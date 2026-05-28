export type ProgressVariant = "line" | "gradient" | "segmented" | "circle" | "striped";

export interface ProgressProps {
  /** Value from 0 to 100 */
  value: number;
  /** Styling variant */
  variant?: ProgressVariant;
  /** Custom height for linear bars in px (defaults to 6px) */
  height?: number;
  /** Display label with percentage (e.g., "65%") */
  showLabel?: boolean;
  /** Custom label text displayed on the left side of the progress bar */
  label?: string;
  /** Whether to show text percentage in the center of the circle progress */
  showCircleLabel?: boolean;
  /** Manual number of segments for segmented mode. If not provided, it will auto-configure. */
  segments?: number;
  /** Position of the label text row: above ('top') or below ('bottom') the bar (defaults to 'top') */
  labelPosition?: "top" | "bottom";
}
