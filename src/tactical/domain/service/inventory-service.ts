import { inject, injectable } from "inversify";
import { TYPES } from "../../../types";
import ResourceNotFoundError from "../model/error/resource-not-found-error";
import Inventory from "../model/inventory";
import { InventoryServicePort, ItemServicePort } from "../port/primary/services";
import RepositoryPort from "../port/secondary/repository-port";

@injectable()
export default class InventoryService implements InventoryServicePort {

    constructor(
        @inject(TYPES.ITEM_SERVICE) private readonly itemService: ItemServicePort,
        @inject(TYPES.INVENTORY_REPOSITORY) private readonly inventoryRepository: RepositoryPort<Inventory>) {
    }

    createInventory(inventory: Inventory): string {
        const id = this.inventoryRepository.save(inventory);
        inventory.id = id;
        this.inventoryRepository.update(inventory, id);
        return id;
    }

    getInventory(id: string): Inventory {
        const inventory = this.inventoryRepository.load(id);
        if (!inventory) {
            throw ResourceNotFoundError.fromClass(Inventory);
        }
        return inventory;
    }

    add(id: string, itemId: string, quantity: number): boolean {
        const inventory = this.getInventory(id);
        const item = this.itemService.getItem(itemId);
        if (inventory.add(item, quantity)) {
            this.inventoryRepository.update(inventory, id);
            return true;
        }
        return false;
    }

    remove(id: string, itemId: string, quantity: number): boolean {
        const inventory = this.getInventory(id);
        const item = this.itemService.getItem(itemId);
        if (inventory.remove(item, quantity)) {
            this.inventoryRepository.update(inventory, id);
            return true;
        }
        return false;
    }

}