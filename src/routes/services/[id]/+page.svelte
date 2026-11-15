<script lang="ts">
    import ResponseChart from "#lib/components/settings/ResponseChart.svelte";
    import Spinner from "#lib/components/Spinner.svelte";
    import type { Service } from "#lib/models/Service.ts";
    import { serviceStore } from "#lib/stores/ServiceStore.svelte.ts";
    import { uiStore } from "#lib/stores/UIStore.svelte.ts";
    import { firstLetterToUpperCase } from "#lib/utils/firstLetterToUpperCase.ts";
    import { formatDate } from "#lib/utils/formatDate.ts";
    import { getAvg } from "#lib/utils/getAvg.ts";
    import { getUptime } from "#lib/utils/getUptime.ts";
    import { page } from "$app/state";

    const service: Service | undefined = $derived(
        serviceStore.serviceList.find((s) => s.id === page.params.id),
    );
    const lastCheck = $derived(service?.checks[service.checks.length - 1]);

    const summary = $derived(
        service?.checks.reduce(
            (acc, curr) => {
                const responseMs = curr.responseMs ?? 0;
                if (curr.status === "up") acc.up += 1;
                if (curr.status === "degraded") acc.degraded += 1;
                if (curr.status === "down") acc.down += 1;
                if (responseMs === 0) return acc;
                if (responseMs > acc.max) acc.max = responseMs;
                if (responseMs < acc.min) acc.min = responseMs;
                return acc;
            },
            { up: 0, down: 0, degraded: 0, min: 100000, max: 0 },
        ),
    );

    async function handleRun() {
        if (!service) return;
        serviceStore.startService(service.id);
    }

    async function handlePause() {
        if (!service) return;
        await serviceStore.pauseService(service?.id);
    }
</script>

{#if service}
    <section class="detail" data-route="detail">
        <nav class="breadcrumbs" aria-label="Хлебные крошки">
            <a href="/">Dashboard</a>
            <span aria-hidden="true">/</span>
            <span>{service.name}</span>
        </nav>

        <header class="detail_head">
            <div>
                <h1 class="detail_title">{service.name}</h1>
                <p class="detail_url">{service.url}</p>
            </div>
            <div class="detail_actions">
                <span
                    class="badge badge_{service.enabled
                        ? (lastCheck?.status ?? 'unknown')
                        : 'unknown'}"
                    ><span class="badge_dot"></span>{firstLetterToUpperCase(
                        service.enabled
                            ? (lastCheck?.status ?? "unknown")
                            : "disabled",
                    )}</span
                >
                <button
                    onclick={() => uiStore.askEdit(service)}
                    class="btn btn_ghost"
                    type="button">Edit</button
                >
                <button
                    onclick={service.enabled ? handlePause : handleRun}
                    class="btn btn_ghost"
                    type="button">{service.enabled ? "Pause" : "Start"}</button
                >
                <button
                    onclick={() => serviceStore.oncePingService(service)}
                    class="btn btn_primary"
                    type="button">Check now</button
                >
                <button
                    onclick={() => uiStore.askDelete(service)}
                    class="btn btn_danger"
                    type="button">Delete</button
                >
            </div>
        </header>

        <p class="detail_meta">
            Interval: {service.intervalSec}s · Expected: {service.expectedStatus}
            · Created: {formatDate(service.createdAt)} · Updated: {formatDate(service.updatedAt)}
            · Checks: {service.checks.length}
        </p>

        <div class="detail_stats">
            <div class="stat">
                <span class="stat_label">Uptime 24h</span><span
                    class="stat_value">{getUptime(service)}%</span
                >
            </div>
            <div class="stat">
                <span class="stat_label">Avg</span><span class="stat_value"
                    >{getAvg(service)} ms</span
                >
            </div>
            <div class="stat">
                <span class="stat_label">Min</span><span class="stat_value"
                    >{summary?.min === 100000 ? 0 : summary?.min} ms</span
                >
            </div>
            <div class="stat">
                <span class="stat_label">Max</span><span class="stat_value"
                    >{summary?.max} ms</span
                >
            </div>
            <div class="stat">
                <span class="stat_label">Down</span><span class="stat_value"
                    >{summary?.down}</span
                >
            </div>
            <div class="stat">
                <span class="stat_label">Degraded</span><span class="stat_value"
                    >{summary?.degraded}</span
                >
            </div>
        </div>

        {#if service.checks.length}
            <ResponseChart checks={service.checks} />
        {:else}
            <div style="display: flex; justify-content: center; padding-bottom: 20px;">
                <h2 class="empty-state_title">Checks not found</h2>
            </div>
        {/if}
        <div class="history">
            <div class="history_head">
                <h2 class="history_title">History</h2>
                <button
                    onclick={() => uiStore.askClearHistory(service)}
                    class="btn btn_ghost btn_sm"
                    type="button">Clear history</button
                >
            </div>
            <table class="table">
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>Status</th>
                        <th>HTTP</th>
                        <th>Response</th>
                        <th>Error</th>
                    </tr>
                </thead>
                <tbody>
                    {#if service.checks.length == 0}
                        <tr>
                            <td>Checks not found</td>
                        </tr>
                    {:else}
                        {#each service.checks.slice(0, 50) as check (check.id)}
                            {@const date = new Date(check.ts).toISOString()}
                            <tr>
                                <td title={formatDate(date)}
                                    >{formatDate(date)}</td
                                >
                                <td
                                    ><span class="badge badge_{check.status}"
                                        ><span class="badge_dot"
                                        ></span>{firstLetterToUpperCase(
                                            check.status,
                                        )}</span
                                    >
                                </td>
                                <td>{check.httpStatus}</td>
                                {#if check.status === "down"}
                                    <td>Null</td>
                                {:else}
                                    <td>{check.responseMs} ms</td>
                                {/if}
                                <td>{check.error || "—"}</td>
                            </tr>
                        {/each}
                    {/if}
                </tbody>
            </table>
        </div>
    </section>
{:else}
    <div style="display: flex; justify-content: center;">
        <Spinner />
    </div>
{/if}
