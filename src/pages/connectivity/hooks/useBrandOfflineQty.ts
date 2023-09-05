import { BranchContext, BranchContextType } from "context/BranchProvider";
import { useRedux } from "hooks";
import MenuBadgesService from "layouts/Menu/Badges/MenuBadgeService";
import { MenuConnectivityBadge } from "layouts/Menu/Badges/MenuConnectivityBadge";
import { useCallback, useContext, useEffect } from "react";
import { getOfflineBrandQty } from "redux/actions";
 

export default function useBrandOfflineQty() {
    const { dispatch, appSelector } = useRedux();
    const { activeBranchId } = useContext(BranchContext) as BranchContextType;

    const { loading, offlineBrandQty, error } = appSelector((state) => ({
        loading: state.Connectivity.loading,
        error: state.Connectivity.error,
        offlineBrandQty: state.Connectivity.offlineBrandQtyInfo, //This is a number
    }));

    const onRequest = useCallback(() => {
        dispatch(getOfflineBrandQty(activeBranchId))
    }, [dispatch, activeBranchId]);

    //Add Effect for updating badge
    useEffect(() => {
        if (offlineBrandQty !== null) {
            var productBadge = MenuBadgesService.getInstance()?.getBadges()?.find(b =>  b instanceof(MenuConnectivityBadge));
            if (productBadge) {
                productBadge?.setTextBadge(offlineBrandQty.toString());
                MenuBadgesService.getInstance().refreshMenuBadge(productBadge);
            }
        }
    },[offlineBrandQty]);

    return {
        loading,
        offlineBrandQty,
        error,
        onRequest
    }
}