<script lang="ts">
    import type { ShortService } from "#lib/models/Service.ts";
    import { serviceStore } from "#lib/stores/ServiceStore.svelte.ts";
    import { uiStore } from "#lib/stores/UIStore.svelte.ts";
    import { untrack } from "svelte";

    const service = $derived(uiStore.serviceToEdit);
    const editedData: Partial<ShortService> = $state(
        untrack(() => {
            return {
                enabled: service?.enabled,
                expectedStatus: service?.expectedStatus,
                intervalSec: service?.intervalSec,
                name: service?.name,
                url: service?.url,
            };
        }),
    );

    let error: string[] = $state([]);

    function handleSubmit() {
        if (!uiStore.serviceToEdit || !service) return;
        if (editedData) {
            if ((editedData.name || editedData.name == '') && editedData.name.trim().length <= 2)
                error.push("nameError");
            if (editedData.url && editedData.url.trim().length < 7)
                error.push("urlError");
            if (
                editedData.url && editedData.url !== service.url &&
                serviceStore.serviceList
                    .map((s) => s.url === editedData.url!.trim())
                    .includes(true)
            )
                error.push("alreadyExist");
            if (error.length) return;
        }

        serviceStore.editService({
            ...service,
            ...editedData,
        });
        closeModal();
    }

    function closeModal() {
        uiStore.cancelEdit();
    }
</script>

{#if service}
    <div class="modal">
        <div
            role="presentation"
            onclick={closeModal}
            class="modal_backdrop"
        ></div>

        <div
            class="modal_dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <header class="modal_head">
                <h2 class="modal_title" id="modal-title">Edit service</h2>
                <button
                    onclick={closeModal}
                    class="icon-btn"
                    type="button"
                    aria-label="Закрыть">✕</button
                >
            </header>

            <form class="modal_body" novalidate>
                <div class="field">
                    <label class="field_label" for="f-name">Name</label>
                    <input
                        class="input"
                        id="f-name"
                        type="text"
                        maxlength="64"
                        bind:value={editedData.name}
                    />
                </div>
                <p class="field_error" hidden={!error.includes("nameError")}>
                    Название слишком короткое
                </p>
                <div class="field">
                    <label class="field_label" for="f-url">URL</label>
                    <input
                        class="input"
                        id="f-url"
                        type="url"
                        bind:value={editedData.url}
                    />
                </div>
                <p class="field_error" hidden={!error.includes("urlError")}>
                    Некорректный URL
                </p>
                <p class="field_error" hidden={!error.includes("alreadyExist")}>
                    Сервис с таким URL уже существует.
                </p>

                <div class="field-row">
                    <div class="field">
                        <label class="field_label" for="f-interval"
                            >Interval</label
                        >
                        <select
                            bind:value={editedData.intervalSec}
                            class="select"
                            id="f-interval"
                        >
                            <option value={30}>30 sec</option>
                            <option value={60} selected>60 sec</option>
                            <option value={300}>5 min</option>
                            <option value={900}>15 min</option>
                        </select>
                    </div>

                    <div class="field">
                        <label class="field_label" for="f-status"
                            >Expected status</label
                        >
                        <input
                            class="input"
                            id="f-status"
                            type="number"
                            min="100"
                            max="599"
                            bind:value={editedData.expectedStatus}
                        />
                    </div>
                </div>

                <div class="field field_inline">
                    <label class="checkbox">
                        <input
                            bind:checked={editedData.enabled}
                            type="checkbox"
                        /> Enabled
                    </label>
                </div>

                <footer class="modal_footer">
                    <button
                        onclick={closeModal}
                        class="btn btn_ghost"
                        type="button">Cancel</button
                    >
                    <button
                        onclick={handleSubmit}
                        class="btn btn_primary"
                        type="submit">Save changes</button
                    >
                </footer>
            </form>
        </div>
    </div>
{/if}
