"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscription = (unsubscribe) => {
    let unSubscribed = false;
    return {
        isUnsubscribed: () => unSubscribed,
        unsubscribe: () => {
            if (unSubscribed) {
                throw new Error("Already Unsubscribed");
            }
            unSubscribed = true;
            unsubscribe();
        }
    };
};
