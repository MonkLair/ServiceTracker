<script lang="ts">
    import type { Check } from "#lib/models/Check.ts";
    import { getChart } from "#lib/utils/chart.ts";

    const { checks }: { checks: Check[] } = $props();

    const height = 200;
    const width = 800;

    const chart = $derived(getChart(checks, width, height));
</script>

<div class="chart_head">
    <h2 class="chart_title">
        Response time (last {checks.length} checks)
    </h2>
</div>
<div class="chart chart-container">
    <svg
        viewBox="0 0 {width} {height}"
        preserveAspectRatio="none"
        class="chart-svg"
    >
        <polyline
            fill="none"
            stroke="var(--accent)"
            stroke-width="2"
            stroke-linejoin="round"
            stroke-linecap="round"
            points={chart.points}
        />

        {#each checks as check, i}
            {@const x =
                10 + (i / Math.max(1, checks.length - 1)) * (width - 20)}
            {@const y =
                height -
                10 -
                ((check.responseMs ?? 0) / chart.maxMs) * (height - 20)}
            <circle
                cx={x}
                cy={y}
                r="4"
                fill={check.status === "up"
                    ? "var(--up)"
                    : check.status === "down"
                      ? "var(--down)"
                      : "var(--degraded)"}
            />
        {/each}
    </svg>
</div>

<style>
    .chart-container {
        width: 100%;
        height: 200px;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        padding: 16px;
        box-sizing: border-box;
    }
    .chart-svg {
        width: 100%;
        height: 100%;
        overflow: visible;
    }
</style>
