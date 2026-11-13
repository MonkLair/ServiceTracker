import type { Service, ShortService } from "#lib/models/Service.ts";
import { BackupService } from "#lib/services/BackupService.ts";
import { DataService } from "#lib/services/DataService.ts";
import { settingsStore } from "./SettingsStore.svelte";

class ServiceStore {
    serviceList: Service[] = $state([])
    pingindIds = $state(new Set<string>())

    async addService(service: Omit<ShortService, 'id'>) {
        if (this.serviceList.length == 100) return
        this.serviceList = await DataService.addService(service) ?? this.serviceList
    }

    async loadServices() {
        this.serviceList = await DataService.fetchAllServices()
    }

    async oncePingService(service: Service) {
        if(service.checks.length == 50) return
        if (this.pingindIds.has(service.id)) return
        this.pingindIds.add(service.id)
        
        try {
            this.serviceList = await DataService.pingService(service.url, service.id, settingsStore.settings.degradedBoundary)
        } finally {
            this.pingindIds.delete(service.id)
        }
    }

    async deleteService(id: string) {
        this.serviceList = await DataService.deleteService(id)
    }

    async clearHistory(id: string) {
        this.serviceList = await DataService.clearHistory(id)
    }

    async pauseAll() {
        this.serviceList = await DataService.toggleAllEnabled(false)
    }

    async pauseService(id: string) {
        this.serviceList = await DataService.toggleServiceEnabled(id, false)
    }

    async startAll() {
        this.serviceList = await DataService.toggleAllEnabled(true)
    }

    async startService(id: string) {
        this.serviceList = await DataService.toggleServiceEnabled(id, true)
    }

    async editService(editedService: Service) {
        this.serviceList = await DataService.editService(editedService)
    }

    async deleteAllServices() {
        this.serviceList = await DataService.deleteAllServices()
    }

    async exportData() {
        await BackupService.exportData()
    }
}

export const serviceStore = new ServiceStore()