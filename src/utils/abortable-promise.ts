export class AbortablePromise<T> {
    promise: Promise<T>;
    rej: ((reason?: any) => void) | undefined = undefined;

    constructor(promise: Promise<T>) {
        this.promise = new Promise((res, rej) => {
            this.rej = rej;
            promise.then(res).catch(rej);
        });
    }

    async abort(reason?: any) {
        while (!this.rej) {
            await new Promise((res) => setTimeout(res, 70));
        }
		console.log("aborted promise!!!");
		this.rej(reason);
    }

	run() {
		return this.promise;
	}
}
