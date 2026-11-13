import { SEED_KEY } from "#lib/config/consts.ts"
import type { Check, ServiceStatus } from "#lib/models/Check.ts"
import type { Service, ShortService } from "#lib/models/Service.ts"
import { settingsStore } from "#lib/stores/SettingsStore.svelte.ts"
import { delay } from "#lib/utils/delay.ts"
import { getFromStorage} from "#lib/utils/getFromStorage.ts"



export class DataService {
    static async fetchAllServices(): Promise<Service[]> {
        return JSON.parse(localStorage.getItem(SEED_KEY)!)
    }


    static async toggleAllEnabled(enabled: boolean) {
        const newList = await getFromStorage<Service[]>(SEED_KEY)

        newList.forEach(s => s.enabled = enabled)

        localStorage.setItem(SEED_KEY, JSON.stringify(newList))
        return newList
    }

    static async toggleServiceEnabled(id: string, enabled: boolean) {
        const newList = await getFromStorage<Service[]>(SEED_KEY)

        const idx = newList.findIndex(s => s.id === id)
        newList[idx].enabled = enabled

        localStorage.setItem(SEED_KEY, JSON.stringify(newList))
        return newList
    }

    static async deleteService(id: string) {
        const newList = await getFromStorage<Service[]>(SEED_KEY)

        const idx = newList.findIndex(s => s.id === id)
        const deletedService = newList.splice(idx, 1)

        localStorage.setItem(SEED_KEY, JSON.stringify(newList))
        return newList
    }

    static async clearHistory(id: string) {
        const newList = await getFromStorage<Service[]>(SEED_KEY)

        const idx = newList.findIndex(s => s.id === id)
        newList[idx].checks = []

        localStorage.setItem(SEED_KEY, JSON.stringify(newList))
        return newList
    }

    static async pingService(url: string, id: string, degradedBoundary: number): Promise<Service[]> {
        const r = Math.random() * 2500
        await delay(Math.round(r))
        const status: ServiceStatus = r >= 2200 ? 'down' : r >= degradedBoundary ? 'degraded' : 'up'
        const httpStatus = status === 'down' ? 400 : 200
        const now = Date.now()

        const check = {
            httpStatus,
            responseMs: Math.round(r),
            id,
            status,
            ts: now,
        }
        const newList = await getFromStorage<Service[]>(SEED_KEY)

        const idx = newList.findIndex(s => s.id === id)
        newList[idx].checks.push(check)
        localStorage.setItem(SEED_KEY, JSON.stringify(newList))

        return newList
    }

    static async addService(service: Omit<ShortService, 'id'>): Promise<Service[] | null> {
        await delay(200)
        if (localStorage.getItem(SEED_KEY) == null) return null

        const newList = await getFromStorage<Service[]>(SEED_KEY)

        if (newList.find((s) => s.url === service.url)) return null
        const now = new Date().toISOString()

        const newService = {
            ...service,
            id: crypto.randomUUID(),
            checks: [],
            createdAt: now,
            updatedAt: now
        }
        newList.push(newService)

        localStorage.setItem(SEED_KEY, JSON.stringify(newList))
        return newList
    }

    static async editService(editedService: Service) {
        await delay(200)
        const newList = await getFromStorage<Service[]>(SEED_KEY)

        const idx = newList.findIndex(s => s.id === editedService.id)

        newList[idx] = {
            ...editedService,
            updatedAt: new Date().toISOString()
        }
        localStorage.setItem(SEED_KEY, JSON.stringify(newList))
        return newList
    }

    static async deleteAllServices() {
        localStorage.setItem(SEED_KEY, JSON.stringify([]))
        return []
    }

}