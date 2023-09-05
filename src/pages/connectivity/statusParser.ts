import { t } from "i18next";
import { Status } from "redux/branch/types";

class StatusParser {

    public static isOpen(state: Status): boolean {

        if(state === Status.OPEN) {
            return true;
        }
        return false;
    }

    public static stateName(state: Status): string {
        switch(state) {
            case Status.OPEN:
                return t('Open');
            case Status.CLOSED:
                return t('Closed');
            case Status.OUT_OF_HOURS:
                return t('Out of hours');
            case Status.SUSPENDED:
                return t('Suspended');
            case Status.UNKNOWN:
                return t('Unknown');
            case Status.CLOSING:
                return t('Closing');
            case Status.OPENING:
                return t('Opening');
            default:
                return "";
        }   
    }

    public static stateColor(state: Status): string {
        switch(state) {
            case Status.OPEN:
            case Status.OPENING:
                return 'success';
            case Status.CLOSED:
            case Status.CLOSING:
                return 'danger';
            case Status.OUT_OF_HOURS:
                return 'dark'
            case Status.SUSPENDED:
                return 'light';
            case Status.UNKNOWN:
                return 'warning';
            default:
                return 'info';
        } 
    }
}

export default StatusParser;