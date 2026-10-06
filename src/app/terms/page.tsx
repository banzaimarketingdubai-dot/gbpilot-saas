'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-google-bg flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-12 text-google-text-primary space-y-6">
        <h1 className="text-3xl font-extrabold text-google-blue">Terms of Service</h1>
        <p className="text-sm text-google-text-secondary">Last updated: October 6, 2026</p>
        
        <section className="space-y-3 material-card p-6 bg-white">
          <h2 className="text-xl font-bold">1. Terms</h2>
          <p className="text-xs leading-relaxed text-google-text-secondary">
            By accessing GBPilot, you agree to connect your Google Business Profile to generate automated SEO recommendations and execute proactive updates.
          </p>
        </section>

        <section className="space-y-3 material-card p-6 bg-white">
          <h2 className="text-xl font-bold">2. Use License</h2>
          <p className="text-xs leading-relaxed text-google-text-secondary">
            GBPilot provides software-as-a-service features for local business growth automation.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
