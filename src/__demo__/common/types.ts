export interface AppConfig {
    dontQuit: boolean;
}

export interface Store<T> {
    get: <R>(key: keyof T) => Promise<R>;
    set: (key: string, value: any) => Promise<void>;
    value: () => Promise<T>;
}

export interface Subscription {
    unsubscribe: () => void;
}