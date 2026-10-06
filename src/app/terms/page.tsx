import React from 'react';

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-google-text-primary space-y-6">
      <h1 className="text-3xl font-extrabold text-google-blue">Terms of Service</h1>
      <p className="text-sm text-google-text-secondary">Last updated: October 6, 2026</p>
      
      <section className="space-y-3">
        <h2 className="text-xl font-bold">1. Terms</h2>
        <p className="text-xs leading-relaxed text-google-text-secondary">
          By accessing GBPilot, you agree to connect your Google Business Profile to generate automated SEO recommendations and execute proactive updates.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">2. Use License</h2>
        <p className="text-xs leading-relaxed text-google-text-secondary">
          GBPilot provides software-as-a-service features for local business growth automation.
        </p>
      </section>
    </div>
  );
}
