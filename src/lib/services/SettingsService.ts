import { DEFAULT_SETTINGS, SETTINGS_KEY } from "#lib/config/consts.ts";
import type { IntervalSec } from "#lib/models/Service.ts";
import type { Settings } from "#lib/models/Settings.ts";
import { getFromStorage } from "#lib/utils/getFromStorage.ts";




export class SettingsService {

    static async loadSettings() {
        if (!localStorage.getItem(SETTINGS_KEY)) {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS))
            return DEFAULT_SETTINGS
        }
        return JSON.parse(localStorage.getItem(SETTINGS_KEY)!) as Settings
    }

    static async setDefaultInterval(interval: IntervalSec) {
        const newSettings = await getFromStorage<Settings>(SETTINGS_KEY)

        newSettings.defaultInterval = interval

        localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings))

        return newSettings
    }

    static async setDegradedBoundary(ms: number) {
        const newSettings = await getFromStorage<Settings>(SETTINGS_KEY)

        newSettings.degradedBoundary = ms

        localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings))

        return newSettings
    }
}