import ReactGA4 from "react-ga4";
import { sha256 } from "js-sha256";

const useGASetUserId = () => {
    const setUserId = (userId: string): void => {
        ReactGA4.set({ userId:  sha256(userId) });
   }
   return setUserId;
}

export default useGASetUserId;