import { TariffRecord, WBTariffResponse } from "#types/global.js";

export class TariffsService {
    public convertResponseToRecords(res: WBTariffResponse): TariffRecord[] {
        const currentDate = new Date();

        return res.response.data.warehouseList.map((warehouse) => {
            return {
                date: currentDate,
                warehouse_name: warehouse.warehouseName,
                geo_name: warehouse.geoName,
                box_delivery_base: warehouse.boxDeliveryBase,
                box_delivery_coef_expr: warehouse.boxDeliveryCoefExpr,
                box_delivery_liter: warehouse.boxDeliveryLiter,
                box_delivery_marketplace_base: warehouse.boxDeliveryMarketplaceBase,
                box_delivery_marketplace_coef_expr: warehouse.boxDeliveryMarketplaceCoefExpr,
                box_delivery_marketplace_liter: warehouse.boxDeliveryMarketplaceLiter,
                box_storage_base: warehouse.boxStorageBase,
                box_storage_coef_expr: warehouse.boxStorageCoefExpr,
                box_storage_liter: warehouse.boxStorageLiter,
            };
        });
    }

    public convertTariffsToExcel(tariffs: TariffRecord[]): unknown[][] {
        const tariffSheetHeaders = [
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
        ];

        const sortCoefficients = (t1: string, t2: string) => {
            if (t1 === "-" && t2 === "-") return 0;
            if (t1 !== "-" && t2 === "-") return 1;
            if (t1 === "-" && t2 !== "-") return -1;
            return Number(t1) - Number(t2);
        };

        tariffs.sort((t1, t2) => {
            return (
                sortCoefficients(t1.box_delivery_coef_expr, t2.box_delivery_coef_expr) ||
                sortCoefficients(t1.box_delivery_marketplace_coef_expr, t2.box_delivery_marketplace_coef_expr) ||
                sortCoefficients(t1.box_storage_coef_expr, t2.box_storage_coef_expr)
            );
        });

        const tariffsExcel = tariffs.map((tariff) => {
            return [
                tariff.warehouse_name,
                tariff.geo_name,
                tariff.box_delivery_base,
                tariff.box_delivery_coef_expr,
                tariff.box_delivery_liter,
                tariff.box_delivery_marketplace_base,
                tariff.box_delivery_marketplace_coef_expr,
                tariff.box_delivery_marketplace_liter,
                tariff.box_storage_base,
                tariff.box_storage_coef_expr,
                tariff.box_storage_liter,
            ];
        });

        tariffsExcel.unshift(tariffSheetHeaders);

        return tariffsExcel;
    }
}
