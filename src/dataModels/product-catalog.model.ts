import { ApiResource } from "../common/interfaces/serializer";


export class Products {
    icon: string;
    productCode: string;
    productTitle: string;
    url: string;
}

export class ProductCategory {
    category: string;
    products: Products[] = [];
    id: string;
}

export class ProductCatalogReq {
}

export class ProductCatalogResp extends ApiResource {
    productCategory: ProductCategory[] = [];

    constructor(json: any) {
        super(json);
        let _json = json.data;

        for (var i = 0; i < _json.length; i++) {
            let item = new ProductCategory();
            item.id = _json[i]._id;
            item.category = _json[i].category;

            let products: Products[] = [];
            let _jsonProduct = _json[i].products;
            for (var j = 0; j < _jsonProduct.length; j++) {
                let item2 = new Products();
                item2.icon = _jsonProduct[j].icon;
                item2.productCode = _jsonProduct[j].productCode;
                item2.productTitle = _jsonProduct[j].productTitle;
                item2.url = _jsonProduct[j].url
                products.push(item2);
            }
            item.products = products;
            this.productCategory.push(item);
        }

    }
}


export class ProductCatalogSerializer {
    toJson(obj: ProductCatalogReq): any {
        console.log('ProductCatalogSerializer toJson -> ', obj);
        return {
        };
    }
    fromJson(json: any): ProductCatalogResp {
        console.log('ProductCatalogSerializer fromJson -> ', json);
        let response = new ProductCatalogResp(json);
        return response;
    }
}