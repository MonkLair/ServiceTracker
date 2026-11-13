<script lang="ts">
    import AddServiceButton from "#lib/components/dashboard/AddServiceButton.svelte";
    import AddServiceModal from "#lib/components/dashboard/modals/AddServiceModal.svelte";
    import ServiceCard from "#lib/components/dashboard/ServiceCard.svelte";
    import type { Filters, Sorts } from "#lib/models/ServicesFilters.ts";
    import { setFakeData } from "#lib/seed/seed.ts";
    import { serviceStore } from "#lib/stores/ServiceStore.svelte.ts";
    import { filterServices } from "#lib/utils/filterServices.ts";

    const serviceList = $derived(serviceStore.serviceList);
    const summary = $derived(
        serviceStore.serviceList.reduce(
            (acc, curr) => {
                acc.total += 1;
                if (curr.checks[curr.checks.length - 1]?.status === "up")
                    acc.up += 1;
                if (curr.checks[curr.checks.length - 1]?.status === "degraded")
                    acc.degraded += 1;
                if (curr.checks[curr.checks.length - 1]?.status === "down")
                    acc.down += 1;
                return acc;
            },
            { total: 0, degraded: 0, up: 0, down: 0 },
        ),
    );
    let activeFilter: Filters = $state("all");
    let activeSort: Sorts = $state("status");
    let searchQuery = $state("");
    function handleFilterClick(
        e: MouseEvent & { currentTarget: HTMLButtonElement },
    ) {
        activeFilter = e.currentTarget.textContent.toLowerCase() as Filters;
    }

    const filteredList = $derived(
        filterServices(serviceList, activeFilter, activeSort, searchQuery),
    );
    let isOpen = $state(false);

    const closeModal = (e: MouseEvent) => {
        e.preventDefault();
        isOpen = false;
    };
</script>

<section class="dashboard" data-route="dashboard">
    <div class="summary">
        <div class="summary_tile">
            <span class="summary_label">Total</span>
            <span class="summary_value">{summary.total}</span>
        </div>
        <div class="summary_tile summary_tile_up">
            <span class="summary_label">Up</span>
            <span class="summary_value">{summary.up}</span>
        </div>
        <div class="summary_tile summary_tile_degraded">
            <span class="summary_label">Degraded</span>
            <span class="summary_value">{summary.degraded}</span>
        </div>
        <div class="summary_tile summary_tile_down">
            <span class="summary_label">Down</span>
            <span class="summary_value">{summary.down}</span>
        </div>
    </div>

    <div class="toolbar">
        <div class="toolbar_row">
            <AddServiceButton onclick={() => (isOpen = true)} />

            <input
                class="input input_search"
                type="search"
                placeholder="Search by name or URL…"
                bind:value={searchQuery}
            />

            <select bind:value={activeSort} class="select select_sort">
                <option value="status">Sort: Status</option>
                <option value="name">Sort: Name (A–Z)</option>
                <option value="uptime">Sort: Uptime</option>
                <option value="date">Sort: Added date</option>
            </select>
        </div>

        <div class="chips" role="tablist" aria-label="Фильтр по статусу">
            <button
                onclick={handleFilterClick}
                class="chip {activeFilter === 'all' ? 'chip_active' : ''}"
                role="tab"
                aria-selected="true">All</button
            >
            <button
                onclick={handleFilterClick}
                class="chip {activeFilter === 'up' ? 'chip_active' : ''}"
                role="tab"
                aria-selected="false">Up</button
            >
            <button
                onclick={handleFilterClick}
                class="chip {activeFilter === 'degraded' ? 'chip_active' : ''}"
                role="tab"
                aria-selected="false">Degraded</button
            >
            <button
                onclick={handleFilterClick}
                class="chip {activeFilter === 'down' ? 'chip_active' : ''}"
                role="tab"
                aria-selected="false">Down</button
            >
            <button
                onclick={handleFilterClick}
                class="chip {activeFilter === 'unknown' ? 'chip_active' : ''}"
                role="tab"
                aria-selected="false">Unknown</button
            >
            <button
                onclick={handleFilterClick}
                class="chip {activeFilter === 'disabled' ? 'chip_active' : ''}"
                role="tab"
                aria-selected="false">Disabled</button
            >
        </div>
    </div>

    <div class="cards">
        {#each filteredList as service}
            <ServiceCard {service} />
        {/each}
    </div>

    {#if isOpen}
        <AddServiceModal {closeModal} />
    {/if}

    {#if !serviceList.length}
        <div class="empty-state">
            <div class="empty-state_icon">📈</div>
            <h2 class="empty-state_title">Пока нет сервисов</h2>
            <p class="empty-state_text">
                Добавь первый сервис или загрузи демо-набор из 15 сервисов.
            </p>
            <div class="empty-state_actions">
                <AddServiceButton onclick={() => (isOpen = true)} />
                <button
                    onclick={() => {
                        setFakeData();
                        serviceStore.loadServices();
                    }}
                    class="btn btn_ghost"
                    type="button">Load demo set</button
                >
            </div>
        </div>
    {/if}
    {#if serviceList.length && !filteredList.length}
        <div class="empty-state">
            <div class="empty-state_icon">📈</div>
            <h2 class="empty-state_title">Сервисы не найдены</h2>
            <p class="empty-state_text">
                Добавьте новый или измените фильтры.
            </p>
        </div>
    {/if}
</section>
