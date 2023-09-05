import { CellFormatter } from "components";
import i18n from "i18n";
import { t } from "i18next";
import { OrderDocument } from "darwinModels";
import { Column } from "react-table";
import LoggerService from "services/LoggerService";
import config from "config/config";
import { getLogo, parseOrderStatusToTableColumn } from "pages/kitchen/utils";
import { useContext, useEffect, useState } from "react";
import { useToggle, useUser } from "hooks";
import { BranchContext, BranchContextType } from "context/BranchProvider";
import {markOrderAsMarketing, printInvoice } from "helpers";
import useOrders from "hooks/useOrders";
import { Button, Modal, Offcanvas, Toast, ToastContainer } from "react-bootstrap";
import { OrderHistoryDetails } from "./OrderHistoryDetails";
import { OrderStatus } from "darwinModels";
import classNames from "classnames";
import { parseDeliveryMethod } from "pages/kitchen/utils";
import { GlobalVariablesContext, GlobalVariablesContextType } from "context/GlobalVariablesProvider";
import { Role } from "config/types";
import { useSearchParams } from "react-router-dom";
import { fromDateStringToDate } from "./utils";
import { useModal } from "pages/uikit/hooks";

const IdColumn = ({ row }: CellFormatter<OrderDocument>) => {
    return (
        <>
            { row.original.displayId }
        </>

    );
};

const CreatedAtColumn = ({ row }: CellFormatter<OrderDocument>) => {
    const options: Intl.DateTimeFormatOptions = { 
        year: '2-digit', 
        month: '2-digit', 
        day: '2-digit', 
        hour: 'numeric', 
        minute: 'numeric',
        hour12: false
    };
    let dateString = "";
    try {
        dateString = new Date(row.original.createdAt).toLocaleDateString(i18n.language, options);
    } catch (error: any) {
        LoggerService.getInstance().error(error);
    }

    return ( 
        <>
            {dateString}
        </>
    )
}

const PlatformColumn = ({ row }: CellFormatter<OrderDocument>) => {    
    const appNames = config.appNames;
    
    return ( 
        <>
            {appNames[row.original.platform] || row.original.platform}
        </>
    )
}
const BrandColumn = ({ row }: CellFormatter<OrderDocument>) => {
    return ( 
        <>
            {row.original.brand.name}
        </>
    )
}

const DeliveryMethodColumn = ({ row }: CellFormatter<OrderDocument>) => {
    return (
        <>
            {parseDeliveryMethod(row.original.deliveryMethod)}
        </>
    );
};

const StatusColumn = ({ row }: CellFormatter<OrderDocument>) => {
    return (
        <>
        {<h4>
            <span
                className={classNames('badge', {
                    'badge-outline-info': row.original.status === OrderStatus.NEW,
                    'badge-outline-warning': row.original.status === OrderStatus.TAKEN,
                    'badge-outline-success': row.original.status === OrderStatus.READY_FOR_PICKUP,
                    'badge-outline-primary': row.original.status === OrderStatus.DELIVERED,
                    'badge-outline-danger': row.original.status === OrderStatus.CANCELLED || row.original.status === OrderStatus.REJECTED,
                })}
            >
                {parseOrderStatusToTableColumn(row.original.status as OrderStatus)}
            </span>
            </h4>
        }
        </>        
    );
}

const TotalColumn = ({ row }: CellFormatter<OrderDocument>) => {
    return (
        <>
            $ {row.original.pricing.totalOrder}
        </>
    );
};

type ToastNotification = {
    message: string;
    class: string;
}

