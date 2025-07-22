import { Product } from '../types/index';

export class ProductModel {
	constructor(private data: Product) {}

	getData() {
		return this.data;
	}
}
