
export async function getFromStorage<T>(key: string) {
    const data: T = JSON.parse(localStorage.getItem(key) || '{}')    
    return structuredClone(data)
}