/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
    return knex.schema.createTable("tariffs", function (table) {
        table.date("date").notNullable();
        table.string("warehouse_name").notNullable();
        table.string("geo_name");

        table.string("box_delivery_base");
        table.string("box_delivery_coef_expr");
        table.string("box_delivery_liter");
        table.string("box_delivery_marketplace_base");
        table.string("box_delivery_marketplace_coef_expr");
        table.string("box_delivery_marketplace_liter");
        table.string("box_storage_base");
        table.string("box_storage_coef_expr");
        table.string("box_storage_liter");

        table.timestamps(true, true);

        table.primary(["date", "warehouse_name"]);
    });
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
    return knex.schema.dropTable("tariffs");
}
