'use client';

import React, { useMemo, useRef, useEffect, useState } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  animate,
} from 'framer-motion';

type LabelPos = 'top' | 'bottom';

type NodeBase = {
  id: string;
  label: string;
  x: number;
  description: string;
  labelPosition: LabelPos;
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
  position: LabelPos;
  subEvents?: NodeBase[];
};

type Branch = {
  id: string;
  label: string;
  startNode: string;
  y: number;
  nodes: NodeBase[];
};

type CoreValue = {
  id: string;
  label: string;
  description: string;
};

export default function ProductRoadmapFlow() {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const coreValues: CoreValue[] = [
    { id: 'clarity',    label: 'CLARITY',    description: 'Clean design & readable code' },
    { id: 'reliability',label: 'RELIABILITY',description: 'Systems you can trust' },
    { id: 'efficiency', label: 'EFFICIENCY', description: 'Idea → MVP in weeks' },
    { id: 'adaptability',label:'ADAPTABILITY',description:'Learn & integrate fast' },
    { id: 'growth',     label: 'GROWTH',     description: 'Each project → stronger' },
  ];

  const mainTimeline: MainNode[] = [
    { id: 'idea',     label: 'Idea',     x: 50,  description: 'Initial concept & vision', labelPosition: 'bottom', hasChildren: false },
    { id: 'planning', label: 'Planning', x: 100, description: 'Architecture & strategy',  labelPosition: 'top',    hasChildren: true,  hollow: true },
    { id: 'pre-mvp',  label: 'Pre-MVP',  x: 160, description: 'Core features definition', labelPosition: 'bottom', hasChildren: true,  hollow: true },
    { id: 'analysis', label: 'Analysis', x: 220, description: 'Market & tech research',   labelPosition: 'top',    hasChildren: true },
    { id: 'docs',     label: 'Docs',     x: 280, description: 'Technical documentation',  labelPosition: 'bottom', hasChildren: false },
    { id: 'deploy',   label: 'Deploy',   x: 340, description: 'First deployment',         labelPosition: 'top',    hasChildren: true, isBranch: true },
    { id: 'mvp',      label: 'MVP',      x: 400, description: 'Minimum viable product',   labelPosition: 'bottom', hasChildren: true },
    { id: 'integration', label: 'Integration', x: 460, description: 'External services', labelPosition: 'top',     hasChildren: false },
  ];

  const rangeEvents: Range[] = [
    {
      id: 'analytics',
      label: 'Analytics',
      startNode: 'analysis',
      endNode: 'mvp',
      position: 'top',
      subEvents: [
        { id: 'metrics',  label: 'Metrics',  x: 240, description: 'KPI definition',   labelPosition: 'top' },
        { id: 'tracking', label: 'Tracking', x: 290, description: 'User behavior',    labelPosition: 'bottom' },
        { id: 'reports',  label: 'Reports',  x: 340, description: 'Data visualization', labelPosition: 'top' }
      ]
    },
    {
      id: 'testing',
      label: 'Testing',
      startNode: 'pre-mvp',
      endNode: 'deploy',
      position: 'bottom',
      subEvents: [
        { id: 'unit',              label: 'Unit tests',  x: 190, description: 'Component testing', labelPosition: 'bottom' },
        { id: 'integration-test',  label: 'Integration', x: 240, description: 'System testing',    labelPosition: 'top' },
        { id: 'uat',               label: 'UAT',         x: 290, description: 'User acceptance',   labelPosition: 'bottom' }
      ]
    },
    {
      id: 'design',
      label: 'Design',
      startNode: 'planning',
      endNode: 'pre-mvp',
      position: 'top',
      subEvents: [
        { id: 'ux', label: 'UX', x: 120, description: 'User experience', labelPosition: 'top' },
        { id: 'ui', label: 'UI', x: 140, description: 'Interface design', labelPosition: 'bottom' }
      ]
    }
  ];

  const branchLines: Branch[] = [
    {
      id: 'devops-branch',
      label: 'DevOps',
      startNode: 'deploy',
      y: 80,
      nodes: [
        { id: 'ci-cd',        label: 'CI/CD',        x: 360, description: 'Automation pipeline', labelPosition: 'bottom' },
        { id: 'monitoring',   label: 'Monitoring',   x: 410, description: 'System observability', labelPosition: 'top' },
        { id: 'scaling',      label: 'Scaling',      x: 460, description: 'Auto-scaling setup',   labelPosition: 'bottom' },
        { id: 'optimization', label: 'Optimization', x: 510, description: 'Performance tuning',  labelPosition: 'top' }
      ]
    },
    {
      id: 'mobile-branch',
      label: 'Mobile',
      startNode: 'mvp',
      y: -80,
      nodes: [
        { id: 'mobile-design', label: 'Mobile Design', x: 420, description: 'Native UI/UX',     labelPosition: 'top' },
        { id: 'ios',           label: 'iOS',           x: 470, description: 'iOS application',  labelPosition: 'bottom' },
        { id: 'android',       label: 'Android',       x: 520, description: 'Android application', labelPosition: 'top' }
      ]
    }
  ];

  const nodeMap = useMemo(() => {
    const m = new Map<string, MainNode>();
    mainTimeline.forEach(n => m.set(n.id, n));
    return m;
  }, []);

  const VIEW_W = 550;
  const VIEW_H = 350;
  const BASE_Y = 175;
  const START_X = 25;
  const END_X = 525;
  const IDEA_X = 50;

  const axisX2 = useMotionValue<number>(IDEA_X);
  const cameraFocusX = useSpring(IDEA_X, { stiffness: 60, damping: 18, mass: 0.9 });
  const cameraScale  = useMotionValue<number>(1.8);

  const [following, setFollowing] = useState(false);
  const [valuesVisible, setValuesVisible] = useState(false);

  useEffect(() => {
    const unsub = axisX2.on('change', (v) => {
      if (following) {
        cameraFocusX.set(v + 30);
      }
    });
    return () => unsub();
  }, [following, cameraFocusX, axisX2]);

  const groupX = useTransform(cameraFocusX, (fx) => {
    const desired = VIEW_W / 2 - fx;
    const min = VIEW_W / 2 - END_X - 20;
    const max = VIEW_W / 2 - START_X + 20;
    return Math.max(min, Math.min(max, desired));
  });

  const [ideaVisible, setIdeaVisible] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      setValuesVisible(true);
      await new Promise(r => setTimeout(r, 800));
      setIdeaVisible(true);
      await new Promise(r => setTimeout(r, 500));

      const LINE_DURATION = 9.0;
      const lineControls = animate(axisX2, END_X, {
        duration: LINE_DURATION,
        ease: [0.2, 0.0, 0.2, 1.0],
      });

      await new Promise(r => setTimeout(r, 450));
      if (!mounted) return;

      setFollowing(true);
      animate(cameraScale, 1.8, {
        duration: LINE_DURATION - 0.6,
        ease: [0.2, 0.0, 0.2, 1.0],
      });

      await lineControls.finished;
      if (!mounted) return;

      setFollowing(false);

      const sceneMid = (START_X + END_X) / 2;
      const finalCenter = sceneMid;
      await Promise.all([
        animate(cameraFocusX, finalCenter, {
          duration: 0.9,
          ease: [0.2, 0.0, 0.2, 1.0],
        }).finished,
        animate(cameraScale, 1.5, {
          duration: 0.9,
          ease: [0.2, 0.0, 0.2, 1.0],
        }).finished,
      ]);
    })();

    return () => { mounted = false; };
  }, [axisX2, cameraFocusX, cameraScale]);

  const appearAt = (x: number, pre = 12, post = 3) =>
    useTransform(axisX2, [x - pre, x + post], [0, 1]);

  const getTrackY = (position: LabelPos, offset = 0) =>
    position === 'top' ? BASE_Y - 50 - offset : BASE_Y + 50 + offset;

  const tick = (x: number, y: number, pos: LabelPos, len = 8) => {
    const o = appearAt(x);
    return (
      <motion.line
        x1={x} y1={y} x2={x} y2={pos === 'top' ? y - len : y + len}
        stroke="#9ca3af" strokeWidth={1}
        style={{ opacity: o }}
      />
    );
  };

  const drawRange = (range: Range) => {
    const s = nodeMap.get(range.startNode);
    const e = nodeMap.get(range.endNode);
    if (!s || !e) return null;
    const y = getTrackY(range.position);
    const o = useTransform(axisX2, [s.x - 5, e.x - 3], [0, 0.6]);

    return (
      <g key={`range-${range.id}`}>
        <motion.line
          x1={s.x} y1={y} x2={e.x} y2={y}
          stroke="#6b7280" strokeWidth={1}
          style={{ opacity: o }}
        />
        <motion.line
          x1={s.x} y1={BASE_Y} x2={s.x} y2={y}
          stroke="#6b7280" strokeWidth={1} strokeDasharray="2,2"
          style={{ opacity: o }}
        />
        <motion.line
          x1={e.x} y1={BASE_Y} x2={e.x} y2={y}
          stroke="#6b7280" strokeWidth={1} strokeDasharray="2,2"
          style={{ opacity: o }}
        />
        <motion.text
          x={s.x - 15} y={y - 5} fill="#9ca3af" fontSize="9" fontWeight={600}
          style={{ opacity: o }}
        >
          {range.label}
        </motion.text>
      </g>
    );
  };

  const drawBranch = (branch: Branch) => {
    const start = nodeMap.get(branch.startNode);
    if (!start) return null;
    const by = BASE_Y + branch.y;
    const o = appearAt(start.x);

    return (
      <g key={`branch-${branch.id}`}>
        <motion.path
          d={`M ${start.x} ${BASE_Y} Q ${start.x + 10} ${BASE_Y + branch.y / 2} ${start.x + 20} ${by}`}
          stroke="#6b7280" strokeWidth={1} fill="none"
          style={{ opacity: o }}
        />
        <motion.line
          x1={start.x + 20} y1={by} x2={branch.nodes[branch.nodes.length - 1].x + 25} y2={by}
          stroke="#6b7280" strokeWidth={1}
          style={{ opacity: o }}
        />
        <motion.text
          x={branch.nodes[0].x - 20} y={by - 8} fill="#9ca3af" fontSize="9" fontWeight={700}
          style={{ opacity: o }}
        >
          {branch.label}
        </motion.text>
      </g>
    );
  };

  return (
    <div className="border border-gray-900 rounded-sm p-4 md:p-6 bg-black/50 backdrop-blur-sm">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-left select-none text-white mb-4">
          Building Products — Step by Step
        </h1>

        <div className="relative w-full h-32 mb-6 flex items-center justify-center">
          <svg width="100%" height="130" viewBox="0 0 500 130" className="overflow-visible">
            <defs>
              <linearGradient id="amberGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"  stopColor="#fbbf24" />
                <stop offset="55%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
              <filter id="glowAmber" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="0" stdDeviation="1.6" floodColor="#f59e0b" floodOpacity="0.35" />
              </filter>
              <linearGradient id="gloss" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(255,255,255,0.6)"/>
                <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
              </linearGradient>
            </defs>

            {(() => {
              const LEFT = 50;
              const RIGHT = 450;
              const BASE_Y = 98; 
              const PILLAR_W = 16;
              const PILLAR_H = 42;
              const CAP_H = 4;
              const BASE_H = 3;
              const spacing = coreValues.length > 1 ? (RIGHT - LEFT) / (coreValues.length - 1) : 0;

              return (
                <>
                  <motion.line
                    x1={LEFT - 24} y1={BASE_Y} x2={RIGHT + 24} y2={BASE_Y}
                    stroke="#4b5563" strokeWidth={2}
                    strokeLinecap="square"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: valuesVisible ? 1 : 0 }}
                    transition={{ duration: 0.9, ease: 'easeInOut' }}
                  />

                  {coreValues.map((value, idx) => {
                    const x = LEFT + idx * spacing;
                    const pillarX = x - PILLAR_W / 2;
                    const delay = 0.20 + idx * 0.12;

                    return (
                      <g key={value.id}>
                        <motion.rect
                          x={pillarX - 6} y={BASE_Y} width={PILLAR_W + 12} height={BASE_H}
                          fill="#111827" stroke="#374151" strokeWidth={1}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: valuesVisible ? 1 : 0 }}
                          transition={{ duration: 0.3, delay }}
                        />

                        <motion.g
                          initial={{ scaleY: 0, opacity: 0 }}
                          animate={{ scaleY: valuesVisible ? 1 : 0, opacity: valuesVisible ? 1 : 0 }}
                          transition={{ duration: 0.45, delay: delay + 0.05, ease: [0.2, 0.0, 0.2, 1] }}
                          style={{ transformOrigin: `${x}px ${BASE_Y}px` }}
                          filter="url(#glowAmber)"
                        >
                          <rect
                            x={pillarX} y={BASE_Y - PILLAR_H}
                            width={PILLAR_W} height={PILLAR_H}
                            rx={2}
                            fill="url(#amberGrad)"
                            stroke="#1f2937"
                            strokeWidth={1}
                          />
                          <rect
                            x={pillarX + 2}
                            y={BASE_Y - PILLAR_H}
                            width={PILLAR_W - 4}
                            height={Math.max(8, PILLAR_H * 0.35)}
                            rx={1.6}
                            fill="url(#gloss)"
                            style={{ mixBlendMode: 'screen' as any }}
                          />
                          <rect
                            x={pillarX - 2}
                            y={BASE_Y - PILLAR_H - CAP_H}
                            width={PILLAR_W + 4}
                            height={CAP_H}
                            rx={1.6}
                            fill="#f59e0b"
                            stroke="#1f2937"
                            strokeWidth={1}
                          />
                        </motion.g>

                        <motion.text
                          x={x}
                          y={BASE_Y - PILLAR_H - CAP_H - 7}
                          textAnchor="middle"
                          fontSize="11"
                          fontWeight={800}
                          letterSpacing="0.06em"
                          fill="#f59e0b"
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: valuesVisible ? 1 : 0, y: valuesVisible ? 0 : -4 }}
                          transition={{ duration: 0.35, delay: delay + 0.18, ease: 'easeOut' }}
                        >
                          {value.label}
                        </motion.text>

                        {/* Description (gray-400) */}
                        <motion.text
                          x={x}
                          y={BASE_Y + 14}
                          textAnchor="middle"
                          fontSize="10"
                          fill="#9ca3af"
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: valuesVisible ? 1 : 0, y: valuesVisible ? 0 : 4 }}
                          transition={{ duration: 0.35, delay: delay + 0.22, ease: 'easeOut' }}
                        >
                          {value.description}
                        </motion.text>
                      </g>
                    );
                  })}
                </>
              );
            })()}
          </svg>
        </div>
      </div>

      <div className="relative w-full h-[350px] bg-black border border-gray-800 rounded-sm overflow-hidden">
        <div className="relative w-full h-full">
          <svg
            ref={svgRef}
            className="w-full h-full"
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            preserveAspectRatio="xMidYMid meet"
          >
            <motion.g style={{ x: groupX, scale: cameraScale }}>
              <motion.line
                x1={START_X}
                y1={BASE_Y}
                y2={BASE_Y}
                stroke="#6b7280"
                strokeWidth={1}
                x2={axisX2}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />

              {rangeEvents.map(drawRange)}
              {branchLines.map(drawBranch)}

              {mainTimeline.map((n) => {
                const isKey = n.hasChildren || n.isBranch;
                const labelDy = n.labelPosition === 'top' ? -16 : 16;
                const o = appearAt(n.x);

                return (
                  <g key={n.id}>
                    {tick(n.x, BASE_Y, n.labelPosition, 8)}

                    {n.id === 'idea' ? (
                      <>
                        <motion.circle
                          cx={n.x} cy={BASE_Y} r={4}
                          fill="#f59e0b"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: ideaVisible ? 1 : 0 }}
                          transition={{ duration: 0.35, ease: 'easeOut' }}
                        />
                        <motion.text
                          x={n.x} y={BASE_Y + labelDy}
                          textAnchor="middle" fontSize="10" fill="#f59e0b"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: ideaVisible ? 1 : 0 }}
                          transition={{ delay: 0.05, duration: 0.3, ease: 'easeOut' }}
                        >
                          {n.label}
                        </motion.text>
                      </>
                    ) : (
                      <>
                        {n.hollow ? (
                          <motion.circle
                            cx={n.x} cy={BASE_Y} r={4}
                            fill="transparent" stroke="#ffffff" strokeWidth={1}
                            style={{ opacity: o }}
                          />
                        ) : isKey ? (
                          <g>
                            <motion.rect
                              x={n.x - 7} y={BASE_Y - 7} width={14} height={14}
                              fill="#111827" stroke="#4b5563" strokeWidth={1}
                              style={{ opacity: o }}
                            />
                            <motion.circle
                              cx={n.x} cy={BASE_Y} r={2.5}
                              fill={n.isBranch ? "transparent" : "#f59e0b"}
                              stroke={n.isBranch ? "#f59e0b" : "none"}
                              strokeWidth={n.isBranch ? 1 : 0}
                              style={{ opacity: o }}
                            />
                          </g>
                        ) : (
                          <motion.circle
                            cx={n.x} cy={BASE_Y} r={2} fill="#9ca3af"
                            style={{ opacity: o }}
                          />
                        )}

                        <motion.text
                          x={n.x} y={BASE_Y + labelDy}
                          textAnchor="middle" fontSize="10" fill="#9ca3af"
                          style={{ opacity: o }}
                        >
                          {n.label}
                        </motion.text>
                      </>
                    )}
                  </g>
                );
              })}

              {rangeEvents.map(range => {
                const y = getTrackY(range.position);
                return (
                  <g key={`sub-${range.id}`}>
                    {range.subEvents?.map(ev => {
                      const labelDy = ev.labelPosition === 'top' ? -10 : 12;
                      const o = appearAt(ev.x);
                      return (
                        <g key={ev.id}>
                          {tick(ev.x, y, ev.labelPosition, 6)}
                          <motion.circle
                            cx={ev.x} cy={y} r={2} fill="#9ca3af"
                            style={{ opacity: o }}
                          />
                          <motion.text
                            x={ev.x} y={y + labelDy}
                            textAnchor="middle" fontSize="9" fill="#9ca3af"
                            style={{ opacity: o }}
                          >
                            {ev.label}
                          </motion.text>
                        </g>
                      );
                    })}
                  </g>
                );
              })}

              {branchLines.map(branch => {
                const by = BASE_Y + branch.y;
                return (
                  <g key={`branch-nodes-${branch.id}`}>
                    {branch.nodes.map(node => {
                      const labelDy = node.labelPosition === 'top' ? -10 : 12;
                      const o = appearAt(node.x);
                      return (
                        <g key={node.id}>
                          {tick(node.x, by, node.labelPosition, 6)}
                          <motion.circle
                            cx={node.x} cy={by} r={2} fill="#9ca3af"
                            style={{ opacity: o }}
                          />
                          <motion.text
                            x={node.x} y={by + labelDy}
                            textAnchor="middle" fontSize="9" fill="#9ca3af"
                            style={{ opacity: o }}
                          >
                            {node.label}
                          </motion.text>
                        </g>
                      );
                    })}
                  </g>
                );
              })}
            </motion.g>
          </svg>
        </div>
      </div>
    </div>
  );
}
