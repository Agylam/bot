export class NotifyObserver {
    private writeMessage: (message: string, user_id: number) => Promise<void>;

    constructor(writeMessage: (message: string, user_id: number) => Promise<void>) {
        this.writeMessage = writeMessage;
    }
}
