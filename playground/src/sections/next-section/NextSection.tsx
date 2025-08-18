'use client';

import React, { useMemo, useRef, useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

type NodeBase = {
  id: string;
  label: string;
  x: number;
  description: string;
  labelPosition: 'top' | 'bottom';
};

type MainNode = NodeBase & {
  hasChildren?: boolean;
  isBranch?: boolean;
  hollow?: boolean;
};

type Range = {
  id: string;
  label: string;
  startNode: string;
  endNode: string;
  position: 'top' | 'bottom';
  subEvents?: NodeBase[];
};

type Branch = {
  id: string;
  label: string;
  startNode: string;
  y: number; 
  nodes: NodeBase[];
};

export default function ProductRoadmapFlow() {
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const mainTimeline: MainNode[] = [
    { id: 'idea',     label: 'Idea',     x: 100, description: 'Initial concept & vision', labelPosition: 'bottom', hasChildren: false },
    { id: 'planning', label: 'Planning', x: 200, description: 'Architecture & strategy',  labelPosition: 'top',    hasChildren: true,  hollow: true },
    { id: 'pre-mvp',  label: 'Pre-MVP',  x: 320, description: 'Core features definition', labelPosition: 'bottom', hasChildren: true,  hollow: true },
    { id: 'analysis', label: 'Analysis', x: 440, description: 'Market & tech research',   labelPosition: 'top',    hasChildren: true },
    { id: 'docs',     label: 'Docs',     x: 560, description: 'Technical documentation',  labelPosition: 'bottom', hasChildren: false },
    { id: 'deploy',   label: 'Deploy',   x: 680, description: 'First deployment',         labelPosition: 'top',    hasChildren: true, isBranch: true },
    { id: 'mvp',      label: 'MVP',      x: 800, description: 'Minimum viable product',   labelPosition: 'bottom', hasChildren: true },
    { id: 'integration', label: 'Integration', x: 920, description: 'External services', labelPosition: 'top',     hasChildren: false },
  ];

  const rangeEvents: Range[] = [
    {
      id: 'analytics',
      label: 'Analytics',
      startNode: 'analysis',
      endNode: 'mvp',
      position: 'top',
      subEvents: [
        // { id: 'metrics',  label: 'Metrics',  x: 480, description: 'KPI definition',   labelPosition: 'top' },
        { id: 'tracking', label: 'Tracking', x: 580, description: 'User behavior',    labelPosition: 'bottom' },
        { id: 'reports',  label: 'Reports',  x: 680, description: 'Data visualization', labelPosition: 'top' }
      ]
    },
    {
      id: 'testing',
      label: 'Testing',
      startNode: 'pre-mvp',
      endNode: 'deploy',
      position: 'bottom',
      subEvents: [
        { id: 'unit',              label: 'Unit tests',  x: 380, description: 'Component testing', labelPosition: 'bottom' },
        { id: 'integration-test',  label: 'Integration', x: 480, description: 'System testing',    labelPosition: 'top' },
        { id: 'uat',               label: 'UAT',         x: 580, description: 'User acceptance',   labelPosition: 'bottom' }
      ]
    },
    {
      id: 'design',
      label: 'Design',
      startNode: 'planning',
      endNode: 'pre-mvp',
      position: 'top',
      subEvents: [
        { id: 'ux', label: 'UX', x: 240, description: 'User experience', labelPosition: 'top' },
        { id: 'ui', label: 'UI', x: 280, description: 'Interface design', labelPosition: 'bottom' }
      ]
    }
  ];

  const branchLines: Branch[] = [
    {
      id: 'devops-branch',
      label: 'DevOps',
      startNode: 'deploy',
      y: 100,
      nodes: [
        { id: 'ci-cd',        label: 'CI/CD',        x: 720, description: 'Automation pipeline', labelPosition: 'bottom' },
        { id: 'monitoring',   label: 'Monitoring',   x: 840, description: 'System observability', labelPosition: 'top' },
        { id: 'scaling',      label: 'Scaling',      x: 960, description: 'Auto-scaling setup',   labelPosition: 'bottom' },
        { id: 'optimization', label: 'Optimization', x: 1080, description: 'Performance tuning',  labelPosition: 'top' }
      ]
    },
    {
      id: 'mobile-branch',
      label: 'Mobile',
      startNode: 'mvp',
      y: -100,
      nodes: [
        { id: 'mobile-design', label: 'Mobile Design', x: 840, description: 'Native UI/UX',     labelPosition: 'top' },
        { id: 'ios',           label: 'iOS',           x: 960, description: 'iOS application',  labelPosition: 'bottom' },
        { id: 'android',       label: 'Android',       x: 1080, description: 'Android application', labelPosition: 'top' }
      ]
    }
  ];

  const allNodes = useMemo(
    () => [
      ...mainTimeline,
      ...rangeEvents.flatMap(r => r.subEvents || []),
      ...branchLines.flatMap(b => b.nodes),
    ],
    []
  );

  const nodeMap = useMemo(() => {
    const m = new Map<string, MainNode>();
    mainTimeline.forEach(n => m.set(n.id, n));
    return m;
  }, []);

  useEffect(() => {
    controls.start('visible');
  }, [controls]);

  const VIEW_W = 1200;
  const VIEW_H = 600;
  const BASE_Y = 300;

  const getTrackY = (position: 'top' | 'bottom', offset = 0) =>
    position === 'top' ? BASE_Y - 80 - offset : BASE_Y + 80 + offset;

  const [hover, setHover] = useState<{ id: string; label: string; desc: string; x: number; y: number } | null>(null);

  const placeOverlay = () => {
    if (!containerRef.current || !hover) return { left: 0, top: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    const kx = rect.width / VIEW_W;
    const ky = rect.height / VIEW_H;
    const pad = 12;
    const left = Math.min(rect.width - 260, Math.max(0, hover.x * kx + pad));
    const top  = Math.min(rect.height - 120, Math.max(0, hover.y * ky - 60));
    return { left, top };
  };

  const drawLabelTick = (x: number, y: number, pos: 'top' | 'bottom', len = 14) => (
    <line x1={x} y1={y} x2={x} y2={pos === 'top' ? y - len : y + len} stroke="#9ca3af" strokeWidth={1} opacity={0.6} />
  );

  const drawRange = (range: Range) => {
    const s = nodeMap.get(range.startNode);
    const e = nodeMap.get(range.endNode);
    if (!s || !e) return null;
    const y = getTrackY(range.position);

    return (
      <g key={`range-${range.id}`} pointerEvents="none">
        <motion.line
          x1={s.x} y1={y} x2={e.x} y2={y}
          stroke="#6b7280" strokeWidth={1} opacity={0.5}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.2 }}
        />
        <line x1={s.x} y1={BASE_Y} x2={s.x} y2={y} stroke="#6b7280" strokeWidth={1} opacity={0.3} strokeDasharray="2,2" />
        <line x1={e.x} y1={BASE_Y} x2={e.x} y2={y} stroke="#6b7280" strokeWidth={1} opacity={0.3} strokeDasharray="2,2" />
        <text x={s.x - 30} y={y - 6} fill="#9ca3af" fontSize="11" fontWeight={600}>{range.label}</text>
      </g>
    );
  };

  const drawBranch = (branch: Branch) => {
    const start = nodeMap.get(branch.startNode);
    if (!start) return null;
    const by = BASE_Y + branch.y;

    return (
      <g key={`branch-${branch.id}`} pointerEvents="none">
        <motion.path
          d={`M ${start.x} ${BASE_Y} Q ${start.x + 20} ${BASE_Y + branch.y / 2} ${start.x + 40} ${by}`}
          stroke="#6b7280" strokeWidth={1} fill="none" opacity={0.5}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 0.5 }}
        />
        <motion.line
          x1={start.x + 40} y1={by} x2={branch.nodes[branch.nodes.length - 1].x + 50} y2={by}
          stroke="#6b7280" strokeWidth={1} opacity={0.5}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.7 }}
        />
        <text x={branch.nodes[0].x - 40} y={by - 10} fill="#9ca3af" fontSize="11" fontWeight={700}>{branch.label}</text>
      </g>
    );
  };

  const onEnter = (id: string, label: string, description: string, x: number, y: number) =>
    setHover({ id, label, desc: description, x, y });

  const onLeave = () => setHover(null);

  return (
    <div ref={containerRef} className="relative w-full h-[640px] bg-black p-6 rounded-lg border border-gray-800">
      <div className="absolute left-6 right-6 top-6 z-10 pointer-events-none">
        <h1 className="text-3xl font-bold text-white tracking-tight">Product Development Flow</h1>
        <p className="text-gray-500 text-sm"></p>
      </div>

      <svg
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <motion.line
          x1={50} y1={BASE_Y} x2={1100} y2={BASE_Y}
          stroke="#6b7280" strokeWidth={1}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2 }}
        />

        {rangeEvents.map(drawRange)}
        {branchLines.map(drawBranch)}

        {mainTimeline.map(n => drawLabelTick(n.x, BASE_Y, n.labelPosition))}

        {mainTimeline.map((n, idx) => {
          const isKey = n.hasChildren || n.isBranch;
          const labelDy = n.labelPosition === 'top' ? -24 : 24;

          return (
            <g
              key={n.id}
              onMouseEnter={() => onEnter(n.id, n.label, n.description, n.x, BASE_Y)}
              onMouseLeave={onLeave}
              style={{ cursor: 'default' }}
            >
              {n.hollow ? (
                <circle cx={n.x} cy={BASE_Y} r={6} fill="transparent" stroke="#ffffff" strokeWidth={1.2} />
              ) : isKey ? (
                <g>
                  <rect x={n.x - 10} y={BASE_Y - 10} width={20} height={20} fill="#111827" stroke="#4b5563" strokeWidth={1} />
                  {n.isBranch ? (
                    <circle cx={n.x} cy={BASE_Y} r={4} fill="transparent" stroke="#f59e0b" strokeWidth={1.2} />
                  ) : (
                    <circle cx={n.x} cy={BASE_Y} r={4} fill="#f59e0b" />
                  )}
                </g>
              ) : (
                <circle cx={n.x} cy={BASE_Y} r={3} fill="#9ca3af" />
              )}

              <text
                x={n.x}
                y={BASE_Y + labelDy}
                textAnchor="middle"
                fontSize="12"
                fill="#9ca3af"
              >
                {n.label}
              </text>
            </g>
          );
        })}

        {rangeEvents.map(range => {
          const y = getTrackY(range.position);
          return (
            <g key={`sub-${range.id}`}>
              {range.subEvents?.map(ev => {
                const labelDy = ev.labelPosition === 'top' ? -16 : 18;
                return (
                  <g
                    key={ev.id}
                    onMouseEnter={() => onEnter(ev.id, ev.label, ev.description, ev.x, y)}
                    onMouseLeave={onLeave}
                    style={{ cursor: 'default' }}
                  >
                    {drawLabelTick(ev.x, y, ev.labelPosition, 12)}
                    <circle cx={ev.x} cy={y} r={3} fill="#9ca3af" />
                    <text x={ev.x} y={y + labelDy} textAnchor="middle" fontSize="11" fill="#9ca3af">{ev.label}</text>
                  </g>
                );
              })}
            </g>
          );
        })}

        {branchLines.map(branch => {
          const by = BASE_Y + branch.y;
          return (
            <g key={`nodes-${branch.id}`}>
              {branch.nodes.map(ev => {
                const labelDy = ev.labelPosition === 'top' ? -18 : 20;
                return (
                  <g
                    key={ev.id}
                    onMouseEnter={() => onEnter(ev.id, ev.label, ev.description, ev.x, by)}
                    onMouseLeave={onLeave}
                    style={{ cursor: 'default' }}
                  >
                    {drawLabelTick(ev.x, by, ev.labelPosition, 16)}
                    <circle cx={ev.x} cy={by} r={3} fill="#9ca3af" />
                    <text x={ev.x} y={by + labelDy} textAnchor="middle" fontSize="11" fill="#9ca3af">{ev.label}</text>
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>

      {hover && (
        <div
          className="absolute z-20 pointer-events-none"
          style={{ ...placeOverlay(), width: 240 }}
        >
          <div className="p-3 rounded-md border border-gray-700 bg-gray-900/95 shadow-xl">
            <div className="text-[11px] text-gray-400 uppercase tracking-wider">{hover.id}</div>
            <div className="text-white font-semibold">{hover.label}</div>
            <div className="text-gray-400 text-sm mt-1">{hover.desc}</div>
          </div>
        </div>
      )}

      <div className="absolute left-6 right-6 bottom-6">
      </div>
    </div>
  );
}
