import { OrderEvent, OrderStatus, PrintOrderCommand } from "darwinModels";

export const fakeOrderEvent: OrderEvent = {
    id: "RP-342217387",
    externalId: "RP-342217387",
    createdAt: new Date(),
    platform: "RP",
    store: {
        id: "999999999",
        externalId: "999999999"
    }
}

export const fakeOrderPrinterCommand: PrintOrderCommand = {
    id: 'RP-342217387',
    displayId: 'RP-342217387',
    platform: 'RP-Platform',
    brand: 'K-Brand',
    printerId: 'Darwin_Printer',
    date: new Date(),
    pickUpDate: new Date(),
    autoAccepted: false,
    items: [
        {
            name: 'Sándwich Club de Pollo con Papas & Franui',
            qty: 2,
            comment: 'Sin tomate, con cebolla, sin lechuga, con tomate, con extra katsup',
            subItems: [
                {
                    name: 'Gatsby Club Sandwich',
                    qty: 1,
                },
                {
                    name: 'Franui de Chocolate  con  leche',
                    qty: 1,
                },
            ],
        },
    ],
    comment: 'Esto es un comentario a nivel pedido',
};

export const fakeOrders: any[] = [
    {
        id: "PY-34221738",
        displayId: "34221738",
        externalId: "34221738",
        autoAccepted: true,
        branch: {
            id: 1,
            name: "Almagro - Bustamante"
        },
        brand: {
            id: 1,
            name: "Test Brand"
        },
        companyId: "36",
        cookingTime: 15,
        country: "AR",
        createdAt: new Date("2023-03-08T12:05:04.753Z"),
        events: {
            takenAt: new Date("2023-03-08T12:15:00Z"),
            readyAt: new Date("2023-03-08T12:40:00Z"),
            deliveredAt: new Date("2023-03-08T13:20:00Z"),
            rejectedAt: undefined,
            cancelledAt: undefined,
        },
        customer: {
            completeName: "Mariano Rocha",
            phone: "099999999999"
        },
        delivery: {
            address: "Avenida irarrazaval 2650 Depto. 200 esquina florida",
            additionalDetails: ""
        },
        deliveryMethod: "DELIVERY_BY_PLATFORM",
        paymentMethod: "CASH",
        platform: "PY",
        pricing: {
            currency: "ARS",
            charges: {
                shipping: 259,
                service: 189
            },
            totalOrder: 800,
            totalProducts: 7600,
            totalDiscounts: 259,
            totalChargesDiscount: 259
        },
        products: [
            {
                type: "PRODUCT",
                sku: "19122",
                name: "Cheeseburger Doble",
                quantity: 1,
                unitPrice: 2390,
                comment: "test comment",
                subItems: [
                    {
                        type: "EXTRA",
                        sku: "19054",
                        name: "Carne Hamburguesa",
                        quantity: 1,
                        unitPrice: 700,
                        comment: "sdjhfasjkhf",
                        subItems: []
                    }
                ]
            },
            {
                type: "PRODUCT",
                sku: "19123",
                name: "Papas Grandes",
                quantity: 1,
                unitPrice: 1500,
                comment: "test comment",
                subItems: []
            }
        ],
        store: { 
            id: "1000", 
            externalId: "110292"
        },
        trunk: {
            id: 1,
            name: "Buenos Aires"
        },
        tz: "America/Argentina/Buenos_Aires",
        status: OrderStatus.READY_FOR_PICKUP,
        observations: "Porfavor poner sobres de ketchup"
    },
    {
        id: "RP-99111222",
        displayId: "99111222",
        externalId: "99111222",
        autoAccepted: true,
        branch: {
            id: 1,
            name: "Almagro - Bustamante"
        },
        brand: {
            id: 1,
            name: "Test brand"
        },
        companyId: "36",
        cookingTime: 15,
        country: "AR",
        createdAt: new Date("2023-03-08T12:05:04.753Z"),
        events: {
            takenAt: new Date("2023-03-08T12:15:00Z"),
            readyAt: new Date("2023-03-08T12:40:00Z"),
            deliveredAt: new Date("2023-03-08T13:20:00Z"),
            rejectedAt: undefined,
            cancelledAt: undefined,
        },
        customer: {
            completeName: "Mariano Rocha",
            phone: "099999999999"
        },
        delivery: {
            address: "Avenida irarrazaval 2650 Depto. 200 esquina florida",
            additionalDetails: ""
        },
        deliveryMethod: "DELIVERY_BY_PLATFORM",
        paymentMethod: "CASH",
        platform: "RP",
        pricing: {
            currency: "ARS",
            charges: {
                shipping: 259,
                service: 189
            },
            totalOrder: 15500.20,
            totalProducts: 7600,
            totalDiscounts: 259,
            totalChargesDiscount: 259
        },
        products: [
            {
                type: "PRODUCT",
                sku: "19122",
                name: "4 empanadas y Coca",
                quantity: 1,
                unitPrice: 2390,
                comment: "test comment",
                subItems: [
                    {
                        type: "EXTRA",
                        sku: "19054",
                        name: "Empanada de carne ",
                        quantity: 2,
                        unitPrice: 700,
                        comment: "sdjhfasjkhf",
                        subItems: []
                    },
                    {
                        type: "EXTRA",
                        sku: "19054",
                        name: "Empanada de Jamon y Queso",
                        quantity: 2,
                        unitPrice: 700,
                        comment: "un comentario laaaaaaaaaaaaaaaaaaaaaaaaaaargo",
                        subItems: []
                    },
                    {
                        type: "EXTRA",
                        sku: "19054",
                        name: "Coca 250ml",
                        quantity: 2,
                        unitPrice: 700,
                        comment: "aaaaaaaaaaaaaaaaaa",
                        subItems: []
                    }
                ]
            },
        ],
        store: { 
            id: "1001", 
            externalId: "99999999"
        },
        trunk: {
            id: 1,
            name: "Buenos Aires"
        },
        tz: "America/Argentina/Buenos_Aires",
        status: OrderStatus.TAKEN
    },
    {
        id: "RP-99111444",
        displayId: "99111444",
        externalId: "99111444",
        autoAccepted: true,
        branch: {
            id: 1,
            name: "Almagro - Bustamante"
        },
        brand: {
            id: 1,
            name: "Test brand"
        },
        companyId: "36",
        cookingTime: 15,
        country: "AR",
        createdAt: new Date("2023-03-08T12:05:04.753Z"),
        events: {
            takenAt: new Date("2023-03-08T12:15:00Z"),
            readyAt: new Date("2023-03-08T12:40:00Z"),
            deliveredAt: new Date("2023-03-08T13:20:00Z"),
            rejectedAt: undefined,
            cancelledAt: undefined,
        },
        customer: {
            completeName: "Mariano Rocha",
            phone: "099999999999"
        },
        delivery: {
            address: "Avenida irarrazaval 2650 Depto. 200 esquina florida",
            additionalDetails: ""
        },
        deliveryMethod: "DELIVERY_BY_PLATFORM",
        paymentMethod: "CASH",
        platform: "RP",
        pricing: {
            currency: "ARS",
            charges: {
                shipping: 259,
                service: 189
            },
            totalOrder: 15500.20,
            totalProducts: 7600,
            totalDiscounts: 259,
            totalChargesDiscount: 259
        },
        products: [
            {
                type: "PRODUCT",
                sku: "19122",
                name: "4 empanadas y Coca",
                quantity: 1,
                unitPrice: 2390,
                comment: "test comment",
                subItems: [
                    {
                        type: "EXTRA",
                        sku: "19054",
                        name: "Empanada de carne ",
                        quantity: 2,
                        unitPrice: 700,
                        comment: "sdjhfasjkhf",
                        subItems: []
                    },
                    {
                        type: "EXTRA",
                        sku: "19054",
                        name: "Empanada de Jamon y Queso",
                        quantity: 2,
                        unitPrice: 700,
                        comment: "un comentario laaaaaaaaaaaaaaaaaaaaaaaaaaargo",
                        subItems: []
                    },
                    {
                        type: "EXTRA",
                        sku: "19054",
                        name: "Coca 250ml",
                        quantity: 2,
                        unitPrice: 700,
                        comment: "aaaaaaaaaaaaaaaaaa",
                        subItems: []
                    }
                ]
            },
        ],
        store: { 
            id: "1001", 
            externalId: "99999999"
        },
        trunk: {
            id: 1,
            name: "Buenos Aires"
        },
        tz: "America/Argentina/Buenos_Aires",
        status: OrderStatus.TAKEN
    },
    {
        id: "RP-99111666",
        displayId: "99111666",
        externalId: "99111666",
        autoAccepted: true,
        branch: {
            id: 1,
            name: "Almagro - Bustamante"
        },
        brand: {
            id: 1,
            name: "Test brand"
        },
        companyId: "36",
        cookingTime: 15,
        country: "AR",
        createdAt: new Date("2023-03-08T12:05:04.753Z"),
        events: {
            takenAt: new Date("2023-03-08T12:15:00Z"),
            readyAt: new Date("2023-03-08T12:40:00Z"),
            deliveredAt: new Date("2023-03-08T13:20:00Z"),
            rejectedAt: undefined,
            cancelledAt: undefined,
        },
        customer: {
            completeName: "Mariano Rocha",
            phone: "099999999999"
        },
        delivery: {
            address: "Avenida irarrazaval 2650 Depto. 200 esquina florida",
            additionalDetails: ""
        },
        deliveryMethod: "DELIVERY_BY_PLATFORM",
        paymentMethod: "CASH",
        platform: "RP",
        pricing: {
            currency: "ARS",
            charges: {
                shipping: 259,
                service: 189
            },
            totalOrder: 15500.20,
            totalProducts: 7600,
            totalDiscounts: 259,
            totalChargesDiscount: 259
        },
        products: [
            {
                type: "PRODUCT",
                sku: "19122",
                name: "4 empanadas y Coca",
                quantity: 1,
                unitPrice: 2390,
                comment: "test comment",
                subItems: [
                    {
                        type: "EXTRA",
                        sku: "19054",
                        name: "Empanada de carne ",
                        quantity: 2,
                        unitPrice: 700,
                        comment: "sdjhfasjkhf",
                        subItems: []
                    },
                    {
                        type: "EXTRA",
                        sku: "19054",
                        name: "Empanada de Jamon y Queso",
                        quantity: 2,
                        unitPrice: 700,
                        comment: "un comentario laaaaaaaaaaaaaaaaaaaaaaaaaaargo",
                        subItems: []
                    },
                    {
                        type: "EXTRA",
                        sku: "19054",
                        name: "Coca 250ml",
                        quantity: 2,
                        unitPrice: 700,
                        comment: "aaaaaaaaaaaaaaaaaa",
                        subItems: []
                    }
                ]
            },
        ],
        store: { 
            id: "1001", 
            externalId: "99999999"
        },
        trunk: {
            id: 1,
            name: "Buenos Aires"
        },
        tz: "America/Argentina/Buenos_Aires",
        status: OrderStatus.TAKEN
    },
    {
        id: "RP-99111777",
        displayId: "99111777",
        externalId: "99111777",
        autoAccepted: true,
        branch: {
            id: 1,
            name: "Almagro - Bustamante"
        },
        brand: {
            id: 1,
            name: "Test brand"
        },
        companyId: "36",
        cookingTime: 15,
        country: "AR",
        createdAt: new Date("2023-03-08T12:05:04.753Z"),
        events: {
            takenAt: new Date("2023-03-08T12:15:00Z"),
            readyAt: new Date("2023-03-08T12:40:00Z"),
            deliveredAt: new Date("2023-03-08T13:20:00Z"),
            rejectedAt: undefined,
            cancelledAt: undefined,
        },
        customer: {
            completeName: "Mariano Rocha",
            phone: "099999999999"
        },
        delivery: {
            address: "Avenida irarrazaval 2650 Depto. 200 esquina florida",
            additionalDetails: ""
        },
        deliveryMethod: "DELIVERY_BY_PLATFORM",
        paymentMethod: "CASH",
        platform: "RP",
        pricing: {
            currency: "ARS",
            charges: {
                shipping: 259,
                service: 189
            },
            totalOrder: 15500.20,
            totalProducts: 7600,
            totalDiscounts: 259,
            totalChargesDiscount: 259
        },
        products: [
            {
                type: "PRODUCT",
                sku: "19122",
                name: "4 empanadas y Coca",
                quantity: 1,
                unitPrice: 2390,
                comment: "test comment",
                subItems: [
                    {
                        type: "EXTRA",
                        sku: "19054",
                        name: "Empanada de carne ",
                        quantity: 2,
                        unitPrice: 700,
                        comment: "sdjhfasjkhf",
                        subItems: []
                    },
                    {
                        type: "EXTRA",
                        sku: "19054",
                        name: "Empanada de Jamon y Queso",
                        quantity: 2,
                        unitPrice: 700,
                        comment: "un comentario laaaaaaaaaaaaaaaaaaaaaaaaaaargo",
                        subItems: []
                    },
                    {
                        type: "EXTRA",
                        sku: "19054",
                        name: "Coca 250ml",
                        quantity: 2,
                        unitPrice: 700,
                        comment: "aaaaaaaaaaaaaaaaaa",
                        subItems: []
                    }
                ]
            },
        ],
        store: { 
            id: "1001", 
            externalId: "99999999"
        },
        trunk: {
            id: 1,
            name: "Buenos Aires"
        },
        tz: "America/Argentina/Buenos_Aires",
        status: OrderStatus.TAKEN
    },
    {
        id: "RP-99111555",
        displayId: "99111555",
        externalId: "99111555",
        autoAccepted: true,
        branch: {
            id: 1,
            name: "Almagro - Bustamante"
        },
        brand: {
            id: 1,
            name: "Test brand"
        },
        companyId: "36",
        cookingTime: 15,
        country: "AR",
        createdAt: new Date("2023-03-08T12:05:04.753Z"),
        events: {
            takenAt: new Date("2023-03-08T12:15:00Z"),
            readyAt: new Date("2023-03-08T12:40:00Z"),
            deliveredAt: new Date("2023-03-08T13:20:00Z"),
            rejectedAt: undefined,
            cancelledAt: undefined,
        },
        customer: {
            completeName: "Mariano Rocha",
            phone: "099999999999"
        },
        delivery: {
            address: "Avenida irarrazaval 2650 Depto. 200 esquina florida",
            additionalDetails: ""
        },
        deliveryMethod: "DELIVERY_BY_PLATFORM",
        paymentMethod: "CASH",
        platform: "RP",
        pricing: {
            currency: "ARS",
            charges: {
                shipping: 259,
                service: 189
            },
            totalOrder: 15500.20,
            totalProducts: 7600,
            totalDiscounts: 259,
            totalChargesDiscount: 259
        },
        products: [
            {
                type: "PRODUCT",
                sku: "19122",
                name: "4 empanadas y Coca",
                quantity: 1,
                unitPrice: 2390,
                comment: "test comment",
                subItems: [
                    {
                        type: "EXTRA",
                        sku: "19054",
                        name: "Empanada de carne ",
                        quantity: 2,
                        unitPrice: 700,
                        comment: "sdjhfasjkhf",
                        subItems: []
                    },
                    {
                        type: "EXTRA",
                        sku: "19054",
                        name: "Empanada de Jamon y Queso",
                        quantity: 2,
                        unitPrice: 700,
                        comment: "un comentario laaaaaaaaaaaaaaaaaaaaaaaaaaargo",
                        subItems: []
                    },
                    {
                        type: "EXTRA",
                        sku: "19054",
                        name: "Coca 250ml",
                        quantity: 2,
                        unitPrice: 700,
                        comment: "aaaaaaaaaaaaaaaaaa",
                        subItems: []
                    }
                ]
            },
        ],
        store: { 
            id: "1001", 
            externalId: "99999999"
        },
        trunk: {
            id: 1,
            name: "Buenos Aires"
        },
        tz: "America/Argentina/Buenos_Aires",
        status: OrderStatus.TAKEN
    },
    {
        id: "MP-44111222",
        displayId: "7122",
        externalId: "44111222",
        autoAccepted: false,
        branch: {
            id: 1,
            name: "Almagro - Bustamante"
        },
        brand: {
            id: 1,
            name: "Test brand"
        },
        companyId: "36",
        cookingTime: 15,
        country: "AR",
        createdAt: new Date("2023-03-08T12:05:04.753Z"),
        events: {
            takenAt: new Date("2023-03-08T12:15:00Z"),
            readyAt: new Date("2023-03-08T12:40:00Z"),
            deliveredAt: new Date("2023-03-08T13:20:00Z"),
            rejectedAt: undefined,
            cancelledAt: undefined,
        },
        customer: {
            completeName: "Mariano Rocha",
            phone: "099999999999"
        },
        delivery: {
            address: "Avenida irarrazaval 2650 Depto. 200 esquina florida",
            additionalDetails: ""
        },
        deliveryMethod: "PICKUP",
        paymentMethod: "CASH",
        platform: "MP",
        pricing: {
            currency: "ARS",
            charges: {
                shipping: 259,
                service: 189
            },
            totalOrder: 10000,
            totalProducts: 7600,
            totalDiscounts: 259,
            totalChargesDiscount: 259
        },
        products: [
            {
                type: "PRODUCT",
                sku: "19122",
                name: "Wrap vegano",
                quantity: 1,
                unitPrice: 2390,
            },
        ],
        store: { 
            id: "1001", 
            externalId: "99999999"
        },
        trunk: {
            id: 1,
            name: "Buenos Aires"
        },
        tz: "America/Argentina/Buenos_Aires",
        status: OrderStatus.NEW,
        observations: "El timbre no anda"
    },
    {
        id: "UE-01199222",
        displayId: "01199222",
        externalId: "01199222",
        autoAccepted: true,
        branch: {
            id: 1,
            name: "Almagro - Bustamante"
        },
        brand: {
            id: 1,
            name: "Test brand"
        },
        companyId: "36",
        cookingTime: 15,
        country: "AR",
        createdAt: new Date("2023-03-08T12:05:04.753Z"),
        events: {
            takenAt: new Date("2023-03-08T12:15:00Z"),
            readyAt: new Date("2023-03-08T12:40:00Z"),
            deliveredAt: new Date("2023-03-08T13:20:00Z"),
            rejectedAt: undefined,
            cancelledAt: undefined,
        },
        customer: {
            completeName: "Mariano Rocha",
            phone: "099999999999"
        },
        delivery: {
            address: "Avenida irarrazaval 2650 Depto. 200 esquina florida",
            additionalDetails: ""
        },
        deliveryMethod: "PICKUP",
        paymentMethod: "CASH",
        platform: "UE",
        pricing: {
            currency: "ARS",
            charges: {
                shipping: 259,
                service: 189
            },
            totalOrder: 7600,
            totalProducts: 7600,
            totalDiscounts: 259,
            totalChargesDiscount: 259
        },
        products: [
            {
                type: "PRODUCT",
                sku: "19122",
                name: "Papas Grandes",
                quantity: 1,
                unitPrice: 2390,
            },
        ],
        store: { 
            id: "1001", 
            externalId: "99999999"
        },
        trunk: {
            id: 1,
            name: "Buenos Aires"
        },
        tz: "America/Argentina/Buenos_Aires",
        status: OrderStatus.READY_FOR_PICKUP,
    },
    {
        id: "UE-01199223",
        displayId: "01199223",
        externalId: "01199223",
        companyId: "ABC123",
        cookingTime: 30,
        country: "ARG",
        platform: "UE",
        createdAt: new Date("2023-05-05T12:00:00Z"),
        events: {
            takenAt: new Date("2023-05-05T12:15:00Z"),
            readyAt: new Date("2023-05-05T12:40:00Z"),
            deliveredAt: new Date("2023-05-05T13:20:00Z"),
            rejectedAt: undefined,
            cancelledAt: undefined,
        },
        autoAccepted: true,
        status: OrderStatus.DELIVERED,
        cancelReason: undefined,
        rejectReason: undefined,
        paymentMethod: "credit",
        deliveryMethod: "DELIVERY_BY_PLATFORM",
        tz: "America/Argentina/Buenos_Aires",
        observations: "Please call when arriving",
        products: [
            {
                id: "PROD-001",
                name: "Product 1",
                quantity: 2,
                price: 10.5,
            },
            {
                id: "PROD-002",
                name: "Product 2",
                quantity: 1,
                price: 8.75,
            },
        ],
        store: {
            id: "STORE-123",
            externalId: "EXT-789",
        },
        brand: {
            id: 123,
            name: "Brand Name",
        },
        trunk: {
            id: 456,
            name: "Trunk Name",
        },
        branch: {
            id: 789,
            name: "Branch Name",
        },
        customer: {
            completeName: "John Doe",
            phone: "+5491123456789",
        },
        delivery: {
            address: "Av. Corrientes 1234",
            additionalDetails: "Apt. 5B",
        },
        pricing: {
            currency: "ARS",
            charges: {
                shipping: 120.0,
                service: 80.0,
            },
            totalOrder: 420.5,
            totalProducts: 29.75,
            totalDiscounts: undefined,
            totalChargesDiscount: undefined,
        },
        
    },
    {
        id: "RP-99111888",
        displayId: "99111888",
        externalId: "99111888",
        autoAccepted: true,
        branch: {
            id: 1,
            name: "Almagro - Bustamante"
        },
        brand: {
            id: 1,
            name: "Test brand"
        },
        companyId: "36",
        cookingTime: 15,
        country: "AR",
        createdAt: new Date("2023-03-08T12:05:04.753Z"),
        events: {
            takenAt: new Date("2023-03-08T12:15:00Z"),
            readyAt: new Date("2023-03-08T12:40:00Z"),
            deliveredAt: new Date("2023-03-08T13:20:00Z"),
            rejectedAt: undefined,
            cancelledAt: undefined,
        },
        customer: {
            completeName: "Mariano Rocha",
            phone: "099999999999"
        },
        delivery: {
            address: "Avenida irarrazaval 2650 Depto. 200 esquina florida",
            additionalDetails: ""
        },
        deliveryMethod: "DELIVERY_BY_PLATFORM",
        paymentMethod: "CASH",
        platform: "RP",
        pricing: {
            currency: "ARS",
            charges: {
                shipping: 259,
                service: 189
            },
            totalOrder: 15500.20,
            totalProducts: 7600,
            totalDiscounts: 259,
            totalChargesDiscount: 259
        },
        products: [
            {
                type: "PRODUCT",
                sku: "19122",
                name: "4 empanadas y Coca",
                quantity: 1,
                unitPrice: 2390,
                comment: "test comment",
                subItems: [
                    {
                        type: "EXTRA",
                        sku: "19054",
                        name: "Empanada de carne ",
                        quantity: 2,
                        unitPrice: 700,
                        comment: "sdjhfasjkhf",
                        subItems: []
                    },
                    {
                        type: "EXTRA",
                        sku: "19054",
                        name: "Empanada de Jamon y Queso",
                        quantity: 2,
                        unitPrice: 700,
                        comment: "un comentario laaaaaaaaaaaaaaaaaaaaaaaaaaargo",
                        subItems: []
                    },
                    {
                        type: "EXTRA",
                        sku: "19054",
                        name: "Coca 250ml",
                        quantity: 2,
                        unitPrice: 700,
                        comment: "aaaaaaaaaaaaaaaaaa",
                        subItems: []
                    }
                ]
            },
        ],
        store: { 
            id: "1001", 
            externalId: "99999999"
        },
        trunk: {
            id: 1,
            name: "Buenos Aires"
        },
        tz: "America/Argentina/Buenos_Aires",
        status: OrderStatus.TAKEN
    },
    {
        id: "RP-99112888",
        displayId: "99112888",
        externalId: "99112888",
        autoAccepted: true,
        branch: {
            id: 1,
            name: "Almagro - Bustamante"
        },
        brand: {
            id: 1,
            name: "Test brand"
        },
        companyId: "36",
        cookingTime: 15,
        country: "AR",
        createdAt: new Date("2023-03-08T12:05:04.753Z"),
        events: {
            takenAt: new Date("2023-03-08T12:15:00Z"),
            readyAt: new Date("2023-03-08T12:40:00Z"),
            deliveredAt: new Date("2023-03-08T13:20:00Z"),
            rejectedAt: undefined,
            cancelledAt: undefined,
        },
        customer: {
            completeName: "Mariano Rocha",
            phone: "099999999999"
        },
        delivery: {
            address: "Avenida irarrazaval 2650 Depto. 200 esquina florida",
            additionalDetails: ""
        },
        deliveryMethod: "DELIVERY_BY_PLATFORM",
        paymentMethod: "CASH",
        platform: "RP",
        pricing: {
            currency: "ARS",
            charges: {
                shipping: 259,
                service: 189
            },
            totalOrder: 15500.20,
            totalProducts: 7600,
            totalDiscounts: 259,
            totalChargesDiscount: 259
        },
        products: [
            {
                type: "PRODUCT",
                sku: "19122",
                name: "4 empanadas y Coca",
                quantity: 1,
                unitPrice: 2390,
                comment: "test comment",
                subItems: [
                    {
                        type: "EXTRA",
                        sku: "19054",
                        name: "Empanada de carne ",
                        quantity: 2,
                        unitPrice: 700,
                        comment: "sdjhfasjkhf",
                        subItems: []
                    },
                    {
                        type: "EXTRA",
                        sku: "19054",
                        name: "Empanada de Jamon y Queso",
                        quantity: 2,
                        unitPrice: 700,
                        comment: "un comentario laaaaaaaaaaaaaaaaaaaaaaaaaaargo",
                        subItems: []
                    },
                    {
                        type: "EXTRA",
                        sku: "19054",
                        name: "Coca 250ml",
                        quantity: 2,
                        unitPrice: 700,
                        comment: "aaaaaaaaaaaaaaaaaa",
                        subItems: []
                    }
                ]
            },
        ],
        store: { 
            id: "1001", 
            externalId: "99999999"
        },
        trunk: {
            id: 1,
            name: "Buenos Aires"
        },
        tz: "America/Argentina/Buenos_Aires",
        status: OrderStatus.TAKEN
    },
]

