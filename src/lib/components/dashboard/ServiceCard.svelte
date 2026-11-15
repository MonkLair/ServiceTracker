<script lang="ts">
    import type { Service } from "#lib/models/Service.ts";
    import { calcBarHeight } from "#lib/utils/calcBarHeight.ts";
    import { getAvg } from "#lib/utils/getAvg.ts";
    import { getUptime } from "#lib/utils/getUptime.ts";
    import ServiceDropdown from "./ServiceDropdown.svelte";

    const { service }: { service: Service } = $props();
    const {
        url,
        checks,
        name,
        id,
        enabled,
        intervalSec: interval,
    } = $derived(service);
    const status = $derived(
        service.checks[service.checks.length - 1]?.status || "unknown",
    );
    const maxResponseMs = $derived(
        Math.max(...checks.map((c) => c.responseMs ?? 0), 1),
    );

    let isDropdownOpen = $state(false);
</script>

<article class="card {enabled ? '' : 'card_disabled'}" data-status={status}>
    <header class="card_head">
        <a class="card_name" href="/services/{id}">{name}</a>
        <span class="badge badge_{enabled ? status : 'unknown'}"
            ><span class="badge_dot"></span>{enabled
                ? status[0].toUpperCase() + status.slice(1)
                : "Disabled"}</span
        >
        <button
            class="icon-btn card_menu"
            type="button"
            aria-label="Меню сервиса"
            onclick={() => (isDropdownOpen = true)}>⋮</button
        >
        {#if isDropdownOpen}
            <ServiceDropdown
                onClose={() => (isDropdownOpen = false)}
                {service}
            />
        {/if}
    </header>
    <p class="card_url" title={url}>
        {url}
    </p>
    <ul class="card_meta">
        <li>⏱ {interval}s</li>
        <li>Uptime 24h: <strong>{getUptime(service)}%</strong></li>
        <li>Avg: <strong>{getAvg(service)} ms</strong></li>
    </ul>
    <div
        class="sparkline {enabled ? '' : 'sparkline_empty'}"
        aria-hidden="true"
    >
        {#if enabled}
            {#each checks.slice(-20) as check (check.id)}
                <span
                    class="sparkline_bar sparkline_bar_{check.status}"
                    style="height:{Math.round(
                        calcBarHeight(check, maxResponseMs),
                    )}%"
                ></span>
            {/each}
        {/if}
    </div>
</article>
