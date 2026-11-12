import type { Check } from "./Check"

export type IntervalSec = 30 | 60 | 300| 900

export interface Service {
    id: string
    name: string
    url: string
    intervalSec: IntervalSec
    createdAt: string
    updatedAt: string
    enabled: boolean
    checks: Check[]
    expectedStatus: number
}

export interface ShortService {
    id: string
    name: string
    url: string
    intervalSec: IntervalSec
    enabled: boolean
    expectedStatus: number
}