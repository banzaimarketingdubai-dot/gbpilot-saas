'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer data-testid="global-footer" className="bg-white border-t border-google-border py-8 text-xs text-google-text-secondary mt-auto">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-full bg-google-blue flex items-center justify-center">
            <MapPin className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-google-text-primary text-sm">GBPilot</span>
          <span>© 2026 SHER DIGITAL CORE. All rights reserved.</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          <Link href="/dashboard" data-testid="footer-action-hub" className="hover:text-google-blue transition-colors">
            Action Hub
          </Link>
          <Link href="/copilot" data-testid="footer-ai-copilot" className="hover:text-google-blue transition-colors">
            AI Copilot
          </Link>
          <Link href="/geo-grid" data-testid="footer-geo-grid" className="hover:text-google-blue transition-colors">
            Geo-Grid Radar
          </Link>
          <Link href="/reviews-posts" data-testid="footer-reviews-posts" className="hover:text-google-blue transition-colors">
            Reviews & Posts
          </Link>
          <Link href="/outreach" data-testid="footer-lead-outreach" className="hover:text-google-blue transition-colors">
            Lead Outreach
          </Link>
          <Link href="/onboarding" data-testid="footer-onboarding" className="hover:text-google-blue transition-colors">
            Onboarding
          </Link>
          <Link href="/b2b" data-testid="footer-b2b" className="hover:text-google-blue transition-colors">
            B2B Landing
          </Link>
          <Link href="/privacy" data-testid="footer-privacy" className="hover:text-google-blue transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" data-testid="footer-terms" className="hover:text-google-blue transition-colors">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
};
