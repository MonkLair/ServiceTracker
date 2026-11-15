<script lang="ts">
    import type { LayoutProps } from "./$types";
    import "../App.css";
    import { page } from "$app/state";
    import { serviceStore } from "#lib/stores/ServiceStore.svelte.ts";
    import { uiStore } from "#lib/stores/UIStore.svelte.ts";
    import ConfirmClearModal from "#lib/components/modals/ConfirmClearModal.svelte";
    import ConfirmDeleteModal from "#lib/components/modals/ConfirmDeleteModal.svelte";
    import EditModal from "#lib/components/modals/EditModal.svelte";
    import { settingsStore } from "#lib/stores/SettingsStore.svelte.ts";
    let { children }: LayoutProps = $props();

    const isAllPaused = $derived(
        serviceStore.serviceList.find((s) => s.enabled) ? false : true,
    );

    $effect(() => {
        const timers = new Map<string, ReturnType<typeof setInterval>>()

        for (const service of serviceStore.serviceList) {
            if (!service.enabled) continue

            const id = setInterval(() => {
                serviceStore.oncePingService(service)
            }, service.intervalSec * 1000)

            timers.set(service.id, id)
        }

        return () => {
            for (const id of timers.values()) {
                clearInterval(id)
            }
        }
    })
    const theme = $derived(
        settingsStore.settings.theme === 'system'
            ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
            : settingsStore.settings.theme
    )
</script>

<header class="app_header">
    <div class="app_header_inner container">
        <a class="logo" href="/">
            <span class="logo_dot"></span>
            <span class="logo_text">Service Tracker</span>
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
                translate="no"
                class="icon-btn"
                type="button"
                id="toggle-theme"
                onclick={() => {
                    theme === 'dark'
                        ? settingsStore.toggleTheme('light')
                        : settingsStore.toggleTheme('dark')
                }}
                aria-label="Сменить тему">
                    {#if theme != 'dark'}
                        🌙
                    {:else}
                        ☀️
                    {/if}
                </button
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
