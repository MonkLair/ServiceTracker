import type { Check } from "#lib/models/Check.ts";

export function makeFakeHistory(n = 20): Check[] {
    let history: Check[] = []
    for (let i = 0; i <= n; i++) {
        const r = Math.random();
        const status = r > 0.9 ? 'down' : r > 0.75 ? 'degraded' : 'up';
        history.push({
            status,
            id: crypto.randomUUID(),
            ts: Date.now() - (n - i) * 60_000,
            responseMs: status === 'down' ? null : Math.round(50 + Math.random() * 2000),
            httpStatus: status === 'down' ? null : 200,
        })
    }
    return history
}