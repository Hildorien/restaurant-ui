import { Status, Store, } from "redux/branch/types";
import { ConnectivityCardInfo } from "./types";

const fakeStores: Store[] = [ 
    {
        id: 2,
        name: "Z Brand 1",
        status: true,
        integrations: [
            {
                id: 1,
                app: "Rappi",
                appStoreId: "900120591",
                status: Status.OPEN
            },
            {
                id: 2,
                app: "Pedidos ya",
                appStoreId: "110292",
                status: Status.CLOSED
            },
            {
                id: 3,
                app: "Wabi",
                appStoreId: "841fedd3-bc28-4395-ab54-fc23e1da6783",
                status: Status.SUSPENDED
            }
        ]
    },
    {
        id: 3,
        name: "Z Brand 2",
        status: true,
        integrations: [
            {
                id: 4,
                app: "Rappi",
                appStoreId: "900120591",
                status: Status.OUT_OF_HOURS
            },
            {
                id: 5,
                app: "Pedidos ya",
                appStoreId: "110292",
                status: Status.OUT_OF_HOURS
            },
        ]
    }
  ];

export function addFakeConnectivityInfo() {
    const rv: ConnectivityCardInfo[]  = [];
    for(const fakeStore of fakeStores) {
      rv.push({
        id: fakeStore.id,
        title: fakeStore.name,
        state: fakeStore.status,
        integrations: fakeStore.integrations.map(fakeIntegration => {
          return {
            id: fakeIntegration.id,
            app: fakeIntegration.app,
            appStoreId: fakeIntegration.appStoreId,
            name: fakeIntegration.app,
            state: fakeIntegration.status
          }
        }) });
    }
    return rv;
}

