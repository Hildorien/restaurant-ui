import { User } from "config/types";
import DarwinApi from "services/api/DarwinApi";

export default function useUser() {
    const loggedInUser = DarwinApi.getInstance().getLoggedInUser() as User;
    return [loggedInUser];
}
