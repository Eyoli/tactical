import fs from "fs";
import Repository from "../../../domain/port/secondary/repository";
import { injectable } from "inversify";
import { JsonMapper } from "../../json/json-mappers";
import * as UUID from "uuid";

const FILE_ENCODING = "utf8";
const FILE_SUFFIX = ".json";

@injectable()
export class InJsonFileRepository<T> implements Repository<T> {
    private baseUrl!: string;
    private jsonMapper: JsonMapper<T>;

    constructor(jsonMapper: JsonMapper<T>) {
        this.jsonMapper = jsonMapper;
    }

    withBaseUrl(baseUrl: string) {
        this.baseUrl = baseUrl + "/";
        return this;
    }

    update(object: T, id: string): void {
        this.writeFile(id + FILE_SUFFIX, object, true);
    }
    
    save(object: T) {
        const id = UUID.v4();
        this.writeFile(id + FILE_SUFFIX, object, false);
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

    private writeFile(fileName: string, object: T, replace: boolean) {
        if (replace || !fs.existsSync(this.baseUrl + fileName)) {
            fs.writeFileSync(
                this.baseUrl + fileName, 
                JSON.stringify(this.jsonMapper.toJson(object)), 
                FILE_ENCODING);
        }
    }
}