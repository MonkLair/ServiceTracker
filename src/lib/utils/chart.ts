import type { Check } from "#lib/models/Check.ts";

export function getChart(checks: Check[], width: number, height: number) {
    if (!checks.length) return { points: '', maxMs: 0 }

    const maxMs = Math.max(...checks.map(c => c.responseMs ?? 0), 1000)

    const paddingX = 10
    const paddingY = 10
    const usableWidth = width - paddingX * 2
    const usableHeigth = height - paddingY * 2

    const points = checks.map((check, index) => {
        const x = paddingX + (index / Math.max(1, checks.length - 1)) * usableWidth
        const value = check.responseMs ?? 0
        const y = height - paddingY - (value / maxMs) * usableHeigth

        return `${x},${y}`
    })

    return {
        points: points.join(' '),
        maxMs
    }
}