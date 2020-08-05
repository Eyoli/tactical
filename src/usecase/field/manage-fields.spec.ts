import "reflect-metadata";
import * as Assert from "assert";
import FieldService from "../../domain/service/field-service";
import Field from "../../domain/model/field";
import InMemoryRepository from "../../infrastructure/adapter/secondary/in-memory-repository";
import { IFieldService } from "../../domain/port/primary/services";
import Repository from "../../domain/port/secondary/repository";
import Unit from "../../domain/model/unit";
import Tile from "../../domain/model/tile";
import UnitState from "../../domain/model/unit-state";
import Position from "../../domain/model/position";

describe('About fields we should be able to...', () => {

    let fieldService: IFieldService;
    let fieldRepository: Repository<Field>;

    beforeEach(() => {
        fieldRepository = new InMemoryRepository<Field>(); 
        fieldService = new FieldService(fieldRepository);
    });

    it('save a field', () => {
        // arrange
        // act
        const id = fieldService.createField(new Field("Name"));

        // assert
        const field = fieldRepository.load(id);
        Assert.deepStrictEqual(field?.name, "Name");
    });

    it('get an existing field', () => {
        // arrange
        fieldRepository.save(new Field("Name"), "key");

        // act
        const field = fieldService.getField("key");

        // assert
        Assert.deepStrictEqual(field.name, "Name");
    });

    it('get the list of all existing fields', () => {
        // arrange
        fieldRepository.save(new Field("Name"), "key1");
        fieldRepository.save(new Field("Name"), "key2");

        // act
        const fields = fieldService.getFields();

        // assert
        Assert.deepStrictEqual(fields.length, 2);
    });

    it('get the tiles accessible to a unit', () => {
        // arrange
        const field = new Field("Field")
            .withId("fieldId")
            .withTiles(
                [[new Tile(1,1)], [new Tile(1,1)], [new Tile(1,1)]],
                [[new Tile(1,1)], [new Tile(1,1)], [new Tile(1,1)]],
                [[new Tile(1,1)], [new Tile(1,1)], [new Tile(1,1)]]);
        const unit = new Unit("Unit").withMoves(1);
        const unitState = new UnitState(unit)
            .withPosition(new Position(0, 0));

        // act
        const accessibleTiles = fieldService.getAccessibleTiles(field.id, unitState);

        // assert
        Assert.deepStrictEqual(accessibleTiles.length, 3);
    })

});