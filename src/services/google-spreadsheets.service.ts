import { sheets_v4 } from "@googleapis/sheets";
import { GoogleAuth } from "google-auth-library";

export class GoogleSpreadsheetsService {
    private sheets: sheets_v4.Sheets;

    constructor() {
        const auth = new GoogleAuth({
            keyFile: "google_key.json",
            scopes: "https://www.googleapis.com/auth/spreadsheets",
        });

        this.sheets = new sheets_v4.Sheets({ auth });
    }

    public async syncTariffSpreadsheets(spreadsheetIds: string[], values: unknown[][], range: string): Promise<void> {
        for (const spreadsheetId of spreadsheetIds) {
            this.updateSpreadsheet(spreadsheetId, values, range);
        }
    }

    private async updateSpreadsheet(spreadsheetId: string, values: unknown[][], range: string) {
        return await this.sheets.spreadsheets.values.update({
            spreadsheetId,
            range,
            valueInputOption: "RAW",
            requestBody: { values },
        });
    }
}
