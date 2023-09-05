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
                appStoreId: "900120599",
                status: Status.OPEN,
                verificationCode: undefined
            }
        ]
    }
]