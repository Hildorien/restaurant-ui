import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Dropdown, Button } from 'react-bootstrap';
import SimpleBar from 'simplebar-react';
import classNames from 'classnames';
import { useToggle } from 'hooks';
import { t } from 'i18next';
import { NotificationMessage } from './NotificationMessage/NotificationMessage';

// notifiaction continer styles
const notificationShowContainerStyle = {
    maxHeight: '300px',
};


export type NotificationDropdownProps = {
    branchId: number;
    notifications: NotificationMessage[];
    updateNotifications: (newNotif: NotificationMessage[]) => void;
};

const NotificationDropdown2 = ({ notifications, updateNotifications }: NotificationDropdownProps) => {
    const [isOpen, toggleDropdown] = useToggle();
    const [notificationStack, setNotificationStack] = useState(notifications);
    

    const clearNotifications = () => {
        setNotificationStack([]);
        updateNotifications([]);
    }

    const showNotificationIconAlert = () => {
        if (notificationStack.length === 0) {
            return false;
        }
        return !notificationStack[0].isRead;
    }

    const cleanNotification = (id: string) => {
        const newNotif = notificationStack.filter(notif => notif.id !== id);
        setNotificationStack(newNotif);
        updateNotifications(newNotif);
    }

    const markNotificationAsRead = (id: string) => {
        for(const notif of notificationStack) {
            if (notif.id === id) {
                notif.isRead = true;
                setNotificationStack(notificationStack.slice());
                break;
            }
        }
    }

    const sortNotifications = (notifications: NotificationMessage[]): NotificationMessage[] => {
        return notifications.sort(function (n1: NotificationMessage, n2: NotificationMessage) {
            return n1.date > n2.date ? -1 : 1;
        });
    }

    let navigate = useNavigate(); 
    const routeChange = (notification: NotificationMessage) =>{ 
        navigate(notification.navigateToPath());
    }

    useEffect(() => {
        setNotificationStack(sortNotifications(notifications).slice());
    }, [notifications]);

    return (
        <Dropdown autoClose={"outside"} show={isOpen} onToggle={toggleDropdown}>
            <Dropdown.Toggle
                variant="link"
                id="dropdown-notification"
                as={Link}
                to="#"
                className="nav-link dropdown-toggle arrow-none"
            >
                <i style={{'fontSize': '20px'}} className="dripicons-bell noti-icon"></i>
                { showNotificationIconAlert() && <span className="noti-icon-badge"></span> }
            </Dropdown.Toggle>
            <Dropdown.Menu className="dropdown-menu-animated dropdown-lg" align="end">
                <div>
                    <div className="dropdown-item noti-title px-3">
                        <h5 className="m-0">
                            {
                                notificationStack.length > 0 &&
                                (<span className="float-end">
                                    <Button size='sm' variant='link' className="text-dark" onClick={clearNotifications}>
                                       <small>{t('Clear All')}</small>
                                    </Button>
                                </span>)
                            }
                            {t('Notifications')}
                        </h5>
                    </div>
                    <SimpleBar className="px-3" style={notificationShowContainerStyle}>                     
                        {notificationStack.map((notification, index) => {
                            return (
                                <React.Fragment key={index.toString()}>
                                    <Dropdown.Item
                                                key={index + '-noti'}
                                                className={classNames(
                                                    'p-0 notify-item card shadow-none mb-2',
                                                    notification.isRead ? 'read-noti' : 'unread-noti'
                                                )}
                                                onMouseOver={() => markNotificationAsRead(notification.id)}
                                                onClick={() => routeChange(notification)}    
                                            >
                                                <Card.Body>                                                  
                                                    <span className="float-end noti-close-btn text-muted">
                                                        <i className="mdi mdi-close" onClick={() => cleanNotification(notification.id)}></i>
                                                    </span>
                                                    <div className="d-flex align-items-center">
                                                        <div className="flex-shrink-0">
                                                            <div
                                                                className={classNames(
                                                                    'notify-icon',
                                                                    notification.variant && 'bg-' + notification.variant
                                                                )}
                                                            >
                                                                {notification.avatar ? (
                                                                    <img
                                                                        src={notification.avatar}
                                                                        className="img-fluid rounded-circle"
                                                                        alt=""
                                                                    />
                                                                ) : (
                                                                    <i className={notification.icon}></i>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex-grow-1 text-truncate ms-2">
                                                            <h5 className="noti-item-title fw-semibold font-14">
                                                                {notification.title}{' '}
                                                                {notification.time && (
                                                                    <small className="fw-normal text-muted ms-1">
                                                                        {notification.time}
                                                                    </small>
                                                                )}
                                                            </h5>
                                                            <small 
                                                            title={notification.subText}
                                                            className="noti-item-subtitle text-muted">
                                                                {notification.subText}
                                                            </small>

                                                        </div>
                                                    </div>
                                                </Card.Body>
                                            </Dropdown.Item>
                                </React.Fragment>
                            );
                        })}

                        {/* Spinner indicating that is looking for new notifications
                        <div className="text-center">
                            <i className="mdi mdi-dots-circle mdi-spin text-muted h3 mt-0"></i>
                    </div>*/}
                    </SimpleBar>
                </div>
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default NotificationDropdown2;
