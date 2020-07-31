import fs from "fs";
import Repository from "../../../domain/port/secondary/repository";
import { injectable } from "inversify";
import { JsonMapper } from "../../json/json-mappers";

@injectable()
export class InJsonFileRepository<T> implements Repository<T> {
    private baseUrl: string;
    private jsonMapper: JsonMapper<T>;

    constructor(jsonMapper: JsonMapper<T>, baseUrl: string) {
        this.jsonMapper = jsonMapper;
        this.baseUrl = baseUrl;
    }

    update(object: T, id: string): void {
        throw new Error("Method not implemented.");
    }
    
    save(object: T, key: string) {
        throw new Error("Method not implemented");
    }

    load(key: string): T | undefined {
        return this.parseObject(key + ".json");
    }

    loadSome(ids: string[]): T[] {
        throw new Error("Method not implemented.");
    }

    loadAll(): T[] {
        return fs.readdirSync(this.baseUrl)
            .map(fileName => this.parseObject(fileName));
    }

    parseObject(fileName: string): T {
        const json = JSON.parse(fs.readFileSync(this.baseUrl + "/" + fileName, 'utf8'));
        return this.jsonMapper.fromJson(json);
    }
}