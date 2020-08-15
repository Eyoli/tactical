export default interface JsonMapperPort<T> {
    fromJson(json: any): T;
    toJson(object: T): any;
}