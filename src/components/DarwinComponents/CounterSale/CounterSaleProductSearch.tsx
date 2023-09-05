import { Brand } from "redux/brands/types";
import DarwinDropDownSearch from "../DarwinDropDownSearch";
import { Product } from "redux/products/types";
import { useState } from "react";
import { t } from "i18next";

interface CounterSaleProductSearchProps {
    brand?: Brand;
    products: Product[];
    handleProductSelect: (product?: Product) => void;
    isFocused:  boolean;
    onFinishSearch?: () => void;

}
export const CounterSaleProductSearch = ({ brand, products, handleProductSelect, isFocused, onFinishSearch }: CounterSaleProductSearchProps) => {
    
    //Local variables
    const [results, setResults] = useState<{ id: number; name: string }[]>();
    const [selectedProduct] = useState<{
        id: number;
        name: string;
      }>();

    
    //Handlers
    type changeHandler = React.ChangeEventHandler<HTMLInputElement>;
    const handleChange: changeHandler = (e) => {
        const { target } = e;
        if (!target.value.trim()) return setResults([]);

        const productsWithBrandSelected = products.filter(product => product.brandId === brand?.id);
        const productsWithoutBrand = products.filter(product => product.brandId === undefined);
        const productsSearchSpace = productsWithBrandSelected.concat(productsWithoutBrand);
        const productsSearchSpaceMapped = productsSearchSpace.map(product => {
            return {
                id: product.id,
                name: product.productName
            }
        });


        const filteredValue = productsSearchSpaceMapped.filter((product) =>
            product.name.toLowerCase().includes(target.value.toLowerCase())
        );
        setResults(filteredValue);
    };

    const onSelectItem = (item: any) => {
        //setSelectedProduct(item); This is to prevent the dropdown input to write down the product selected
        setResults([]);
        const productSelected = products.find(product => product.id === item.id);
        handleProductSelect(productSelected);
    }

    return(
        <>
            <DarwinDropDownSearch 
                results={results}
                value={selectedProduct?.name}
                renderItem={(item) => <p>{item.name}</p>}
                onChange={handleChange}
                onSelect={(item) => onSelectItem(item)}
                placeHolder={t("Search for a product") + "..." }
                isFocused={isFocused}
                onFinishSearch={onFinishSearch}
                />
        </>
    )
}
