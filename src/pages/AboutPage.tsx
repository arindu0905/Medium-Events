import React from 'react';
import { StatsBar } from '../components/StatsBar';
import { AboutSection } from '../components/AboutSection';

export default function AboutPage() {
  return (
    <div className="pt-20">
      <StatsBar />
      <AboutSection />
    </div>
  );
}
