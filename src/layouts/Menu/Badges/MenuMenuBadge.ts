import { MenuItemBadge } from "appConstants";
import { t } from "i18next";
import { MenuBadge } from "./MenuBadge";

export class MenuMenuBadge extends MenuBadge {
    protected badge: MenuItemBadge | undefined;

    public getBadge(): MenuItemBadge | undefined {
        return this.badge;
    }

    public setTextBadge(text: string): void {
        //If 0 menues are configured, show badge
        if (text === '0') { 
            this.badge = { variant: 'danger', text: '!', toolTipText: t('There are no menus configured')};
        } else {
            this.badge = undefined;
        }
    }

}