<script lang="ts">
    import { serviceStore } from "#lib/stores/ServiceStore.svelte.ts";
    import { uiStore } from "#lib/stores/UIStore.svelte.ts";


    let confirm = $state('')

    function handleSubmit(e: MouseEvent) {
        if (!uiStore.servicesToReset) return;
        serviceStore.deleteAllServices();
        closeModal();
    }

    function closeModal() {
        uiStore.cancelReset();
    }
</script>

<div class="modal">
    <div role="presentation" onclick={closeModal} class="modal_backdrop"></div>

    <div
        class="modal_dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="danger-title"
    >
        <header class="modal_head">
            <h2 class="modal_title modal_title_danger" id="danger-title">
                Удалить все данные?
            </h2>
            <button onclick={closeModal} class="icon-btn" type="button" aria-label="Закрыть">
                ✕
            </button>
        </header>

        <div class="modal_body">
            <p class="modal_text">
                Все ваши сервисы, история проверок и настройки будут удалены
                навсегда. Восстановить их будет невозможно.
            </p>
            <p class="modal_text">
                Пожалуйста, введите <strong>RESET</strong>, чтобы подтвердить:
            </p>

            <input
                bind:value={confirm}
                class="input"
                type="text"
                placeholder="RESET"
                autocomplete="off"
                spellcheck="false"
            />
        </div>

        <footer class="modal_footer reset_footer">
            <button onclick={closeModal} class="btn btn_ghost" type="button"> Отмена </button>
            <button onclick={handleSubmit} class="btn btn_danger" type="button" disabled={confirm !== 'RESET'}>
                Удалить всё
            </button>
        </footer>
    </div>
</div>
