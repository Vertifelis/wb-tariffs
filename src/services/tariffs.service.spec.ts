import { TariffsService } from "./tariffs.service.js";
import { TariffRecord, WBTariffResponse } from "#types/global.js";

describe("TariffsService", () => {
    const date = new Date("2023-10-05T12:00:00Z");
    const tariffsResponse: WBTariffResponse = {
        "response": {
            "data": {
                "dtNextBox": "",
                "dtTillMax": "2025-11-27",
                "warehouseList": [
                    {
                        "boxDeliveryBase": "46",
                        "boxDeliveryCoefExpr": "100",
                        "boxDeliveryLiter": "14",
                        "boxDeliveryMarketplaceBase": "-",
                        "boxDeliveryMarketplaceCoefExpr": "-",
                        "boxDeliveryMarketplaceLiter": "-",
                        "boxStorageBase": "0,07",
                        "boxStorageCoefExpr": "100",
                        "boxStorageLiter": "0,07",
                        "geoName": "",
                        "warehouseName": "Цифровой склад",
                    },
                    {
                        "boxDeliveryBase": "89,7",
                        "boxDeliveryCoefExpr": "195",
                        "boxDeliveryLiter": "27,3",
                        "boxDeliveryMarketplaceBase": "89,7",
                        "boxDeliveryMarketplaceCoefExpr": "195",
                        "boxDeliveryMarketplaceLiter": "27,3",
                        "boxStorageBase": "0,1",
                        "boxStorageCoefExpr": "145",
                        "boxStorageLiter": "0,1",
                        "geoName": "Центральный федеральный округ",
                        "warehouseName": "Цифровой склад 2",
                    },
                ],
            },
        },
    };
    const tariffsRecords: TariffRecord[] = [
        {
            date: new Date("2023-10-05T12:00:00Z"),
            warehouse_name: "Цифровой склад",
            geo_name: "",
            box_delivery_base: "46",
            box_delivery_coef_expr: "100",
            box_delivery_liter: "14",
            box_delivery_marketplace_base: "-",
            box_delivery_marketplace_coef_expr: "-",
            box_delivery_marketplace_liter: "-",
            box_storage_base: "0,07",
            box_storage_coef_expr: "100",
            box_storage_liter: "0,07",
        },
        {
            date: new Date("2023-10-05T12:00:00Z"),
            warehouse_name: "Цифровой склад 2",
            geo_name: "Центральный федеральный округ",
            box_delivery_base: "89,7",
            box_delivery_coef_expr: "195",
            box_delivery_liter: "27,3",
            box_delivery_marketplace_base: "89,7",
            box_delivery_marketplace_coef_expr: "195",
            box_delivery_marketplace_liter: "27,3",
            box_storage_base: "0,1",
            box_storage_coef_expr: "145",
            box_storage_liter: "0,1",
        },
    ];
    let service: TariffsService;

    beforeEach(() => {
        jest.useFakeTimers();
        service = new TariffsService();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    describe("convertResponseToRecords", () => {
        it("should convert response to tariff records with current date", () => {
            jest.setSystemTime(date);

            const records = service.convertResponseToRecords(tariffsResponse);

            expect(records).toHaveLength(2);
            expect(records[0]).toEqual(tariffsRecords[0]);
            expect(records[1]).toEqual(tariffsRecords[1]);
        });
    });

    describe("convertTariffsToExcel", () => {
        it("should add headers and sort by coefficients", () => {
            const result = service.convertTariffsToExcel(tariffsRecords);

            expect(result[0]).toEqual([
                "Warehouse Name",
                "Geo Name",
                "Box Delivery Base",
                "Box Delivery Coef Expr",
                "Box Delivery Liter",
                "Box Delivery Marketplace Base",
                "Box Delivery Marketplace Coef Expr",
                "Box Delivery Marketplace Liter",
                "Box Storage Base",
                "Box Storage Coef Expr",
                "Box Storage Liter",
            ]);
            expect(result[1]).toEqual(["Цифровой склад", "", "46", "100", "14", "-", "-", "-", "0,07", "100", "0,07"]);
            expect(result[2]).toEqual(["Цифровой склад 2", "Центральный федеральный округ", "89,7", "195", "27,3", "89,7", "195", "27,3", "0,1", "145", "0,1"]);
        });
    });
});
