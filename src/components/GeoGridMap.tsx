'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Eye, CheckCircle, Info } from 'lucide-react';
import { GeoGridNode } from '@/lib/mockData';

interface GeoGridMapProps {
  nodes: GeoGridNode[];
  keyword: string;
}

export const GeoGridMap: React.FC<GeoGridMapProps> = ({ nodes, keyword }) => {
  const [selectedNode, setSelectedNode] = useState<GeoGridNode | null>(nodes[12] || nodes[0]);
  const [gridSize, setGridSize] = useState<'3x3' | '5x5' | '7x7'>('5x5');

  const getRankBadgeStyle = (rank: number) => {
    if (rank <= 3) {
      return 'bg-emerald-500 text-slate-950 font-black border-emerald-400 shadow-glow-emerald';
    }
    if (rank <= 10) {
      return 'bg-amber-500 text-slate-950 font-black border-amber-400';
    }
    return 'bg-rose-600 text-white font-black border-rose-400';
  };

  return (
    <div className="glass-panel rounded-3xl p-6 border border-slate-800 relative overflow-hidden">
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-indigo-400" />
            Geo-Grid Rank Heatmap
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Spatial Google Maps SERP distribution for keyword: <span className="text-indigo-300 font-semibold">"{keyword}"</span>
          </p>
        </div>

        {/* Grid Size Switcher */}
        <div className="flex items-center space-x-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
          {(['3x3', '5x5', '7x7'] as const).map((sz) => (
            <button
              key={sz}
              onClick={() => setGridSize(sz)}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                gridSize === sz ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {sz}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Map Grid Viewport Simulation */}
        <div className="lg:col-span-2 bg-slate-950/90 rounded-2xl p-6 border border-slate-800/80 relative min-h-[380px] flex items-center justify-center bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
          
          {/* Map Grid Container */}
          <div className="grid grid-cols-5 gap-3 md:gap-4 max-w-md mx-auto relative z-10">
            {nodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              return (
                <motion.button
                  key={node.id}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedNode(node)}
                  className={`w-11 h-11 md:w-12 md:h-12 rounded-2xl flex items-center justify-center text-sm border-2 transition-all relative ${getRankBadgeStyle(
                    node.rank
                  )} ${isSelected ? 'ring-4 ring-indigo-500/50 scale-110 z-20' : 'opacity-90'}`}
                >
                  <span>#{node.rank}</span>
                  {node.rank === 1 && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Map Compass Accent */}
          <div className="absolute bottom-3 right-3 text-slate-600 text-[10px] flex items-center font-mono">
            <Navigation className="w-3.5 h-3.5 mr-1" /> Sector B Grid Matrix
          </div>
        </div>

        {/* Selected Node Details Side Card */}
        {selectedNode && (
          <motion.div
            key={selectedNode.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Selected Coordinate Node
                </span>
                <h4 className="text-sm font-bold text-white flex items-center mt-0.5">
                  Node #{selectedNode.row}-{selectedNode.col}
                </h4>
              </div>
              <span className={`px-3 py-1 rounded-xl text-sm font-extrabold border ${getRankBadgeStyle(selectedNode.rank)}`}>
                Rank #{selectedNode.rank}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/60 text-slate-300">
                <span className="text-slate-500">Top Ranking Competitor:</span>
                <span className="font-semibold text-emerald-400">{selectedNode.topCompetitor}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60 text-slate-300">
                <span className="text-slate-500">Latitude / Longitude:</span>
                <span className="font-mono text-slate-400">{selectedNode.lat.toFixed(4)}, {selectedNode.lng.toFixed(4)}</span>
              </div>
              <div className="flex justify-between py-1 text-slate-300">
                <span className="text-slate-500">Status:</span>
                <span className="font-semibold text-indigo-300">
                  {selectedNode.rank <= 3 ? '🟢 Top 3 Local Pack' : selectedNode.rank <= 10 ? '🟡 Page 1 Search' : '🔴 Needs Optimization'}
                </span>
              </div>
            </div>

            <div className="bg-indigo-950/40 border border-indigo-800/50 p-3 rounded-xl text-[11px] text-indigo-200 leading-relaxed">
              <Info className="w-3.5 h-3.5 inline mr-1 text-indigo-400" />
              {selectedNode.rank <= 3 ? (
                <span>You hold top Local Pack placement at this coordinate! Maintain photo and post frequency.</span>
              ) : (
                <span>Publishing a geotagged post targeting <b>"breakfast cafe"</b> can recover top 3 placement here.</span>
              )}
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
};
