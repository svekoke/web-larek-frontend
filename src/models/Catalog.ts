import { ProductItem } from '../types';
import { IEvents } from '../components/base/events';

//	хранит данные и логику каталога
export class Catalog {
    //  сохраняет все товары
    private catalog: ProductItem[] = [];
    //  товар рассматриваемые в данный момент
    private previewProduct: ProductItem | null = null;

    constructor(private events: IEvents) {}
    //  обновляет спсиок товаров
    setCatalog(items: ProductItem[]) {
        this.catalog = items;
        this.events.emit('catalog:update', this.catalog);
    }
    //  возвращает каталог
    getCatalog() {
        return this.catalog;
    }
    //  устанавливает выбранный товар
    setPreview(product: ProductItem) {
        this.previewProduct = product;
        this.events.emit('preview:update', product);
    }
    //  возвращает товар
    getPreview() {
        return this.previewProduct;
    }
}
