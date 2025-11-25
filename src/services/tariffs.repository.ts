import knex from "#postgres/knex.js";
import { TariffRecord } from "#types/global.js";

export class TariffsRepository {
    public async upsertTariffs(tariffs: TariffRecord[]): Promise<number[]> {
        return await knex("tariffs").insert(tariffs).onConflict(["date", "warehouse_name"]).merge();
    }
}
