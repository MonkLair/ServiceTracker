import type { IntervalSec } from "./Service"

export type Themes = 'dark' | 'light' | 'system'

export interface Settings {
    theme: Themes,
    defaultInterval: IntervalSec
    degradedBoundary: number
    defaultStatus: number
}