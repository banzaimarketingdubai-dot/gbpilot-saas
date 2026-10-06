import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-google-text-primary space-y-6">
      <h1 className="text-3xl font-extrabold text-google-blue">Privacy Policy</h1>
      <p className="text-sm text-google-text-secondary">Last updated: October 6, 2026</p>
      
      <section className="space-y-3">
        <h2 className="text-xl font-bold">1. Information We Collect</h2>
        <p className="text-xs leading-relaxed text-google-text-secondary">
          GBPilot ("we", "our") accesses Google Business Profile data solely to provide automated SEO recommendations, review management, and performance insights authorized by you via Google OAuth 2.0.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">2. Use of Google User Data</h2>
        <p className="text-xs leading-relaxed text-google-text-secondary">
          We do not sell or share your Google user data. Tokens and profile metadata are stored securely to enable 1-Click execution and proactive optimization workflows.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">3. Contact Us</h2>
        <p className="text-xs leading-relaxed text-google-text-secondary">
          If you have questions regarding this Privacy Policy, please contact admin@gbpilot.com.
        </p>
      </section>
    </div>
  );
}
