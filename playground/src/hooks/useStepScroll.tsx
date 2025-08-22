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


import { useCallback, useEffect, useRef, useState, useMemo } from 'react';

const TRANSITION_MS = 720;
const WHEEL_THRESHOLD = 50;
const TOUCH_THRESHOLD = 40;
const POST_COOLDOWN_MS = 120;

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

export function useStepScroll(sectionIds: readonly string[]) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const animatingRef = useRef(false);
  const cooldownRef = useRef<number | null>(null);
  const wheelAccRef = useRef(0);
  const touchStartYRef = useRef<number | null>(null);
  const touchDeltaYRef = useRef(0);

  const maxIndex = useMemo(() => sectionIds.length - 1, [sectionIds.length]);

  const shouldIgnoreScroll = useCallback((target: EventTarget | null): boolean => {
    if (!target) return false;
    
    let element = target as HTMLElement;
    while (element && element !== containerRef.current) {
      if (element.dataset?.scrollIgnore === 'true') {
        return true;
      }
      
      if (element.scrollHeight > element.clientHeight && 
          (element.classList?.contains('overflow-y-auto') || 
           element.classList?.contains('overflow-auto') ||
           element.style?.overflowY === 'auto' ||
           element.style?.overflow === 'auto')) {
        return true;
      }
      
      if (element.tagName === 'INPUT' || 
          element.tagName === 'TEXTAREA' || 
          element.contentEditable === 'true') {
        return true;
      }
      
      element = element.parentElement as HTMLElement;
    }
    return false;
  }, []);

  const goToIndex = useCallback((target: number) => {
    const next = clamp(target, 0, maxIndex);
    if (next === activeIndex || animatingRef.current) return;

    animatingRef.current = true;
    setActiveIndex(next);

    window.clearTimeout(cooldownRef.current ?? undefined);
    cooldownRef.current = window.setTimeout(() => {
      animatingRef.current = false;
    }, TRANSITION_MS + POST_COOLDOWN_MS);
  }, [activeIndex, maxIndex]);

  const goNext = useCallback(() => goToIndex(activeIndex + 1), [goToIndex, activeIndex]);
  const goPrev = useCallback(() => goToIndex(activeIndex - 1), [goToIndex, activeIndex]);

  const goToId = useCallback((id: string) => {
    const idx = sectionIds.findIndex((sectionId) => sectionId === id);
    if (idx >= 0) goToIndex(idx);
  }, [sectionIds, goToIndex]);

  const onWheel = useCallback((e: WheelEvent) => {
    if (shouldIgnoreScroll(e.target)) {
      return;
    }
    
    e.preventDefault();
    if (animatingRef.current) return;

    wheelAccRef.current += e.deltaY;
    const acc = wheelAccRef.current;

    if (Math.abs(acc) >= WHEEL_THRESHOLD) {
      wheelAccRef.current = 0;
      if (acc > 0) goNext(); else goPrev();
    }
  }, [goNext, goPrev, shouldIgnoreScroll]);

  const onTouchStart = useCallback((e: TouchEvent) => {
    if (shouldIgnoreScroll(e.target)) return;
    if (animatingRef.current) return;
    
    const t = e.touches[0];
    touchStartYRef.current = t.clientY;
    touchDeltaYRef.current = 0;
  }, [shouldIgnoreScroll]);

  const onTouchMove = useCallback((e: TouchEvent) => {
    if (shouldIgnoreScroll(e.target)) return;
    
    e.preventDefault();
    const startY = touchStartYRef.current;
    if (startY == null || animatingRef.current) return;
    const currentY = e.touches[0].clientY;
    touchDeltaYRef.current = currentY - startY;
  }, [shouldIgnoreScroll]);

  const onTouchEnd = useCallback(() => {
    if (animatingRef.current) return;
    const dy = touchDeltaYRef.current;
    if (Math.abs(dy) >= TOUCH_THRESHOLD) {
      if (dy < 0) goNext(); else goPrev();
    }
    touchStartYRef.current = null;
    touchDeltaYRef.current = 0;
  }, [goNext, goPrev]);

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.contentEditable === 'true') {
      return;
    }
    
    if (animatingRef.current) return;
    
    if (['ArrowDown', 'PageDown', 'Space'].includes(e.key)) {
      e.preventDefault();
      goNext();
    } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
      e.preventDefault();
      goPrev();
    } else if (e.key === 'Home') {
      e.preventDefault();
      goToIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      goToIndex(maxIndex);
    }
  }, [goNext, goPrev, goToIndex, maxIndex]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const wheelOpts = { passive: false } as AddEventListenerOptions;
    const touchOpts = { passive: false } as AddEventListenerOptions;

    el.addEventListener('wheel', onWheel, wheelOpts);
    el.addEventListener('touchstart', onTouchStart, touchOpts);
    el.addEventListener('touchmove', onTouchMove, touchOpts);
    el.addEventListener('touchend', onTouchEnd, touchOpts);

    window.addEventListener('keydown', onKeyDown, { passive: false });

    el.tabIndex = 0;

    return () => {
      el.removeEventListener('wheel', onWheel as EventListener);
      el.removeEventListener('touchstart', onTouchStart as EventListener);
      el.removeEventListener('touchmove', onTouchMove as EventListener);
      el.removeEventListener('touchend', onTouchEnd as EventListener);
      window.removeEventListener('keydown', onKeyDown as EventListener);
    };
  }, [onWheel, onTouchStart, onTouchMove, onTouchEnd, onKeyDown]);

  const isHeaderVisible = activeIndex > 0;
  const isFooterVisible = activeIndex === maxIndex;
  
  return { 
    activeIndex, 
    isHeaderVisible, 
    isFooterVisible,
    goToId, 
    containerRef,
    totalSections: sectionIds.length 
  };
}