import type { Settings } from "#lib/models/Settings.ts"

export const APP_DELAY = 500

export const SEED_KEY = 'seed_services'

export const SETTINGS_KEY = 'settings_services'

export const DEFAULT_SETTINGS: Settings = {
    defaultInterval: 60,
    degradedBoundary: 1000,
    theme: 'dark',
    defaultStatus: 200
}