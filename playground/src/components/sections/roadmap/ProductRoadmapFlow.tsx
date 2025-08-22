/*
 * Copyright 2025 Mark Reshetov
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
  isKey?: boolean; 
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

type SubRange = {
  id: string;
  label: string;
  parentNode: string;  
  parentBranch: string; 
  position: LabelPos;
  subEvents: NodeBase[];
};

type Branch = {
  id: string;
  label: string;
  startNode: string;
  y: number;
  nodes: NodeBase[];
  connections?: string[];
};

type CoreValue = {
  id: string;
  label: string;
  description: string;
};

function useFirstTimeInView<T extends Element>(
  threshold = 0.4
): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || entered) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
          setEntered(true);
          obs.disconnect();
        }
      },
      { threshold: [0, 0.25, threshold, 0.75, 1] }
    );

    obs.observe(node);
    return () => obs.disconnect();
  }, [entered, threshold]);

  return [ref, entered];
}

export default function ProductRoadmapFlow() {
  const coreValues: CoreValue[] = [
    { id: 'clarity',     label: 'CLARITY',     description: 'Clean design & readable code' },
    { id: 'reliability', label: 'RELIABILITY', description: 'Systems you can trust' },
    { id: 'efficiency',  label: 'EFFICIENCY',  description: 'Idea → MVP in weeks' },
    { id: 'adaptability',label: 'ADAPTABILITY',description:'Learn & integrate fast' },
    { id: 'growth',      label: 'GROWTH',      description: 'Each project → stronger' },
  ];

  const mainTimeline: MainNode[] = [
    { id: 'idea',       label: 'Idea',       x: 30,  description: 'Initial concept & vision',  labelPosition: 'bottom', isKey: true },
    { id: 'planning',   label: 'Planning',   x: 75,  description: 'Architecture & strategy',   labelPosition: 'top', hasChildren: true },
    { id: 'pre-mvp',    label: 'Pre-MVP',    x: 120, description: 'Core features definition',  labelPosition: 'bottom', hasChildren: true },
    { id: 'analysis',   label: 'Analysis',   x: 165, description: 'Market & tech research',    labelPosition: 'top' },
    { id: 'docs',       label: 'Docs',       x: 210, description: 'Technical documentation',   labelPosition: 'bottom', isBranch: true },
    { id: 'deploy',     label: 'Deploy',     x: 255, description: 'First deployment',          labelPosition: 'top', isBranch: true },
    { id: 'mvp',        label: 'MVP',        x: 300, description: 'Minimum viable product',    labelPosition: 'bottom', isKey: true, isBranch: true },
    { id: 'qa',         label: 'QA',         x: 345, description: 'Quality assurance',         labelPosition: 'top' },
    { id: 'alpha',      label: 'Alpha',      x: 390, description: 'Alpha release',             labelPosition: 'bottom' },
    { id: 'iteration',  label: 'Iteration',  x: 435, description: 'Feature iterations',        labelPosition: 'top' },
    { id: 'beta',       label: 'Beta',       x: 480, description: 'Beta release',              labelPosition: 'bottom', hasChildren: true },
    { id: 'v1',         label: 'v1.0',       x: 525, description: 'First stable release',      labelPosition: 'top', isKey: true, isBranch: true },
    { id: 'advanced',   label: 'Advanced',   x: 570, description: 'Advanced analytics',        labelPosition: 'bottom' },
    { id: 'integrations', label: 'Integrations', x: 615, description: 'External integrations',  labelPosition: 'top', hasChildren: true },
    { id: 'v2',         label: 'v2.0',       x: 660, description: 'Major update',              labelPosition: 'bottom', isKey: true },
  ];

  const rangeEvents: Range[] = [
    {
      id: 'design',
      label: 'Design',
      startNode: 'planning',
      endNode: 'pre-mvp',
      position: 'top',
      subEvents: [
        { id: 'ux', label: 'UX', x: 90, description: 'User experience', labelPosition: 'top' },
        { id: 'ui', label: 'UI', x: 105, description: 'Interface design', labelPosition: 'bottom' }
      ]
    },
    {
      id: 'research',
      label: 'Research',
      startNode: 'pre-mvp',
      endNode: 'docs',
      position: 'bottom',
      subEvents: [
        { id: 'market', label: 'Market', x: 145, description: 'Market analysis', labelPosition: 'bottom' },
        { id: 'tech-stack', label: 'Tech Stack', x: 185, description: 'Technology selection', labelPosition: 'top' }
      ]
    },
    {
      id: 'feedback',
      label: 'Feedback',
      startNode: 'alpha',
      endNode: 'v1',
      position: 'bottom',
      subEvents: [
        { id: 'interviews', label: 'Interviews', x: 420, description: 'User interviews', labelPosition: 'bottom' },
        { id: 'requests',   label: 'Requests',   x: 460, description: 'Feature requests', labelPosition: 'top' },
        { id: 'bugs',       label: 'Bugs',       x: 495, description: 'Bug reports', labelPosition: 'bottom' }
      ]
    },
    {
      id: 'integration-services',
      label: 'Payments',
      startNode: 'integrations',
      endNode: 'integrations',
      position: 'top',
      subEvents: [
        { id: 'stripe', label: 'Stripe', x: 605, description: 'Stripe integration', labelPosition: 'top' },
        { id: 'paypal', label: 'PayPal', x: 625, description: 'PayPal integration', labelPosition: 'bottom' }
      ]
    }
  ];

  const subRanges: SubRange[] = [
    {
      id: 'monitoring-tools',
      label: 'Monitor',
      parentNode: 'monitoring',
      parentBranch: 'devops',
      position: 'bottom',
      subEvents: [
        { id: 'prometheus', label: 'Prometheus', x: 520, description: 'Metrics collection', labelPosition: 'bottom' },
        { id: 'grafana', label: 'Grafana', x: 570, description: 'Visualization', labelPosition: 'top' },
        { id: 'telegram-bot', label: 'Telegram', x: 620, description: 'Alerts', labelPosition: 'bottom' }
      ]
    },
    {
      id: 'scaling-tools',
      label: 'Infra',
      parentNode: 'scaling',
      parentBranch: 'devops',
      position: 'top',
      subEvents: [
        { id: 'nginx', label: 'Nginx', x: 650, description: 'Load balancer', labelPosition: 'top' },
        { id: 'apache', label: 'Apache', x: 690, description: 'Web server', labelPosition: 'bottom' },
        { id: 'kubernetes', label: 'K8s', x: 730, description: 'Orchestration', labelPosition: 'top' }
      ]
    }
  ];

  const branchLines: Branch[] = [
    {
      id: 'testing',
      label: 'Testing',
      startNode: 'mvp',
      y: -90,
      nodes: [
        { id: 'unit-tests',     label: 'Unit Tests',     x: 320, description: 'Component testing',  labelPosition: 'top' },
        { id: 'regression',     label: 'Regression',     x: 500, description: 'Regression testing', labelPosition: 'bottom' },
        { id: 'full-coverage',  label: 'Full Coverage',  x: 545, description: 'Complete test suite', labelPosition: 'top' },
        { id: 'e2e',            label: 'E2E',            x: 680, description: 'End-to-end testing', labelPosition: 'bottom' }
      ],
      connections: ['mvp', 'beta', 'v1', 'v2']
    },
    {
      id: 'devops',
      label: 'DevOps',
      startNode: 'deploy',
      y: 85,
      nodes: [
        { id: 'ci-cd',      label: 'CI/CD',      x: 275, description: 'Automation setup',    labelPosition: 'bottom' },
        { id: 'monitoring', label: 'Monitoring', x: 545, description: 'System monitoring',   labelPosition: 'top' },
        { id: 'scaling',    label: 'Scaling',    x: 680, description: 'Infrastructure scaling', labelPosition: 'bottom' },
        { id: 'security',   label: 'Security',   x: 760, description: 'Security hardening', labelPosition: 'top' }
      ],
      connections: ['deploy', 'v1', 'v2']
    },
    {
      id: 'analytics',
      label: 'Analytics',
      startNode: 'mvp',
      y: 110,
      nodes: [
        { id: 'metrics',    label: 'Metrics',    x: 320, description: 'Basic metrics',       labelPosition: 'bottom' },
        { id: 'behavior',   label: 'Behavior',   x: 500, description: 'User behavior',       labelPosition: 'top' },
        { id: 'advanced-analytics', label: 'Advanced', x: 570, description: 'Deep analytics', labelPosition: 'bottom' },
        { id: 'ml-insights', label: 'ML Insights', x: 680, description: 'Machine learning', labelPosition: 'top' }
      ],
      connections: ['mvp', 'beta', 'v1', 'v2']
    },
    {
      id: 'mobile',
      label: 'Mobile',
      startNode: 'v1',
      y: -65,
      nodes: [
        { id: 'mobile-design', label: 'Design',  x: 555, description: 'Mobile UI/UX',    labelPosition: 'top' },
        { id: 'ios',          label: 'iOS',      x: 605, description: 'iOS app',         labelPosition: 'bottom' },
        { id: 'android',      label: 'Android',  x: 655, description: 'Android app',     labelPosition: 'top' },
        { id: 'tablet',       label: 'Tablet',   x: 705, description: 'Tablet optimize', labelPosition: 'bottom' }
      ],
      connections: ['v1', 'v2']
    },
    {
      id: 'documentation',
      label: 'Docs',
      startNode: 'docs',
      y: -110,
      nodes: [
        { id: 'todo',         label: 'TODO',          x: 235, description: 'Task tracking',     labelPosition: 'top' },
        { id: 'teams',        label: 'Teams',         x: 285, description: 'Team collaboration', labelPosition: 'bottom' },
        { id: 'wiki',         label: 'Wiki',          x: 335, description: 'Knowledge base',     labelPosition: 'top' },
        { id: 'api-docs',     label: 'API Docs',      x: 525, description: 'API documentation',  labelPosition: 'bottom' },
        { id: 'changelog',    label: 'Changelog',     x: 680, description: 'Version history',    labelPosition: 'top' }
      ],
      connections: ['docs', 'mvp', 'v1', 'v2']
    }
  ];

  const nodeMap = useMemo(() => {
    const m = new Map<string, MainNode>();
    mainTimeline.forEach(n => m.set(n.id, n));
    return m;
  }, []);

  const branchNodeMap = useMemo(() => {
    const m = new Map<string, { node: NodeBase; branch: Branch }>();
    branchLines.forEach(branch => {
      branch.nodes.forEach(node => {
        m.set(node.id, { node, branch });
      });
    });
    return m;
  }, []);

  const VIEW_W = 800;
  const VIEW_H = 420;
  const BASE_Y = 210;
  const START_X = 20;
  const END_X = 780;
  const IDEA_X = 30;

  const axisX2 = useMotionValue<number>(IDEA_X);
  const cameraFocusX = useSpring(IDEA_X, { stiffness: 60, damping: 18, mass: 0.9 });
  const cameraScale  = useMotionValue<number>(1.5);

  const [following, setFollowing] = useState(false);
  const [valuesVisible, setValuesVisible] = useState(false);
  const [ideaVisible, setIdeaVisible] = useState(false);

  const [sectionRef, inView] = useFirstTimeInView<HTMLDivElement>(0.4);

  useEffect(() => {
    if (!inView) return;

    let mounted = true;

    (async () => {
      setValuesVisible(true);
      await new Promise(r => setTimeout(r, 650));

      setIdeaVisible(true);
      await new Promise(r => setTimeout(r, 480));

      const LINE_DURATION = 12.0;
      const lineControls = animate(axisX2, END_X, {
        duration: LINE_DURATION,
        ease: [0.2, 0.0, 0.2, 1.0],
      });

      await new Promise(r => setTimeout(r, 380));
      if (!mounted) return;

      setFollowing(true);
      animate(cameraScale, 1.2, {
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
        animate(cameraScale, 1.0, {
          duration: 0.9,
          ease: [0.2, 0.0, 0.2, 1.0],
        }).finished,
      ]);
    })();

    return () => { mounted = false; };
  }, [inView, axisX2, cameraFocusX, cameraScale]);

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
    
    const isSinglePoint = range.startNode === range.endNode;
    const y = getTrackY(range.position, isSinglePoint ? 10 : 0);
    const o = useTransform(axisX2, [s.x - 5, (e?.x ?? s.x) + 3], [0, 0.6]);

    const labelX = s.x - 35;
    const labelY = y + 3;

    return (
      <g key={`range-${range.id}`}>
        <motion.text
          x={labelX} y={labelY} fill="#9ca3af" fontSize="9" fontWeight={600}
          textAnchor="end"
          style={{ opacity: o }}
        >
          {range.label}
        </motion.text>
        <motion.line
          x={labelX + 5} y1={y} x2={s.x - 5} y2={y}
          stroke="#6b7280" strokeWidth={0.5}
          style={{ opacity: o }}
        />
        
        {isSinglePoint ? (
          <>
            <motion.line
              x1={s.x} y1={BASE_Y} x2={s.x} y2={y}
              stroke="#6b7280" strokeWidth={1} strokeDasharray="2,2"
              style={{ opacity: o }}
            />
            {range.subEvents && range.subEvents.length > 0 && (
              <motion.line
                x1={range.subEvents[0].x - 5} y1={y} 
                x2={range.subEvents[range.subEvents.length - 1].x + 5} y2={y}
                stroke="#6b7280" strokeWidth={1}
                style={{ opacity: o }}
              />
            )}
          </>
        ) : (
          <>
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
          </>
        )}
      </g>
    );
  };

  const drawSubRange = (subRange: SubRange) => {
    const parentInfo = branchNodeMap.get(subRange.parentNode);
    if (!parentInfo) return null;
    
    const { node: parentNode, branch } = parentInfo;
    const by = BASE_Y + branch.y;
    const rangeY = subRange.position === 'top' ? by - 35 : by + 35;
    const o = appearAt(parentNode.x);

    const labelX = subRange.subEvents[0].x - 35;

    return (
      <g key={`subrange-${subRange.id}`}>
        <motion.text
          x={labelX} y={rangeY + 2}
          fill="#6b7280" fontSize="8" fontWeight={500}
          textAnchor="end"
          style={{ opacity: o }}
        >
          {subRange.label}
        </motion.text>
        <motion.line
          x1={labelX + 5} y1={rangeY} x2={subRange.subEvents[0].x - 8} y2={rangeY}
          stroke="#4b5563" strokeWidth={0.5}
          style={{ opacity: o }}
        />
        
        <motion.line
          x1={parentNode.x} y1={by} x2={parentNode.x} y2={rangeY}
          stroke="#4b5563" strokeWidth={0.5} strokeDasharray="1,2"
          style={{ opacity: o }}
        />
        
        {subRange.subEvents.length > 0 && (
          <motion.line
            x1={subRange.subEvents[0].x - 5} y1={rangeY}
            x2={subRange.subEvents[subRange.subEvents.length - 1].x + 5} y2={rangeY}
            stroke="#4b5563" strokeWidth={0.5}
            style={{ opacity: o }}
          />
        )}
        
        {subRange.subEvents.map(ev => {
          const evO = appearAt(ev.x);
          const labelDy = ev.labelPosition === 'top' ? -8 : 10;
          return (
            <g key={ev.id}>
              <motion.line
                x1={ev.x} y1={rangeY} 
                x2={ev.x} y2={ev.labelPosition === 'top' ? rangeY - 4 : rangeY + 4}
                stroke="#6b7280" strokeWidth={0.5}
                style={{ opacity: evO }}
              />
              <motion.circle
                cx={ev.x} cy={rangeY} r={1.5} fill="#6b7280"
                style={{ opacity: evO }}
              />
              <motion.text
                x={ev.x} y={rangeY + labelDy}
                textAnchor="middle" fontSize="8" fill="#6b7280"
                style={{ opacity: evO }}
              >
                {ev.label}
              </motion.text>
            </g>
          );
        })}
      </g>
    );
  };

  const drawBranch = (branch: Branch) => {
    const start = nodeMap.get(branch.startNode);
    if (!start) return null;
    const by = BASE_Y + branch.y;
    const o = appearAt(start.x);

    const lastNodeX = Math.max(...branch.nodes.map(n => n.x));

    return (
      <g key={`branch-${branch.id}`}>
        <motion.text
          x={start.x - 25} y={by + 3} fill="#9ca3af" fontSize="9" fontWeight={700}
          textAnchor="end"
          style={{ opacity: o }}
        >
          {branch.label}
        </motion.text>
        <motion.line
          x1={start.x - 20} y1={by} x2={start.x + 20} y2={by}
          stroke="#6b7280" strokeWidth={1}
          style={{ opacity: o }}
        />
        
        <motion.path
          d={`M ${start.x} ${BASE_Y} Q ${start.x + 10} ${BASE_Y + branch.y / 2} ${start.x + 20} ${by}`}
          stroke="#6b7280" strokeWidth={1} fill="none"
          style={{ opacity: o }}
        />
        
        <motion.line
          x1={start.x + 20} y1={by} x2={lastNodeX + 40} y2={by}
          stroke="#6b7280" strokeWidth={1}
          style={{ opacity: o }}
        />
        
        {branch.connections?.map(connId => {
          const connNode = nodeMap.get(connId);
          if (!connNode || connId === branch.startNode) return null;
          const connO = appearAt(connNode.x);
          return (
            <motion.line
              key={`conn-${branch.id}-${connId}`}
              x1={connNode.x} y1={BASE_Y}
              x2={connNode.x} y2={by}
              stroke="#4b5563" strokeWidth={0.5} strokeDasharray="1,3"
              style={{ opacity: connO }}
            />
          );
        })}
      </g>
    );
  };

  const valuesContainerVariants = {
    hidden: { opacity: 0, y: 8 },
    show: {
      opacity: 1,
      y: 0,
      transition: { when: 'beforeChildren', staggerChildren: 0.12 }
    }
  } as const;

  const valueItemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } }
  } as const;

  const NumberCircle = ({ n }: { n: number }) => (
    <motion.div className="relative inline-flex items-center justify-center">
      <motion.span
        initial={{ scale: 0.9, opacity: 0 }}
        animate={valuesVisible ? { scale: [0.95, 1.05, 0.98], opacity: 0.45 } : { scale: 0.9, opacity: 0 }}
        transition={{ duration: 1.2, repeat: valuesVisible ? Infinity : 0, repeatType: 'loop' }}
        className="absolute inset-0 rounded-full border border-amber-400/30"
      />
      <div className="h-12 w-12 rounded-full bg-amber-500/95 text-black font-extrabold tracking-tight flex items-center justify-center shadow-[0_0_0_1px_#1f2937]">
        {n}
      </div>
    </motion.div>
  );

  return (
    <section ref={sectionRef} className="border border-gray-900 rounded-sm p-4 md:p-6 bg-black/50 backdrop-blur-sm">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-left select-none text-white mb-4">
          Building Products – Step by Step
        </h1>

        <motion.div
          variants={valuesContainerVariants}
          initial="hidden"
          animate={valuesVisible ? 'show' : 'hidden'}
          className="w-full"
        >
          <div className="flex flex-col sm:flex-row items-stretch justify-between gap-6 mx-auto w-full max-w-full">
            {coreValues.map((v, i) => (
              <motion.div key={v.id} variants={valueItemVariants} className="flex-1 min-w-[120px] max-w-[20%]">
                <div className="flex flex-col items-center text-center">
                  <div className="text-[12px] sm:text-sm font-extrabold tracking-[0.12em] uppercase text-amber-400 mb-2">
                    {v.label}
                  </div>
                  <NumberCircle n={i + 1} />
                  <p className="mt-3 text-[12px] sm:text-[13px] leading-relaxed text-gray-300 max-w-[28ch]">
                    {v.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="relative w-full h-[420px] bg-black border border-gray-800 rounded-sm overflow-hidden">
        <div className="border-b border-gray-800 px-3 py-2 flex items-center justify-between bg-gray-950/50">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            <span className="ml-3 text-xs text-gray-600">Product Roadmap</span>
          </div>
        </div>
        
        <div className="relative w-full h-[calc(100%-32px)]">
          <svg
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
                animate={{ opacity: inView ? 1 : 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />

              {rangeEvents.map(drawRange)}
              {branchLines.map(drawBranch)}
              {subRanges.map(drawSubRange)}

              {mainTimeline.map((n) => {
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
                        {n.isKey ? (
                          <motion.circle
                            cx={n.x} cy={BASE_Y} r={4}
                            fill="#f59e0b"
                            style={{ opacity: o }}
                          />
                        ) : n.hollow ? (
                          <motion.circle
                            cx={n.x} cy={BASE_Y} r={4}
                            fill="transparent" stroke="#ffffff" strokeWidth={1}
                            style={{ opacity: o }}
                          />
                        ) : n.hasChildren || n.isBranch ? (
                          <g>
                            <motion.rect
                              x={n.x - 7} y={BASE_Y - 7} width={14} height={14}
                              fill="#111827" stroke="#4b5563" strokeWidth={1}
                              style={{ opacity: o }}
                            />
                            <motion.circle
                              cx={n.x} cy={BASE_Y} r={2.5}
                              fill={n.isBranch ? 'transparent' : '#9ca3af'}
                              stroke={n.isBranch ? '#9ca3af' : 'none'}
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
                          textAnchor="middle" fontSize="10" 
                          fill={n.isKey ? '#f59e0b' : '#9ca3af'}
                          fontWeight={n.isKey ? 600 : 400}
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
                const isSinglePoint = range.startNode === range.endNode;
                const y = getTrackY(range.position, isSinglePoint ? 10 : 0);
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
    </section>
  );
}