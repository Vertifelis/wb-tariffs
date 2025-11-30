import { migrate, seed } from "#postgres/knex.js";
import env from "#config/env/env.js";
import { GoogleSpreadsheetsService } from "#services/google-spreadsheets.service.js";
import { SchedulerService } from "#services/scheduler.service.js";
import { TariffsRepository } from "#services/tariffs.repository.js";
import { WbApiService } from "#services/wb-api.service.js";
import { TariffsService } from "#services/tariffs.service.js";
import { GoogleAuth } from "google-auth-library";
import { sheets_v4 } from "@googleapis/sheets";

async function runApplication(): Promise<void> {
    await migrate.latest();
    await seed.run();

    console.log("All migrations and seeds have been run");

    const schedulerService = new SchedulerService();
    const wbApiService = new WbApiService(env.WB_API_URL, env.WB_API_KEY);
    const tariffsService = new TariffsService();
    const tariffsRepository = new TariffsRepository();

    const auth = new GoogleAuth({
        keyFile: env.GOOGLE_APPLICATION_CREDENTIALS,
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });
    const spreadsheetService = new GoogleSpreadsheetsService(new sheets_v4.Sheets({ auth }));

    schedulerService.scheduleTask(async () => {
        const tariffsData = await wbApiService.fetchTariffs();

        const tariffs = tariffsService.convertResponseToRecords(tariffsData);

        await tariffsRepository.upsertTariffs(tariffs);

        const tariffsExcel = tariffsService.convertTariffsToExcel(tariffs);

        await spreadsheetService.syncTariffSpreadsheets(env.GOOGLE_APPLICATION_SHEET_IDS, tariffsExcel, "stocks_coefs");
    }, env.WB_QUERY_INTERVAL * 1000);

    process.on("uncaughtException", (error) => {
        console.error(`Uncaught exception: ${error}`);
        process.exit(1);
    });

    process.on("unhandledRejection", (reason, promise) => {
        console.error("Unhandled rejection at: ", promise);
        console.error("Reason: ", reason);
        process.exit(1);
    });
}

try {
    void runApplication();
} catch (error) {
    console.error("Startup failure: ", error);
}
