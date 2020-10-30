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
    let itemRepository: RepositoryPort<Item>;
    let inventoryRepository: RepositoryPort<Inventory>;

    beforeEach(() => {
        inventoryRepository = new InMemoryRepository<Inventory>(new CounterIdGenerator("inventory"));
        itemRepository = new InMemoryRepository<Item>(new CounterIdGenerator("item"));
        inventoryService = new InventoryService(new ItemService(itemRepository), inventoryRepository);
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
        inventoryRepository.save(new Inventory(1), "inv");

        // act
        const inventory = inventoryService.getInventory("inv");

        // assert
        Assert.deepStrictEqual(inventory?.size, 1);
    });

    it('add an item', () => {
        // arrange
        inventoryRepository.save(new Inventory(1), "inv");
        itemRepository.save(new Item("item", "linkedId", "img"), "item");

        // act
        const result = inventoryService.add("inv", "item", 1);

        // assert
        const inventory = inventoryRepository.load("inv");
        Assert.deepStrictEqual(result, true);
        Assert.deepStrictEqual(inventory?.items.size, 1);
        Assert.deepStrictEqual(Array.from(inventory?.items.keys())[0], "item");
    });

    it("can't have more of an item than its limit", () => {
        // arrange
        itemRepository.save(new Item("item", "linkedId", "img", 2), "item");
        const items = new Map<string, number>();
        items.set("item", 2);
        inventoryRepository.save(new Inventory(1, items), "inv");

        // act
        const result = inventoryService.add("inv", "item", 1);

        // assert
        const inventory = inventoryRepository.load("inv");
        Assert.deepStrictEqual(result, true);
        Assert.deepStrictEqual(inventory?.items.size, 1);
        Assert.deepStrictEqual(Array.from(inventory?.items.keys())[0], "item");
        Assert.deepStrictEqual(Array.from(inventory?.items.values())[0], 2);
    });

    it('remove an item', () => {
        // arrange
        itemRepository.save(new Item("item", "linkedId", "img"), "item");
        const items = new Map<string, number>();
        items.set("item", 1);
        inventoryRepository.save(new Inventory(1, items), "inv");

        // act
        const result = inventoryService.remove("inv", "item", 1);

        // assert
        const inventory = inventoryRepository.load("inv");
        Assert.deepStrictEqual(result, true);
        Assert.deepStrictEqual(inventory?.items.size, 0);
    });

    it("can't remove specific items", () => {
        // arrange
        itemRepository.save(new Item("item", "linkedId", "img", 1, true, false), "item");
        const items = new Map<string, number>();
        items.set("item", 1);
        inventoryRepository.save(new Inventory(1, items), "inv");

        // act
        const result = inventoryService.remove("inv", "item", 1);

        // assert
        const inventory = inventoryRepository.load("inv");
        Assert.deepStrictEqual(result, false);
        Assert.deepStrictEqual(inventory?.items.size, 1);
    });
});