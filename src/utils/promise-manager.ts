export class PromiseManager {
    rej: ((reason?: any) => void) | undefined = undefined;

    run<T>(promise: Promise<T>): Promise<T> {
        return new Promise((res, rej) => {
            this.rej = rej;
            promise
                .then(res)
                .catch(rej)
                .finally(() => {
                    this.rej = undefined;
                });
        });
    }

    abort(reason?: any) {
        if (!this.rej) return;
        this.rej(reason);
        this.rej = undefined;
    }
}

// await promiseManager.run(Promise);
