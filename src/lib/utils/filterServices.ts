import type { ServiceStatus } from "#lib/models/Check.ts";
import type { Service } from "#lib/models/Service.ts";
import type { Filters, Sorts } from "#lib/models/ServicesFilters.ts";
import { getUptime } from "./getUptime";

const STATUS_ORDER = {
    up: 0,
    degraded: 1,
    down: 2,
    unknown: 3,
    disabled: 4
};

export function filterServices(list: Service[], filter: Filters, sort: Sorts, query: string) {
    return list.filter(service => {
        const name = service.name.toLowerCase()
        const url = service.url.toLowerCase()
        const checks = service.checks
        const isActive = service.enabled
        const searchQuery = query.toLowerCase().trim()

        if (url.includes(searchQuery) || name.includes(searchQuery) || searchQuery == '') {
            if (isActive) {

                if (filter === 'all') return true

                if (!checks.length) {
                    if (filter === 'unknown') return true
                    return false
                }

                return (
                    checks[checks.length - 1].status === filter
                );
            } else {
                if (filter === 'all' || filter === 'disabled') return true
            }

            
        }
    }).sort((a, b) => {
        const aStatus = a.enabled ? a.checks[a.checks.length - 1]?.status ?? 'unknown' : 'disabled'
        const bStatus = b.enabled ? b.checks[b.checks.length - 1]?.status ?? 'unknown' : 'disabled'
        const aUptime = getUptime(a)
        const bUptime = getUptime(b)
        switch (sort) {
            case "status":
                return STATUS_ORDER[aStatus] - STATUS_ORDER[bStatus]
            case "name":
                return a.name.localeCompare(b.name)
            case "uptime":
                return bUptime - aUptime
            case "date":
                return b.createdAt.localeCompare(a.createdAt)
        }
    })
}