<script lang="ts">
    import type { Service } from "#lib/models/Service.ts";
    import { serviceStore } from "#lib/stores/ServiceStore.svelte.ts";
    import { uiStore } from "#lib/stores/UIStore.svelte.ts";

    const { service, onClose }: { service: Service; onClose: () => void } =
        $props();
</script>

<div
    role="presentation"
    onclick={onClose}
    class="dropdown_backdrop"
></div>
<div class="dropdown_menu" role="menu">
    <button
        onclick={() => {
            uiStore.askEdit(service);
            onClose()
        }}
        class="dropdown_item"
        role="menuitem"
    >
        <span class="dropdown_icon">✏️</span> Edit
    </button>
    <button class="dropdown_item" role="menuitem">
        <span class="dropdown_icon">{service.enabled ? "⏸️" : "▶️"}</span>
        {service.enabled ? "Pause" : "Start"}
    </button>
    <button
        onclick={() => {
            serviceStore.oncePingService(service);
            onClose()
        }}
        class="dropdown_item"
        role="menuitem"
    >
        <span class="dropdown_icon">🔄</span> Check now
    </button>

    <div class="dropdown_divider"></div>

    <button
        class="dropdown_item dropdown_item_danger"
        role="menuitem"
        onclick={() => {
            uiStore.askDelete(service);
            onClose()
        }}
    >
        <span class="dropdown_icon">🗑️</span> Delete
    </button>
</div>
