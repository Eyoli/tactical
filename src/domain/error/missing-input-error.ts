export default class MissingInputError extends Error {

    constructor(inputName: string) {
        super(inputName + " is required");
    }
}