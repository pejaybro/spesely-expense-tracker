import { useState, useRef, useEffect, useCallback } from "react";
import { Copy, Clipboard, Shuffle, X, Check } from "lucide-react";
import { Button } from "@/src/components/base";
import { Modal } from "@/src/pejay-ui/panels";

// ============================================================================
// Color Conversion Helpers (HSV <-> HEX <-> RGB)
// ============================================================================

interface HSV {
  h: number; // 0..360
  s: number; // 0..100
  v: number; // 0..100
}

function hsvToHex({ h, s, v }: HSV): string {
  const sNorm = s / 100;
  const vNorm = v / 100;
  const c = vNorm * sNorm;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = vNorm - c;

  let r = 0, g = 0, b = 0;
  if (h >= 0 && h < 60) { r = c; g = x; b = 0; }
  else if (h >= 60 && h < 120) { r = x; g = c; b = 0; }
  else if (h >= 120 && h < 180) { r = 0; g = c; b = x; }
  else if (h >= 180 && h < 240) { r = 0; g = x; b = c; }
  else if (h >= 240 && h < 300) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }

  const rHex = Math.round((r + m) * 255).toString(16).padStart(2, "0");
  const gHex = Math.round((g + m) * 255).toString(16).padStart(2, "0");
  const bHex = Math.round((b + m) * 255).toString(16).padStart(2, "0");

  return `#${rHex}${gHex}${bHex}`.toUpperCase();
}

function hexToHsv(hex: string): HSV {
  let cleanHex = hex.replace("#", "").trim();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split("").map(c => c + c).join("");
  }
  if (cleanHex.length !== 6) return { h: 0, s: 100, v: 100 };

  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;

  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }

  const s = max === 0 ? 0 : Math.round((d / max) * 100);
  const v = Math.round(max * 100);

  return { h, s, v };
}

function isValidHex(hex: string): boolean {
  return /^#?([0-9A-F]{3}){1,2}$/i.test(hex.trim());
}

// ============================================================================
// Props
// ============================================================================

export interface ColorPickerModalProps {
  isOpen: boolean;
  initialColor?: string;
  onClose: () => void;
  onApply: (color: string) => void;
}

// ============================================================================
// Component
// ============================================================================

