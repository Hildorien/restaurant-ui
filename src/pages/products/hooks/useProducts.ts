import { useRedux } from "hooks";
import { useCallback } from "react";
import { getProductInfo } from "redux/actions";
 

export default function useProducts() {
    const { dispatch, appSelector } = useRedux();

    const { loading, productInfo, error } = appSelector((state) => ({
        loading: state.Products.loading,
        error: state.Products.error,
        productInfo: state.Products.productInfo, //This is an array of Product
    }));

    const onRequest = useCallback((branchId: number) => {
        dispatch(getProductInfo(branchId))
    },[dispatch]);

    return {
        loading,
        productInfo,
        error,
        onRequest
    }
}