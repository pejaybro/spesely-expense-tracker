import React, { useState, useLayoutEffect, useEffect, useRef } from "react";
import { Button, Flex } from "@/src/components/base";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Maximize2,
  Minimize2,
  PanelLeftOpen,
  PanelLeftClose,
  Settings,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/src/utils";
import { useContextMenu } from "@/src/components/base/context-menu";
import { PATH } from "../path.config";
import { NAV_ITEMS } from "../nav.config";
import { MenuBtn } from "@/src/components/app";

// ============================================================================
// Constants & Configuration
// ============================================================================

const MOBILE_BREAKPOINT = 900;
const COLLAPSE_THRESHOLD = 180;
const MAX_SIDEBAR_WIDTH = 300;
const DEFAULT_SIDEBAR_WIDTH = 220;
const ICON_ONLY_WIDTH = 52;
const WIDTH_TRANSITION =
  "width 700ms cubic-bezier(0.22, 1, 0.36, 1), padding 800ms cubic-bezier(0.22, 1, 0.36, 1)";

const isMobileViewport = () => window.innerWidth < MOBILE_BREAKPOINT;

export type AppLayoutFeatures = {
  resize: boolean;
  fullscreen: boolean;
  collapseOnClick: boolean;
  autoCollapseOnResize: boolean;
};

export const DEFAULT_APP_LAYOUT_FEATURES: AppLayoutFeatures = {
  resize: true,
  fullscreen: true,
  collapseOnClick: true,
  autoCollapseOnResize: true,
};

type AppLayoutProps = {
  features?: Partial<AppLayoutFeatures>;
};

// A single entry from nav.config. Typed properly instead of `any` so
// NavMenuBlock/NavCard get autocomplete + safety.
export type NavItem = {
  id: string | number;
  name: string;
  link: string;
  icon: LucideIcon;
  subtitle?: string;
  stat?: string;
  stat2?: string;
  hoverBorder?: string;
  pillBg?: string;
  pillBgBack?: string;
};

// ============================================================================
// useSidebarLayout — all width/collapse/fullscreen/resize state + behavior.
// -> Would become `hooks/useSidebarLayout.ts`
// ============================================================================

