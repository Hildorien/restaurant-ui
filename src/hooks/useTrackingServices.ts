import { useEffect, useState } from 'react'
import config from 'config/config';
//import ReactGA from 'react-ga';
import ReactGA4 from 'react-ga4';
import { hotjar } from 'react-hotjar';



const useTrackingServices = () => {
    const [initialized, setInitialized] = useState(false);

    const initializeAnalytics = () => {
        ReactGA4.initialize(config.trackingId);
    }

    const initializeHotjar = () => {
        hotjar.initialize(config.hotjarId, config.hotjarSnipperVersion);
    }


    useEffect(() => {
        initializeAnalytics();
        initializeHotjar();
        setInitialized(true);
    }, []);

    useEffect(() => {
        if (initialized) {
            ReactGA4.send({ hitType: "pageview", page: window.location.pathname + window.location.search})
        }
    },[initialized]);
}

export default useTrackingServices;
