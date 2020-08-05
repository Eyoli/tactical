import { injectable, inject } from "inversify";
import { IFieldService } from "../port/primary/services";
import Field from "../model/field";
import Repository from "../port/secondary/repository";
import * as UUID from "uuid";
import { TYPES } from "../../types";
import ResourceNotFoundError from "../error/resource-not-found-error";
import UnitState from "../model/unit-state";
import Tile from "../model/tile";
import Position from "../model/position";

@injectable()
export default class FieldService implements IFieldService {
    private fieldRepository: Repository<Field>;

    public constructor(@inject(TYPES.FIELD_REPOSITORY) fieldRepository: Repository<Field>) {
        this.fieldRepository = fieldRepository;
    }

    getFields(): Field[] {
        return this.fieldRepository.loadAll();
    }

    createField(field: Field): string {
        field.id = UUID.v4();
        this.fieldRepository.save(field, field.id);
        return field.id;
    }

    getField(fieldId: string): Field {
        const field = this.fieldRepository.load(fieldId);
        if(!field) {
            throw new ResourceNotFoundError(Field);
        }
        return field;
    }

    getAccessibleTiles(fieldId: string, unitState: UnitState): Tile[] {
        const field = this.getField(fieldId);

        const accessibleTiles: Tile[] = [];
        const currentSearch: [Tile, Position, number] = [
            field.getTopTile(unitState.position), unitState.position, unitState.moves];
        const searches = [];
        searches.push(field.getAccessibleTiles(currentSearch[1], currentSearch[2], unitState.jumps)
            .filter(tile => !accessibleTiles.includes(currentSearch[0])))
    }

    
}