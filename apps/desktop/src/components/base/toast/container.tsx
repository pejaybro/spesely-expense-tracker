import { useEffect, useState, useRef } from "react";
import type { ToastData } from "./types";
import { toastStore } from "./store";
import { CheckCircle, AlertCircle, AlertTriangle, Info, Sparkles, X } from "lucide-react";
import { cn } from "@/src/utils";
import { Potral } from "../Portal";

function ToastItem({ toast }: { toast: ToastData }) {
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isDismissing, setIsDismissing] = useState(false);
  const startXRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const duration = toast.duration ?? 4000;
    timerRef.current = setTimeout(() => {
      setIsDismissing(true);
      setTimeout(() => {
        toastStore.remove(toast.id);
      }, 200);
    }, duration);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, [toast.id, toast.duration]);

  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    startXRef.current = clientX;
    stopTimer();
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    const offset = clientX - startXRef.current;
    setDragOffset(offset);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (Math.abs(dragOffset) > 100) {
      setIsDismissing(true);
      setDragOffset(dragOffset > 0 ? 500 : -500);
      setTimeout(() => {
        toastStore.remove(toast.id);
      }, 200);
    } else {
      if (Math.abs(dragOffset) < 5) {
        setIsDismissing(true);
        setTimeout(() => {
          toastStore.remove(toast.id);
        }, 200);
      } else {
        setDragOffset(0);
        startTimer();
      }
    }
  };

  const onMouseDown = (e: React.MouseEvent) => {
    handleDragStart(e.clientX);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX);
  };

  const onMouseUpOrLeave = () => {
    handleDragEnd();
  };

  const onTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientX);
  };

  const onTouchEnd = () => {
    handleDragEnd();
  };

  let Icon = Info;
  let iconColor = toast.iconColor ?? "text-sky-500";
  let borderColor = toast.borderColor ?? "border-sky-500/20";
  let bgGlow = toast.bgGlow ?? "shadow-sky-500/5";
  let accentColor = toast.accentColor ?? "bg-sky-500";

  switch (toast.type) {
    case "success":
      Icon = CheckCircle;
      iconColor = toast.iconColor ?? "text-emerald-500";
      borderColor = toast.borderColor ?? "border-emerald-500/20";
      bgGlow = toast.bgGlow ?? "shadow-emerald-500/5";
      accentColor = toast.accentColor ?? "bg-emerald-500";
      break;
    case "error":
      Icon = AlertCircle;
      iconColor = toast.iconColor ?? "text-red-500";
      borderColor = toast.borderColor ?? "border-red-500/20";
      bgGlow = toast.bgGlow ?? "shadow-red-500/5";
      accentColor = toast.accentColor ?? "bg-red-500";
      break;
    case "warning":
      Icon = AlertTriangle;
      iconColor = toast.iconColor ?? "text-amber-500";
      borderColor = toast.borderColor ?? "border-amber-500/20";
      bgGlow = toast.bgGlow ?? "shadow-amber-500/5";
      accentColor = toast.accentColor ?? "bg-amber-500";
      break;
    case "custom":
      Icon = Sparkles;
      iconColor = toast.iconColor ?? "text-violet-500";
      borderColor = toast.borderColor ?? "border-violet-500/20";
      bgGlow = toast.bgGlow ?? "shadow-violet-500/5";
      accentColor = toast.accentColor ?? "bg-violet-500";
      break;
    case "info":
    default:
      Icon = Info;
      iconColor = toast.iconColor ?? "text-sky-500";
      borderColor = toast.borderColor ?? "border-sky-500/20";
      bgGlow = toast.bgGlow ?? "shadow-sky-500/5";
      accentColor = toast.accentColor ?? "bg-sky-500";
      break;
  }

  const opacity = Math.max(0, 1 - Math.abs(dragOffset) / 300);

  return (
    <div
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUpOrLeave}
      onMouseLeave={onMouseUpOrLeave}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{
        transform: `translateX(${dragOffset}px)`,
        opacity: isDismissing ? 0 : opacity,
        transition: isDragging ? "none" : "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      className={cn(
        "relative overflow-hidden min-w-[320px] max-w-[400px] rounded-xl border backdrop-blur-md p-4 shadow-2xl flex gap-3 items-start",
        "select-none cursor-pointer active:cursor-grabbing",
        isDismissing ? "animate-out fade-out slide-out-to-right duration-200" : "animate-in slide-in-from-right fade-in duration-300",
        toast.bgColor ?? "bg-gray-950/95",
        borderColor,
        bgGlow,
        toast.className
      )}
    >
      {accentColor && accentColor !== "bg-transparent" && (
        <div
          className={cn(
            "absolute left-0 top-0 bottom-0 w-[3px]",
            accentColor
          )}
        />
      )}

      {toast.icon ? (
        <div className="shrink-0 mt-0.5 ml-1 pointer-events-none flex items-center justify-center">
          {toast.icon}
        </div>
      ) : (
        <Icon className={cn("shrink-0 mt-0.5 ml-1 pointer-events-none", iconColor)} size={18} />
      )}

      <div className="flex-1 flex flex-col gap-0.5 pointer-events-none">
        <h3 className={cn("font-semibold text-sm tracking-tight leading-tight pr-4", toast.titleColor ?? "text-white")}>
          {toast.title}
        </h3>
        {toast.description && (
          <p className={cn("text-xs font-medium mt-1 leading-normal", toast.descriptionColor ?? "text-gray-400")}>
            {toast.description}
          </p>
        )}
      </div>

      {toast.showClose && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsDismissing(true);
            setTimeout(() => {
              toastStore.remove(toast.id);
            }, 200);
          }}
          className="text-gray-500 hover:text-white transition-colors p-1 rounded-md hover:bg-gray-900 shrink-0 relative z-10"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastData[]>(toastStore.getToasts());

  useEffect(() => {
    const unsubscribe = toastStore.subscribe(setToasts);
    return unsubscribe;
  }, []);

  return (
    <Potral>
      <div
        className="
          fixed top-4 right-4
          z-[9999]
          flex flex-col gap-3
        "
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </div>
    </Potral>
  );
}