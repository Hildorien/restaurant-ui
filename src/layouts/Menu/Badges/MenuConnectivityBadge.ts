import { MenuItemBadge } from "appConstants";
import { t } from "i18next";
import { MenuBadge } from "./MenuBadge";

export class MenuConnectivityBadge extends MenuBadge {
    protected badge: MenuItemBadge | undefined;

    public getBadge(): MenuItemBadge | undefined {
        return this.badge;
    }

    public setTextBadge(text: string): void {
        //If 0 products offline, remove badge
        if (text === '0') { 
            this.badge = undefined;
        } else {
            this.badge = { variant: 'danger', text: text, toolTipText: t('Offline brands')}
        }
    }

}
    
