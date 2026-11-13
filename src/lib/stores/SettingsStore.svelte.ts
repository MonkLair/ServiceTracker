import { DEFAULT_SETTINGS } from "#lib/config/consts.ts";
import type { IntervalSec } from "#lib/models/Service.ts";
import type { Settings, Themes } from "#lib/models/Settings.ts";
import { SettingsService } from "#lib/services/SettingsService.ts";

class SettingsStore {
    settings: Settings = $state({ ...DEFAULT_SETTINGS })

    async loadSettings() {
        this.settings = await SettingsService.loadSettings()
        this.applyTheme()
    }

    async setDefaultInterval(e: Event & { currentTarget: HTMLSelectElement }) {
        this.settings = await SettingsService.setDefaultInterval(Number(e.currentTarget.value) as IntervalSec)
    }

    async setDegradedBoundary(e: Event & { currentTarget: HTMLInputElement }) {
        this.settings = await SettingsService.setDegradedBoundary(Number(e.currentTarget.value))
    }

    async setDefaultStatus(e: Event & { currentTarget: HTMLInputElement }) {
        const statusCode = Number(e.currentTarget.value)
        if (statusCode > 599 || statusCode < 200) return
        this.settings = await SettingsService.setDefaultStatus(Number(statusCode))
    }

    applyTheme() {
        const theme = this.settings.theme
        const isDark = theme === 'dark' ||
            (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

        document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
    }

    async setTheme(e: MouseEvent & { currentTarget: HTMLInputElement }) {
        const theme = e.currentTarget.value as Themes

        this.settings = await SettingsService.setTheme(theme)
        this.applyTheme()
    }

    async toggleTheme(theme: 'dark' | 'light') {
        this.settings = await SettingsService.setTheme(theme)
        
        this.applyTheme()
    }
}

export const settingsStore = new SettingsStore()