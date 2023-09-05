import Routes from 'routes/Routes';
import { configureFakeBackend } from 'helpers';

// For Default import Saas.scss
//import 'assets/scss/Saas.scss';
import 'assets/scss/Darwin.scss'
//import useTrackingServices from 'hooks/useTrackingServices';
import React from 'react';
import GlobalVariablesContext from 'context/GlobalVariablesProvider';
// import 'assets/scss/Creative.scss';
// import 'assets/scss/Modern.scss';

//Test Comment


const App = () => {
    //useTrackingServices();
    configureFakeBackend();
    return (
        <GlobalVariablesContext>
                <Routes />
        </GlobalVariablesContext>
        );
};

export default App;
