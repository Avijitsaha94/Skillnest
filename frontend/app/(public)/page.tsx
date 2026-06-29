import { HeroSection } from "@/components/landing/HeroSection";
import {
  FeaturesSection,
  CategoriesSection,
  TopCoursesSection,
  StatsSection,
  TestimonialsSection,
  FAQSection,
  NewsletterSection,
  CTASection,
} from "@/components/landing/Sections";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <CategoriesSection />
      <TopCoursesSection />
      <StatsSection />
      <TestimonialsSection />
      <FAQSection />
      <NewsletterSection />
      <CTASection />
    </>
  );
}
