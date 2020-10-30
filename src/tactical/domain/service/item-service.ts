import { inject, injectable } from "inversify";
import { TYPES } from "../../../types";
import ResourceNotFoundError from "../model/error/resource-not-found-error";
import Item from "../model/item";
import { ItemServicePort } from "../port/primary/services";
import RepositoryPort from "../port/secondary/repository-port";

@injectable()
export default class ItemService implements ItemServicePort {

    constructor(
        @inject(TYPES.ITEM_REPOSITORY) private readonly itemRepository: RepositoryPort<Item>) {
    }

    createItem(item: Item): string {
        const id = this.itemRepository.save(item);
        item.id = id;
        this.itemRepository.update(item, id);
        return item.id;
    }

    getItem(id: string): Item {
        const item = this.itemRepository.load(id);
        if (!item) {
            throw ResourceNotFoundError.fromClass(Item);
        }
        return item;
    }
}