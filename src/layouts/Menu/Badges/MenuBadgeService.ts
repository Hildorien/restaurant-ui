import { MenuBadge } from "./MenuBadge";


export default class MenuBadgesService {
    private static instance: MenuBadgesService;
    private badges: MenuBadge[] = [];
    private constructor () {}

    public static async initialize(badges: MenuBadge[]) {
        if (!this.instance) {
            this.instance = new MenuBadgesService();
            this.instance.badges = badges;
        }
    }

    public static getInstance(): MenuBadgesService {
		return this.instance;
	}

    public getBadges() {
        return this.badges;
    }

    public refreshMenuBadge(menuBadge: MenuBadge) {
        const index = this.badges.findIndex(b => b.getMenuKey() === menuBadge.getMenuKey());
        if (index !== -1) {
            this.badges.splice(index, 1);
            this.badges.push(menuBadge);
        }
    }

}