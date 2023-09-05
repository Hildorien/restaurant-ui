import config from 'config/config';
import { Brand } from 'redux/brands/types';
import { Product } from 'redux/products/types';
import { groupBy } from 'utils';
import { AccordionItem, ProductForAccordion } from './types';

export function searchProductsForAccordion(allProducts: AccordionItem[], textSearch: string, brandSearch: string, brands: Brand[], productStateSearch?: boolean): AccordionItem[] {
    const productsToSearch = allProducts.slice();

      //Search for products matching criteria by state (if set)
      let productsByState = [];
      if (productStateSearch !== undefined) {
        for (const category of productsToSearch) {
          let newProductsInCategory: ProductForAccordion[] = [];
          for (const product of category.products) {
            if (product.status === productStateSearch && !newProductsInCategory.some(p => p.id === product.id)) {
              newProductsInCategory.push(product);
            }
          }
          productsByState.push({ id: category.id, title: category.title, products: newProductsInCategory });
        }
      } else {
        productsByState = productsToSearch;
      }

      //Search for products matching criteria by brand (if set) already filtered by state (if set)
      let productsByBrand = [];
      if (brandSearch !== "") {
        for (const category of productsByState) {
          let newProductsInCategory: ProductForAccordion[] = [];
          for (const product of category.products) {
            const brandOfProduct = brands.filter(b => product.brandId?.includes(b.id));
            const brandNamesOfProduct = brandOfProduct.map(b => b.name);  
            if (brandOfProduct.length > 0 && brandNamesOfProduct.includes(brandSearch) && !newProductsInCategory.some(p => p.id === product.id)) {
              newProductsInCategory.push(product);
            }
          }
          productsByBrand.push({ id: category.id, title: category.title, products: newProductsInCategory });
        }
      } else {
        productsByBrand = productsByState;
      }

      //Search for products matching criteria by title (if set) already filtered by state and brand (if set)
      let productsByTitle = [];
      if (textSearch !== "") {
        for (const category of productsByBrand) {
          let newProductsInCategory: ProductForAccordion[] = [];
          for (const product of category.products) {
            if ( product.productName.toLowerCase().includes(textSearch.toLocaleLowerCase()) && !newProductsInCategory.some(p => p.id === product.id)) {
              newProductsInCategory.push(product);
            }
          }
          productsByTitle.push({ id: category.id, title: category.title, products: newProductsInCategory });
        }
      } else {
        productsByTitle = productsByBrand;
      }

      return productsByTitle;   
}


export function parseProductsToAccordions(productsInDB: Product[]) {
  let productsAccordion: AccordionItem[] = [];
  const productsByCategory: Map<string, Product[]> = groupBy(productsInDB, product => product.categoryName.toLocaleLowerCase());
  const productCategorySortingPosition = config.productCategorySortingPosition.map(cat => cat.toLocaleLowerCase());
  //Push items based on productCategorySortingPosition
  for (const category of productCategorySortingPosition) {
    if (productsByCategory.has(category)) {
      const products: Product[] = productsByCategory.get(category) ?? [];
      if (products.length > 0) {
        const categoryName = products[0].categoryName;
        productsAccordion.push({
          id: category,
          title: categoryName,
          products: parseToProductForAccordion(products)
        });
      }
    }
  }
  //Push the rest that is not in the config variable
  productsByCategory.forEach((value: Product[], key: string) => {
    if(!productCategorySortingPosition.includes(key)) {      
      productsAccordion.push({
        id: value[0].categoryId,
        title: value[0].categoryName,
        products: parseToProductForAccordion(value)
    });
    }
  });
  return productsAccordion;
}

export function parseToProductForAccordion(products: Product[]): ProductForAccordion[] {
    const productsBySku: Map<string, Product[]> = groupBy(products, product => product.sku);
    let productsForAccordion: ProductForAccordion[] = [];
    productsBySku.forEach( (products, sku)=> {
      const aProductExample = products[0];
      productsForAccordion.push({
        id: aProductExample.id,
        sku: sku,
        productName: aProductExample.productName,
        status: aProductExample.status,
        categoryId: aProductExample.categoryId,
        categoryName: aProductExample.categoryName,
        brandId: products.map(pr => pr.brandId), //A product for accordion can be in more than one brand
        branchId: aProductExample.branchId,
        productMenuLabel: aProductExample.productMenuLabel
      })
    });
    return productsForAccordion;
} 