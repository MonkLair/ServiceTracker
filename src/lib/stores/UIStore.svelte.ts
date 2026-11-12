import type { Service } from "#lib/models/Service.ts";


class UIStore {
    serviceToDelete: Service | null = $state(null)
    serviceToClearHistory: Service | null = $state(null)
    serviceToEdit: Service | null = $state(null)
    servicesToReset: Service[] | null = $state(null)

    askDelete(service: Service) {
        this.serviceToDelete = service
    }

    cancelDelete() {
        this.serviceToDelete = null
    }

    askClearHistory(service: Service) {
        this.serviceToClearHistory = service
    }

    cancelClearHistory() {
        this.serviceToClearHistory = null
    }

    askEdit(service: Service) {
        this.serviceToEdit = service
    }

    cancelEdit() {
        this.serviceToEdit = null
    }

    askReset(services: Service[]) {
        this.servicesToReset = services
    }

    cancelReset() {
        this.servicesToReset = null
    }
}

export const uiStore = new UIStore()