'use client';

import { useState } from 'react';
import Dashboard from '@/components/Dashboard';
import { OnboardingWizard } from '@/components/OnboardingWizard';

export default function Home() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Show onboarding wizard first, then main dashboard
  if (showOnboarding) {
    return <OnboardingWizard />;
  }

  // Show main dashboard
  return <Dashboard />;
}
