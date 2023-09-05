import useBrandOfflineQty from "pages/connectivity/hooks/useBrandOfflineQty";
import useMenuQty from "pages/menu/hooks/useMenuQty";
import useProductsOfflineQty from "pages/products/hooks/useProductOfflineQty";
import { createContext, useContext, useEffect, useState } from "react";
import { BranchContext, BranchContextType } from "./BranchProvider";

export type StartupNotificationContextType = {
    offlineProductsQty: number;
    setOfflineProductsQty: React.Dispatch<React.SetStateAction<number>>;
    
    offlineStoresQty: number;
    setOfflineStoresQty: React.Dispatch<React.SetStateAction<number>>;
    
    menusConfiguredQty: number;
    setMenusConfiguredQty: React.Dispatch<React.SetStateAction<number>>;
};

export const StartupNotificationContext = createContext<StartupNotificationContextType | null>(null);

const  StartupNotificationProvider: React.FC<React.ReactNode> = ({ children }) => {
    //Add local state variables here
    const [offlineProductsQty, setOfflineProductsQty] = useState<number>(0);
    const [offlineStoresQty, setOfflineStoresQty] = useState<number>(0);
    const [menusConfiguredQty, setMenusConfiguredQty] = useState<number>(-1);

    //Import hooks
    const { offlineProductQty, onRequest: onRequestProductsOfflineQty  } = useProductsOfflineQty();
    const { offlineBrandQty, onRequest: onRequestBrandOfflineQty } = useBrandOfflineQty();
    const { menuQty, onRequestMenuQty } = useMenuQty();
    const { activeBranchId } = useContext(BranchContext) as BranchContextType;

    useEffect(() => {
        onRequestProductsOfflineQty();
        onRequestBrandOfflineQty();
        onRequestMenuQty();
    }, [activeBranchId, onRequestProductsOfflineQty, onRequestBrandOfflineQty, onRequestMenuQty]);
    
    useEffect(() => {
        if (offlineProductQty) {
            setOfflineProductsQty(offlineProductQty);
        }
    }, [offlineProductQty]);

    useEffect(() => {
        if (offlineBrandQty) {
            setOfflineStoresQty(offlineBrandQty);
        }
    }, [offlineBrandQty]);

    useEffect(() => {
        if (menuQty >= 0) {
            setMenusConfiguredQty(menuQty);
        }
    }, [menuQty])
  
    return (
      <StartupNotificationContext.Provider 
      value={{  offlineProductsQty, setOfflineProductsQty, 
                offlineStoresQty, setOfflineStoresQty, 
                menusConfiguredQty, setMenusConfiguredQty}}>
        {children}
      </StartupNotificationContext.Provider>
    )
  }
  
  export default StartupNotificationProvider;