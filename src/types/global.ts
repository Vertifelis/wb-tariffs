import z from "zod";

export interface TariffRecord {
    date: Date;
    warehouse_name: string;
    geo_name: string;

    box_delivery_base: string;
    box_delivery_coef_expr: string;
    box_delivery_liter: string;
    box_delivery_marketplace_base: string;
    box_delivery_marketplace_coef_expr: string;
    box_delivery_marketplace_liter: string;
    box_storage_base: string;
    box_storage_coef_expr: string;
    box_storage_liter: string;

    created_at?: Date;
    updated_at?: Date;
}

export const tariffSchema = z.object({
    response: z.object({
        data: z.object({
            dtNextBox: z.string(),
            dtTillMax: z.string(),
            warehouseList: z.array(
                z.object({
                    boxDeliveryBase: z.string(),
                    boxDeliveryCoefExpr: z.string(),
                    boxDeliveryLiter: z.string(),
                    boxDeliveryMarketplaceBase: z.string(),
                    boxDeliveryMarketplaceCoefExpr: z.string(),
                    boxDeliveryMarketplaceLiter: z.string(),
                    boxStorageBase: z.string(),
                    boxStorageCoefExpr: z.string(),
                    boxStorageLiter: z.string(),
                    geoName: z.string(),
                    warehouseName: z.string(),
                }),
            ),
        }),
    }),
});

export type WBTariffResponse = z.infer<typeof tariffSchema>;
