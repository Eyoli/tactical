import fs from "fs";
import Repository from "../domain/secondaries/repository";
import { injectable } from "inversify";

@injectable()
export default abstract class InFileRepository<T> implements Repository<T> {
    private baseUrl: string;

    constructor() {
        this.baseUrl = "fields";
    }

    save(object: T, key: string) {
        throw new Error("Method not implemented");
    }

    load(key: string): T | undefined {
        return this.parseObject(key + ".json");
    }

    loadAll(): T[] {
        return fs.readdirSync(this.baseUrl)
            .map(fileName => this.parseObject(fileName));
    }

    parseObject(fileName: string): T {
        const json = JSON.parse(fs.readFileSync(this.baseUrl + "/" + fileName, 'utf8'));
        return this.parseJson(fileName.split(".")[0], json);
    }

    abstract parseJson(key: string, json: any): T;
}