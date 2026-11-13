<script lang="ts">
    import ConfirmResetModal from "#lib/components/settings/modals/ConfirmResetModal.svelte";
    import { setFakeData } from "#lib/seed/seed.ts";
    import { BackupService } from "#lib/services/BackupService.ts";
    import { serviceStore } from "#lib/stores/ServiceStore.svelte.ts";
    import { settingsStore } from "#lib/stores/SettingsStore.svelte.ts";
    import { uiStore } from "#lib/stores/UIStore.svelte.ts";

    async function handleImport(e: Event & { currentTarget: HTMLInputElement }) {
        const file = e.currentTarget.files?.[0];
        if (!file) return;

        try {
            await BackupService.importData(file)

            serviceStore.loadServices()
            settingsStore.loadSettings()
        } catch (e) {
            console.error(e);
            
        }
    }

    async function handleExport() {
        await serviceStore.exportData()
    }
</script>

<section class="settings" data-route="settings">
    <h1 class="settings_title">Settings</h1>

    <div class="settings_group">
        <h2 class="settings_group-title">Appearance</h2>
        <div class="field">
            <div class="field_label">Theme</div>
            <div class="radio-group">
                <label class="radio"
                    ><input
                        type="radio"
                        name="theme"
                        value="light"
                        checked={settingsStore.settings.theme == "light"}
                        onclick={(e) => settingsStore.setTheme(e)}
                    /> Light</label
                >
                <label class="radio"
                    ><input
                        type="radio"
                        name="theme"
                        value="dark"
                        checked={settingsStore.settings.theme == "dark"}
                        onclick={(e) => settingsStore.setTheme(e)}
                    /> Dark</label
                >
                <label class="radio"
                    ><input
                        type="radio"
                        name="theme"
                        value="system"
                        checked={settingsStore.settings.theme == "system"}
                        onclick={(e) => settingsStore.setTheme(e)}
                    /> System</label
                >
            </div>
        </div>
    </div>

    <div class="settings_group">
        <h2 class="settings_group-title">Polling</h2>

        <div class="field">
            <label class="field_label" for="default-interval"
                >Default interval</label
            >
            <select
                onchange={(e) => settingsStore.setDefaultInterval(e)}
                class="select"
                id="default-interval"
                value={settingsStore.settings.defaultInterval}
            >
                <option value={30}>30 sec</option>
                <option value={60}>60 sec</option>
                <option value={300}>5 min</option>
                <option value={900}>15 min</option>
            </select>
        </div>

        <div class="field">
            <label class="field_label" for="default-expected-status"
                >Default expected status</label
            >
            <input
                onchange={(e) => settingsStore.setDefaultStatus(e)}
                class="input"
                id="default-expected-status"
                type="number"
                min="200"
                max="599"
                step="1"
                value={settingsStore.settings.defaultStatus}
            />
        </div>

        <div class="field">
            <label class="field_label" for="degraded-threshold"
                >Degraded threshold (ms)</label
            >
            <input
                onchange={(e) => settingsStore.setDegradedBoundary(e)}
                class="input"
                id="degraded-threshold"
                type="number"
                min="100"
                max="10000"
                step="100"
                value={settingsStore.settings.degradedBoundary}
            />
        </div>
    </div>

    <div class="settings_group">
        <h2 class="settings_group-title">Data</h2>
        <div class="settings_actions">
            <button onclick={handleExport} class="btn btn_ghost" type="button">Export JSON</button>
            <label class="btn btn_ghost" style="cursor: pointer;">
                Import JSON
                <input
                    type="file"
                    accept=".json"
                    onchange={handleImport}
                    hidden
                />
            </label>
            <button
                onclick={() => {
                    setFakeData();
                    serviceStore.loadServices();
                }}
                class="btn btn_ghost"
                type="button">Load demo set</button
            >
            <button
                onclick={() => uiStore.askReset(serviceStore.serviceList)}
                class="btn btn_danger"
                type="button">Reset all data</button
            >
        </div>
    </div>
</section>

{#if uiStore.servicesToReset}
    <ConfirmResetModal />
{/if}
