export interface Payload {
    id?: any
}

export class View<T extends Payload> {

    private readonly _payload: T

    constructor(payload: T) {
        this._payload = payload
    }

    get payload(): T {
        return this._payload
    }

}