export const fakeOrdersPrintCommands: PrintOrderCommand[] = [
    {
        id: "PY-141153306",
        displayId: "Pedidos Ya 141153306",
        date: new Date("2023-03-21T17:15:09.948Z"),
        autoAccepted: true,
        pickUpDate: new Date("2023-03-21T17:50:09.948Z"),
        platform: "PY",
        brand: "Test brand",
        items: [
            {
                name: "Test item",
                qty: 1,
                comment: "",
            }
        ],
        printerId: "1-1"
    },
    {
        id: "PY-141153307",
        displayId: "Pedidos Ya 141153307",
        date: new Date("2023-03-21T17:15:09.948Z"),
        autoAccepted: true,
        pickUpDate: new Date("2023-03-21T17:50:09.948Z"),
        platform: "PY",
        brand: "Test brand",
        items: [
            {
                name: "Test item",
                qty: 1,
                comment: "",
            }
        ],
        printerId: "1-1"
    },
    {
        id: "PY-141153308",
        displayId: "Pedidos Ya 141153308",
        date: new Date("2023-03-21T17:15:09.948Z"),
        autoAccepted: true,
        pickUpDate: new Date("2023-03-21T17:50:09.948Z"),
        platform: "PY",
        brand: "Test brand",
        items: [
            {
                name: "Test item",
                qty: 1,
                comment: "",
            }
        ],
        printerId: "1-1"
    },
    {
        id: "PY-141153309",
        displayId: "Pedidos Ya 141153309",
        date: new Date("2023-03-21T17:15:09.948Z"),
        autoAccepted: true,
        pickUpDate: new Date("2023-03-21T17:50:09.948Z"),
        platform: "PY",
        brand: "Test brand",
        items: [
            {
                name: "Test item",
                qty: 1,
                comment: "",
            }
        ],
        printerId: "1-1"
    },
    {
        id: "PY-141153310",
        displayId: "Pedidos Ya 141153310",
        date: new Date("2023-03-21T17:15:09.948Z"),
        autoAccepted: true,
        pickUpDate: new Date("2023-03-21T17:50:09.948Z"),
        platform: "PY",
        brand: "Test brand",
        items: [
            {
                name: "Test item",
                qty: 1,
                comment: "",
            }
        ],
        printerId: "1-1"
    },
    {
        id: "PY-141153311",
        displayId: "Pedidos Ya 141153311",
        date: new Date("2023-03-21T17:15:09.948Z"),
        autoAccepted: true,
        pickUpDate: new Date("2023-03-21T17:50:09.948Z"),
        platform: "PY",
        brand: "Test brand",
        items: [
            {
                name: "Test item",
                qty: 1,
                comment: "",
            }
        ],
        printerId: "1-1"
    },
    {
        id: "PY-141153312",
        displayId: "Pedidos Ya 141153312",
        date: new Date("2023-03-21T17:15:09.948Z"),
        autoAccepted: true,
        pickUpDate: new Date("2023-03-21T17:50:09.948Z"),
        platform: "PY",
        brand: "Test brand",
        items: [
            {
                name: "Test item",
                qty: 1,
                comment: "",
            }
        ],
        printerId: "1-1"
    },
    {
        id: "PY-141153313",
        displayId: "Pedidos Ya 141153313",
        date: new Date("2023-03-21T17:15:09.948Z"),
        autoAccepted: true,
        pickUpDate: new Date("2023-03-21T17:50:09.948Z"),
        platform: "PY",
        brand: "Test brand",
        items: [
            {
                name: "Test item",
                qty: 1,
                comment: "",
            }
        ],
        printerId: "1-1"
    },
    {
        id: "PY-141153314",
        displayId: "Pedidos Ya 141153314",
        date: new Date("2023-03-21T17:15:09.948Z"),
        autoAccepted: true,
        pickUpDate: new Date("2023-03-21T17:50:09.948Z"),
        platform: "PY",
        brand: "Test brand",
        items: [
            {
                name: "Test item",
                qty: 1,
                comment: "",
            }
        ],
        printerId: "1-1"
    },
    {
        id: "PY-141153315",
        displayId: "Pedidos Ya 141153315",
        date: new Date("2023-03-21T17:15:09.948Z"),
        autoAccepted: true,
        pickUpDate: new Date("2023-03-21T17:50:09.948Z"),
        platform: "PY",
        brand: "Test brand",
        items: [
            {
                name: "Test item",
                qty: 1,
                comment: "",
            }
        ],
        printerId: "1-1"
    },
];

export function generateRandomPrintOrderCommands() {
    let orderCommands: PrintOrderCommand[] = [];
    for (const orderCommand of fakeOrdersPrintCommands) {
        const randomId = "PY-" + Math.floor((Math.random() * (100000 - 1) + 1)).toString();
        orderCommands.push(
            {
                ...orderCommand,
                id: randomId,
                displayId: "Pedidos Ya " + randomId,                
            }
        )
    }
    return new Promise((resolve, reject) => {
        return resolve({ data: orderCommands })
    });
}