import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { Badge, getBadgeVariant } from "@/components/ui/atoms/Badge";
import { Card } from "@/components/ui/atoms/Card";
import { useI18n } from "@/features/i18n/I18nProvider";
import type { Segment, SegmentContentItem, SegmentContentType } from "@/types/grid";
import { AssetType } from "@/types/nexonoma";

type SegmentFilterType = "all" | SegmentContentType;

type SegmentBoardProps = {
  segments: Segment[];
  activeType: SegmentFilterType;
  onTypeChange: (type: SegmentFilterType) => void;
  typeOptions: { value: SegmentFilterType; label: string }[];
  typePrefix: string;
};

type BoardItem = SegmentContentItem & {
  type: SegmentContentType;
};

function toCatalogTypeSlug(value: string) {
  return value.toLowerCase();
}

function buildSegmentItems(segment: Segment): BoardItem[] {
  const content = segment.content;
  if (!content) return [];

  const withType = (items: SegmentContentItem[], type: SegmentContentType) =>
    items.map((item) => ({
      ...item,
      type,
    }));

  return [
    ...withType(content.methods ?? [], AssetType.METHOD),
    ...withType(content.concepts ?? [], AssetType.CONCEPT),
    ...withType(content.tools ?? [], AssetType.TOOL),
    ...withType(content.technologies ?? [], AssetType.TECHNOLOGY),
  ];
}

function useSyncedHorizontalScroll() {
  const proxyRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const spacerRef = useRef<HTMLDivElement | null>(null);
  const [hasOverflow, setHasOverflow] = useState(false);
  const syncingRef = useRef(false);

  useEffect(() => {
    const proxy = proxyRef.current;
    const content = contentRef.current;
    const spacer = spacerRef.current;
    if (!proxy || !content || !spacer) return;

    const updateSpacer = () => {
      spacer.style.width = `${content.scrollWidth}px`;
      setHasOverflow(content.scrollWidth > content.clientWidth + 1);
    };

    updateSpacer();
    const resizeObserver = new ResizeObserver(updateSpacer);
    resizeObserver.observe(content);

    const onProxyScroll = () => {
      if (syncingRef.current) return;
      syncingRef.current = true;
      content.scrollLeft = proxy.scrollLeft;
      syncingRef.current = false;
    };

    const onContentScroll = () => {
      if (syncingRef.current) return;
      syncingRef.current = true;
      proxy.scrollLeft = content.scrollLeft;
      syncingRef.current = false;
    };

    proxy.addEventListener("scroll", onProxyScroll, { passive: true });
    content.addEventListener("scroll", onContentScroll, { passive: true });

    return () => {
      resizeObserver.disconnect();
      proxy.removeEventListener("scroll", onProxyScroll);
      content.removeEventListener("scroll", onContentScroll);
    };
  }, []);

  return { proxyRef, contentRef, spacerRef, hasOverflow };
}

function useDragToPan(containerRef: React.RefObject<HTMLDivElement>) {
  const [isDragging, setIsDragging] = useState(false);
  const stateRef = useRef({
    pointerId: -1,
    startX: 0,
    startY: 0,
    scrollLeft: 0,
    scrollTop: 0,
    dragging: false,
    moved: false,
    lastDragTime: 0,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      if (event.pointerType === "touch") return;

      const target = event.target as HTMLElement | null;
      const isInteractive = target?.closest(
        "a,button,input,select,textarea,summary,[role=\"button\"],[data-no-drag]"
      );
      if (isInteractive && !event.shiftKey) return;

      const state = stateRef.current;
      state.pointerId = event.pointerId;
      state.startX = event.clientX;
      state.startY = event.clientY;
      state.scrollLeft = container.scrollLeft;
      state.scrollTop = container.scrollTop;
      state.dragging = false;
      state.moved = false;

      container.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event: PointerEvent) => {
      const state = stateRef.current;
      if (state.pointerId !== event.pointerId) return;

      const deltaX = event.clientX - state.startX;
      const deltaY = event.clientY - state.startY;

      if (!state.dragging) {
        if (Math.hypot(deltaX, deltaY) < 6) return;
        state.dragging = true;
        state.moved = true;
        setIsDragging(true);
      }

      container.scrollLeft = state.scrollLeft - deltaX;
      container.scrollTop = state.scrollTop - deltaY;
      event.preventDefault();
    };

    const onPointerUp = (event: PointerEvent) => {
      const state = stateRef.current;
      if (state.pointerId !== event.pointerId) return;
      if (state.dragging) {
        event.preventDefault();
        state.lastDragTime = Date.now();
      }
      state.pointerId = -1;
      state.dragging = false;
      setIsDragging(false);
      container.releasePointerCapture(event.pointerId);
    };

    const onPointerCancel = (event: PointerEvent) => {
      const state = stateRef.current;
      if (state.pointerId !== event.pointerId) return;
      state.pointerId = -1;
      state.dragging = false;
      setIsDragging(false);
      container.releasePointerCapture(event.pointerId);
    };

    const onClick = (event: MouseEvent) => {
      const state = stateRef.current;
      if (Date.now() - state.lastDragTime < 250) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerup", onPointerUp);
    container.addEventListener("pointercancel", onPointerCancel);
    container.addEventListener("click", onClick, true);

    return () => {
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("pointercancel", onPointerCancel);
      container.removeEventListener("click", onClick, true);
    };
  }, [containerRef]);

  return { isDragging };
}

