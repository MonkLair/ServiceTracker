<script lang="ts">
    import ConfirmClearModal from "#lib/components/modals/ConfirmClearModal.svelte";
    import ConfirmResetModal from "#lib/components/settings/modals/ConfirmResetModal.svelte";
    import { setFakeData } from "#lib/seed/seed.ts";
    import { serviceStore } from "#lib/stores/ServiceStore.svelte.ts";
    import { settingsStore } from "#lib/stores/SettingsStore.svelte.ts";
    import { uiStore } from "#lib/stores/UIStore.svelte.ts";
</script>

<section class="settings" data-route="settings">
    <h1 class="settings_title">Settings</h1>

    <div class="settings_group">
        <h2 class="settings_group-title">Appearance</h2>
        <div class="field">
            <div class="field_label">Theme</div>
            <div class="radio-group">
                <label class="radio"
                    ><input type="radio" name="theme" value="light" /> Light</label
                >
                <label class="radio"
                    ><input type="radio" name="theme" value="dark" checked /> Dark</label
                >
                <label class="radio"
                    ><input type="radio" name="theme" value="system" /> System</label
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
            <div class="field_label">Engine</div>
            <div class="radio-group">
                <label class="radio"
                    ><input type="radio" name="engine" value="mock" checked /> Mock</label
                >
                <label class="radio"
                    ><input type="radio" name="engine" value="real" /> Real fetch
                    (CORS ограничения)</label
                >
            </div>
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

        <div class="field">
            <label class="field_label" for="mock-down">Mock: down rate</label>
            <input
                class="range"
                id="mock-down"
                type="range"
                min="0"
                max="100"
                value="5"
            />
        </div>

        <div class="field">
            <label class="field_label" for="mock-degraded"
                >Mock: degraded rate</label
            >
            <input
                class="range"
                id="mock-degraded"
                type="range"
                min="0"
                max="100"
                value="15"
            />
        </div>
    </div>

    <div class="settings_group">
        <h2 class="settings_group-title">Data</h2>
        <div class="settings_actions">
            <button class="btn btn_ghost" type="button">Export JSON</button>
            <button class="btn btn_ghost" type="button">Import JSON</button>
            <button onclick={() => {
                setFakeData()
                serviceStore.loadServices()
            }} class="btn btn_ghost" type="button">Load demo set</button>
            <button onclick={() => uiStore.askReset(serviceStore.serviceList)} class="btn btn_danger" type="button">Reset all data</button>
        </div>
    </div>
</section>

{#if uiStore.servicesToReset}
    <ConfirmResetModal/>
{/if}
