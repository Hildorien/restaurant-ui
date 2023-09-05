import { BranchContext, BranchContextType } from "context/BranchProvider";
import { getMenus } from "helpers/api/menu";
import MenuBadgesService from "layouts/Menu/Badges/MenuBadgeService";
import { MenuMenuBadge } from "layouts/Menu/Badges/MenuMenuBadge";
import { useCallback, useContext, useEffect, useState } from "react";

export default function useMenuQty() {

    const [menuQty, setMenuQty] = useState<number>(-1);
    const [loading, setLoading] = useState<boolean>(false);

    //Import hooks
    const { activeBranchId } = useContext(BranchContext) as BranchContextType;

    const onRequestMenuQty = useCallback(async () => {
        let menus = 0;
        setLoading(true);
        await getMenus({ branchId: activeBranchId})
        .then( async (response) => {
            menus = response.data.length;
            setMenuQty(menus);
        })
        .finally(() =>  { 
            setLoading(false); 
        })
        return menus;
    }, [activeBranchId]);

    useEffect(() => {
        var menuBadge = MenuBadgesService.getInstance()?.getBadges()?.find(b =>  b instanceof(MenuMenuBadge));
        if (menuBadge) {
            menuBadge?.setTextBadge(menuQty.toString());
            MenuBadgesService.getInstance().refreshMenuBadge(menuBadge);
        }
    }, [menuQty])

    return { menuQty, onRequestMenuQty, loading };
}