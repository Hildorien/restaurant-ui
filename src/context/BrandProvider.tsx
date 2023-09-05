import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Brand } from "redux/brands/types";
import { BranchContext, BranchContextType } from "./BranchProvider";
import { getBrandsByBranchId } from "helpers";

export type BrandContextType = {
    brands: Brand[];
};

export const BrandContext = createContext<BrandContextType | null>(null);

const  BrandProvider: React.FC<React.ReactNode> = ({ children }) => {

    const [brands, setBrands] = useState<Brand[]>([]);
    const { activeBranchId } = useContext(BranchContext) as BranchContextType;

    const fetchBrands = useCallback(async () => {
        await getBrandsByBranchId({ branchId: activeBranchId})
        .then((response) => {
            setBrands(response.data as Brand[]);
        })
    }, [activeBranchId]);

    useEffect(() => {
        fetchBrands();
    }, [activeBranchId, fetchBrands]);

    return (
        <BrandContext.Provider value={{brands}}>
          {children}
        </BrandContext.Provider>
    )
}

export default BrandProvider;