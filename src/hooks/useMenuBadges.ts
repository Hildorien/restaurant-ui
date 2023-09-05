import { BranchContext, BranchContextType } from "context/BranchProvider";
import useBrandOfflineQty from "pages/connectivity/hooks/useBrandOfflineQty";
import useMenuQty from "pages/menu/hooks/useMenuQty";
import useProductsOfflineQty from "pages/products/hooks/useProductOfflineQty";
import { useCallback, useContext, useEffect, useState } from "react";

export interface MenuBadge {
    offlineProducts: number;
    offlineBrands: number;
    menusConfigured: number;
}

export default function useMenuBadges() {

    const [suscribedVariables, setSuscribedVariables] = useState<MenuBadge | undefined>(undefined);
    const { activeBranchId: currentBranchId } = useContext(BranchContext) as BranchContextType;
    const [activeBranch, setActiveBranch] = useState<number | undefined>(undefined);


    //Add hooks specific to a badge
    const { onRequest: onRequestProductOfflineQty, offlineProductQty, error: errorProductsOfflineQty } = useProductsOfflineQty();
    const { onRequest: onRequestBrandOfflineQty, offlineBrandQty, error: errorBrandOfflineQty } = useBrandOfflineQty();
    const { menuQty, onRequestMenuQty } = useMenuQty();

    
    const onRequestMenuBadges = useCallback(() => {
        //Add all requests that update badges in menu
        onRequestProductOfflineQty(); 
        onRequestBrandOfflineQty();
        onRequestMenuQty();

    },[onRequestProductOfflineQty,onRequestBrandOfflineQty, onRequestMenuQty]);

    const refreshBadges = useCallback(() => {
        onRequestProductOfflineQty(); 
        onRequestBrandOfflineQty();
        onRequestMenuQty();
    },[onRequestProductOfflineQty,onRequestBrandOfflineQty, onRequestMenuQty]);

    useEffect(() => {
        if (!activeBranch) {
            setActiveBranch(currentBranchId);
        }
    }, [activeBranch, currentBranchId]);
    
    useEffect(() => {
        if (activeBranch && activeBranch !== currentBranchId) {
            refreshBadges();
            setActiveBranch(currentBranchId);
        }
      }, [activeBranch, currentBranchId, refreshBadges]);

    //Add effect for updating suscribedVariables
    useEffect(() => {
        if (offlineProductQty !== null && !errorProductsOfflineQty) {
            setSuscribedVariables(prevState => {
                if (prevState) {
                    return { ...prevState, offlineProducts: offlineProductQty } 
                }
            });
        }
    }, [offlineProductQty, errorProductsOfflineQty, currentBranchId]);

    useEffect(() => {
        if (offlineBrandQty !== null && !errorBrandOfflineQty) {
            setSuscribedVariables(prevState => {
                if (prevState) {
                    return { ...prevState, offlineBrands: offlineBrandQty }
                }
            });
        }
    }, [offlineBrandQty, errorBrandOfflineQty, currentBranchId]);

    useEffect(() => {
        if (menuQty >= 0) {
            setSuscribedVariables(prevState => {
                if (prevState) {
                    return { ...prevState, menusConfigured: menuQty }
                }
            });
        }
    }, [menuQty]);

    return {
        suscribedVariables,
        onRequestMenuBadges
    }


}