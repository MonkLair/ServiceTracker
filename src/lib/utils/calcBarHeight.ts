import type { Check } from "#lib/models/Check.ts";

export function calcBarHeight(check: Check, maxMs: number) {
    if (check.status === 'down' || check.responseMs == null) return 4;    
    return Math.max(4, (check.responseMs / maxMs) * 100);
}