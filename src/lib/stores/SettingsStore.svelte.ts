import { DEFAULT_SETTINGS } from "#lib/config/consts.ts";
import type { IntervalSec } from "#lib/models/Service.ts";
import type { Settings } from "#lib/models/Settings.ts";
import { SettingsService } from "#lib/services/SettingsService.ts";



class SettingsStore {
    settings: Settings = $state({...DEFAULT_SETTINGS})
    
    async loadSettings() {
        this.settings = await SettingsService.loadSettings()        
    }

    async setDefaultInterval(e: Event & {currentTarget: HTMLSelectElement}) {
        this.settings = await SettingsService.setDefaultInterval(Number(e.currentTarget.value) as IntervalSec)        
    }

    async setDegradedBoundary(e: Event & {currentTarget: HTMLInputElement}) {
        this.settings = await SettingsService.setDegradedBoundary(Number(e.currentTarget.value))        
    }
}

export const settingsStore = new SettingsStore()