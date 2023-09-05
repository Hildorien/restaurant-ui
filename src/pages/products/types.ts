import { Brand } from "redux/brands/types";
import { Product } from "redux/products/types";
import { string } from "yup";

export type AccordionItem = {
    id: string;
    title: string;
    products: ProductForAccordion[];
};

export type CustomToggleProps = {
    children: React.ReactNode;
    eventKey: string;
    containerClass: string;
    linkClass: string;
    callback?: (eventKey: string) => void;
};

export type ProductAccordionRowProps = {
    product: ProductForAccordion;
    handleProductRowStatusChange: (turnedOn: boolean, sku: string) => void;
    finishLoading: boolean;
    brand?: Brand;
};

export type ProductSearchProps = {
    handleSearch: (textSearch: string, brandSearch: string, productStateSearch?: boolean) => void;
    brands: string[];
    textSearch: string;
    brandSearch: string;
    productStateSearch: string;
    forceSearch: boolean;
}

export type ProductAccordionProps = {
    activeItems: string[];
    products: AccordionItem[];
    handleStatusChange: (turnedOn: boolean, sku: string) => void;
    finishLoading: boolean;
    brands: Brand[];
}

export type ProductForAccordion = {
    id: number;
    sku: string;
    productName: string;
    status: boolean;
    categoryId: string;
    categoryName: string;
    brandId?: (number | undefined)[]; //A product for accordion can be in more than one brand
    branchId: number;
    productMenuLabel?: string;
}

export const ProductSearchStates = [ 'Available', 'Unavailable' ];




