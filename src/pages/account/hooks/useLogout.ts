import { useEffect } from 'react';
import { logoutUser } from 'redux/actions';
import { useRedux } from 'hooks';

export default function useLogout() {
    const { dispatch, appSelector} = useRedux();

    const { userLogout } = appSelector((state) => ({
        userLogout: state.Auth.userLogout,
    }));

    useEffect(() => {
        dispatch(logoutUser());
    }, [dispatch]);

    return { userLogout }
}
