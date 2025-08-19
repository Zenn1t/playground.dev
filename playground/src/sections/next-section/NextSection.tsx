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
    { id: 'clarity', label: 'Clarity', description: 'Clean design and readable code' },
    { id: 'reliability', label: 'Reliability', description: 'Systems that you can trust' },
    { id: 'efficiency', label: 'Efficiency', description: 'From idea to MVP in weeks, not months' },
    { id: 'adaptability', label: 'Adaptability', description: 'Learning and integrating fast' },
    { id: 'growth', label: 'Growth', description: 'Each project makes me stronger' },
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

    return () => {
      mounted = false;
    };
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
          Building Products - Step by Step
        </h1>
        
        <div className="relative w-full h-32 mb-6 flex items-center justify-center">
          <svg width="100%" height="130" viewBox="0 0 500 130" className="overflow-visible">
            <motion.line
              x1="50" y1="70" x2="450" y2="70"
              stroke="#4b5563" strokeWidth="3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: valuesVisible ? 1 : 0 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
            />
            
            {coreValues.map((value, index) => {
              const x = 50 + (index * 100);
              return (
                <g key={value.id}>
                  <motion.rect
                    x={x - 12} y="50" width="24" height="40"
                    fill="#f59e0b" stroke="#1f2937" strokeWidth="2"
                    rx="2"
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={{ 
                      scaleY: valuesVisible ? 1 : 0,
                      opacity: valuesVisible ? 1 : 0 
                    }}
                    transition={{ 
                      duration: 0.6, 
                      delay: 0.3 + (index * 0.15),
                      ease: 'backOut'
                    }}
                    style={{ transformOrigin: `${x}px 90px` }}
                  />
                  
                  <motion.text
                    x={x} y="35" 
                    textAnchor="middle" 
                    fontSize="16" 
                    fontWeight="700"
                    fill="#f59e0b"
                    transform={`rotate(-12 ${x} 35)`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ 
                      opacity: valuesVisible ? 1 : 0,
                      y: valuesVisible ? 0 : 10
                    }}
                    transition={{ 
                      duration: 0.5, 
                      delay: 0.6 + (index * 0.15),
                      ease: 'easeOut'
                    }}
                  >
                    {value.label}
                  </motion.text>
                  
                  <motion.foreignObject
                    x={x - 35} y="100" width="70" height="25"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: valuesVisible ? 1 : 0 }}
                    transition={{ 
                      duration: 0.4, 
                      delay: 0.9 + (index * 0.15),
                      ease: 'easeOut'
                    }}
                  >
                    <div className="text-center text-xs text-gray-400 leading-tight">
                      {value.description}
                    </div>
                  </motion.foreignObject>
                </g>
              );
            })}
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
