export const subscription = (unsubscribe: () => void) => {
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
