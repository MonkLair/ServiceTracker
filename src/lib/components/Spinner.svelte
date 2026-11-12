<script lang="ts">
    let { size = 32 }: { size?: number } = $props();
</script>

<div class="spinner" style="--size: {size}px" role="status" aria-label="Загрузка">
    <div class="spinner__circle"></div>
</div>

<style>
    .spinner {
        display: flex;
        align-items: center;
        justify-content: center;
        width: var(--size);
        height: var(--size);
        color: var(--accent);
    }

    .spinner__circle {
        width: 100%;
        height: 100%;
        border: 2px solid currentColor;
        border-top-color: transparent;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
</style>