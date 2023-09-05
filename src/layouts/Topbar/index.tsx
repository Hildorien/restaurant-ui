import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { /*showRightSidebar,*/ changeSidebarType } from 'redux/actions';
import * as layoutConstants from 'appConstants';
import { useRedux, useToggle, useViewport } from 'hooks';
import { /*notifications,*/ profileMenus, /*searchOptions*/ } from './data';
//import LanguageDropdown from './LanguageDropdown';
//import NotificationDropdown from './NotificationDropdown';
import ProfileDropdown from './ProfileDropdown';
//import SearchDropdown from './SearchDropdown';
//import TopbarSearch from './TopbarSearch';
//import AppsDropdown from './AppsDropdown';

// Original assets
import userImage from 'assets/images/users/avatar-1.jpg';
import logoSmDark from 'assets/images/logo_sm_dark.png';
import logoSmLight from 'assets/images/logo_sm.png';
import logo from 'assets/images/logo-light.png';

import { useUser } from 'hooks';
import { t } from 'i18next';
import BranchDropdown from './BranchDropdown';
import NotificationDropdown2 from './NotificationDropdown2';
import { NewOrder, OrderCancelled, PrintOrderCommand } from "darwinModels";
import { useCallback, useContext, useEffect, useState } from 'react';
import { NotificationToast } from './NotificationToast';
import { PrinterCheckpointContext, PrinterCheckpointContextType } from 'context/PrinterCheckpointProvider';
import { arrayEquals } from 'utils';
import { OrderEventContext, OrderEventContextType, OrderEventPrinterNotificationError } from 'context/OrderEventProvider';
import { BranchContext, BranchContextType } from 'context/BranchProvider';
import { EmptyMenusNotificationMessage, NewOrderNotificationMessage, NotificationMessage,  OfflineBrandsNotificationMessage,  OfflineProductsNotificationMessage,  OrderCancelledNotificationMessage } from './NotificationMessage/NotificationMessage';
//import StoreVerificationCodes from 'components/DarwinComponents/StoreVerificationCode';
//import CounterSale from 'components/DarwinComponents/CounterSale/CounterSale';
import { getMenus, getOfflineBrands, getOfflineProducts } from 'helpers';
import { ProfileOption } from 'layouts/types';
import CounterSale from 'components/DarwinComponents/CounterSale/CounterSale';

type TopbarProps = {
    hideLogo?: boolean;
    navCssClasses?: string;
    openLeftMenuCallBack?: () => void;
    topbarDark?: boolean;
};

type PrinterNotification = {
    message: string;
    class: string;
    id: string;
};

