'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FileText, ShieldAlert, CheckCircle2, Scale, Mail } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-google-bg flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-12 text-google-text-primary space-y-8">
        {/* Header */}
        <div className="space-y-2 border-b border-google-border pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold">
            <FileText className="w-4 h-4 text-google-blue" />
            <span>Legal Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-sm text-google-text-secondary">
            Effective Date: October 15, 2026 | Last Updated: October 15, 2026
          </p>
        </div>

        {/* 1. Acceptance */}
        <section className="material-card p-6 sm:p-8 bg-white rounded-2xl border border-google-border shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>1. Acceptance of Terms</span>
          </h2>
          <p className="text-sm leading-relaxed text-slate-600">
            Welcome to GBPilot (&ldquo;Service&rdquo;, &ldquo;Platform&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;), hosted at{' '}
            <Link href="https://www.gbpilot.top" className="text-google-blue font-medium hover:underline">
              https://www.gbpilot.top
            </Link>
            . By accessing or using our platform, connecting your Google Business Profile via OAuth 2.0, or utilizing our automated Local SEO growth tools, you agree to be bound by these Terms of Service (&ldquo;Terms&rdquo;) and our{' '}
            <Link href="/privacy" className="text-google-blue font-medium hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
          <p className="text-sm leading-relaxed text-slate-600">
            If you are entering into these Terms on behalf of an entity, organization, or business, you represent and warrant that you have full legal authority to bind that entity.
          </p>
        </section>

        {/* 2. Service Description */}
        <section className="material-card p-6 sm:p-8 bg-white rounded-2xl border border-google-border shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-slate-900">
            2. Description of Services
          </h2>
          <p className="text-sm leading-relaxed text-slate-600">
            GBPilot provides autonomous Local SEO growth intelligence, reputation management, and automated action execution for local businesses. Key capabilities include:
          </p>
          <ul className="list-disc pl-5 text-sm space-y-2 text-slate-600">
            <li><strong>Action Hub &amp; Diagnostics:</strong> Automated auditing of profile completeness, categories, photos, and local search signals.</li>
            <li><strong>Review Management &amp; AI Copilot:</strong> Review sentiment tracking, dispute workflow assistance, and suggested owner reply drafting.</li>
            <li><strong>Google Posts &amp; Content Sync:</strong> Generating and publishing business updates, promotions, and operating hour changes via official Google APIs.</li>
            <li><strong>Geo-Grid Rank Tracking:</strong> Visualizing spatial local search rank snapshots across geographic map grids.</li>
          </ul>
        </section>

        {/* 3. Google API Compliance & Policies */}
        <section className="material-card p-6 sm:p-8 bg-white rounded-2xl border border-google-border shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>3. Google Business Profile &amp; Third-Party Platform Policies</span>
          </h2>
          <p className="text-sm leading-relaxed text-slate-600">
            GBPilot integrates with Google Business Profile APIs to deliver authorized management features. As a condition of using our services:
          </p>
          <ul className="list-disc pl-5 text-sm space-y-2 text-slate-600">
            <li>
              You agree to comply with Google&apos;s official{' '}
              <a
                href="https://support.google.com/business/answer/3038177"
                target="_blank"
                rel="noopener noreferrer"
                className="text-google-blue underline hover:text-blue-700 font-medium"
              >
                Guidelines for representing your business on Google
              </a>
              {' '}and{' '}
              <a
                href="https://policies.google.com/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-google-blue underline hover:text-blue-700 font-medium"
              >
                Google Terms of Service
              </a>.
            </li>
            <li>You warrant that you are the verified owner, manager, or authorized agent of the Google Business Profile locations you connect to GBPilot.</li>
            <li>You acknowledge that search rankings, review moderation decisions, and profile suspensions on Google Maps and Search are under the sole discretion and algorithmic control of Google LLC. GBPilot does not guarantee specific position rankings or review removal outcomes.</li>
          </ul>
        </section>

        {/* 4. Acceptable Use & Strict Prohibition of Adult/NSFW Content */}
        <section className="material-card p-6 sm:p-8 bg-white rounded-2xl border border-google-border shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <span>4. Acceptable Use &amp; Strict Prohibition of Sexual, Adult, and NSFW Content</span>
          </h2>
          <p className="text-sm leading-relaxed text-slate-600">
            GBPilot is designed strictly for legitimate local business discovery and professional reputation management. We enforce zero tolerance for prohibited or abusive content.
          </p>
          
          <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-xl space-y-2 text-xs text-rose-950">
            <h3 className="font-extrabold text-sm text-rose-900 uppercase tracking-wide">
              Strict Prohibition of Sexual and NSFW Content in AI-Generated Posts &amp; Review Replies
            </h3>
            <p className="font-semibold text-rose-900 leading-relaxed">
              Users are strictly and explicitly prohibited from using GBPilot to generate, request, draft, edit, publish, or distribute any sexual, adult, erotic, or NSFW (Not Safe For Work) content in AI-generated Google Posts, AI review replies, customer communications, or profile updates.
            </p>
            <ul className="list-disc pl-4 space-y-1 text-rose-900">
              <li><strong>Sexual or NSFW Content:</strong> Any sexually explicit, pornographic, suggestive, or adult-themed text or imagery is strictly prohibited in all AI post and review generation tools.</li>
              <li><strong>Adult &amp; Escort Services:</strong> Promotion of adult entertainment, escort agencies, massage parlors of an illicit nature, or sexually oriented businesses is barred from AI generation features.</li>
              <li><strong>Automated AI Guardrails:</strong> All AI post generation and AI review-reply workflows are continuously monitored by automated Google Gemini Safety Moderation filters that actively block sexual and NSFW prompts before processing.</li>
              <li><strong>Zero-Tolerance Enforcement:</strong> Violation will result in immediate termination of account access, revocation of API tokens, and permanent ban with zero refund.</li>
            </ul>
          </div>

          <div className="space-y-2 text-xs text-slate-600">
            <h3 className="font-bold text-slate-900 text-sm">Automated AI Content Moderation &amp; Enforcement</h3>
            <p className="leading-relaxed">
              All AI content generation features (including Google Business Posts, owner review replies, and business description optimization) are strictly governed by automated safety filters powered by Google Gemini Content Safety APIs. These filters operate in real-time with threshold settings configured to block:
            </p>
            <ul className="list-disc pl-4 space-y-1">
              <li><strong>Sexually Explicit &amp; Adult Content:</strong> Automatically rejected before generation or transmission.</li>
              <li><strong>Hate Speech &amp; Harassment:</strong> Evaluated and flagged to prevent abusive customer correspondence.</li>
              <li><strong>Dangerous &amp; Illicit Content:</strong> Filtered at the API level.</li>
            </ul>
            <p className="leading-relaxed">
              Any attempt to circumvent automated content filters or prompt NSFW/sexual generation will trigger immediate, permanent account termination and forfeiture of active subscription access without refund.
            </p>
          </div>
        </section>

        {/* 5. User Content & Data Ownership */}
        <section className="material-card p-6 sm:p-8 bg-white rounded-2xl border border-google-border shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-slate-900">
            5. Intellectual Property &amp; User Content
          </h2>
          <p className="text-sm leading-relaxed text-slate-600">
            You retain full ownership and intellectual property rights in all data, logos, trademarks, and content you provide or sync through the platform. By connecting your profile, you grant GBPilot a limited, revocable license to process, display, and transmit such content solely to provide the services requested by you.
          </p>
          <p className="text-sm leading-relaxed text-slate-600">
            GBPilot, its brand identity, software code, algorithm blueprints, and user interface designs are the proprietary property of SHER DIGITAL CORE.
          </p>
        </section>

        {/* 6. Limitation of Liability */}
        <section className="material-card p-6 sm:p-8 bg-white rounded-2xl border border-google-border shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Scale className="w-5 h-5 text-google-blue" />
            <span>6. Disclaimer of Warranties &amp; Limitation of Liability</span>
          </h2>
          <p className="text-xs leading-relaxed text-slate-600 uppercase font-semibold">
            The platform is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind, whether express, implied, or statutory.
          </p>
          <p className="text-sm leading-relaxed text-slate-600">
            To the maximum extent permitted by law, GBPilot and SHER DIGITAL CORE shall not be liable for any indirect, incidental, consequential, or punitive damages, including loss of profits, business interruption, or ranking volatility resulting from third-party algorithm updates, platform outages, or changes to Google API access rules.
          </p>
        </section>

        {/* 7. Termination & Account Deletion */}
        <section className="material-card p-6 sm:p-8 bg-white rounded-2xl border border-google-border shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-slate-900">
            7. Termination &amp; Disconnection
          </h2>
          <p className="text-sm leading-relaxed text-slate-600">
            You may terminate your relationship with GBPilot at any time by disconnecting your Google account in your dashboard and revoking permissions via{' '}
            <a
              href="https://myaccount.google.com/permissions"
              target="_blank"
              rel="noopener noreferrer"
              className="text-google-blue underline font-medium"
            >
              Google Account Permissions
            </a>. Upon termination, we purge your session tokens and profile sync records in accordance with our Privacy Policy.
          </p>
        </section>

        {/* 8. Contact Information */}
        <section className="material-card p-6 sm:p-8 bg-white rounded-2xl border border-google-border shadow-sm space-y-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Mail className="w-5 h-5 text-google-blue" />
            <span>8. Contact Us</span>
          </h2>
          <p className="text-sm leading-relaxed text-slate-600">
            For questions or legal inquiries regarding these Terms of Service, please reach out to:
          </p>
          <div className="text-xs space-y-1 text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <p><strong>Entity:</strong> GBPilot (SHER DIGITAL CORE)</p>
            <p><strong>Website:</strong> https://www.gbpilot.top</p>
            <p><strong>Support &amp; Legal:</strong> <a href="mailto:support@gbpilot.top" className="text-google-blue underline font-medium">support@gbpilot.top</a></p>
            <p><strong>Developer Email:</strong> <a href="mailto:0451611@gmail.com" className="text-google-blue underline font-medium">0451611@gmail.com</a></p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
