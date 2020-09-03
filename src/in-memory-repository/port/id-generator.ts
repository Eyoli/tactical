export default interface IdGenerator<T, I> {
    generate(object: T): I;
}