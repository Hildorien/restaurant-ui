import { MenuItemBadge } from "appConstants";

export abstract class MenuBadge {
	protected menuKey: string;

	public constructor(menuKey: string) {
		this.menuKey = menuKey;
	}

	public static getInstance<T extends MenuBadge>(
		type: { new (menuKey: string): T },
		menuKey: string,
	): MenuBadge {
		return new type(menuKey);
	}

	public getMenuKey() {
		return this.menuKey;
	}

	public abstract getBadge(): MenuItemBadge | undefined;
	public abstract setTextBadge(text: string): void;

}