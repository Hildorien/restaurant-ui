import { MenuModifierGroup } from "pages/menu/types";

export const fakeModifiers: MenuModifierGroup[] = [
    {
        id: 1,
        groupId: 1,
        position: 1,
        name: "Salsa",
        minQty: 1,
        maxQty: 1,
        options: [
            {
                id: 1,
                optionId: 1,
                name: "Tabasco",
                price: 0,
                active: true,
                position: 1,
                product: {
                    id: 1,
                    name: "Producto 1",
                    sku: "P001",
                    image: ""
                }
            },
            {
                id: 2,
                optionId: 2,
                name: "Crema al verdeo",
                price: 0,
                active: true,
                position: 2,
                product: {
                    id: 1,
                    name: "Producto 2",
                    sku: "P002",
                    image: ""
                }


            },
            {
                id: 3,
                optionId: 3,
                name: "Chimichurri",
                price: 0,
                active: true,
                position: 3,
                product: {
                    id: 1,
                    name: "Producto 3",
                    sku: "P003",
                    image: ""
                }
            }, 
        ]
    },
    {
        id: 2,
        groupId: 2,
        position: 2,
        name: "Bebida extra",
        minQty: 1,
        maxQty: 1,
        options: [
            {
                id: 4,
                optionId: 4,
                name: "Pepsi",
                price: 0,
                active: true,
                position: 1,
                product: {
                    id: 1,
                    name: "Producto 1",
                    sku: "P001",
                    image: ""
                }
            },
            {
                id: 5,
                optionId: 5,
                name: "Sprite",
                price: 0,
                active: true,
                position: 2,
                product: {
                    id: 1,
                    name: "Producto 2",
                    sku: "P002",
                    image: ""
                }
            },
            {
                id: 6,
                optionId: 6,
                name: "Fanta",
                price: 0,
                active: true,
                position: 3,
                product: {
                    id: 1,
                    name: "Producto 3",
                    sku: "P003",
                    image: ""
                }
            }, 
        ]
    }
]