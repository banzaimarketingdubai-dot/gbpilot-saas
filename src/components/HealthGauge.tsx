'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface HealthGaugeProps {
  score: number;
  size?: number;
}

export const HealthGauge: React.FC<HealthGaugeProps> = ({ score, size = 110 }) => {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#1E8E3E'; // Google Maps Green
    if (score >= 60) return '#F9AB00'; // Google Yellow
    return '#D93025'; // Google Red
  };

  const strokeColor = getScoreColor(score);

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E8EAED"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Animated Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          strokeLinecap="round"
        />
      </svg>
      {/* Inner Label */}
      <div className="absolute flex flex-col items-center justify-center text-center">
        <motion.span 
          className="text-2xl font-black tracking-tight text-google-text-primary"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          {score}
        </motion.span>
        <span className="text-[10px] uppercase font-bold text-google-text-tertiary tracking-wider">
          Health
        </span>
      </div>
    </div>
  );
};
