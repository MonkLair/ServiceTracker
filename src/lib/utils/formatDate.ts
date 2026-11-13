
export function formatDate(isoString: string | null | undefined, options?: Intl.DateTimeFormatOptions) {
    if (!isoString) return '—';

    const date = new Date(isoString);
    
    if (isNaN(date.getTime())) return '—';

    const defaultOptions: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    };

    return new Intl.DateTimeFormat('ru-RU', options ?? defaultOptions).format(date);
}