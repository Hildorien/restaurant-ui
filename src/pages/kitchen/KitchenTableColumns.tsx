import { Column } from "react-table";
import { t } from "i18next";
import { CellFormatter } from "components";
import { KitchenOrderRecord } from "./types";
import { Button, Offcanvas, Toast, ToastContainer } from "react-bootstrap";
import i18n from "i18n";
import { OrderStatus } from "darwinModels";
import { getLogo, parseOrderStatusToTableColumn } from "./utils";
import classNames from "classnames";
import { deliverOrder, getPrintOrderCommand, readyOrder, sendOrderPrintError, takeOrder } from "helpers";
import { printKitchenCommand , acceptOrder, rejectOrder } from "helpers";
import { useContext, useEffect, useState } from "react";
import LoggerService from "services/LoggerService";
import useOrders from "hooks/useOrders";
import { BranchContext, BranchContextType } from "context/BranchProvider";
import { useToggle } from "hooks";
import KitchenOrderDetails from "./KitchenOrderDetails";
import { PrinterApiError } from "helpers/api/apiError";
import { GlobalVariablesContext, GlobalVariablesContextType } from "context/GlobalVariablesProvider";

/* status column render */
const IdColumn = ({ row }: CellFormatter<KitchenOrderRecord>) => {
    return (
        <>
            { row.original.displayId }
        </>

    );
};

const CreatedAtColumn = ({ row }: CellFormatter<KitchenOrderRecord>) => {
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
        dateString = row.original.createdAt.toLocaleDateString(i18n.language, options);
    } catch (error: any) {
        LoggerService.getInstance().error(error);
    }

    return ( 
        <>
            {dateString}
        </>
    )
}

const BrandColumn = ({ row }: CellFormatter<KitchenOrderRecord>) => {
    return ( 
        <>
            {row.original.brandName}
        </>
    )
}

const PlatformColumn = ({ row }: CellFormatter<KitchenOrderRecord>) => {    
    return ( 
        <>
            {row.original.platform}
        </>
    )
}

const DeliveryMethodColumn = ({ row }: CellFormatter<KitchenOrderRecord>) => {
    return (
        <>
            {row.original.deliveryMethod}
        </>
    );
};


const StatusColumn = ({ row }: CellFormatter<KitchenOrderRecord>) => {
    return (
        <>
        {/*parseOrderStatus(row.original.status)*/}
        {<h4>
            <span
                className={classNames('badge', {
                    'badge-outline-info': row.original.status === OrderStatus.NEW,
                    'badge-outline-warning': row.original.status === OrderStatus.TAKEN,
                    'badge-outline-success': row.original.status === OrderStatus.READY_FOR_PICKUP,
                    'badge-outline-primary': row.original.status === OrderStatus.DELIVERED
                })}
            >
                {parseOrderStatusToTableColumn(row.original.status)}
            </span>
            </h4>
        }
        </>        
    );
}

/* action column render */

type ToastNotification = {
    message: string;
    class: string;
}

