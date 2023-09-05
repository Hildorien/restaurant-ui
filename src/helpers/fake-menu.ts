import { Menu } from "pages/menu/types";

export const fakeMenu: Menu[] = [
    {
        id: "3",
        brand: {
            id: 1,
            name: "Test Brand"
        },
        apps: [
            {
                app: "UE",
                appId: "999",
                active: false
            },
            {
                app: "MP",
                appId: "999",
                active: false
            },
            {
                app: "PY",
                appId: "999",
                active: true
            },
            {
                app: "RP",
                appId: "999",
                active: true
            }
        ],
        sections: [
            {
                id: "3",
                name: "primera seccion (sueltos)",
                position: 1,
                active: true,
                items: [
                    {
                        id: 4,
                        position: 1,
                        price: 100.00,
                        active: true,
                        product: {
                            id: 666,
                            name: "Empanada de Carne Picante",
                            sku: "VIPIC",
                            image: ""
                        }
                    }
                ]
            },
            {
                id: "4",
                name: "segundo (combos)",
                position: 2,
                active: true,
                items: [
                    {
                        id: 5,
                        position: 1,
                        price: 100.00,
                        active: true,
                        product: {
                            id: 1768,
                            name: "4 empanadas + Bebida",
                            sku: "COMBOTEST1",
                            image: ""
                        }
                    },
                    {
                        id: 6,
                        position: 2,
                        price: 100.00,
                        active: true,
                        product: {
                            id: 1776,
                            name: "8 empanadas + 2 bebidas",
                            sku: "COMBOTEST3",
                            image: ""
                        }
                    }
                ]
            }
        ]
    },
    {
        id: "1",
        brand: {
            id: 1,
            name: "Test brand"
        },
        apps: [
            {
                app: "UE",
                appId: "999",
                active: false
            },
            {
                app: "MP",
                appId: "999",
                active: true
            },
            {
                app: "PY",
                appId: "999",
                active: false
            },
            {
                app: "RP",
                appId: "999",
                active: false
            }
        ],
        sections: [
            {
                id: "1",
                name: "sueltas",
                position: 1,
                active: true,
                items: [
                    {
                        id: 1,
                        position: 1,
                        price: 100.00,
                        active: true,
                        product: {
                            id: 666,
                            name: "Empanada de Carne Picante",
                            sku: "VIPIC",
                            image: ""
                        }
                    }
                ]
            },
            {
                id: "2",
                name: "combos",
                position: 2,
                active: true,
                items: [
                    {
                        id: 2,
                        position: 1,
                        price: 100.00,
                        active: true,
                        product: {
                            id: 1768,
                            name: "4 empanadas + Bebida",
                            sku: "COMBOTEST1",
                            image: ""
                        }
                    },
                    {
                        id: 3,
                        position: 2,
                        price: 100.00,
                        active: true,
                        product: {
                            id: 1776,
                            name: "8 empanadas + 2 bebidas",
                            sku: "COMBOTEST3",
                            image: ""
                        }
                    }
                ]
            }
        ]
    }
]