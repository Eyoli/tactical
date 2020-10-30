import Item from "./item";

export default class Inventory {
    id!: string;

    constructor(
        readonly size: number,
        readonly items: Map<string, number> = new Map()) {
    }

    add(item: Item, quantity = 1): boolean {
        if (!this.items.has(item.id) && this.items.size >= this.size) {
            return false;
        }

        const newQuantity = Math.min((this.items.get(item.id) || 0) + quantity, item.max);
        this.items.set(item.id, newQuantity);
        return true;
    }

    remove(item: Item, quantity = 1): boolean {
        if (!this.items.has(item.id) || !item.remove) {
            return false;
        }

        const newQuantity = (this.items.get(item.id) || 0) - quantity;
        if (newQuantity <= 0) {
            this.items.delete(item.id);
        } else {
            this.items.set(item.id, newQuantity);
        }
        return true;
    }
}