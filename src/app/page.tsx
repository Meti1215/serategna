import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { TrustStatsBar, CategoryShowcase } from '@/components/home/TrustStatsBar';
import { FeaturedWorkersSection } from '@/components/home/FeaturedWorkersSection';
import { OpportunitiesSection } from '@/components/home/OpportunitiesSection';
import { PhoneUnlockExplainer } from '@/components/home/PhoneUnlockExplainer';
import { HowItWorksSection } from '@/components/home/HowItWorksSection';
import { RegionalHubsSection, TestimonialsSection } from '@/components/home/RegionalHubsSection';
import { workersService } from '@/services/workersService';
import { jobsService } from '@/services/jobsService';
import { internshipsService } from '@/services/internshipsService';

export default async function HomePage() {
  const [featuredWorkers, featuredJobs, featuredInternships] = await Promise.all([
    workersService.getFeaturedWorkers(),
    jobsService.getFeaturedJobs(),
    internshipsService.getFeaturedInternships(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <TrustStatsBar />
        <CategoryShowcase />
        <FeaturedWorkersSection workers={featuredWorkers} />
        <OpportunitiesSection jobs={featuredJobs} internships={featuredInternships} />
        <PhoneUnlockExplainer />
        <HowItWorksSection />
        <RegionalHubsSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
}
