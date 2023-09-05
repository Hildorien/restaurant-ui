import { t } from "i18next";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Product } from "redux/products/types";
import { arrayEquals } from "utils";


export type ItemCounterSale = {
    product: Product;
    quantity: number;
    price: number;
}

interface CounterSaleItemsProps {
    items: ItemCounterSale[];
    handleDeleteItem: (item: ItemCounterSale, index: number) => void;
    handleQuantityChange: (item: ItemCounterSale, quantity: number, index: number) => void;
    handlePriceChange: (item: ItemCounterSale, price: number, index: number) => void;
    triggerFocusOnInput: () => void;
}

export const CounterSaleTable = ({ items, handleDeleteItem, handleQuantityChange, handlePriceChange, triggerFocusOnInput  }: CounterSaleItemsProps) => {

    const [itemsInTable, setItemsInTable] = useState<ItemCounterSale[]>([]);
    const [focusLastInput, setFocusLastInput] = useState<boolean>(false);

    if (!arrayEquals(items, itemsInTable)) {
        setItemsInTable(items);
        setFocusLastInput(true);
    }
    
    return (
        <div className="table-responsive">
            <table className="table mb-0 ">
                <thead className="table-light">
                    <tr>
                        <th style={{'width': '45%'}}>{t('Product')}</th>
                        <th style={{'width': '20%'}} className='text-center'>{t('Quantity')}</th>
                        <th style={{'width': '25%'}} className='text-center'>{t('Unit price')}</th>
                        <th style={{'width': '10%'}} className='text-center'>{t('Action')}</th>
                    </tr>
                </thead>
                <tbody>
                    {(items || []).map( (item, index) =>                      
                        <CounterSaleItem 
                        item={item} 
                        index={index}
                        handleDeleteItem={handleDeleteItem}
                        handlePriceChange={handlePriceChange}
                        handleQuantityChange={handleQuantityChange}
                        key={item.product.productName + '-' + index.toString() }
                        triggerFocusOnInput={triggerFocusOnInput}
                        isFocused={focusLastInput && index === items.length - 1}
                        />
                        )
                    }
                </tbody>
            </table>
        </div>) 
}

interface CounterSaleItemProps {
    item: ItemCounterSale;
    index: number;
    handleDeleteItem: (item: ItemCounterSale, index: number) => void;
    handleQuantityChange: (item: ItemCounterSale, quantity: number, index: number) => void;
    handlePriceChange: (item: ItemCounterSale, price:number, index: number) => void;
    triggerFocusOnInput: () => void;
    isFocused: boolean;
}

const CounterSaleItem = ({ item, index,  handleDeleteItem, handleQuantityChange, handlePriceChange, triggerFocusOnInput, isFocused }: CounterSaleItemProps) => {

    const [quantity, setQuantity] = useState(item.quantity);
    const [price, setPrice] = useState(item.price);
    const priceInput = useRef<HTMLInputElement | null>(null);
    const quantityInput = useRef<HTMLInputElement | null>(null);

    // Handlers 
    const handleOnChangeInput = (e: React.ChangeEvent<HTMLInputElement>, item: ItemCounterSale, index: number, isForPrice: boolean) => {
        const value = Number.parseFloat(e.target.value) || 0;
        if (isForPrice) {
            setPrice(value);
            handlePriceChange(item, e.target.valueAsNumber, index)
        } else {
            setQuantity(value);
            handleQuantityChange(item, e.target.valueAsNumber ,index)
        }
    }

    const highlightInput = useCallback((highlight: boolean, input:  React.MutableRefObject<HTMLInputElement | null>) => {
        if (highlight && input.current) {
            input.current.style.borderColor = 'coral';
            input.current.style.borderWidth = '2px';
        }
        if (!highlight && input.current) {
            input.current.style.borderColor = '';
            input.current.style.borderWidth = '';
        }
      },[]);

    
    //This will trigger after the line is rendered in table
    useEffect(() => {
        if (isFocused) {
            quantityInput.current?.focus();
        }
    }, [quantityInput, isFocused])

    return  (<>
            <tr key={item.product.productName}>
                <td>{item.product.productName}</td>
                <td className='text-center'>
                    <OverlayTrigger
                        key={index.toString()}
                        placement={'bottom'}
                        overlay={
                            <Tooltip id={`tooltip-quantity-bottom`}>
                                {t('You can use the Up and Down arrow keys to change the quantity')}
                            </Tooltip>
                        }
                    >
                        <input  type="number" min="1" 
                                className="form-control" 
                                style={{'textAlign': 'right'}} 
                                value={Number(quantity).toString()}
                                onChange={(e) => { handleOnChangeInput(e, item, index, false) }}
                                onFocus={() => highlightInput(true, quantityInput)}
                                onBlur={() => highlightInput(false, quantityInput)}
                                ref={quantityInput}
                        />
                    </OverlayTrigger>
                </td>
                <td>
                    <div className='d-flex flex-row '>
                    <p className='my-1 mx-1'>$</p>
                    <OverlayTrigger
                        key={index.toString()}
                        placement={'bottom'}
                        overlay={
                            <Tooltip id={`tooltip-price-bottom`}>
                                {t('Press Enter after setting the price for searching next product')}
                            </Tooltip>
                        }
                    >
                        <input type="number" min="0" 
                        className="form-control"
                        style={{'textAlign': 'right'}} 
                        value={Number(price).toString()} //This will remove leading zeros
                        onChange={(e) => { handleOnChangeInput(e, item, index, true) }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                triggerFocusOnInput();
                            }
                        }}
                        onFocus={() => highlightInput(true, priceInput)}
                        onBlur={() => highlightInput(false, priceInput)}
                        ref={priceInput}
                        />

                    </OverlayTrigger>
                    </div>
                </td>
                <td className='text-center'>
                    <Button size="lg" variant="link" className="btn-icon text-danger" onClick={() => handleDeleteItem(item, index)}>
                        <i className="mdi mdi-trash-can-outline" title={t('Delete item')}></i>
                    </Button>
                </td>
            </tr>
            </>
    )
}