<script lang="ts">
    import type { LayoutProps } from "./$types";
    import "../App.css";
    import { page } from "$app/state";
    import { serviceStore } from "#lib/stores/ServiceStore.svelte.ts";
    import { uiStore } from "#lib/stores/UIStore.svelte.ts";
    import ConfirmClearModal from "#lib/components/modals/ConfirmClearModal.svelte";
    import ConfirmDeleteModal from "#lib/components/modals/ConfirmDeleteModal.svelte";
    import EditModal from "#lib/components/modals/EditModal.svelte";
    let { children }: LayoutProps = $props();

    const isAllPaused = $derived(
        serviceStore.serviceList.find((s) => s.enabled) ? false : true,
    );
</script>

<header class="app_header">
    <div class="app_header_inner container">
        <a class="logo" href="/">
            <span class="logo_dot"></span>
            <span class="logo_text">Pulse</span>
        </a>

        <nav class="nav" aria-label="Основная навигация">
            <a
                class="nav_link {page.url.pathname === '/'
                    ? 'nav_link_active'
                    : ''}"
                href="/">Dashboard</a
            >
            <a
                class="nav_link {page.url.pathname === '/settings'
                    ? 'nav_link_active'
                    : ''}"
                href="/settings">Settings</a
            >
        </nav>

        <div class="app_header_actions">
            <button
                onclick={isAllPaused
                    ? () => serviceStore.startAll()
                    : () => serviceStore.pauseAll()}
                class="btn btn_ghost"
                type="button"
                id="toggle_engine"
                >{isAllPaused ? "Start All" : "Pause All"}</button
            >
            <button
                class="icon-btn"
                type="button"
                id="toggle-theme"
                aria-label="Сменить тему">🌙</button
            >
        </div>
    </div>
</header>

<main class="app_main container">
    {@render children()}
</main>

{#if uiStore.serviceToDelete}
    <ConfirmDeleteModal/>
{/if}

{#if uiStore.serviceToClearHistory}
    <ConfirmClearModal/>
{/if}

{#if uiStore.serviceToEdit}
    <EditModal/>
{/if}