function useSidebarLayout(features: AppLayoutFeatures) {
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH);
  const [isCollapsed, setIsCollapsed] = useState(
    () => features.autoCollapseOnResize && isMobileViewport(),
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [suppressHover, setSuppressHover] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  const sidebarRef = useRef<HTMLDivElement>(null);
  const lastWidth = useRef(DEFAULT_SIDEBAR_WIDTH);

  // Refs mirroring state so the mousemove/media-query listeners (registered
  // once) always read the latest values without needing to be re-subscribed.
  const sidebarWidthRef = useRef(sidebarWidth);
  sidebarWidthRef.current = sidebarWidth;
  const isCollapsedRef = useRef(isCollapsed);
  isCollapsedRef.current = isCollapsed;
  const isFullscreenRef = useRef(isFullscreen);
  isFullscreenRef.current = isFullscreen;

  const isCompact = !isFullscreen && isCollapsed;
  const isExpanded = isFullscreen || !isCollapsed;
  const hoverAnim =
    features.collapseOnClick && !isFullscreen && !isResizing && !suppressHover;
  const showHoverClose = hoverAnim && isSidebarHovered && isExpanded;

  const sidebarStyle = isFullscreen
    ? { width: "100%", transition: WIDTH_TRANSITION }
    : {
        width: `${isCompact ? ICON_ONLY_WIDTH : sidebarWidth}px`,
        transition: isResizing ? "none" : WIDTH_TRANSITION,
      };

  /* Auto collapse on small viewport resize */
  useLayoutEffect(() => {
    if (!features.autoCollapseOnResize) return;

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    const applyBreakpoint = (mobile: boolean) => {
      if (isFullscreenRef.current) return;

      if (mobile) {
        if (!isCollapsedRef.current) {
          lastWidth.current = sidebarWidthRef.current;
        }
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
        setSidebarWidth(lastWidth.current);
      }
    };

    const onChange = (e: MediaQueryListEvent) => applyBreakpoint(e.matches);
    mql.addEventListener("change", onChange);
    applyBreakpoint(mql.matches);

    return () => mql.removeEventListener("change", onChange);
  }, [features.autoCollapseOnResize]);

  /* Sidebar drag resizing handler */
  useEffect(() => {
    if (!isResizing || !features.resize) return;

    const onMove = (e: MouseEvent) => {
      if (isFullscreenRef.current || !sidebarRef.current) return;

      const left = sidebarRef.current.getBoundingClientRect().left;
      const width = e.clientX - left;

      if (width < COLLAPSE_THRESHOLD) {
        if (!isCollapsedRef.current) {
          lastWidth.current = sidebarWidthRef.current;
        }
        setIsCollapsed(true);
      } else if (width <= MAX_SIDEBAR_WIDTH) {
        lastWidth.current = width;
        setIsCollapsed(false);
        setSidebarWidth(width);
      }
    };

    const onUp = () => setIsResizing(false);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
  }, [isResizing, features.resize]);

  /* If fullscreen gets disabled via a feature-flag change mid-session, bail out of it */
  useEffect(() => {
    if (!features.fullscreen && isFullscreen) {
      setIsFullscreen(false);
      setSidebarWidth(lastWidth.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [features.fullscreen, isFullscreen]);

  const expandToLastWidth = () => {
    setIsCollapsed(false);
    setSidebarWidth(lastWidth.current);
  };

  const toggleCompact = () => {
    if (!features.collapseOnClick || isFullscreen) return;
    if (isCompact) {
      setSuppressHover(false);
      expandToLastWidth();
    } else {
      lastWidth.current = sidebarWidth;
      setSuppressHover(true);
      setIsCollapsed(true);
    }
  };

  const toggleFullscreen = () => {
    if (!features.fullscreen) return;

    if (isFullscreen) {
      setIsFullscreen(false);
      setSuppressHover(true);
      if (features.autoCollapseOnResize && isMobileViewport()) {
        setIsCollapsed(true);
      } else {
        expandToLastWidth();
      }
      return;
    }

    if (!isCollapsed) lastWidth.current = sidebarWidth;
    setIsFullscreen(true);
  };

  return {
    sidebarRef,
    sidebarStyle,
    isCompact,
    isExpanded,
    isFullscreen,
    isResizing,
    hoverAnim,
    showHoverClose,
    setIsResizing,
    setIsSidebarHovered,
    setSuppressHover,
    toggleCompact,
    toggleFullscreen,
  };
}

// ============================================================================
// NavCard — one destination tile shown in fullscreen menu mode.
// -> Would become `components/NavCard.tsx`
// ============================================================================

const NavCard = ({ item, onClick }: { item: NavItem; onClick: () => void }) => (
  <Flex
    direction="column"
    justify="between"
    onClick={onClick}
    className={cn(
      "bg-dark-6 shrink-0 relative grow-0 min-w-60 w-60 xl:min-w-75 xl:w-75 rounded-[18px] p-1.5 gap-0.5 border border-chalk-10 transition-all duration-200 cursor-pointer hover:bg-dark-5 group",
      item.hoverBorder,
    )}
  >
    <span className="absolute top-5 right-5 text-chalk-100 group-hover:text-white transition-colors">
      <ArrowUpRight size={16} />
    </span>

    <Flex direction="column" className="mt-6 p-4 gap-1">
      {item.subtitle && (
        <span className="text-[11px] font-semibold tracking-wider text-chalk-40 uppercase">
          {item.subtitle}
        </span>
      )}
      <span className="text-3xl font-bold leading-none mb-1 text-white">
        {item.name}
      </span>
    </Flex>

    {/* Stacked double-pill stat display */}
    {(item.stat || item.stat2) && (
      <div className="relative w-full flex flex-col items-center pt-1 text-sm font-medium text-white">
        {item.stat2 && (
          <div
            className={cn(
              "pt-2 px-4 pb-8 rounded-[14px] w-full relative z-0 -mb-6 text-slate-7",
              item.pillBgBack,
            )}
          >
            <span className="truncate">{item.stat2}</span>
          </div>
        )}
        {item.stat && (
          <div
            className={cn(
              "py-2.5 px-4 rounded-[14px] items-center w-full relative z-1",
              item.pillBg,
            )}
          >
            <span className="truncate">{item.stat}</span>
          </div>
        )}
      </div>
    )}
  </Flex>
);

// ============================================================================
// NavMenuBlock — switches between the compact/list nav and the fullscreen
// card grid.
// -> Would become `components/NavMenuBlock.tsx`
// ============================================================================

const NavMenuBlock = ({
  isCompact,
  isFullscreen,
  items,
  navigate,
  currentPath,
}: {
  isCompact?: boolean;
  isFullscreen: boolean;
  items: NavItem[];
  navigate: (link: string) => void;
  currentPath: string;
}) => {
  if (isFullscreen) {
    return (
      <Flex direction="row" wrap className="w-full gap-5 content-start">
        {items.map(item => (
          <NavCard
            key={item.id}
            item={item}
            onClick={() => navigate(item.link)}
          />
        ))}
      </Flex>
    );
  }

  return (
    <Flex direction="column" className="w-full gap-1.5">
      {items.map(item => (
        <MenuBtn
          key={item.id}
          tooltipContent={isCompact ? item.name : undefined}
          isMenuExpanded={!isCompact}
          onClick={() => navigate(item.link)}
          name={item.name}
          icon={React.createElement(item.icon, { size: 18 })}
          isActive={currentPath === item.link}
        />
      ))}
    </Flex>
  );
};

// ============================================================================
// Sidebar — the collapsible/resizable/fullscreen-able shell itself.
// -> Would become `components/Sidebar.tsx`
// ============================================================================

const Sidebar = ({
  layout,
  features,
  navigate,
  currentPath,
}: {
  layout: ReturnType<typeof useSidebarLayout>;
  features: AppLayoutFeatures;
  navigate: (link: string) => void;
  currentPath: string;
}) => {
  const {
    sidebarRef,
    sidebarStyle,
    isCompact,
    isExpanded,
    isFullscreen,
    isResizing,
    hoverAnim,
    showHoverClose,
    setIsResizing,
    setIsSidebarHovered,
    setSuppressHover,
    toggleCompact,
    toggleFullscreen,
  } = layout;

  return (
    <div
      ref={sidebarRef}
      style={sidebarStyle}
      onMouseEnter={() => setIsSidebarHovered(true)}
      onMouseLeave={() => {
        setIsSidebarHovered(false);
        setSuppressHover(false);
      }}
      className={cn(
        "bg-dark-c1 rounded-lg border border-chalk-10 h-full overflow-hidden relative flex flex-col justify-between shrink-0 select-none",
        isCompact ? "p-1.5" : !isFullscreen && "py-2 px-3",
      )}
    >
      <Flex
        direction="column"
        items="start"
        className={cn(
          "w-full overflow-y-auto",
          isFullscreen ? "overflow-x-auto py-2.5 px-4.5" : "overflow-x-hidden",
          isCompact ? "gap-0" : "gap-1.5",
        )}
      >
        {/* Header */}
        <Flex
          items="center"
          justify={isCompact ? "start" : "between"}
          className={cn("w-full", isCompact && "gap-1")}
        >
          <Button
            variant="custom"
            tooltipContent={
              isCompact
                ? "Expand Menu"
                : !isFullscreen
                  ? "Collapse Menu"
                  : undefined
            }
            rounded="md"
            className={cn(
              "bg-transparent gap-0",
              isCompact ? "p-2 aspect-square" : "p-0",
              !features.collapseOnClick && "pointer-events-none",
            )}
            onClick={toggleCompact}
          >
            {isExpanded ? (
              <>
                {hoverAnim && (
                  <span
                    className={cn(
                      "h-5 overflow-hidden inline-flex transition-all duration-300",
                      showHoverClose ? "w-5 mr-1.5" : "w-0",
                    )}
                  >
                    <PanelLeftClose
                      className={cn(
                        "shrink-0 duration-300",
                        showHoverClose
                          ? "translate-x-0 opacity-100"
                          : "-translate-x-4 opacity-0",
                      )}
                      size={20}
                    />
                  </span>
                )}
                <span className="text-md font-medium">Spesely Menu</span>
              </>
            ) : (
              <PanelLeftOpen
                size={20}
                className="text-chalk-60 hover:text-chalk-100"
              />
            )}
          </Button>

          {isExpanded && features.fullscreen && (
            <Button
              variant="white-ghost"
              rounded="full"
              className="h-auto p-2.5"
              onClick={toggleFullscreen}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </Button>
          )}
        </Flex>

        {/* Nav */}
        <NavMenuBlock
          isFullscreen={isFullscreen}
          isCompact={isCompact}
          items={NAV_ITEMS}
          navigate={navigate}
          currentPath={currentPath}
        />
      </Flex>

      {/* Settings */}
      <Flex
        direction="column"
        className="w-full pt-4 mt-4 border-t border-chalk-20"
      >
        <MenuBtn
          tooltipContent={isCompact ? "Settings" : undefined}
          isMenuExpanded={!isCompact}
          onClick={() => navigate(PATH.setting())}
          name="Settings"
          icon={<Settings size={18} />}
          isActive={currentPath === PATH.setting()}
        />
      </Flex>

      {features.resize && !isFullscreen && (
        <div
          onMouseDown={() => setIsResizing(true)}
          title="Drag to resize menu"
          className={cn(
            "absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-amber-500/60 active:bg-amber-500 transition-colors z-30",
            isResizing && "bg-amber-500",
          )}
        />
      )}
    </div>
  );
};

// ============================================================================
// AppLayout — top-level orchestrator.
// -> Stays as `AppLayout.tsx`
// ============================================================================

export const AppLayout = ({ features: featuresProp }: AppLayoutProps = {}) => {
  const features: AppLayoutFeatures = {
    ...DEFAULT_APP_LAYOUT_FEATURES,
    ...featuresProp,
  };

  const navigate = useNavigate();
  const location = useLocation();
  useContextMenu();

  const layout = useSidebarLayout(features);

  return (
    <Flex
      direction="column"
      className="flex-1 w-full p-2.5 gap-2 overflow-hidden"
    >
      <Flex direction="row" className="flex-1 w-full gap-2 overflow-hidden">
        <Sidebar
          layout={layout}
          features={features}
          navigate={link => navigate(link)}
          currentPath={location.pathname}
        />

        {!layout.isFullscreen && (
          <Flex
            direction="column"
            className="flex-1 bg-dark-c1 rounded-lg border border-chalk-10 p-4 h-full overflow-y-auto relative"
          >
            <Outlet />
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};
