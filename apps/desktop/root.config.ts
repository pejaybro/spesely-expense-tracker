/**
 *ANCHOR : Root configuration file for the desktop application. This file serves as a central point for exporting commonly used modules, libraries, types, and props across the desktop application. By centralizing these exports, we can maintain cleaner and more organized code throughout the project.
 */

/**
 *============================================
 *? Modules and libraries
 *============================================
 */

export { dayjs as default } from "../../packages/lib";

/**
 *============================================
 *? Props and types
 *============================================
 */
export type { FlexProps, ButtonProps } from "types";
