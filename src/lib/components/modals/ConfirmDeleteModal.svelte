<script lang="ts">
    import { serviceStore } from "#lib/stores/ServiceStore.svelte.ts";
    import { uiStore } from "#lib/stores/UIStore.svelte.ts";
    import { goto } from "$app/navigation";

    function handleSubmit(e: MouseEvent) {
        if(!uiStore.serviceToDelete) return
        serviceStore.deleteService(uiStore.serviceToDelete.id);
        goto("/");
        closeModal();
    }

    function closeModal() {
        uiStore.cancelDelete()
    }
</script>

<div class="modal">
    <div onclick={closeModal} role="presentation" class="modal_backdrop"></div>
    <div
        class="modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
    >
        <header class="modal__head">
            <h2 class="modal__title" id="confirm-title">Вы уверены?</h2>
        </header>

        <div class="modal__body">
            <p>Это действие нельзя отменить.</p>
        </div>

        <footer class="modal__footer">
            <button class="btn btn--ghost" type="button" onclick={closeModal}>
                Отмена
            </button>
            <button
                class="btn btn_danger"
                type="button"
                onclick={handleSubmit}
            >
                Подтвердить
            </button>
        </footer>
    </div>
</div>

<style>
    .modal {
        position: fixed;
        inset: 0;
        z-index: 100;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px;
        background: rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(2px);
    }

    .modal__dialog {
        position: relative;
        background: var(--surface);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        width: 100%;
        max-width: 400px;
        animation: modal-in 0.2s ease;
    }

    @keyframes modal-in {
        from {
            opacity: 0;
            transform: scale(0.96) translateY(8px);
        }
        to {
            opacity: 1;
            transform: scale(1) translateY(0);
        }
    }

    .modal__head {
        padding: 20px 24px 0;
    }
    .modal__title {
        margin: 0;
        font-size: 18px;
        color: var(--text);
    }

    .modal__body {
        padding: 12px 24px 24px;
        color: var(--text-muted);
        font-size: 14px;
        line-height: 1.5;
    }
    .modal__body p {
        margin: 0;
    }

    .modal__footer {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        padding: 16px 24px;
        background: var(--surface-2);
        border-bottom-left-radius: var(--radius-lg);
        border-bottom-right-radius: var(--radius-lg);
    }
</style>
