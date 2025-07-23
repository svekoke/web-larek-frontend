import { Api } from './api';
import { Product, ApiListResponse } from '../../types/index';

export class ProductApi extends Api {
	constructor(baseUrl: string) {
		super(baseUrl);
	}

	getProductList(): Promise<Product[]> {
		return this.get('/product').then((data: ApiListResponse<Product>) => data.items);
	}
}
