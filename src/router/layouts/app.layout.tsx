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

export const AppLayout = ({ features: featuresProp }: AppLayoutProps = {}) => {
  const features: AppLayoutFeatures = {
    ...DEFAULT_APP_LAYOUT_FEATURES,
    ...featuresProp,
  };

  const navigate = useNavigate();
  const location = useLocation();
  useContextMenu();

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

  useEffect(() => {
    if (!features.fullscreen && isFullscreen) {
      setIsFullscreen(false);
      setSidebarWidth(lastWidth.current);
    }
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

  return (
    <Flex
      direction="column"
      className="flex-1 w-full p-2.5 gap-2 overflow-hidden"
    >
      <Flex direction="row" className="flex-1 w-full gap-2 overflow-hidden">
        {/* Sidebar */}
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
              isFullscreen
                ? "overflow-x-auto py-2.5 px-4.5"
                : "overflow-x-hidden",
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
                      : null
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
                    <span className="text-md font-medium">Menu</span>
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
                  {isFullscreen ? (
                    <Minimize2 size={16} />
                  ) : (
                    <Maximize2 size={16} />
                  )}
                </Button>
              )}
            </Flex>

            {/* Nav */}
            <NavMenuBlock
              isFullscreen={isFullscreen}
              isCompact={isCompact}
              menu={NAV_ITEMS}
              navigate={navigate}
              currentPath={location.pathname}
            />
          </Flex>

          {/* Settings */}
          <Flex
            direction="column"
            className="w-full pt-4 mt-4 border-t border-chalk-20"
          >
            <MenuBtn
              tooltipContent={isCompact ? "Settings" : null}
              isMenuExpanded={!isCompact}
              onClick={() => navigate(PATH.setting())}
              name={"Settings"}
              icon={<Settings size={18} />}
              isActive={location.pathname === PATH.setting()}
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

        {!isFullscreen && (
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

const NavMenuBlock = ({
  isCompact,
  isFullscreen,
  menu,
  navigate,
  currentPath,
}: {
  isCompact?: boolean;
  isFullscreen: boolean;
  menu: any;
  navigate: (link: string) => void;
  currentPath: string;
}) => {
  return (
    <Flex
      direction={isFullscreen ? "row" : "column"}
      wrap={isFullscreen}
      className={cn("w-full gap-1", isFullscreen && "gap-5 content-start")}
    >
      {!isFullscreen &&
        menu.map((n: any) => (
          <MenuBtn
            key={n.id}
            tooltipContent={isCompact && n.name}
            isMenuExpanded={!isCompact}
            onClick={() => navigate(n.link)}
            name={n.name}
            icon={React.createElement(n.icon, { size: 18 })}
            isActive={currentPath === n.link}
          />
        ))}
      {isFullscreen &&
        menu.map((n: any) => (
          <Flex
            key={n.id}
            direction="column"
            justify="between"
            onClick={() => navigate(n.link)}
            className={cn(
              "bg-dark-6 shrink-0 relative grow-0 min-w-60 w-60 xl:min-w-75 xl:w-75 rounded-[18px] p-1.5 gap-0.5 border border-chalk-10 transition-all duration-200 cursor-pointer hover:bg-dark-5 group",
              n.hoverBorder,
            )}
          >
            <span className="absolute top-5 right-5 text-chalk-100 group-hover:text-white transition-colors">
              <ArrowUpRight size={16} />
            </span>
            <Flex direction="column" className="mt-6 p-4 gap-1">
              <span className="text-[11px] font-semibold tracking-wider text-chalk-40 uppercase">
                {n.subtitle}
              </span>
              <span className="text-3xl font-bold leading-none mb-1 text-white">
                {n.name}
              </span>
            </Flex>

            {/* Stacked Double Pill Container */}
            <div className="relative w-full flex flex-col items-center pt-1 text-sm font-medium text-white">
              {/* Back / Upper Stacked Pill Bar (Peeking out behind) */}
              {n.stat2 && (
                <div
                  className={cn(
                    "pt-2 px-4 pb-8 rounded-[14px] w-full relative z-0 -mb-6 text-slate-7",
                    n.pillBgBack,
                  )}
                >
                  <span className="truncate">{n.stat2}</span>
                </div>
              )}
              {/* Front / Lower Stacked Pill Bar (Main Popping Pill) */}
              {n.stat && (
                <div
                  className={cn(
                    "py-2.5 px-4 rounded-[14px] items-center w-full relative z-1",
                    n.pillBg,
                  )}
                >
                  <span className="truncate">{n.stat}</span>
                </div>
              )}
            </div>
          </Flex>
        ))}
    </Flex>
  );
};
