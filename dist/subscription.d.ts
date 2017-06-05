export declare const subscription: (unsubscribe: () => void) => {
    isUnsubscribed: () => boolean;
    unsubscribe: () => void;
};
