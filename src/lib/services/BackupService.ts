import { SEED_KEY, SETTINGS_KEY } from "#lib/config/consts.ts";
import type { Service } from "#lib/models/Service.ts";
import type { Settings } from "#lib/models/Settings.ts";
import { getFromStorage } from "#lib/utils/getFromStorage.ts";

interface Import {
    settings: Settings
    services: Service[]
}

export class BackupService {

    static async exportData() {
        const settings = await getFromStorage<Settings>(SETTINGS_KEY)
        const services = await getFromStorage<Service[]>(SEED_KEY)
        
        const backup = {
            exportedAt: new Date().toISOString(),
            settings,
            services
        }

        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)

        const a = document.createElement('a')
        a.href = url
        a.download = `serviceTracker-backup-${new Date().toISOString().slice(0, 10)}.json`
        a.click()

        URL.revokeObjectURL(url)
    }

    static async importData(file: File) {
        try {
            const text = await file.text()
            const data = JSON.parse(text) as Import

            if (!Array.isArray(data.services) || typeof data.settings !== 'object') {
                throw new Error('Неверный формат файла резервной копии');
            }

            localStorage.setItem(SEED_KEY, JSON.stringify(data.services));
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(data.settings));
        } catch (e) {
            console.error(e);
        }
    }
}