import { Status } from "redux/branch/types";
import Connectivity from "redux/connectivity/reducers";
import { number } from "yup";

export interface ConnectivityCardInfo  {
    id: number;
    title: string;
    state: boolean;
    integrations:  IntegrationInfo[];
}

export interface IntegrationInfo {
    id: number;
    app: string;
    appStoreId: string;
    name: string;
    state: Status;
}

export interface ConnectivityInfo {
    brandId?: number;
    branchId: number;
}

export interface ConnectivityCardInfoProps {
    title: string;
    integrations:  IntegrationInfo[];
    maxRows: number;
    state: boolean
    finishLoading: boolean;
    disableSwitch: boolean;
    connectivityInfo: ConnectivityInfo;
    handleConnectivityChange: (turnedOn: boolean, brandName: string) => void;
    handleConnectivityLoading: (status: Status, brandName: string) => void;
}

export interface ConnectivityCardRowProps {
    index: number;
    appName: string;
    appState: Status;
    finishLoading: boolean;
}

export interface ConnectivityCardTableProps {
    integrations: IntegrationInfo[];
    maxRows: number;
    finishLoading: boolean;
}

export interface ConnectivityAppStateProps {
    appName: string;
    state: Status;
    finishLoading: boolean;
}
