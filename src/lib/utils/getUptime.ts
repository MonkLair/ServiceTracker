import type { Service } from "#lib/models/Service.ts";

export function getUptime(service: Service | null) {
    if (!service || !service.checks.length) return 0
    return Math.round(
        (service.checks.reduce((acc, curr) => {
            acc += curr.status !== "down" ? 1 : 0;
            return acc;
        }, 0) /
            service.checks.length) * 100
    )
}