export const ColorPickerModal = ({
  isOpen,
  initialColor = "#AA5BFC",
  onClose,
  onApply,
}: ColorPickerModalProps) => {
  const [hsv, setHsv] = useState<HSV>(() => hexToHsv(initialColor));
  const [hexInput, setHexInput] = useState<string>(initialColor.toUpperCase());
  const [copied, setCopied] = useState(false);

  const satValRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);

  // Sync state when modal opens
  useEffect(() => {
    if (isOpen) {
      const parsed = hexToHsv(initialColor);
      setHsv(parsed);
      setHexInput(hsvToHex(parsed));
    }
  }, [isOpen, initialColor]);

  const updateColorFromHsv = useCallback((newHsv: HSV) => {
    setHsv(newHsv);
    setHexInput(hsvToHex(newHsv));
  }, []);

  // ── 2D Saturation / Value Drag Handler ──────────────────────────────────────

  const handleSatValMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!satValRef.current) return;
      const rect = satValRef.current.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      let x = (clientX - rect.left) / rect.width;
      let y = (clientY - rect.top) / rect.height;

      x = Math.max(0, Math.min(1, x));
      y = Math.max(0, Math.min(1, y));

      const s = Math.round(x * 100);
      const v = Math.round((1 - y) * 100);

      updateColorFromHsv({ ...hsv, s, v });
    },
    [hsv, updateColorFromHsv]
  );

  const handleSatValMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    handleSatValMove(e.nativeEvent);

    const onMove = (moveEv: MouseEvent | TouchEvent) => handleSatValMove(moveEv);
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onUp);
  };

  // ── Hue Slider Drag Handler ──────────────────────────────────────────────────

  const handleHueMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!hueRef.current) return;
      const rect = hueRef.current.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;

      let x = (clientX - rect.left) / rect.width;
      x = Math.max(0, Math.min(1, x));

      const h = Math.round(x * 360);
      updateColorFromHsv({ ...hsv, h });
    },
    [hsv, updateColorFromHsv]
  );

  const handleHueMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    handleHueMove(e.nativeEvent);

    const onMove = (moveEv: MouseEvent | TouchEvent) => handleHueMove(moveEv);
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onUp);
  };

  // ── Hex Input Change ─────────────────────────────────────────────────────────

  const handleHexInputChange = (val: string) => {
    setHexInput(val);
    if (isValidHex(val)) {
      const parsed = hexToHsv(val);
      setHsv(parsed);
    }
  };

  const handleCopy = () => {
    const hex = hsvToHex(hsv);
    navigator.clipboard.writeText(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (isValidHex(text)) {
        let clean = text.trim();
        if (!clean.startsWith("#")) clean = `#${clean}`;
        handleHexInputChange(clean.toUpperCase());
      }
    } catch (err) {
      console.error("Failed to read clipboard", err);
    }
  };

  const handleRandom = () => {
    const randomH = Math.floor(Math.random() * 360);
    const randomS = Math.floor(Math.random() * 40) + 60; // 60-100%
    const randomV = Math.floor(Math.random() * 40) + 60; // 60-100%
    const newHsv = { h: randomH, s: randomS, v: randomV };
    updateColorFromHsv(newHsv);
  };

  if (!isOpen) return null;

  const currentHex = hsvToHex(hsv);
  const pureHueHex = hsvToHex({ h: hsv.h, s: 100, v: 100 });

  return (
    <Modal options={{}} onClose={onClose} isActive={isOpen}>
      {/* Card Dialog */}
      <div
        className="relative w-full max-w-sm bg-[#121212] border border-white/10 rounded-2xl p-5 shadow-2xl flex flex-col gap-4 text-white"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold tracking-tight text-white/90">Pick Color</h3>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* 1. 2D Saturation / Value Gradient Box */}
        <div
          ref={satValRef}
          onMouseDown={handleSatValMouseDown}
          onTouchStart={handleSatValMouseDown}
          className="relative w-full h-44 rounded-xl cursor-crosshair overflow-hidden select-none touch-none shadow-inner"
          style={{
            backgroundColor: pureHueHex,
            backgroundImage: `
              linear-gradient(to top, #000, transparent),
              linear-gradient(to right, #fff, transparent)
            `,
          }}
        >
          {/* Handle */}
          <div
            className="absolute w-5 h-5 -ml-2.5 -mt-2.5 rounded-full border-2 border-white shadow-md pointer-events-none transition-transform duration-75"
            style={{
              left: `${hsv.s}%`,
              top: `${100 - hsv.v}%`,
              backgroundColor: currentHex,
            }}
          />
        </div>

        {/* 2. Hue Slider */}
        <div
          ref={hueRef}
          onMouseDown={handleHueMouseDown}
          onTouchStart={handleHueMouseDown}
          className="relative w-full h-4 rounded-full cursor-pointer select-none touch-none shadow-inner"
          style={{
            background: `linear-gradient(to right, 
              #ff0000 0%, #ffff00 17%, #00ff00 33%, 
              #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)`,
          }}
        >
          {/* Handle */}
          <div
            className="absolute w-5 h-5 -top-0.5 -ml-2.5 rounded-full border-2 border-white shadow-md pointer-events-none"
            style={{
              left: `${(hsv.h / 360) * 100}%`,
              backgroundColor: pureHueHex,
            }}
          />
        </div>

        {/* 3. Color Output & Hex Input row */}
        <div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-white/10">
          {/* Color Circle Preview */}
          <div
            className="w-8 h-8 rounded-full border border-white/20 shrink-0 shadow-sm transition-colors duration-150"
            style={{ backgroundColor: currentHex }}
          />

          {/* Hex Input */}
          <div className="flex-1 flex items-center gap-1 font-mono text-sm">
            <span className="text-white/40 select-none">#</span>
            <input
              type="text"
              value={hexInput.replace("#", "")}
              onChange={e => handleHexInputChange(`#${e.target.value}`)}
              maxLength={6}
              className="w-full bg-transparent text-white font-mono font-medium focus:outline-none uppercase"
              placeholder="FFFFFF"
            />
          </div>

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            title="Copy HEX"
            className="p-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          </button>

          {/* Paste Button */}
          <button
            type="button"
            onClick={handlePaste}
            title="Paste HEX from clipboard"
            className="p-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <Clipboard size={14} />
          </button>
        </div>

        {/* 4. Action Buttons Footer */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <Button
            variant="white-ghost"
            onClick={handleRandom}
            className="gap-1.5 h-9 px-3 text-xs"
            title="Generate Random Color"
          >
            <Shuffle size={13} />
            Random
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="white-ghost"
              onClick={onClose}
              className="h-9 px-3 text-xs"
            >
              Cancel
            </Button>
            <Button
              variant="white"
              onClick={() => onApply(currentHex)}
              className="h-9 px-4 text-xs font-semibold"
            >
              Apply
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
