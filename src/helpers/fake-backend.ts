import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Role, User } from 'config/types';
import { MenuApp } from 'pages/menu/types';
import { BranchMetadata } from 'redux/branch/types';
import { Brand } from 'redux/brands/types';
import { fakeProducts } from './fake-products';
import { fakeStores } from './fake-stores';
import { generateSales } from './fake-user-sales-data';
import { fakeTable } from './fake-metrics-history';
import { fakeMetrics } from './fake-metrics';
import { fakeOrders } from './fake-orders-data';

const TOKEN =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJjb2RlcnRoZW1lcyIsImlhdCI6MTU4NzM1NjY0OSwiZXhwIjoxOTAyODg5NDQ5LCJhdWQiOiJjb2RlcnRoZW1lcy5jb20iLCJzdWIiOiJzdXBwb3J0QGNvZGVydGhlbWVzLmNvbSIsImxhc3ROYW1lIjoiVGVzdCIsIkVtYWlsIjoic3VwcG9ydEBjb2RlcnRoZW1lcy5jb20iLCJSb2xlIjoiQWRtaW4iLCJmaXJzdE5hbWUiOiJIeXBlciJ9.P27f7JNBF-vOaJFpkn-upfEh3zSprYfyhTOYhijykdI';

// Create a new Date object for the current time
const currentDate = new Date();
// Add 24 hours to the current time
currentDate.setHours(currentDate.getHours() + 24);
// Calculate the expiration time in seconds
const expirationInSeconds = currentDate.getTime() / 1000;

//const password = 'test'

var mock = new MockAdapter(axios, { onNoMatch: 'passthrough' });


export async function configureFakeBackend() {
    let users: User[] = [
        {
            email: 'test',
            name: 'Test',
            lastName: '1',
            role: Role.ADMIN,
            branchIds: [1],
            scopes: [],
            token: { value: TOKEN, expire: expirationInSeconds },
            refreshToken: { value: TOKEN, expire: expirationInSeconds }
        },
    ];

    let branch: BranchMetadata[] = [{
        id: 1,
        name: "Test Branch - Buenos Aires",
        address: "Av Test 245",
        lat: "-34.600340",
        lon: "-58.413653",
        cityId: "BUE",
        localSaleEnabled: true
    }];

    let brand: Brand[] = [
        {
            id: 1,
            name: "Test Brand",
            logoSmall: ""
        },
        {
            id: 2,
            name: "Test Brand 2",
            logoSmall: ""
        },
    ];

    let deliveryApps: MenuApp[] = [
        {
            app: "PY",
            appId: "99999",
            active: false
        },
        {
            app: "RP",
            appId: "99998",
            active: false
        },
        {
            app: "MP",
            appId: "99997",
            active: false
        },
        {
            app: "UE",
            appId: "99996",
            active: false
        }
    ];

    mock.onPost('/auth').reply(function (config) {
        return new Promise(function (resolve, reject) {
            resolve([200,
                {
                    accessToken: { value: TOKEN, expire: expirationInSeconds },
                    refreshToken: { value: TOKEN, expire: expirationInSeconds }
                }]);
        });
    })


    mock.onGet('/user?').reply(function (config) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve([200, users[0]]);
            }, 1000);
        });
    });

    mock.onGet('/branch').reply(function (config) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve([200, branch]);
            }, 1000);
        });
    });

    mock.onGet('/brand?branchId=1').reply(function (config) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve([200, brand]);
            }, 1000);
        });
    });

    mock.onGet('/brand?branchId=1').reply(function (config) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve([200, brand]);
            }, 1000);
        });
    });

    mock.onGet('/connectivity/offline?branchId=1').reply(function (config) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve([200, 0]);
            }, 1000);
        });
    });

    mock.onGet('/product/offline?branchId=1').reply(function (config) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve([200, 0]);
            }, 1000);
        });
    });

    mock.onGet('/report/sales/totalOrders?branchId=1?').reply(function (config) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve([200, 0]);
            }, 1000);
        });
    });

    mock.onGet('/menu?branchId=1').reply(function (config) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve([200, []]);
            }, 1000);
        });
    });

    mock.onGet('/menu/apps?branchId=1&brandId=1').reply(function (config) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve([200, deliveryApps]);
            }, 1000);
        });
    });

    mock.onGet('/menu/apps?branchId=1&brandId=2').reply(function (config) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve([200, deliveryApps]);
            }, 1000);
        });
    });

    mock.onGet('/product?branchId=1').reply(function (config) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve([200, fakeProducts]);
            }, 1000);
        });
    });

    mock.onGet('/branch/store?branchId=1').reply(function (config) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve([200, fakeStores]);
            }, 1000);
        });
    });

    mock.onGet('/report/sales?branchId=1?').reply(function (config) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve([200, generateSales(1)]);
            }, 1000);
        });
    });

    mock.onGet('/report/operation?branchId=1?').reply(function (config) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve([200, fakeMetrics]);
            }, 1000);
        });
    });

    mock.onGet('/report/operation/history?branchId=1?').reply(function (config) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve([200, fakeTable]);
            }, 1000);
        });
    });

    mock.onGet('/order/commands?').reply(function (config) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve([200, []]);
            }, 1000);
        });
    });

    mock.onPost('/register/').reply(function (config) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                // get parameters from post request
                let params = JSON.parse(config.data);

                // add new users
                let newUser: User = {
                    email: params.email,
                    name: 'Test',
                    lastName: (users.length + 1).toString(),
                    role: Role.ADMIN,
                    branchIds: [1],
                    scopes: ['report'],
                    token: { value: TOKEN, expire: Date.now() / 1000 },
                    refreshToken: { value: TOKEN, expire: Date.now() / 1000 }
                };
                users.push(newUser);

                resolve([200, newUser]);
            }, 1000);
        });
    });

    mock.onPost('/forget-password/').reply(function (config) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                // get parameters from post request
                let params = JSON.parse(config.data);

                // find if any user matches login credentials
                let filteredUsers = users.filter((user) => {
                    return user.email === params.email;
                });

                if (filteredUsers.length) {
                    // if login details are valid return user details and fake jwt token
                    let responseJson = {
                        message: "We've sent you a link to reset password to your registered email.",
                    };
                    resolve([200, responseJson]);
                } else {
                    // else return error
                    resolve([
                        401,
                        {
                            message: 'Sorry, we could not find any registered user with entered username',
                        },
                    ]);
                }
            }, 1000);
        });
    });

    mock.onPost('/order').reply(function (config) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                let responseJson = {
                    message: "Order created.",
                };
                resolve([200, responseJson]);
            }, 1000);
        });
    });

    mock.onGet('/order/delivery?branchId=1?').reply(function (config) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve([200, { docs: fakeOrders }]);
            }, 1000);
        });
    });

    mock.onGet(/\/order\?branchId=\d+&page=\d+/).reply(function (config) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve([200, { docs: fakeOrders }]);
            }, 1000);
        });
    });
}
