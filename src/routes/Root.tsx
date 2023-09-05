import { useUser } from 'hooks';
import { Navigate } from 'react-router-dom';

const Root = () => {
    
    const [loggedInUser] = useUser();
    const getRootUrl = () => {
        let url: string = loggedInUser ? 'home' : 'account/login';
        return url;
    };

    const url = getRootUrl();

    return <Navigate to={`/${url}`} state={{comesFromLogin: true}} />;
};

export default Root;
