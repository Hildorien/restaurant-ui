export type Product = {
    id: number;
    sku: string;
    productName: string;
    type: ProductType;
    status: boolean;
    categoryId: string;
    categoryName: string;
    brandId?: number;
    branchId: number;
    trunkId: string;
    productMenuLabel?: string;
    image?: string;
}

export enum ProductType {
    MODIFIER = 'M',
    OPERATOR  = 'O',
    MENU = 'P',
    COMBO = 'C',
    INGRIDIENT = 'I'
}