'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ShieldCheck, Lock, ExternalLink, Mail, Trash2, RefreshCw } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-google-bg flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-12 text-google-text-primary space-y-8">
        {/* Header */}
        <div className="space-y-2 border-b border-google-border pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-google-blue text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Google API Compliance & Security</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-sm text-google-text-secondary">
            Effective Date: October 15, 2026 | Last Updated: October 15, 2026
          </p>
        </div>

        {/* 1. Overview */}
        <section className="material-card p-6 sm:p-8 bg-white rounded-2xl border border-google-border shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>1. Overview & Service Identity</span>
          </h2>
          <p className="text-sm leading-relaxed text-slate-600">
            GBPilot (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;), accessible at{' '}
            <Link href="https://www.gbpilot.top" className="text-google-blue font-medium hover:underline">
              https://www.gbpilot.top
            </Link>
            , provides an autonomous Local SEO Growth and Reputation Management platform. This Privacy Policy describes how GBPilot collects, uses, stores, and protects information when you use our website, application, and services integrated with Google APIs.
          </p>
          <p className="text-sm leading-relaxed text-slate-600">
            We are committed to maintaining the confidentiality, integrity, and security of your personal and business data.
          </p>
        </section>

        {/* 2. Google User Data & Scopes */}
        <section className="material-card p-6 sm:p-8 bg-white rounded-2xl border border-google-border shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-slate-900">
            2. Google User Data We Access &amp; Collect
          </h2>
          <p className="text-sm leading-relaxed text-slate-600">
            When you connect your Google Account via Google OAuth 2.0 authorization, GBPilot requests explicit access to manage your Google Business Profile data under the following authorized scopes:
          </p>
          <ul className="list-disc pl-5 text-sm space-y-2 text-slate-600">
            <li>
              <code className="text-xs font-mono bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded">
                https://www.googleapis.com/auth/business.manage
              </code>
              : Used to retrieve and manage your Google Business Profile locations, business attributes (name, address, operating hours, categories), customer reviews, review responses, and business updates/posts.
            </li>
            <li>
              <code className="text-xs font-mono bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded">
                openid / email / profile
              </code>
              : Used strictly for user authentication, account verification, and communication regarding your service status.
            </li>
          </ul>
          <p className="text-sm leading-relaxed text-slate-600">
            We only collect data that is strictly necessary to provide the features you explicitly enable.
          </p>
        </section>

        {/* 3. How We Use Data */}
        <section className="material-card p-6 sm:p-8 bg-white rounded-2xl border border-google-border shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-slate-900">
            3. How We Use Google User Data
          </h2>
          <p className="text-sm leading-relaxed text-slate-600">
            Data accessed through Google APIs is utilized exclusively for the following operational purposes:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="font-semibold text-xs text-slate-800">Local SEO &amp; Audit Dashboards</span>
              <p className="text-xs text-slate-600">
                Displaying location profile completeness, category accuracy, and map rank tracking in your Action Hub.
              </p>
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="font-semibold text-xs text-slate-800">Review Management &amp; Takedown</span>
              <p className="text-xs text-slate-600">
                Aggregating incoming customer reviews, sentiment analysis, and preparing 1-Click suggested owner responses.
              </p>
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="font-semibold text-xs text-slate-800">Google Posts &amp; Updates</span>
              <p className="text-xs text-slate-600">
                Drafting and publishing promotional posts, special offers, and event announcements authorized by you.
              </p>
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="font-semibold text-xs text-slate-800">1-Click Synchronization</span>
              <p className="text-xs text-slate-600">
                Applying user-confirmed updates (e.g., holiday hours, updated phone numbers, attributes) back to your GBP listing.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Google Limited Use Disclosure (CRITICAL FOR GOOGLE APPROVAL) */}
        <section className="p-6 sm:p-8 bg-blue-50/70 rounded-2xl border-2 border-google-blue/30 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-google-blue font-bold text-lg">
            <ShieldCheck className="w-6 h-6 shrink-0" />
            <h2>4. Google API Services User Data Policy Compliance</h2>
          </div>
          <div className="bg-white p-5 rounded-xl border border-blue-200 text-sm leading-relaxed text-slate-800 font-medium">
            &ldquo;GBPilot&apos;s use and transfer to any other app of information received from Google APIs will adhere to the{' '}
            <a
              href="https://developers.google.com/terms/api-services-user-data-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-google-blue underline hover:text-blue-700 font-bold inline-flex items-center gap-1"
            >
              Google API Services User Data Policy
              <ExternalLink className="w-3.5 h-3.5 inline" />
            </a>
            , including the Limited Use requirements.&rdquo;
          </div>
          <div className="text-xs space-y-2 text-slate-700">
            <p>In strict compliance with Google&apos;s Limited Use requirements:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>No Data Resale:</strong> We never sell, lease, or rent your Google user data to any third parties.</li>
              <li><strong>No Advertising:</strong> We never use or transfer Google user data for serving personalized, retargeted, or interest-based advertising.</li>
              <li><strong>No Unauthorized AI Training:</strong> We do not use Google user data to train generalized AI or machine learning models without your explicit, verifiable consent.</li>
              <li><strong>Human Access Limits:</strong> Human personnel do not read your raw Google user data unless you provide explicit consent to investigate a technical issue, or as required by applicable law.</li>
            </ul>
          </div>
        </section>

        {/* 5. Storage, Security & Retention */}
        <section className="material-card p-6 sm:p-8 bg-white rounded-2xl border border-google-border shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-google-blue" />
            <span>5. Data Storage &amp; Security</span>
          </h2>
          <p className="text-sm leading-relaxed text-slate-600">
            All user data, OAuth 2.0 refresh tokens, and session credentials are encrypted both in transit and at rest using industry-standard cryptographic protocols:
          </p>
          <ul className="list-disc pl-5 text-sm space-y-2 text-slate-600">
            <li><strong>In Transit:</strong> Transport Layer Security (TLS 1.3 / HTTPS) with strict HSTS enforcement.</li>
            <li><strong>At Rest:</strong> Advanced Encryption Standard (AES-256) for database storage and secure token vaults.</li>
            <li><strong>Access Controls:</strong> Principle of least privilege, strict role-based access, and isolated virtual networks.</li>
          </ul>
          <p className="text-sm leading-relaxed text-slate-600">
            Data is retained only for as long as your account is active and you maintain an active connection with our platform.
          </p>
        </section>

        {/* 6. User Rights & Data Deletion */}
        <section className="material-card p-6 sm:p-8 bg-white rounded-2xl border border-google-border shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-amber-600" />
            <span>6. User Rights, Access Revocation &amp; Data Deletion</span>
          </h2>
          <p className="text-sm leading-relaxed text-slate-600">
            You maintain full sovereignty over your data at all times:
          </p>
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm space-y-2">
              <div className="font-semibold text-slate-900 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-google-blue" />
                <span>How to Revoke Google Access:</span>
              </div>
              <p className="text-xs text-slate-600">
                You can disconnect GBPilot and revoke API access at any moment directly via your Google Account security settings at:{' '}
                <a
                  href="https://myaccount.google.com/permissions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-google-blue font-medium underline inline-flex items-center gap-1"
                >
                  https://myaccount.google.com/permissions
                  <ExternalLink className="w-3 h-3" />
                </a>.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm space-y-2">
              <div className="font-semibold text-slate-900 flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-rose-600" />
                <span>How to Request Full Data Deletion:</span>
              </div>
              <p className="text-xs text-slate-600">
                To request permanent deletion of your profile data, stored tokens, and audit records, please send an email to{' '}
                <a href="mailto:support@gbpilot.top" className="text-google-blue font-semibold hover:underline">
                  support@gbpilot.top
                </a>{' '}
                or contact our privacy team with the subject &ldquo;Data Deletion Request&rdquo;. We process and purge all associated records within 72 business hours.
              </p>
            </div>
          </div>
        </section>

        {/* 7. Contact Information */}
        <section className="material-card p-6 sm:p-8 bg-white rounded-2xl border border-google-border shadow-sm space-y-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Mail className="w-5 h-5 text-google-blue" />
            <span>7. Contact Us</span>
          </h2>
          <p className="text-sm leading-relaxed text-slate-600">
            If you have any questions, feedback, or concerns regarding this Privacy Policy or our compliance with Google API policies, please contact us:
          </p>
          <div className="text-xs space-y-1 text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <p><strong>Service:</strong> GBPilot (SHER DIGITAL CORE)</p>
            <p><strong>Website:</strong> https://www.gbpilot.top</p>
            <p><strong>Email:</strong> <a href="mailto:support@gbpilot.top" className="text-google-blue underline font-medium">support@gbpilot.top</a></p>
            <p><strong>Alternate Contact:</strong> <a href="mailto:0451611@gmail.com" className="text-google-blue underline font-medium">0451611@gmail.com</a></p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