const ActionColumn = ({ row }: CellFormatter<KitchenOrderRecord>) => {

    const [toastNotification, setToastNotification] = useState<ToastNotification | undefined>(undefined);
    const [sendRequestOrders, setSendRequestOrders] = useState(false);
    const { onRequestOrders } = useOrders();
    const { activeBranchId: activeBranchInfo } = useContext(BranchContext) as BranchContextType;
    const [isOpen, toggle] = useToggle();
    const hasNotes = row.original.items.some(i => i.comment) || row.original.observations;
    const appLogo = getLogo(row.original.platform);
    const { isDarwinElectron } = useContext(GlobalVariablesContext) as GlobalVariablesContextType;


    const handlePrintOrder = async () => {
        const orderId = row.original.id;
        await getPrintOrderCommand({ orderId })
              .then((response) => {
                const buffer = response.data;
                printKitchenCommand(buffer)
                .then((response) => {
                    setToastNotification(
                        {
                            message: t("Order printed succesfully"),
                            class: 'success'
                        });
                })
                .catch(async (error) => {
                    const printerError = new PrinterApiError(error);
                    //Log error in console
                    LoggerService.getInstance().error(printerError);
                    //Log error to backend
                    await sendOrderPrintError({ orderId: orderId, error: printerError })
                    .catch((error) => {
                        LoggerService.getInstance().error(error);
                    })
                    //Send notification to frontend
                    setToastNotification(
                        {
                            message: t("Printer service error. Check connection with printer"),
                            class: 'danger'
                        });
                })
              })
              .catch((error) => {
                LoggerService.getInstance().error(error);
                setToastNotification(
                    {
                        message: t("Order ticket for the kitchen couldn't be obtained"),
                        class: 'danger'
                    });
            });
    } 
    const onCloseNotification = () => {
        setToastNotification(undefined);
    }

    const handleTakeOrder = async () => {
        const orderId = row.original.id;
        takeOrder({ orderId })
        .then( async (response) => {
            setSendRequestOrders(true);
        })
        .catch( (error) => {
            LoggerService.getInstance().error(error);
            setToastNotification(
                {
                    message: t("Order couldn't be taken"),
                    class: 'danger'
                });
        })
    }

    const handleAcceptOrder = async () => {
        const orderId = row.original.id;
        acceptOrder({ orderId })
        .then( async (response) => {
            setSendRequestOrders(true);
        })
        .catch( (error) => {
            LoggerService.getInstance().error(error);
            setToastNotification(
                {
                    message: t("Order couldn't be accepted"),
                    class: 'danger'
                });
        })
    }

    const handleRejectOrder = async () => {
        const orderId = row.original.id;
        rejectOrder({ orderId })
        .then( (response) => {
            setSendRequestOrders(true);
        })
        .catch( (error) => {
            LoggerService.getInstance().error(error);
            setToastNotification(
                {
                    message: t("Order couldn't be rejected"),
                    class: 'danger'
                });
        });
    }

    const handleDeliverOrder = async () => {
        const orderId = row.original.id;
        deliverOrder({ orderId })
        .then( (response) => {
            setSendRequestOrders(true);
        })
        .catch( (error) => {
            LoggerService.getInstance().error(error);
            setToastNotification(
                {
                    message: t("Order couldn't be marked as delivered"),
                    class: 'danger'
                });
        })
    }

    const handleReadyOrder = async () => {
        const orderId = row.original.id;
        readyOrder({ orderId })
        .then( (response) => {
            setSendRequestOrders(true);
        })
        .catch( (error) => {
            LoggerService.getInstance().error(error);
            setToastNotification(
                {
                    message: t("Order couldn't be marked as ready"),
                    class: 'danger'
                });
        })
    }

    useEffect(() => {
        if (sendRequestOrders && activeBranchInfo) {
            onRequestOrders(activeBranchInfo);
            return () => {
                setSendRequestOrders(false); // Reset the state on the clean up of effect
              };
        }
    }, [sendRequestOrders, activeBranchInfo, onRequestOrders]);

    return (
        <>
            <Button size="lg" variant="link" onClick={toggle} className={`btn-icon text-${hasNotes ? 'danger' : 'secondary'}`}>
                <i className="mdi mdi-eye" 
                title={hasNotes ? (t('Details')+' ('+ t('has comments') + ')'): t('Details')}></i>{hasNotes ? ' !' : ''}
            </Button>
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
                    <KitchenOrderDetails order={row.original} />
                </Offcanvas.Body>
            </Offcanvas>


            {   isDarwinElectron &&
                <Button size="lg" variant="link" className="btn-icon" onClick={handlePrintOrder}>
                    <i className="mdi mdi-printer" title={t('Print order')}></i>
                </Button>
            }
            {
                row.original.status === OrderStatus.NEW && !row.original.autoAccepted &&
                <>
                <Button size="lg" variant="link" className="btn-icon text-success" onClick={handleAcceptOrder}>
                <i className="mdi mdi-check" title={t('Accept order')}></i>
                </Button>
                <Button size="lg" variant="link" className="btn-icon text-danger" onClick={handleRejectOrder}>
                    <i className="mdi mdi-cancel" title={t('Reject order')}></i>
                </Button>
                </>
            }
            {
                row.original.status === OrderStatus.NEW && row.original.autoAccepted &&
                <>
                <Button size="lg" variant="link" className="btn-icon text-success" onClick={handleTakeOrder}>
                    <i className="mdi mdi-check" title={t('Take order')}></i>
                </Button>
                </>
            }
            {
                row.original.status === OrderStatus.TAKEN &&
                <Button size="lg" variant="link" className="btn-icon text-success" onClick={handleReadyOrder}>
                    <i className="mdi mdi-clock-alert-outline" title={t('Order Ready')}></i>
                </Button>
            }
            {
                row.original.status === OrderStatus.READY_FOR_PICKUP &&
                <Button size="lg" variant="link" className="btn-icon text-primary" onClick={handleDeliverOrder}>
                    <i className="mdi mdi-bike-fast" title={t('Deliver order')}></i>
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
        accessor: 'brandName',
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
        Header: t('Actions').toString(),
        accessor: 'action',
        defaultCanSort: false,
        Cell: ActionColumn,
    },
];