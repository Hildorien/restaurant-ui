import { useContext, useEffect, useState } from "react";
import { MenuItem, MenuItemProduct, MenuSectionProps, SortableMenuItem } from "./types";
import { Button, Card } from "react-bootstrap";
import { ReactSortable } from "react-sortablejs";
import { MenuItemCard } from "./MenuItemCard";
import DarwinDropDownSearch from "components/DarwinComponents/DarwinDropDownSearch";
import { t } from "i18next";
import { BranchContext, BranchContextType } from "context/BranchProvider";
import { getProductsForMenu } from "helpers";
import LoggerService from "services/LoggerService";
import './sortableStyle.css';

export const MenuSectionCard = ({ section, brand, onNewMenuItemInSection, onDeleteMenuItemInSection, onSortItemsInSection }: MenuSectionProps ) => {
    
    //Local state variables
    const [productsForSearch, setProductsForSearch] = useState<MenuItemProduct[]>([]);
    const [sortableMenuItems, setSortableMenuItems] = useState<SortableMenuItem[]>(
        section.items.map((i, index) => ({ id: index, element: { ...i, position: index }})));
    const [isCreatingNewProduct, setIsCreatingNewProduct] = useState<boolean>(false);
    const [results, setResults] = useState<{ id: number; name: string }[]>();
    const [selectedProduct, setSelectedProduct] = useState<{ id: number; name: string;}>();
    const [errorMessage, setErrorMessage] = useState<string>();
    const [canAddProduct, setCanAddProduct] = useState<boolean>(true);

    //Import branch context
    const { activeBranchId } = useContext(BranchContext) as BranchContextType;

    
    //Effect for fetching products for search
    useEffect(() => {
        const fetchProducts = (async () => {
            await getProductsForMenu({ branchId: activeBranchId , brandId: brand.id})
            .then( (response) => {
                const items = response.data as MenuItemProduct[];
                setProductsForSearch(items);
            })
            .catch( (error) => {
                LoggerService.getInstance().error(error);
                setErrorMessage(`Los productos de la marca ${brand.name} no se encuentran disponibles`);
            })
            
        });

        if (isCreatingNewProduct) {
            //Fetch products only when necessary
            fetchProducts();
        }
    }, [activeBranchId, brand, errorMessage, isCreatingNewProduct]);

    //Effect for updating items whenever section changes
    useEffect(() => {
        setSortableMenuItems(section.items.map((i, index) => ({ id: index, element: { ...i, position: index }})));
    }, [section]);


    //Handlers
    const  handleNewProduct = () => {
        setErrorMessage('');
        setIsCreatingNewProduct(true);
    }

    type changeHandler = React.ChangeEventHandler<HTMLInputElement>;
    const handleChange: changeHandler = (e) => {
        const { target } = e;
        if (!target.value.trim()) return setResults([]);  
        const productsSearchSpaceMapped = productsForSearch.map(i => {
            return {
                id: i.id,
                name: `${i.name || 'Producto sin nombre en menú'} (SKU: ${i.sku})`
            }
        }); 
        const filteredValue = productsSearchSpaceMapped.filter((product) =>
            product.name.toLowerCase().includes(target.value.toLowerCase())
        );
        setResults(filteredValue);
    };  

    const handleDeleteMenuItemOnSection = (productId: number) => {
        setSortableMenuItems(sortableMenuItems.filter(prod => prod.element.product.id !== productId));
        const items = section.items.slice();
        let newItems: MenuItem[] = items.filter(i => i.product.id !== productId);
        section.items = newItems;
        onDeleteMenuItemInSection(section);
    }

    const handleConfirmMenuItemOnSection = (item: MenuItem) => {
        const items = section.items.slice();
        let newItems: MenuItem[] = [];
        //If first item in section, just add it
        if (items.length === 0) {
            newItems.push(item);
        } else if (!items.map(i => i.product.id).includes(item.product.id)) { 
            //If its a new item
            newItems = items.concat(item);
        } else { //Its being edited
            newItems = items.map(i => {
                if (i.product.id === item.product.id) {
                    return item;
                } else {
                    return i;
                }
            });
        }
        setSortableMenuItems(newItems.map((i, index) => ({ id: index, element: i })));
        setErrorMessage('');
        section.items = newItems;
        onNewMenuItemInSection(section);
    }

    const handleSortItemsInSection = () => {
        section.items = sortableMenuItems.map(i => i.element);
        onSortItemsInSection(section);
    }

    const onSelectItem = (item: any) => {
        setSelectedProduct(item);
        setResults([]);
        const productsInSection = sortableMenuItems.slice();
        const productSelected = productsForSearch.find(i => i.id === item.id);

        if (productSelected && sortableMenuItems.filter(pr => pr.element.product.id === productSelected.id).length > 0) {
            setErrorMessage(`El producto ${productSelected.name || 'Producto sin nombre en menú'} (SKU: ${productSelected.sku}) ya existe en esta sección`);
            return;
        }

        if (productSelected) {
            const newItem = {
                id: productSelected.id,
                element: { 
                    price: 0, 
                    active: true, 
                    product: productSelected, 
                    position: productsInSection.length + 1 
                }
            }
            productsInSection.push(newItem);
            handleConfirmMenuItemOnSection(newItem.element);
            setSortableMenuItems(productsInSection);
        }
        setIsCreatingNewProduct(false);
    }

    const handleEditMenuItemOnSection = (itemIsBeingEdit: boolean) => {
        setCanAddProduct(!itemIsBeingEdit);
    }

    return (
        <Card className="mb-0">
            <Card.Body className='border-top-0 mt-1 mb-0' style={{paddingTop: "0px", paddingBottom: "12px"}}>
                <ReactSortable handle={".handle"} className="col" list={sortableMenuItems} setList={setSortableMenuItems} onSort={handleSortItemsInSection}>
                                    {(sortableMenuItems || []).map((menuItem, index) => {
                                        return (
                                                <MenuItemCard
                                                    key={`${section.id}-${menuItem.element.product.sku}-${index.toString()}`}
                                                    menuItem={menuItem.element}
                                                    index={index}
                                                    handleConfirmMenuItemOnSection={handleConfirmMenuItemOnSection}
                                                    handleDeleteMenuItemOnSection={handleDeleteMenuItemOnSection}
                                                    handleEditMenuItemOnSection={handleEditMenuItemOnSection}/>
                                        );
                                    })}
                </ReactSortable>
                <div className="d-flex align-items-center justify-content-center" >
                    <Button disabled={!canAddProduct} variant="primary" className='w-75 my-1' onClick={handleNewProduct}>Nuevo Producto</Button>
                </div>
                {
                    !canAddProduct &&
                    <small className="d-flex align-items-center justify-content-center text-danger">Para agregar un nuevo producto debe confirmar la edición de los productos en la seccioń.</small>
                }
                {
                    isCreatingNewProduct &&
                    <Card className="d-flex align-items-center justify-content-center">
                    <Card.Body className="border-0 pb-0 pt-1 w-75">
                        <DarwinDropDownSearch 
                            results={results}
                            value={isCreatingNewProduct ? '' : selectedProduct?.name}
                            renderItem={(item) => <p className="pb-1 mb-1">{item.name}</p>}
                            onChange={handleChange}
                            onSelect={(item) => onSelectItem(item)}
                            placeHolder={t("Search for a product") + "..." }
                            isFocused={isCreatingNewProduct}
                        />
                        { !errorMessage && <small className="text-muted mx-2">
                        Si no encontrás el producto o necesitás crear uno nuevo, comunicate con tu asesor o contactanos por WhatsApp.
                            </small>}
                        { errorMessage && <p className="text-danger mx-2">{errorMessage}</p>}
                        <Button style={{float: 'right'}} variant="danger" className="mt-1"
                            onClick={() =>{ 
                                setIsCreatingNewProduct(false);
                                setErrorMessage('');}}>Cancelar</Button>
                    </Card.Body>
                    </Card>
                }
            </Card.Body>
        </Card>
    );
};