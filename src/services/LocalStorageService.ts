export enum LocalStorageKeys {
    USER = "user",
}
class LocalStorageService {
    public static setItem(key: string, item: any): void {
        localStorage.setItem(key, JSON.stringify(item));
    }

    public static getItem(key: string) {
        const saved = localStorage.getItem(key);
        if(!saved) return null;
        return JSON.parse(saved);
    }

    public static removeSession() {
        localStorage.clear();
    }

} 

export { LocalStorageService }
