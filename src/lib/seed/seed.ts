import { SEED_KEY } from "#lib/config/consts.ts";
import type { Service, ShortService } from "#lib/models/Service.ts";
import { makeFakeHistory } from "#lib/utils/makeFakeHistory.ts";

const seed: ShortService[] = [
    { "id": "svc-01", "name": "Main API", "url": "https://api.example.com/health", "intervalSec": 30, "expectedStatus": 200, "enabled": true },
    { "id": "svc-02", "name": "Auth Service", "url": "https://auth.example.com/ping", "intervalSec": 30, "expectedStatus": 200, "enabled": true },
    { "id": "svc-03", "name": "Public Website", "url": "https://www.example.com", "intervalSec": 60, "expectedStatus": 200, "enabled": true },
    { "id": "svc-04", "name": "Payments Gateway", "url": "https://pay.example.com/status", "intervalSec": 30, "expectedStatus": 200, "enabled": true },
    { "id": "svc-05", "name": "CDN Edge (EU)", "url": "https://eu.cdn.example.com/healthz", "intervalSec": 60, "expectedStatus": 200, "enabled": true },
    { "id": "svc-06", "name": "Postgres Replica", "url": "https://db-replica.example.com/metrics", "intervalSec": 300, "expectedStatus": 200, "enabled": true },
    { "id": "svc-07", "name": "Search Index", "url": "https://search.example.com/health", "intervalSec": 60, "expectedStatus": 200, "enabled": true },
    { "id": "svc-08", "name": "Email Worker", "url": "https://mail.example.com/queue/health", "intervalSec": 300, "expectedStatus": 200, "enabled": true },
    { "id": "svc-09", "name": "Webhooks Dispatcher", "url": "https://hooks.example.com/ping", "intervalSec": 30, "expectedStatus": 200, "enabled": true },
    { "id": "svc-10", "name": "Analytics Collector", "url": "https://analytics.example.com/collect/ping", "intervalSec": 60, "expectedStatus": 204, "enabled": true },
    { "id": "svc-11", "name": "Legacy Billing (flaky)", "url": "https://legacy-billing.example.com/status", "intervalSec": 60, "expectedStatus": 200, "enabled": true },
    { "id": "svc-12", "name": "Staging API", "url": "https://staging-api.example.com/health", "intervalSec": 300, "expectedStatus": 200, "enabled": true },
    { "id": "svc-13", "name": "Status Page", "url": "https://status.example.com", "intervalSec": 300, "expectedStatus": 200, "enabled": true },
    { "id": "svc-14", "name": "Image Resizer", "url": "https://img.example.com/healthz", "intervalSec": 60, "expectedStatus": 200, "enabled": true },
    { "id": "svc-15", "name": "Feature Flags", "url": "https://flags.example.com/api/health", "intervalSec": 30, "expectedStatus": 200, "enabled": false }
]



export function setFakeData(){
    if (typeof localStorage === 'undefined') return
    if(localStorage.getItem(SEED_KEY) && (JSON.parse(localStorage.getItem(SEED_KEY)!) as []).length > 0) return

    const serviceList: Service[] = []
    const now = new Date().toISOString()

    for (const service of seed) {
        serviceList.push({
            ...service,
            createdAt: now,
            updatedAt: now,
            checks: makeFakeHistory()
        })
    }

    localStorage.setItem(SEED_KEY, JSON.stringify(serviceList))
}

