//import ReactGA from "react-ga";
import ReactGA4 from "react-ga4";

export interface AnalyticsEventProp {
    category: string;
}

const useAnalyticsEventTracker = ( { category }: AnalyticsEventProp) => {
    const eventTracker = (action: string, label?: string): void => {
         ReactGA4.event({ category, action, label });
    }
    return eventTracker;
}

export default useAnalyticsEventTracker;