const ActionColumn = ({ row }: CellFormatter<OrderDocument>) => {

    const [toastNotification, setToastNotification] = useState<ToastNotification | undefined>(undefined);
    const [sendRequestOrders, setSendRequestOrders] = useState(false);
    const { activeBranchId: activeBranchInfo } = useContext(BranchContext) as BranchContextType;
    const [isOpen, toggle] = useToggle();
    const hasNotes = row.original.products.some(i => i.comment) || row.original.observations;
    const hasInvoice = row.original.invoice;
    const appLogo = getLogo(row.original.platform);
    const { isDarwinElectron } = useContext(GlobalVariablesContext) as GlobalVariablesContextType;
    const { onRequestOrderHistory } = useOrders();
    const [loggedInUser] = useUser();
    const isFromTwoHoursAgo = row.original.createdAt && (new Date().getTime() - new Date(row.original.createdAt).getTime()) / (1000 * 60 * 60) < 2;
    const canShowMarketingOrderButton = loggedInUser.role === Role.ADMIN && isFromTwoHoursAgo;
    const isAlreadyMarked = row.original.isMarketingOrder;
    const [searchParams] = useSearchParams();
    const { isOpen: isModalOpen, className, toggleModal, openModalWithClass } = useModal();

    
    const handlePrintOrder = async () => {
        const invoice = row.original.invoice;
        if (invoice) {
            await printInvoice(invoice)
                    .then((response) => {
                        setToastNotification(
                            {
                                message: t("Order printed succesfully"),
                                class: 'success'
                            });
                    })
                    .catch((error) => {
                        LoggerService.getInstance().error(error);
                        setToastNotification(
                            {
                                message: t("Printer service error. Check connection with printer"),
                                class: 'danger'
                            });
                    })
        } else {
            setToastNotification(
                {
                    message: t("The invoice of order") + " "  + row.original.displayId + " " + t("is not available"),
                    class: 'danger'
                });
        }            
    } 
    const onCloseNotification = () => {
        setToastNotification(undefined);
    }

    const handleMarketingOrder = async () => {
        const orderId = row.original.id;
        await markOrderAsMarketing({ orderId })
            .then((response) => {
                setSendRequestOrders(true);
            })
            .catch((error) => {
                LoggerService.getInstance().error(error);
                setToastNotification(
                    {
                        message: t("Order could not be marked as marketing order"),
                        class: 'danger'
                    });
            })
    }

    useEffect(() => {
        if (sendRequestOrders && activeBranchInfo) {
            //Extract search params from url
            const page = parseInt(searchParams.get("page") || "1");
            const search = searchParams.get("s") || "";
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
            let fromDateString = searchParams.get("from") || "";
            let toDateString = searchParams.get("to") || "";
            const from = fromDateStringToDate(fromDateString) || sixMonthsAgo;
            const to = fromDateStringToDate(toDateString) || new Date();

            onRequestOrderHistory(activeBranchInfo, page, from, to, search);
            return () => {
                setSendRequestOrders(false); // Reset the state on the clean up of effect
            };
        }
    }, [sendRequestOrders, activeBranchInfo, onRequestOrderHistory, searchParams]);

    return (
        <>
            <Button size="lg" variant="link" onClick={toggle} className={`btn-icon text-${hasNotes ? 'danger' : 'secondary'}`}>
                <i className="mdi mdi-eye" 
                title={hasNotes ? (t('Details')+' ('+ t('has comments') + ')'): t('Details')}></i>{hasNotes ? ' !' : ''}
            </Button>
            {
                canShowMarketingOrderButton &&
                <Button size="lg" variant="link" onClick={() => isAlreadyMarked ? openModalWithClass('warning') : openModalWithClass('danger')} 
                    className={`btn-icon ${isAlreadyMarked ? 'text-success':'text-secondary' }`}>
                    <i className={`mdi ${isAlreadyMarked ? 'mdi-rocket-launch': 'mdi-rocket' }`} 
                    title={isAlreadyMarked ? t('Order already marked'): t('Mark as marketing order')}></i>
                </Button>
            }
            <Modal show={isModalOpen} onHide={toggleModal} dialogClassName={className}>
                    <Modal.Header className={classNames('modal-colored-header', 'bg-' + className)} onHide={toggleModal} closeButton>
                        <h4 className="modal-title">{t('Order')} {' '} {row.original.displayId}</h4>
                    </Modal.Header>
                    <Modal.Body>
                        { isAlreadyMarked ? 
                        (<p>{t('Order is already marked as a marketing order')}.</p>):
                        (<p>{t('You are about to mark this order as a marketing order. This action is irreversible.')}</p>)
                        }
                    </Modal.Body>
                    
                    {
                        !isAlreadyMarked &&
                        <Modal.Footer>
                            <Button variant="light" onClick={toggleModal}>
                                {t('Cancel')}
                            </Button>{' '}
                            <Button variant="primary" onClick={async () => { 
                                await handleMarketingOrder(); //Error handling already passed to main component
                                toggleModal();
                            }}>
                                {t('Confirm')}
                            </Button>
                        </Modal.Footer>
                    }

            </Modal>           
            <Offcanvas show={isOpen}
            onHide={toggle} 
            key={row.original.id}
            backdrop={true}
            scroll={true}
            keyboard={true}
            className={'w-50'}
            placement='end'>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>
                        {   appLogo &&
                            <img src={appLogo}
                            title={row.original.platform}
                            alt="AppLogo" style={{borderRadius: '50%' }} height="48" width="48"></img>
                        }
                        <h3 className="m-0 mx-2 d-inline-block">{row.original.displayId}</h3>
                        <p className="m-0 mx-4 d-inline-block"><small>(Ref: {row.original.id})</small></p>
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <OrderHistoryDetails order={row.original} />
                </Offcanvas.Body>
            </Offcanvas>


            {   isDarwinElectron && hasInvoice &&
                <Button size="lg" variant="link" className="btn-icon" onClick={handlePrintOrder}>
                <i className="uil uil-bill" title={t('Print invoice')}></i>
                </Button>
            }
            { toastNotification &&
                <ToastContainer className="p-3 bg-light" position={'top-end'}>
                  <div style={{'zIndex': 99, 'position': 'fixed', 'top': 75, 'right': 6}}>
                  <Toast bg={toastNotification.class} 
                  className="d-flex align-items-center w-auto"
                  onClose={onCloseNotification} 
                  show={toastNotification !== undefined} 
                  delay={5000} 
                  onClick={onCloseNotification}
                  animation={true}
                  autohide>
                      <Toast.Body>
                        <div className="text-light">
                          {toastNotification.message + '.'}
                        </div>
                      </Toast.Body>
                      <Button variant="" onClick={onCloseNotification} className="btn-close btn-close-white ms-auto me-2"></Button>
                  </Toast>
                  </div>
                </ToastContainer>
            }
        </>
    );
};



export const columns: ReadonlyArray<Column> = [
    {
        Header: t('Order number').toString(),
        accessor: 'displayId',
        defaultCanSort: true,
        Cell: IdColumn
    },
    {
        Header: t('Platform').toString(),
        accessor: 'platform',
        defaultCanSort: true,
        Cell: PlatformColumn
    },
    {
        Header: t('Date').toString(),
        accessor: 'createdAt',
        defaultCanSort: true,
        Cell: CreatedAtColumn
    },
    {
        Header: t('Brand').toString(),
        accessor: 'brand',
        defaultCanSort: true,
        Cell: BrandColumn
    },
    {
        Header: t('Delivery Method').toString(),
        accessor: 'deliveryMethod',
        defaultCanSort: true,
        Cell: DeliveryMethodColumn
    },
    {
        Header: t('Status').toString(),
        accessor: 'status',
        defaultCanSort: true,
        Cell: StatusColumn
    },
    {
        Header: t('Total').toString(),
        accessor: 'pricing.totalOrder',
        defaultCanSort: true,
        Cell: TotalColumn
    },
    {
        Header: t('Actions').toString(),
        accessor: 'action',
        defaultCanSort: false,
        Cell: ActionColumn,
    },
    
];