export function SegmentBoard({ segments, activeType, onTypeChange, typeOptions, typePrefix }: SegmentBoardProps) {
  const { t } = useI18n();
  const { proxyRef, contentRef, spacerRef, hasOverflow } = useSyncedHorizontalScroll();
  const { isDragging } = useDragToPan(contentRef);

  const translateAssetLabel = (value: string) => {
    const key = `asset.labels.${value.toLowerCase()}`;
    return t(key);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            {t("grid.segments.filters.typeLabel")}
          </div>
          <div className="relative w-full md:w-56">
            <select
              value={activeType}
              onChange={(e) => onTypeChange(e.target.value as SegmentFilterType)}
              className="w-full h-10 appearance-none rounded-xl border border-white/10 bg-white/5 pl-3 pr-10 py-2 text-sm text-slate-200 outline-none focus:border-nexo-ocean/50 focus:bg-slate-900/50 transition-all cursor-pointer shadow-sm"
            >
              {typeOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-200">
                  {`${typePrefix}: ${opt.label}`}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="m7 10 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={proxyRef}
        className={`overflow-x-auto overflow-y-hidden rounded-full bg-white/5 transition-all ${
          hasOverflow ? "h-3 border border-white/10 opacity-100" : "h-0 border border-transparent opacity-0"
        }`}
        aria-hidden="true"
      >
        <div ref={spacerRef} className="h-1" />
      </div>

      <div
        ref={contentRef}
        className={`overflow-x-auto pb-4 ${isDragging ? "cursor-grabbing select-none" : "cursor-grab"}`}
      >
        <div className="flex gap-4 min-w-max pr-2 snap-x snap-mandatory">
          {segments.map((segment) => {
            const items = buildSegmentItems(segment).filter((item) => (activeType === "all" ? true : item.type === activeType));
            const description = segment.longDescription || segment.shortDescription || t("grid.segments.segmentDescriptionFallback");

            return (
              <div
                key={segment.slug}
                className="flex w-[340px] shrink-0 snap-start flex-col rounded-2xl border border-white/10 bg-white/5"
              >
                <div className="space-y-2 border-b border-white/10 px-4 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-white">{segment.name}</h3>
                    <span className="text-[10px] font-mono text-slate-500">{items.length}</span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{description}</p>
                </div>

                <div className="flex-1 space-y-2 overflow-y-auto px-3 py-3 max-h-[calc(100vh-360px)]">
                  {items.map((item) => (
                    <Link key={item.slug} href={`/catalog/${toCatalogTypeSlug(item.type)}/${item.slug}`} data-no-drag>
                      <Card
                        variant="interactive"
                        className="rounded-xl border-white/10 bg-white/5 px-3 py-2 hover:border-white/20"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-white">{item.name}</span>
                          <Badge variant={getBadgeVariant(item.type)} size="sm" className="text-[10px] px-1.5 py-0">
                            {translateAssetLabel(item.type)}
                          </Badge>
                        </div>
                        {item.shortDescription && (
                          <p className="mt-1 text-[11px] text-slate-400 line-clamp-1">{item.shortDescription}</p>
                        )}
                      </Card>
                    </Link>
                  ))}
                  {items.length === 0 && (
                    <div className="rounded-lg border border-dashed border-white/10 bg-white/5 px-3 py-3 text-center">
                      <span className="text-[11px] text-slate-600 italic">{t("grid.segments.emptyLane")}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
