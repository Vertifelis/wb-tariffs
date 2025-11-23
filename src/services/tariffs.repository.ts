import knex from "#postgres/knex.js";
import { TariffRecord } from "#types/global.js";

export class TariffsRepository {
    public async upsertTariffs(tariffs: TariffRecord[]): Promise<number[]> {
        return await knex("tariffs").insert(tariffs).onConflict(["date", "warehouse_name"]).merge();
    }

    public async getSortedTariffs(): Promise<TariffRecord[]> {
        return await knex("tariffs")
            .select("*")
            .orderBy("box_delivery_coef_expr", "asc")
            .orderBy("box_delivery_marketplace_coef_expr", "asc")
            .orderBy("box_storage_coef_expr", "asc");
    }
}
