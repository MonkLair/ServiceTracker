

export function firstLetterToUpperCase(s: string | undefined) {
   if (!s) return ''
    return s[0].toUpperCase() + s.slice(1)
}