const Topbar = ({ hideLogo, navCssClasses, openLeftMenuCallBack, topbarDark }: TopbarProps) => {
    const { dispatch, appSelector } = useRedux();
    const { width } = useViewport();
    const [isMenuOpened, toggleMenu] = useToggle();
    const [notifications, setNotifications] = useState<NotificationMessage[]>([]);
    const [loggedInUser] = useUser();

    //Make Topbar aware of branch switching for side-effects
    const { activeBranchId: activeBranchInfo } = useContext(BranchContext) as BranchContextType;

    //Startup notifications
    const addStartupNotificationArriveHandler = useCallback(async (message: NotificationMessage) => {
        setNotifications(notif => {
            notif.push(message);
            return notif.slice();
        });
    }, []);

    const fetchOfflineProductsQty  = useCallback(async () => {
        await getOfflineProducts({ branchId: activeBranchInfo})
        .then((response) => {
            const qty = response.data as number;
            if (qty > 0) {
                addStartupNotificationArriveHandler(new OfflineProductsNotificationMessage());
            }
        })
    }, [activeBranchInfo, addStartupNotificationArriveHandler]);

    const fetchOfflineBrandsQty  = useCallback(async () => {
        await getOfflineBrands({ branchId: activeBranchInfo})
        .then((response) => {
            const qty = response.data as number;
            if (qty > 0) {
                addStartupNotificationArriveHandler(new OfflineBrandsNotificationMessage());
            } 
        })
    }, [activeBranchInfo, addStartupNotificationArriveHandler]);

    const fetchMenusConfiguredQty  = useCallback(async () => {
        await getMenus({ branchId: activeBranchInfo})
        .then( async (response) => {
            const menus = response.data.length;
            if (menus === 0) {
                addStartupNotificationArriveHandler(new EmptyMenusNotificationMessage());
            }
        })
    }, [activeBranchInfo, addStartupNotificationArriveHandler]);

    useEffect(() => {
        setNotifications([]);
        fetchMenusConfiguredQty();
        fetchOfflineBrandsQty();
        fetchOfflineProductsQty();
    }, [activeBranchInfo, fetchMenusConfiguredQty, fetchOfflineBrandsQty, fetchOfflineProductsQty]);

    //Make Topbar aware of printer checkpoint errors to notify user
    const { checkpointError } = useContext(PrinterCheckpointContext) as PrinterCheckpointContextType;
    const { newOrderNotification,
        newOrdersPrinterCommand,
        newOrdersPrinterNotificationErrorMessage,
        orderCancelledNotification,   
        //--- UNCOMMENT THIS TO TEST ORDERS IN DIFFERENT SCENARIOS (ALSO UNCOMMENT BUTTONS IN HTML) ---
        /*webSocketConnected,
        testNewOrder,
        testWebSocket,
        testPollingNewOrders,
        testOrderCancelledEvent,*/
     } = useContext(OrderEventContext) as OrderEventContextType;


    //Notification with SocketIO initialization states
    const [lastNewOrderNotification, setLastNewOrderNotification] = useState(newOrderNotification);
    const [lastOrderCancelledNotification, setLastOrderCancelledNotification] = useState(orderCancelledNotification);

    //New Orders to print initialization states
    const [lastNewOrdersPrinterCommand, setLastNewOrdersPrinterCommand] = useState(newOrdersPrinterCommand);

    //New Orders error messages
    const [lastNewOrdersProviderErrorMessages, setLastNewOrdersProviderErrorMessages] = useState(newOrdersPrinterNotificationErrorMessage);

    //Profile options
    let customProfileMenu: ProfileOption[] = profileMenus.slice();

    //Printer Notifications
    const [printerNotification, setPrinterNotification] = useState<PrinterNotification | undefined>(undefined);

    const closePrinterNotif = () => {
        setPrinterNotification(undefined);
    }

    const updateNotifications = useCallback((notif: NotificationMessage[]) => {
        setNotifications(notif);
    },[]);
    
    const newOrderNotificationArriveHandler = useCallback(async (newOrderEvent: NewOrder) => {
        setLastNewOrderNotification(newOrderEvent);
        setNotifications(notif => {
            notif.push(NewOrderNotificationMessage.parseNewOrderToNotification(newOrderEvent));
            return notif.slice();
        });
    }, []);

    const orderCancelledNotificationArriveHandler = useCallback(async (orderCancelEvent: OrderCancelled) => {
        setLastOrderCancelledNotification(orderCancelEvent);
        setNotifications(notif => {
            notif.push(OrderCancelledNotificationMessage.parseOrderCancelledToNotification(orderCancelEvent));
            return notif.slice();
        });
    }, []);

    const newOrdersPrinterCommandHandler = useCallback(async (newOrdersPrinterCommand: PrintOrderCommand[]) => {
        setLastNewOrdersPrinterCommand(newOrdersPrinterCommand); //Save new orders
        setNotifications(notif => {
            const newNotifications = newOrdersPrinterCommand.map(c => NewOrderNotificationMessage.parsePrintOrderCommandToNotification(c))
            return notif.concat(newNotifications).slice();
        });
    }, []);

    const newOrdersPrinterNotificationErrorMessageHandler = useCallback((errorMessage: OrderEventPrinterNotificationError) => {
        setLastNewOrdersProviderErrorMessages(errorMessage);
        setPrinterNotification({
            message: errorMessage.message,
            class: 'danger',
            id: errorMessage.id,
        });
    }, []);

    if (newOrderNotification && newOrderNotification !== lastNewOrderNotification && activeBranchInfo === newOrderNotification.branch?.id) {
        newOrderNotificationArriveHandler(newOrderNotification);
    }

    if (orderCancelledNotification && orderCancelledNotification !== lastOrderCancelledNotification && activeBranchInfo === orderCancelledNotification.branch?.id) {
        orderCancelledNotificationArriveHandler(orderCancelledNotification);
    }

    if (newOrdersPrinterCommand.length > 0 && 
        !arrayEquals(newOrdersPrinterCommand, lastNewOrdersPrinterCommand)) {
        newOrdersPrinterCommandHandler(newOrdersPrinterCommand);
    }

    if (newOrdersPrinterNotificationErrorMessage.id !== "" && newOrdersPrinterNotificationErrorMessage !== lastNewOrdersProviderErrorMessages) {
        newOrdersPrinterNotificationErrorMessageHandler(newOrdersPrinterNotificationErrorMessage);
    }

    // Counter Sale Logic
    //const hasAdminOrManagerRole: boolean = (loggedInUser.role === Role.ADMIN || loggedInUser.role === Role.MANAGER);

    const containerCssClasses = !hideLogo ? 'container-fluid' : '';

    const { layoutType, leftSideBarType } = appSelector((state) => ({
        layoutType: state.Layout.layoutType,
        leftSideBarType: state.Layout.leftSideBarType,
    }));

    /**
     * Toggle the leftmenu when having mobile screen
     */
    const handleLeftMenuCallBack = () => {
        toggleMenu();
        if (openLeftMenuCallBack) openLeftMenuCallBack();

        switch (layoutType) {
            case layoutConstants.LayoutTypes.LAYOUT_VERTICAL:
                if (width >= 768) {
                    if (leftSideBarType === 'fixed' || leftSideBarType === 'scrollable')
                        dispatch(changeSidebarType(layoutConstants.SideBarWidth.LEFT_SIDEBAR_TYPE_CONDENSED));
                    if (leftSideBarType === 'condensed')
                        dispatch(changeSidebarType(layoutConstants.SideBarWidth.LEFT_SIDEBAR_TYPE_FIXED));
                }
                break;

            case layoutConstants.LayoutTypes.LAYOUT_FULL:
                if (document.body) {
                    document.body.classList.toggle('hide-menu');
                }
                break;
            default:
                break;
        }
    };

    // Toggles the right sidebar 
    /*const handleRightSideBar = () => {
        dispatch(showRightSidebar());
    };*/

    return (
        <div className={classNames('navbar-custom', navCssClasses)}>
            <div className={containerCssClasses}>
                {!hideLogo && (
                    <Link to="/" className="topnav-logo">
                        <span className="topnav-logo-lg">
                            <img src={logo} alt="logo" height="32" />
                        </span>
                        <span className="topnav-logo-sm">
                            {/*<img src={Logo} alt="logo" height="16" />*/}
                            {<img src={topbarDark ? logoSmLight : logoSmDark} alt="logo" height="16" />}
                        </span>
                    </Link>
                )}
                <ul className="list-unstyled topbar-menu float-end mb-0">
                    {/*<li className="notification-list topbar-dropdown d-xl-none">
                        <SearchDropdown />
                    </li>*/}
                    {/*<li className="dropdown notification-list topbar-dropdown">
                        <LanguageDropdown />
                    </li>*/}
                    {/*<li className="dropdown notification-list d-none d-sm-inline-block">
                        <AppsDropdown />
                    </li>*/}
                    { // --- UNCOMMENT THIS TO TEST DIFFERENT NEW ORDER SCENARIOS
                        /*<>
                            <li className="dropdown notification-list mx-2 my-2">
                            <button onClick={(e) => testNewOrder()}>Probar orden via notificacion</button>
                            </li>
                            <li className="dropdown notification-list mx-2 my-2">
                                <button onClick={(e) => testWebSocket(!webSocketConnected)}>{webSocketConnected ? 'Apagar' : 'Prender'} Web Socket</button>
                            </li>
                            <li className="dropdown notification-list mx-2 my-2">
                                <button onClick={(e) => testPollingNewOrders()}>Probar orden via polling</button>
                            </li>
                            <li className="dropdown notification-list mx-2 my-2">
                                <button onClick={(e) => testOrderCancelledEvent()}>Probar orden cancelada </button>
                            </li>
                        </>*/
                    }
                    {
                        <li className={classNames('side-nav-item', 'pt-2')}>
                            <CounterSale />
                        </li>
                    }
                    <li 
                    className="dropdown notification-list pt-2 mx-1">
                        <BranchDropdown />
                    </li>
                    <li className="dropdown notification-list ms-1">
                        <NotificationDropdown2 
                        branchId={activeBranchInfo} 
                        notifications={notifications || []} 
                        updateNotifications={updateNotifications}  />
                    </li>
                    <li className="dropdown notification-list">
                        <ProfileDropdown
                            userImage={userImage}
                            menuItems={customProfileMenu}
                            username={loggedInUser?.name ?? ""}
                            userTitle={t('User')}
                        />
                    </li>
                </ul>

                {/* toggle for vertical layout */}
                {(layoutType === layoutConstants.LayoutTypes.LAYOUT_VERTICAL ||
                    layoutType === layoutConstants.LayoutTypes.LAYOUT_FULL) && (
                    <button className="button-menu-mobile open-left" onClick={handleLeftMenuCallBack}>
                        <i className="mdi mdi-menu" />
                    </button>
                )}

                {/* toggle for horizontal layout */}
                {layoutType === layoutConstants.LayoutTypes.LAYOUT_HORIZONTAL && (
                    <Link
                        to="#"
                        className={classNames('navbar-toggle', { open: isMenuOpened })}
                        onClick={handleLeftMenuCallBack}
                    >
                        <div className="lines">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </Link>
                )}

                {/* toggle for detached layout */}
                {layoutType === layoutConstants.LayoutTypes.LAYOUT_DETACHED && (
                    <Link to="#" className="button-menu-mobile disable-btn" onClick={handleLeftMenuCallBack}>
                        <div className="lines">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </Link>
                )}
                {/*<TopbarSearch options={searchOptions} />*/}
            </div>

            {
                notifications.length > 0 && !notifications[0].isRead &&
                (<NotificationToast id={notifications[0].id} 
                    text={notifications[0].toToastMessage()} 
                    position='bottom-end' 
                    bgColor={notifications[0].toastBackgroundColor()}/>)
            }
            {
                printerNotification && 
                (<NotificationToast id={printerNotification.id} 
                    text={printerNotification.message} 
                    position='bottom-end' 
                    bgColor='danger'
                    onClose={closePrinterNotif}/>)
            }
            {
                checkpointError && 
                <NotificationToast 
                    id={checkpointError + new Date().toTimeString()} 
                    text={t('Printer checkpoint could not be printed, check printer configuration and its connection')} 
                    position='bottom-end' 
                    bgColor='danger'/>
            }
        </div>
    );
};

export default Topbar;
