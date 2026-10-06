'use client';

import React from 'react';
import { Award, Star, TrendingUp, Share2 } from 'lucide-react';

export interface CompetitorComparison {
  name: string;
  rating: number;
  reviewsCount: number;
  reviewVelocityPerWeek: number;
  priceLevel: string;
  convenience: string[];
  specialtyKeywords: string[];
  diffScore: 'LEADER' | 'CHALLENGER' | 'LAGGING';
}

interface CompetitorMatrixProps {
  competitors: CompetitorComparison[];
}

export const CompetitorMatrix: React.FC<CompetitorMatrixProps> = ({ competitors }) => {
  return (
    <div className="material-card p-6 space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-google-border-light pb-4">
        <div>
          <h2 className="text-base font-bold text-google-text-primary flex items-center gap-2">
            <Award className="w-5 h-5 text-google-blue" />
            5-Factor Competitor Differentiation Matrix
          </h2>
          <p className="text-xs text-google-text-secondary">
            Real-time local market benchmarking against top category leaders
          </p>
        </div>
        <button 
          onClick={() => alert("Public Competitor Challenge Link generated: https://gbpilot.ai/challenge/manhattan-bakery-vs-green-bakery")}
          className="material-button-secondary text-xs py-1.5 px-3"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share Challenge Link</span>
        </button>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-google-border text-google-text-tertiary font-bold uppercase tracking-wider text-[10px]">
              <th className="py-2.5 px-3">Business Name</th>
              <th className="py-2.5 px-3">Quality & Rating</th>
              <th className="py-2.5 px-3">Review Velocity</th>
              <th className="py-2.5 px-3">Price Level</th>
              <th className="py-2.5 px-3">Convenience & Amenities</th>
              <th className="py-2.5 px-3">Specialty Keywords</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-google-border-light text-google-text-primary">
            {competitors.map((comp, i) => {
              const isUser = comp.diffScore === 'LEADER';
              return (
                <tr
                  key={i}
                  className={`transition-colors ${
                    isUser ? 'bg-google-blue-light/40 font-semibold' : 'hover:bg-google-bg'
                  }`}
                >
                  <td className="py-3 px-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-google-text-primary">{comp.name}</span>
                      {isUser && (
                        <span className="px-2 py-0.5 text-[9px] bg-google-green-light text-google-green font-bold rounded">
                          YOU
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <div className="flex items-center space-x-1">
                      <Star className="w-3.5 h-3.5 text-google-yellow fill-google-yellow" />
                      <span className="font-bold text-google-text-primary">{comp.rating}</span>
                      <span className="text-google-text-tertiary">({comp.reviewsCount})</span>
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <div className="flex items-center space-x-1 text-google-green font-medium">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>+{comp.reviewVelocityPerWeek}/wk</span>
                    </div>
                  </td>

                  <td className="py-3 px-3 font-bold text-google-text-secondary">
                    {comp.priceLevel}
                  </td>

                  <td className="py-3 px-3">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {comp.convenience.map((cn, idx) => (
                        <span
                          key={idx}
                          className="bg-white text-google-text-secondary text-[10px] px-2 py-0.5 rounded border border-google-border"
                        >
                          {cn}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {comp.specialtyKeywords.map((kw, idx) => (
                        <span
                          key={idx}
                          className="bg-google-blue-light text-google-blue text-[10px] px-2 py-0.5 rounded border border-google-blue/20 font-mono"
                        >
                          #{kw}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
