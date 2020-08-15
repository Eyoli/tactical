import fs from "fs";
import RepositoryPort from "../../domain/port/secondary/repository";
import { injectable } from "inversify";
import * as UUID from "uuid";
import JsonMapperPort from "../port/json-mapper-port";

const FILE_ENCODING = "utf8";
const FILE_SUFFIX = ".json";

@injectable()
export class InJsonFileRepository<T> implements RepositoryPort<T> {
    private baseUrl!: string;
    private jsonMapper: JsonMapperPort<T>;

    constructor(jsonMapper: JsonMapperPort<T>) {
        this.jsonMapper = jsonMapper;
    }

    withBaseUrl(baseUrl: string) {
        this.baseUrl = baseUrl + "/";
        return this;
    }

    update(object: T, id: string): void {
        this.writeFile(id, object, true);
    }
    
    save(object: T) {
        const id = UUID.v4();
        this.writeFile(id, object, false);
        return id;
    }

    load(id: string): T | undefined {
        if (fs.existsSync(this.baseUrl + id + FILE_SUFFIX)) {
            return this.readFile(id + FILE_SUFFIX);
        }
        return undefined;
    }

    loadSome(ids: string[]): T[] {
        if(ids.length > 0) {
            return fs.readdirSync(this.baseUrl)
            .filter(fileName => ids.includes(fileName.split(FILE_SUFFIX)[0]))
            .map(fileName => this.readFile(fileName));
        }
        return [];
    }

    loadAll(): T[] {
        return fs.readdirSync(this.baseUrl)
            .map(fileName => this.readFile(fileName));
    }

    private readFile(fileName: string): T {
        const json = JSON.parse(fs.readFileSync(this.baseUrl + fileName, FILE_ENCODING));
        return this.jsonMapper.fromJson(json);
    }

    private writeFile(id: string, object: T, replace: boolean) {
        if (replace || !fs.existsSync(this.baseUrl + id + FILE_SUFFIX)) {
            const json = this.jsonMapper.toJson(object);
            json.id = id;
            fs.writeFileSync(
                this.baseUrl + id + FILE_SUFFIX, 
                JSON.stringify(json), 
                FILE_ENCODING);
        }
    }
}