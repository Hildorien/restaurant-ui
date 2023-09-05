import config from "config/config";
import { t } from "i18next";
import { NewOrder, OrderCancelled, PrintOrderCommand } from "darwinModels";
import uuid from "react-uuid";

export abstract class NotificationMessage {
    id: string;
    title: string;
    time?: string;
    subText: string;
    avatar?: string;
    icon?: string;
    variant?: string;
    isRead: boolean;
    date: Date;

    constructor() {
        this.id = '';
        this.title = '';
        this.subText = '';
        this.avatar = '';
        this.icon = '';
        this.variant = '';
        this.isRead = false;
        this.date = new Date();
    }

    public abstract toToastMessage(): string;
    public abstract toastBackgroundColor(): string;
    public abstract navigateToPath(): string;
}

export class NewOrderNotificationMessage extends NotificationMessage {

    public toToastMessage(): string {
        return t('A new order has arrived') + '!'
    }

    public toastBackgroundColor(): string {
        return 'primary';
    }

    public navigateToPath(): string {
        return `/kitchen`; 
    }

    public static parseNewOrderToNotification(newOrderEvent: NewOrder): NotificationMessage {
        const appNames = config.appNames;
        let notif = new NewOrderNotificationMessage();
        notif.id= newOrderEvent.id || '';
        notif.title= 'Ordenes';
        notif.time= new Date(newOrderEvent.createdAt).toLocaleTimeString();
        notif.subText= `Tenes una orden nueva de ${appNames[newOrderEvent.platform] || newOrderEvent.platform}`;
        notif.icon= 'mdi mdi-food-takeout-box-outline';
        notif.variant= 'primary';
        notif.isRead= false;
        notif.date= new Date(newOrderEvent.createdAt);
        return notif;
    }

    public static parsePrintOrderCommandToNotification(printOrderCommand: PrintOrderCommand): NotificationMessage {
        const appNames = config.appNames;
        let notif = new NewOrderNotificationMessage();
        notif.id= printOrderCommand.id || '';
        notif.title= 'Ordenes';
        notif.time= new Date(printOrderCommand.date).toLocaleTimeString();
        notif.subText= `Tenes una orden nueva de ${appNames[printOrderCommand.platform] || printOrderCommand.platform}`;
        notif.icon= 'mdi mdi-food-takeout-box-outline';
        notif.variant= 'primary';
        notif.isRead= false;
        notif.date= new Date(printOrderCommand.date);
        return notif;
    }
}

export class OrderCancelledNotificationMessage extends NotificationMessage {

    public toToastMessage(): string {
        return t('An order has been cancelled') + '!'
    }

    public toastBackgroundColor(): string {
        return 'danger';
    }

    public navigateToPath(): string {
        return `/orders?s=${this.id}`; 
    }

    public static parseOrderCancelledToNotification(orderCancelledEvent: OrderCancelled): NotificationMessage {
        let notif = new OrderCancelledNotificationMessage();
        notif.id= orderCancelledEvent.id || '';
        notif.title= 'Orden cancelada';
        notif.time= new Date(orderCancelledEvent.createdAt).toLocaleTimeString();
        notif.subText= `La orden ${orderCancelledEvent.externalId} fue cancelada`;
        notif.icon= 'mdi mdi-cancel';
        notif.variant= 'danger';
        notif.isRead= false;
        notif.date= new Date(orderCancelledEvent.createdAt);
        return notif;
    }
}

export class OfflineBrandsNotificationMessage extends NotificationMessage {

    constructor() {
        super();
        this.id= uuid() || '';
        this.title= 'Marcas apagadas';
        this.time= new Date().toLocaleTimeString();
        this.subText= `Tienes marcas apagadas en una o mas aplicaciones de delivery`;
        this.icon= 'mdi mdi-store-alert-outline';
        this.variant= 'danger';
        this.isRead= false;
        this.date= new Date();   
    }

    public toToastMessage(): string {
        return t('There are offline stores')
    }

    public toastBackgroundColor(): string {
        return 'danger';
    }

    public navigateToPath(): string {
        return `/connectivity`; 
    }

    public static parseOfflineStoreToNotification(): NotificationMessage {
        let notif = new OfflineBrandsNotificationMessage();
        notif.id= uuid() || '';
        notif.title= 'Marcas apagadas';
        notif.time= new Date().toLocaleTimeString();
        notif.subText= `Tienes marcas apagadas en una o mas aplicaciones de delivery`;
        notif.icon= 'mdi mdi-store-alert-outline';
        notif.variant= 'danger';
        notif.isRead= false;
        notif.date= new Date();
        return notif;
    }
}

export class OfflineProductsNotificationMessage extends NotificationMessage {

    constructor(){
        super();
        this.id= uuid() || '';
        this.title= 'Productos apagados';
        this.time= new Date().toLocaleTimeString();
        this.subText= `Tienes productos apagados en una o mas aplicaciones de delivery`;
        this.icon= 'mdi mdi-food-off-outline';
        this.variant= 'danger';
        this.isRead= false;
        this.date= new Date();
    }
    
    public toToastMessage(): string {
        return t('There are offline products')
    }

    public toastBackgroundColor(): string {
        return 'danger';
    }

    public navigateToPath(): string {
        return `/products`; 
    }
}

export class EmptyMenusNotificationMessage extends NotificationMessage {

    constructor() {
        super();
        this.id= uuid() || '';
        this.title= 'Todavía no creaste el menú';
        this.time= new Date().toLocaleTimeString();
        this.subText= `Armalo y publicalo en las apps para empezar a vender`;
        this.icon= 'mdi mdi-clipboard-alert-outline';
        this.variant= 'danger';
        this.isRead= false;
        this.date= new Date();
    }

    public toToastMessage(): string {
        return t('There are no menus configured')
    }

    public toastBackgroundColor(): string {
        return 'danger';
    }

    public navigateToPath(): string {
        return `/menu`; 
    }
}