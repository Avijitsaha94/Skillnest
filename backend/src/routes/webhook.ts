import { Router, Request, Response } from 'express';
import { Webhook } from 'svix';
import { env } from '../config/env';
import { UserRepository } from '../repositories/UserRepository';

const router = Router();

interface ClerkUserCreatedEvent {
  type: 'user.created' | 'user.updated' | 'user.deleted';
  data: {
    id: string;
    email_addresses: Array<{ email_address: string; id: string }>;
    first_name: string | null;
    last_name: string | null;
    image_url: string;
    primary_email_address_id: string;
  };
}

// POST /api/webhook/clerk
// Receives Clerk events to keep our DB in sync
router.post(
  '/clerk',
  // express.raw is set on this route in app.ts
  async (req: Request, res: Response) => {
    const svixId = req.headers['svix-id'] as string;
    const svixTimestamp = req.headers['svix-timestamp'] as string;
    const svixSignature = req.headers['svix-signature'] as string;

    if (!svixId || !svixTimestamp || !svixSignature) {
      res.status(400).json({ error: 'Missing svix headers' });
      return;
    }

    let evt: ClerkUserCreatedEvent;
    try {
      const wh = new Webhook(env.CLERK_WEBHOOK_SECRET);
      evt = wh.verify(req.body as string, {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      }) as ClerkUserCreatedEvent;
    } catch {
      res.status(400).json({ error: 'Webhook signature invalid' });
      return;
    }

    try {
      if (evt.type === 'user.created') {
        const primaryEmail = evt.data.email_addresses.find(
          (e) => e.id === evt.data.primary_email_address_id
        );

        if (primaryEmail) {
          const existing = await UserRepository.findByClerkId(evt.data.id);
          if (!existing) {
            await UserRepository.create({
              clerkId: evt.data.id,
              email: primaryEmail.email_address,
              name: `${evt.data.first_name ?? ''} ${evt.data.last_name ?? ''}`.trim() || 'SkillNest User',
              avatar: evt.data.image_url,
            });
            console.log(`✅ User created in DB: ${primaryEmail.email_address}`);
          }
        }
      }

      if (evt.type === 'user.updated') {
        const primaryEmail = evt.data.email_addresses.find(
          (e) => e.id === evt.data.primary_email_address_id
        );
        if (primaryEmail) {
          await UserRepository.updateProfile(evt.data.id, {
            name:
              `${evt.data.first_name ?? ''} ${evt.data.last_name ?? ''}`.trim() ||
              'SkillNest User',
            avatar: evt.data.image_url,
          });
        }
      }

      res.status(200).json({ received: true });
    } catch (err) {
      console.error('Webhook handler error:', err);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  }
);

export default router;
