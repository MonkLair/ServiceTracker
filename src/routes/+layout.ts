import { setFakeData } from "#lib/seed/seed.ts";
import { serviceStore } from "#lib/stores/ServiceStore.svelte.ts";
import { settingsStore } from "#lib/stores/SettingsStore.svelte.ts";
import type { LayoutLoad } from "./$types";

export const ssr = false

export const load: LayoutLoad = async () => {
    setFakeData()
    await settingsStore.loadSettings()
    await serviceStore.loadServices()
    return {}
}