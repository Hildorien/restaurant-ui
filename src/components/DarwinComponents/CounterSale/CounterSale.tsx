import { useToggle } from 'hooks';
import { t } from 'i18next';
import { useModal } from 'pages/uikit/hooks';
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Button, Card, Col, Modal, Offcanvas, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import classNames from "classnames";
import { BranchContext, BranchContextType } from 'context/BranchProvider';
import LoggerService from 'services/LoggerService';
import { getProducts } from 'helpers/api/products';
import { Product } from 'redux/products/types';
import { Spinner } from 'components';
import { Brand } from 'redux/brands/types';
import { CounterSaleBrandSelector } from './CounterSaleBrandSelector';
import { CounterSaleProductSearch } from './CounterSaleProductSearch';
import { CounterSaleTable, ItemCounterSale } from './CounterSaleTable';
import { PaymentMethod, calculateTotal, parsePaymentMethod } from './helpers';
import { CounterSalePaymentMethod } from './CounterSalePaymentMethod';
import { LocalOrder, createLocalOrder } from 'helpers';
import { GlobalVariablesContext, GlobalVariablesContextType } from 'context/GlobalVariablesProvider';
import { BrandContext, BrandContextType } from 'context/BrandProvider';

const CounterSale = () => {

    //Import context and hooks
    const [isOpen, toggle] = useToggle();
    const { isOpen: isModalOpen, className, toggleModal, openModalWithClass } = useModal();
    const { activeBranchId: currentBranchId, branches } = useContext(BranchContext) as BranchContextType;
    const { brands } = useContext(BrandContext) as BrandContextType;
    const { isOpen: isConfirmModalOpen, 
            className: confirmModalClassName,
            toggleModal: toggleConfirmModal, 
            openModalWithClass: openConfirmModalWithClass } = useModal();
    const confirmCounterSaleRef = useRef<HTMLButtonElement | null>(null);
    const { isOpen: isCloseModalOpen, 
        className: closeModalClassName,
        toggleModal: toggleCloseModal, 
        openModalWithClass: openCloseModalWithClass } = useModal();
    const { showCounterSaleCloseModal, setShowCounterSaleCloseModal } = useContext(GlobalVariablesContext) as GlobalVariablesContextType;
    

    //Local variables
    const isClickable = branches.find(br => br.id === currentBranchId)?.localSaleEnabled || false;
    const [loading, setLoading] = useState<boolean>(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [brand, setBrand] = useState<Brand | undefined>(undefined);
    const [showCounterSaleProducts, setShowCounterSaleProducts] = useState<boolean>(false);
    const [itemsInSale, setItemsInSale] = useState<ItemCounterSale[]>([]);
    const [totalPrice, setTotalPrice] = useState<number>(calculateTotal(itemsInSale));
    const [focusSearch, setFocusSearch] = useState<boolean>(false);
    const [focusConfirmCounterSale, setFocusConfirmCounterSale] = useState<boolean>(false);
    const [payment, setPayment] = useState<PaymentMethod>(PaymentMethod.CASH);
    const [error, setError] = useState<string>("");
    const [confirmSpinner, setConfirmSpinner] = useState<boolean>(false);
    const [checkShowCounterSaleCloseModal, setCheckShowCounterSaleCloseModal] = useState<boolean>(true);

    //Handlers
    const handleOpenCanvasClick = useCallback(async () => {
        setLoading(true);
        toggle();
        getProducts({ branchId: currentBranchId })
        .then(async (response) => {
            let prods = response.data as Product[];
            //Only show products that are active
            setProducts(prods.filter(p => p.status));
        })
        .catch((error) => {
            LoggerService.getInstance().error(error);
        })
        .finally(() => {
            setLoading(false);
        })
    }, [currentBranchId, toggle]);

    //This method is wrapped in a useCallback to avoid re-entrancy because it is called
    //in the callback of the CounterSaleBrandSelector whenever the user has only one brand
    const handleBrandSelect = useCallback((brand?: Brand) => {
        setBrand(brand);
        setShowCounterSaleProducts(true);
        setFocusSearch(true);
    },[]);

    const handleProductSelect = (product?: Product) => {
        if (product) {
            itemsInSale.push({ product: product, price: 0, quantity: 1});
            const newItems = [...itemsInSale];
            setItemsInSale(newItems);
            setTotalPrice(calculateTotal(newItems));
            setFocusSearch(false);
        }
    }

    const handleOnHideCanvas = (hasConfirmedOrder: boolean) => {
        if (showCounterSaleCloseModal && !hasConfirmedOrder) {
            openCloseModalWithClass('primary');
        } else {
            handleConfirmCloseCanvas();
        }
    }

    const handleConfirmCloseCanvas = () => {
        setShowCounterSaleProducts(false);
        setBrand(undefined);
        setItemsInSale([]);
        setTotalPrice(0);
        setFocusConfirmCounterSale(false);
        setFocusSearch(false);
        setError("");
        setShowCounterSaleCloseModal(checkShowCounterSaleCloseModal);
        toggle();
    }

    const handleDeleteItem = (item: ItemCounterSale, indexToDelete: number) => {
        itemsInSale.splice(indexToDelete, 1);
        const newItems = [...itemsInSale];
        setItemsInSale(newItems);
        setTotalPrice(calculateTotal(newItems));
        setFocusSearch(true);
    }

    const handleQuantityChange = (item: ItemCounterSale, quantity: number, index: number) => {
        const newItems = itemsInSale.map((item, idx) => {
            if (idx === index) {
                return {
                    product: item.product,
                    price: item.price,
                    quantity: quantity
                }
            } else {
                return item;
            }
        });
        setTotalPrice(calculateTotal(newItems));
        setItemsInSale([...newItems]); 
    }

    const handlePriceChange = (item: ItemCounterSale, price: number, index: number) => {
        const newItems = itemsInSale.map((item, idx) => {
            if (idx === index) {
                return {
                    product: item.product,
                    price: price,
                    quantity: item.quantity
                }
            } else {
                return item;
            }
        });
        setTotalPrice(calculateTotal(newItems));
        setItemsInSale([...newItems]);
    }

    const handleFinishSearch = () => {
        setFocusConfirmCounterSale(true);
        openConfirmModalWithClass('primary');
    }

    const handlePaymentSelect = (payment: PaymentMethod) => {
        setPayment(payment);
    }

    const canCreateLocalOrder = (): boolean => {
        return itemsInSale.length > 0;
    }

    const handleConfirm = () => {
        if (canCreateLocalOrder()){
            openConfirmModalWithClass('primary');
        } else {
            setError(t('Please add products to your counter sale'));
        }
    }

    const handleConfirmCounterSale = async () => {
        setConfirmSpinner(true);
        const localOrder: LocalOrder = {
            branchId: currentBranchId,
            brandId: brand?.id || 0,
            paymentMethod: payment,
            products: itemsInSale.map(item => {
                    return {
                        sku: item.product.sku,
                        name: item.product.productName,
                        quantity: item.quantity,
                        unitPrice: item.price
                    }
                })
        }
        await createLocalOrder(localOrder)
        .then(() => {
            setConfirmSpinner(false);
            setFocusConfirmCounterSale(false);
            toggleConfirmModal();
            handleOnHideCanvas(true);
        })
        .catch((error: any) => {
            LoggerService.getInstance().error(error);
            setError(t('Error creating counter sale'));
            setConfirmSpinner(false);
            setFocusConfirmCounterSale(false); 
            toggleConfirmModal();
        });
    }

    //Focus on button after modal is rendered
    useEffect(() => {
        if (focusConfirmCounterSale) {
            confirmCounterSaleRef?.current?.focus();
        }
    }, [focusConfirmCounterSale, confirmCounterSaleRef]);

    return (
        <>
        <Button
            className={classNames('side-nav-link-ref', 'side-sub-nav-link')}
            onClick={() => {
                if (!isClickable) {
                    openModalWithClass('warning');
                } else {
                    handleOpenCanvasClick();
                }
            }}
        >
            <i className="uil uil-shopping-trolley"></i><span className="ms-1">Venta Mostrador</span>
        </Button>
        <Modal show={isModalOpen} onHide={toggleModal} dialogClassName={className}>
            <Modal.Header className={classNames('modal-colored-header', 'bg-' + className)} onHide={toggleModal} closeButton>
            </Modal.Header>
            <Modal.Body>
            {t('Contact your advisor to start selling by counter')}.
            </Modal.Body>
        </Modal>      
        <Offcanvas show={isOpen}
                onHide={handleOnHideCanvas} 
                key={"CounterSale"}
                backdrop={true}
                scroll={false}
                keyboard={true}
                className={'w-75'}
                placement='end'>
                <Offcanvas.Header closeButton>
                        <Offcanvas.Title>
                            <h2>{t('Counter sale')}</h2>
                        </Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        {   loading && 
                            <div className='text-center'>
                                <Spinner className="spinner-border-lg" />
                            </div>
                        }
                        { !loading &&
                            <>
                            <Row>
                                <div className='text-center'>
                                    <CounterSaleBrandSelector 
                                        handleBrandSelect={handleBrandSelect}
                                        brands={brands} />
                                </div>
                            </Row>
                            <hr/>
                            {
                                showCounterSaleProducts &&
                                <>
                                <Row className='my-2'>
                                    <OverlayTrigger
                                        key={"CounterSaleProductSearchTooltip"}
                                        placement={'left'}
                                        overlay={
                                            <Tooltip id={`tooltip-left`}>
                                                {t('You can press Enter to select a product or Ctrl + Enter to finish the sale')}
                                            </Tooltip>
                                        }
                                        >
                                            <i className='uil uil-comment-info mb-2'></i>
                                    </OverlayTrigger>
                                    <CounterSaleProductSearch  
                                        brand={brand}
                                        products={products}
                                        handleProductSelect={handleProductSelect}
                                        isFocused={focusSearch}
                                        onFinishSearch={handleFinishSearch}
                                    />
                                </Row>
                                <Card>
                                <Card.Body>
                                <Row className='mt-2'>
                                    <CounterSaleTable
                                        items={itemsInSale}
                                        handleDeleteItem={handleDeleteItem}
                                        handlePriceChange={handlePriceChange}
                                        handleQuantityChange={handleQuantityChange}
                                        triggerFocusOnInput={() => setFocusSearch(true)}
                                    />
                                </Row>
                                <Row className='mt-5 bg-light'>
                                    <Col sm={6}>
                                        <h2>
                                            Total:
                                        </h2>
                                    </Col>
                                    <Col sm={6}>
                                        <h2 className='text-center'>
                                            $ {totalPrice || 0}
                                        </h2>  
                                    </Col>
                                </Row>
                                <Row className='mt-4'>
                                    <Col sm={6}>
                                        <h4 className='mt-1'>{t('Select a payment method')}:</h4>
                                    </Col>
                                    <Col sm={6}>
                                        <CounterSalePaymentMethod 
                                            handlePaymentSelect={handlePaymentSelect}/>
                                    </Col>
                                </Row>
                                </Card.Body>
                                <Card.Footer>
                                    <Button variant="danger" className='mx-1' style={{'float': 'right'}} onClick={() => handleOnHideCanvas(false)} >{t('Cancel')}</Button>
                                    <Button variant="primary" className='mx-1' style={{'float': 'right'}} onClick={handleConfirm} >{t('Confirm')}</Button>
                                    { error &&
                                        <Row>
                                            <Button variant="link" className='ms-3 my-2 text-danger' disabled>{error}.</Button>
                                        </Row>
                                    }
                                </Card.Footer>
                                </Card>
                                </>
                            }
                        </>
                        }
                    </Offcanvas.Body>
        </Offcanvas>
        <Modal show={isConfirmModalOpen} onHide={ () => { setFocusConfirmCounterSale(false); toggleConfirmModal(); }} dialogClassName={confirmModalClassName}>
            <Modal.Header 
                className={classNames('modal-colored-header', 'bg-' + confirmModalClassName)} 
                onHide={toggleConfirmModal} closeButton>
            </Modal.Header>
            <Modal.Body>
            {`${t('Are you sure you want to confirm the sale of brand')} ${brand?.name || ''} ${t('with a total of')} $ ${totalPrice} ${t('with payment')} ${parsePaymentMethod(payment)}  ` } ?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="light" onClick={() => { setFocusConfirmCounterSale(false); toggleConfirmModal(); }}>
                    {t('No')}
                </Button>{' '}
                <Button variant="primary" onClick={handleConfirmCounterSale} ref={confirmCounterSaleRef}>
                    {t('Yes')}
                </Button>
                {
                    confirmSpinner &&
                    <Spinner className="spinner-border-sm m-2" color={'dark'}/>
                }
            </Modal.Footer>
        </Modal>
        <Modal show={isCloseModalOpen} onHide={ () => { toggleCloseModal(); }} dialogClassName={confirmModalClassName}>
            <Modal.Header 
                className={classNames('modal-colored-header', 'bg-' + closeModalClassName)} 
                onHide={toggleCloseModal} closeButton>
            </Modal.Header>
            <Modal.Body>
            {`${t('You will loose your counter sale upon closing. Are you sure')}` }?
            </Modal.Body>
            <Modal.Footer>
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" 
                    onChange={() => setCheckShowCounterSaleCloseModal(val => !val)}
                    checked={!checkShowCounterSaleCloseModal} 
                    id="closeCanvasCheck" />
                    <label className="form-check-label">
                      {t("Don't show this again")}
                    </label>
                </div>
                <Button variant="light" onClick={() => { toggleCloseModal(); }}>
                    {t('No')}
                </Button>{' '}
                <Button variant="primary" onClick={() => { handleConfirmCloseCanvas(); toggleCloseModal(); }}>
                    {t('Yes')}
                </Button>
            </Modal.Footer>
        </Modal>
        </>)
}

export default CounterSale;