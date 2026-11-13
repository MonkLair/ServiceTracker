<script lang="ts">
    import type { ShortService } from "#lib/models/Service.ts";
    import { serviceStore } from "#lib/stores/ServiceStore.svelte.ts";
    import { settingsStore } from "#lib/stores/SettingsStore.svelte.ts";

    let { closeModal } = $props();
    const newServiceData: Omit<ShortService, "id"> = $state({
        intervalSec: settingsStore.settings.defaultInterval,
        expectedStatus: settingsStore.settings.defaultStatus,
        enabled: true,
        name: "",
        url: "",
    });

    let error: string[] = $state([]);

    async function handleSubmit(e: MouseEvent) {
        if (newServiceData.name.trim().length <= 2) error.push("nameError");
        if (newServiceData.url.trim().length < 7) error.push("urlError");
        if (
            serviceStore.serviceList.map(
                (s) => s.url === newServiceData.url.trim(),
            ).length
        )
            error.push("alreadyExist");
        if (error.length) return;

        closeModal(e);

        await serviceStore.addService(newServiceData);
    }
</script>

<div class="modal">
    <div onclick={closeModal} role="presentation" class="modal_backdrop"></div>
    <div
        class="modal_dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
    >
        <header class="modal_head">
            <h2 class="modal_title" id="modal-title">Add service</h2>
            <button
                onclick={closeModal}
                class="icon-btn modal_close"
                type="button"
                aria-label="Закрыть">✕</button
            >
        </header>
        <form class="modal_body" novalidate>
            <div class="field">
                <label class="field_label" for="f-name">Name</label>
                <input
                    bind:value={newServiceData.name}
                    class="input"
                    id="f-name"
                    type="text"
                    maxlength="64"
                    placeholder="Main API"
                />
                <p class="field_error" hidden={!error.includes("nameError")}>
                    Введите название
                </p>
            </div>

            <div class="field">
                <label class="field_label" for="f-url">URL</label>
                <input
                    bind:value={newServiceData.url}
                    class="input"
                    id="f-url"
                    type="url"
                    placeholder="https://api.example.com/health"
                />
                <p class="field_error" hidden={!error.includes("urlError")}>
                    Некорректный URL
                </p>
                <p class="field_error" hidden={!error.includes("alreadyExist")}>
                    Сервис с таким URL уже существует.
                </p>
            </div>

            <div class="field-row">
                <div class="field">
                    <label class="field_label" for="f-interval">Interval</label>
                    <select
                        bind:value={newServiceData.intervalSec}
                        class="select"
                        id="f-interval"
                    >
                        <option value={30}>30 sec</option>
                        <option value={60}>60 sec</option>
                        <option value={300}>5 min</option>
                        <option value={900}>15 min</option>
                    </select>
                </div>

                <div class="field">
                    <label class="field_label" for="f-status"
                        >Expected status</label
                    >
                    <input
                        bind:value={newServiceData.expectedStatus}
                        class="input"
                        id="f-status"
                        type="number"
                        min="100"
                        max="599"
                    />
                </div>
            </div>

            <div class="field field--inline">
                <label class="checkbox">
                    <input
                        bind:checked={newServiceData.enabled}
                        type="checkbox"
                    /> Enabled
                </label>
            </div>

            <footer class="modal_footer">
                <button onclick={closeModal} class="btn btn_ghost" type="button"
                    >Cancel</button
                >
                <button
                    onclick={handleSubmit}
                    class="btn btn_primary"
                    type="submit">Save</button
                >
            </footer>
        </form>
    </div>
</div>
