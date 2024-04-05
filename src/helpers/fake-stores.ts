import { Status, Store } from "redux/branch/types";

export const fakeStores: Store[] = [
    {
        id: 1,
        name: "Test Brand",
        status: true,
        integrations: [
            {
                id: 1,
                app: "RP",
                appStoreId: "900120599",
                status: Status.OPEN,
                verificationCode: {
                    code: "1234",
                    expiration: new Date()
                }
            },
            {
                id: 2,
                app: "PY",
                appStoreId: "900120598",
                status: Status.OPEN,
                verificationCode: undefined
            },
            {
                id: 3,
                app: "UE",
                appStoreId: "900120597",
                status: Status.OPEN,
                verificationCode: undefined
            },
            {
                id: 4,
                app: "MP",
                appStoreId: "900120596",
                status: Status.OPEN,
                verificationCode: undefined
            }
        ]
    },
    {
        id: 2,
        name: "Test Brand 2",
        status: true,
        integrations: [
            {
                id: 1,
                app: "RP",
                appStoreId: "900120500",
                status: Status.OPEN,
                verificationCode: {
                    code: "1234",
                    expiration: new Date()
                }
            },
            {
                id: 2,
                app: "PY",
                appStoreId: "900120501",
                status: Status.OPEN,
                verificationCode: undefined
            },
            {
                id: 3,
                app: "UE",
                appStoreId: "900120502",
                status: Status.OPEN,
                verificationCode: undefined
            },
            {
                id: 4,
                app: "MP",
                appStoreId: "900120503",
                status: Status.OPEN,
                verificationCode: undefined
            }
        ]
    }
]