'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface HealthGaugeProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  label?: string;
}

export const HealthGauge: React.FC<HealthGaugeProps> = ({ 
  score, 
  size = 110,
  strokeWidth: customStrokeWidth,
  showLabel,
  label = 'Health'
}) => {
  // Adaptive stroke width tailored to gauge diameter
  const strokeWidth = customStrokeWidth ?? (
    size < 60 ? 4 : size < 90 ? 6 : 8
  );

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.min(100, Math.max(0, score));
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  const getScoreColor = (val: number) => {
    if (val >= 80) return '#10B981'; // Emerald 500 / Google Green
    if (val >= 60) return '#F59E0B'; // Amber 500 / Google Yellow
    return '#EF4444'; // Red 500 / Google Red
  };

  const strokeColor = getScoreColor(clampedScore);

  // Only display sublabel text if the gauge has sufficient inner diameter (>= 70px)
  const shouldShowLabel = showLabel ?? (size >= 70);

  // Scaled typography sizes based on gauge diameter
  const scoreFontSize = size < 50 ? 14 : size < 65 ? 18 : size < 90 ? 22 : 28;
  const labelFontSize = Math.max(8, Math.round(size * 0.085));

  return (
    <div 
      className="relative flex items-center justify-center shrink-0 select-none"
      style={{ width: size, height: size }}
      title={`GBP Health Score: ${score}/100`}
    >
      <svg 
        width={size} 
        height={size} 
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90 block"
      >
        {/* Crisp solid inner background */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="#FFFFFF"
        />
        {/* Track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E2E8F0"
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

      {/* Centered Inner Score */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        <motion.span 
          className="font-black text-slate-900 leading-none tracking-tight"
          style={{ fontSize: `${scoreFontSize}px` }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.3 }}
        >
          {score}
        </motion.span>
        {shouldShowLabel && (
          <span 
            className="uppercase font-bold text-slate-400 tracking-wider mt-1 leading-none"
            style={{ fontSize: `${labelFontSize}px` }}
          >
            {label}
          </span>
        )}
      </div>
    </div>
  );
};
