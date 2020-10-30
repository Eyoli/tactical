import "reflect-metadata";
import * as Assert from "assert";
import InMemoryRepository from "../../in-memory-repository/adapter/in-memory-repository";
import RepositoryPort from "../../tactical/domain/port/secondary/repository-port";
import CounterIdGenerator from "../../in-memory-repository/adapter/counter-id-generator";
import Inventory from "../../tactical/domain/model/inventory";
import InventoryService from "../../tactical/domain/service/inventory-service";
import ItemService from "../../tactical/domain/service/item-service";
import Item from "../../tactical/domain/model/item";

describe('About inventories we should be able to...', () => {

    let inventoryService: InventoryService;
    let itemService: ItemService;
    let inventoryRepository: RepositoryPort<Inventory>;

    beforeEach(() => {
        inventoryRepository = new InMemoryRepository<Inventory>(new CounterIdGenerator("inventory"));
        itemService = new ItemService(new InMemoryRepository<Item>(new CounterIdGenerator("item")));
        inventoryService = new InventoryService(itemService, inventoryRepository);
    });

    it('save an inventory', () => {
        // arrange
        // act
        const id = inventoryService.createInventory(new Inventory(1));

        // assert
        const inventory = inventoryRepository.load(id);
        Assert.deepStrictEqual(inventory?.size, 1);
    });

    it('get an existing inventory', () => {
        // arrange
        const id = inventoryRepository.save(new Inventory(1));

        // act
        const inventory = inventoryService.getInventory(id);

        // assert
        Assert.deepStrictEqual(inventory?.size, 1);
    });

    it('add an item', () => {
        // arrange
        const id = inventoryRepository.save(new Inventory(1));
        const itemId = itemService.createItem(new Item("item", "linkedId", "img"));

        // act
        const result = inventoryService.add(id, itemId, 1);

        // assert
        const inventory = inventoryRepository.load(id);
        Assert.deepStrictEqual(result, true);
        Assert.deepStrictEqual(inventory?.items.size, 1);
        Assert.deepStrictEqual(Array.from(inventory?.items.keys())[0], "item1");
    });

    it("can't have more of an item than its limit", () => {
        // arrange
        const itemId = itemService.createItem(new Item("item", "linkedId", "img", 2));
        const items = new Map<string, number>();
        items.set(itemId, 2);
        const id = inventoryRepository.save(new Inventory(1, items));

        // act
        const result = inventoryService.add(id, itemId, 1);

        // assert
        const inventory = inventoryRepository.load(id);
        Assert.deepStrictEqual(result, true);
        Assert.deepStrictEqual(inventory?.items.size, 1);
        Assert.deepStrictEqual(Array.from(inventory?.items.keys())[0], "item1");
        Assert.deepStrictEqual(Array.from(inventory?.items.values())[0], 2);
    });

    it('remove an item', () => {
        // arrange
        const itemId = itemService.createItem(new Item("item", "linkedId", "img"));
        const items = new Map<string, number>();
        items.set(itemId, 1);
        const id = inventoryRepository.save(new Inventory(1, items));

        // act
        const result = inventoryService.remove(id, itemId, 1);

        // assert
        const inventory = inventoryRepository.load(id);
        Assert.deepStrictEqual(result, true);
        Assert.deepStrictEqual(inventory?.items.size, 0);
    });

    it("can't remove specific items", () => {
        // arrange
        const itemId = itemService.createItem(new Item("item", "linkedId", "img", 1, true, false));
        const items = new Map<string, number>();
        items.set(itemId, 1);
        const id = inventoryRepository.save(new Inventory(1, items));

        // act
        const result = inventoryService.remove(id, itemId, 1);

        // assert
        const inventory = inventoryRepository.load(id);
        Assert.deepStrictEqual(result, false);
        Assert.deepStrictEqual(inventory?.items.size, 1);
    });
});