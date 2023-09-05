import { OperationalMetricBrand, OperationalMetricType } from "redux/operationalMetrics/types";

export const fakeMetrics: OperationalMetricBrand[] = 
[   
    {
        brandName: "Test Brand",
        isZombie: false,
        metrics: [
            {
                name: OperationalMetricType.SCORING,
                value: 4.3,
                lastMonthValue: 4.0,
                variation: 0.3,
            },
            {
                name: OperationalMetricType.CANCELLATIONS,
                value: 3,
                lastMonthValue: 1,
                variation: -2, 
            },
            {
                name: OperationalMetricType.COOKING_TIME,
                value: 20,
                lastMonthValue: 20,
                variation: 0,
            },
            {
                name: OperationalMetricType.AVAILABILITY,
            },
            {
                name: OperationalMetricType.PRODUCT_AVAILABILITY,
                value: 98,
                lastMonthValue: 95,
                variation: 3,
            },
        ]
    },
    {
        brandName: "Test Brand 2",
        isZombie: false,
        metrics: [
            {
                name: OperationalMetricType.SCORING,
                value: 4.0,
                lastMonthValue: 3.6,
                variation: 0.4,
            },
            {
                name: OperationalMetricType.CANCELLATIONS,
                value: 5,
                lastMonthValue: 6,
                variation: 1, 
            },
            {
                name: OperationalMetricType.COOKING_TIME,
                value: 25,
                lastMonthValue: 21,
                variation: 3,
            },
            {
                name: OperationalMetricType.AVAILABILITY,
            },
            {
                name: OperationalMetricType.PRODUCT_AVAILABILITY,
            },
        ]
    },
    {
        brandName: "Operador Nuevo",
        isZombie: false,
        metrics: [
            {
                name: OperationalMetricType.SCORING,
                value: 4,
                lastMonthValue: 3,
                variation: 1,
            },
            {
                name: OperationalMetricType.CANCELLATIONS,
                value: undefined,
                lastMonthValue: undefined,
                variation: undefined, 
            },
            {
                name: OperationalMetricType.COOKING_TIME,
                value: 15,
                lastMonthValue: undefined,
                variation: 3,
            },
            {
                name: OperationalMetricType.AVAILABILITY,
                value: undefined,
                lastMonthValue: 95,
                variation: 3,
            },
            {
                name: OperationalMetricType.PRODUCT_AVAILABILITY,
                value: 85,
                lastMonthValue: 90,
                variation: -5,
            },
        ]
    }

]
