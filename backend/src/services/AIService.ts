import OpenAI from 'openai';
import { Response } from 'express';
import { env } from '../config/env';
import { GeneratedCourseContent, ChatMessage, ICourse } from '../types';
import { CourseRepository } from '../repositories/CourseRepository';
import { UserRepository } from '../repositories/UserRepository';

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

export class AIService {
  // ─────────────────────────────────────────────────────────
  // AI Feature 1: Course Content Generator
  // ─────────────────────────────────────────────────────────
  static async generateCourseContent(params: {
    title: string;
    audience: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
  }): Promise<GeneratedCourseContent> {
    const prompt = `You are an expert curriculum designer for SkillNest.

Generate course content for:
- Title: ${params.title}
- Target Audience: ${params.audience}
- Level: ${params.level}

Return ONLY valid JSON (no markdown):
{
  "description": "2-3 paragraph compelling description",
  "outcomes": ["outcome1","outcome2","outcome3","outcome4","outcome5"],
  "tags": ["tag1","tag2","tag3","tag4","tag5"]
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      max_tokens: 900,
      temperature: 0.7,
    });

    const raw = completion.choices[0].message.content ?? '{}';
    const parsed = JSON.parse(raw) as GeneratedCourseContent;

    if (!parsed.description || !Array.isArray(parsed.outcomes) || !Array.isArray(parsed.tags)) {
      throw new Error('AI returned unexpected content shape');
    }

    return parsed;
  }

  // ─────────────────────────────────────────────────────────
  // AI Feature 2: Smart Recommendations
  // ─────────────────────────────────────────────────────────
  static async getRecommendations(userId: string): Promise<ICourse[]> {
    const user = await UserRepository.findByIdWithHistory(userId);
    const enrolledIds = user?.enrolledCourses ?? [];
    const completedCategories = user?.completedCategories ?? [];

    if (enrolledIds.length === 0) {
      return CourseRepository.findTopRated(6);
    }

    const candidates = await CourseRepository.findCandidatesForRecommendation(
      enrolledIds as never,
      completedCategories
    );

    if (candidates.length <= 6) return candidates;

    const prompt = `You are a learning advisor for SkillNest.
Learner completed categories: ${completedCategories.join(', ') || 'none'}.
Pick the 6 best next courses from candidates:
${JSON.stringify(candidates.map((c) => ({
  id: String(c._id),
  title: c.title,
  category: c.category,
  level: c.level,
  tags: c.tags,
  rating: c.rating,
})))}
Return ONLY: { "ids": ["id1","id2","id3","id4","id5","id6"] }`;

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        max_tokens: 200,
        temperature: 0.3,
      });

      const { ids } = JSON.parse(
        completion.choices[0].message.content ?? '{"ids":[]}'
      ) as { ids: string[] };

      const ordered = ids
        .map((id) => candidates.find((c) => String(c._id) === id))
        .filter((c): c is ICourse => Boolean(c));

      return ordered.length >= 3 ? ordered.slice(0, 6) : candidates.slice(0, 6);
    } catch {
      return candidates.slice(0, 6);
    }
  }

  // ─────────────────────────────────────────────────────────
  // AI Feature 3: Chat Assistant — SSE Streaming
  // OpenAI v6 compatible: stream: true + manual chunk reading
  // ─────────────────────────────────────────────────────────
  static async streamChatResponse(messages: ChatMessage[], res: Response): Promise<void> {
    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    try {
      const stream = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are SkillNest AI, a helpful learning assistant. Help students with:
- Finding the right courses for their goals
- Understanding course content and prerequisites
- Planning their learning path
- Answering programming, design, and tech questions
Keep responses concise (under 200 words). Be encouraging.`,
          },
          ...messages,
        ],
        max_tokens: 500,
        temperature: 0.7,
        stream: true,  // ← OpenAI v6 streaming
      });

      // Handle client disconnect
      let aborted = false;
      res.on('close', () => { aborted = true; });

      // Read stream chunks
      for await (const chunk of stream) {
        if (aborted) break;

        const delta = chunk.choices[0]?.delta?.content ?? '';
        if (delta) {
          res.write(`data: ${JSON.stringify({ delta })}\n\n`);
        }

        // Check if stream finished
        if (chunk.choices[0]?.finish_reason === 'stop') {
          res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        }
      }

      res.end();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'AI service error';
      console.error('AI stream error:', message);
      if (!res.writableEnded) {
        res.write(`data: ${JSON.stringify({ error: 'AI service error. Please try again.' })}\n\n`);
        res.end();
      }
    }
  }
}