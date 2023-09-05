import { useRedux } from "hooks";
import { useCallback } from "react";
import { getBrandInfo } from "redux/actions";


export default function useBrands() {
    const { dispatch, appSelector } = useRedux();

    const { loading, brandInfo, error } = appSelector((state) => ({
        loading: state.Brands.loading,
        error: state.Brands.error,
        brandInfo: state.Brands.brandInfo, //This is an array of Brand
    }));

    const onRequest = useCallback((branchId: number) => {
        dispatch(getBrandInfo(branchId))
    },[dispatch]);

    return {
        loading,
        brandInfo,
        error,
        onRequest
    }

}