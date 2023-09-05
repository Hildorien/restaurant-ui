import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from 'hooks';
import config from 'config/config';
import { Role } from 'config/types';
import PrivateRoutesContextProvider from 'context/PrivateRoutesContextProvider';

type PrivateRouteProps = {
    component: React.ComponentType;
    version?: number; 
    roleAccess?: Role[];
    onlyDesktop?: boolean;
};

/**
 * Private Route forces the authorization before the route can be accessed
 * @param {*} param0
 * @returns
 */
const PrivateRoute = ({ component: RouteComponent, version, roleAccess, onlyDesktop, ...rest }: PrivateRouteProps) => {
    let location = useLocation();
    const [loggedInUser] = useUser();

    // login required or user deleted from storage -> return to login
    if (!loggedInUser) {
        return <Navigate to={'/account/login'} state={{ from: location }} replace />;
    }
    // check if route is restricted by role
    if (!loggedInUser.role) {
        // role not assigned, relog
        return <Navigate to={{ pathname: '/account/login' }} />; 
    }
    if (roleAccess && !roleAccess.includes(loggedInUser.role)) {
        // role not authorised so redirect to HOMEPAGE
        return <Navigate to={{ pathname: '/' }} />; 
    }
    const currentVersion = config.version;
    if (version && currentVersion < version) {
        return <Navigate to={{ pathname: '/pages/error-404' }} />;
    }
    //Only desktop
    if(onlyDesktop) {
        return <Navigate to={{ pathname: '/pages/error-404' }} />;
    }

    return (
        <PrivateRoutesContextProvider>
            <RouteComponent />
        </PrivateRoutesContextProvider>
        )      
};

export default PrivateRoute;
