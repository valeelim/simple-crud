export type User = {
    id: string,
    name: string,
    email: string,
    dateOfBirth: Date,
}

export class CustomError {
    message: string;
    code: number;

    constructor(message: string, code: number) {
        this.message = message
        this.code = code
    }
}
