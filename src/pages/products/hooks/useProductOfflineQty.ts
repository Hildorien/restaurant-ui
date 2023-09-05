import { BranchContext, BranchContextType } from "context/BranchProvider";
import { useRedux } from "hooks";
import { MenuProductBadge } from "layouts/Menu/Badges";
import MenuBadgesService from "layouts/Menu/Badges/MenuBadgeService";
import { useCallback, useContext, useEffect } from "react";
import { getOfflineProductQty } from "redux/actions";
 

export default function useProductsOfflineQty() {
    const { dispatch, appSelector } = useRedux();
    const { activeBranchId } = useContext(BranchContext) as BranchContextType;


    const { loading, offlineProductQty, error } = appSelector((state) => ({
        loading: state.Products.loading,
        error: state.Products.error,
        offlineProductQty: state.Products.offlineProductQtyInfo, //This is an array of Product
    }));

    const onRequest = useCallback(() => {
        dispatch(getOfflineProductQty(activeBranchId))
    },[dispatch, activeBranchId]);

    //Add Effect for updating badge
    useEffect(() => {
        if (offlineProductQty !== null) {
            var productBadge = MenuBadgesService.getInstance()?.getBadges()?.find(b =>  b instanceof(MenuProductBadge));
            if (productBadge) {
                productBadge?.setTextBadge(offlineProductQty.toString());
                MenuBadgesService.getInstance().refreshMenuBadge(productBadge);
            }
        }
    },[offlineProductQty]);

    return {
        loading,
        offlineProductQty,
        error,
        onRequest
    }
}