import { sheets_v4 } from "@googleapis/sheets";

export class GoogleSpreadsheetsService {
    constructor(private sheets: sheets_v4.Sheets) {}

    public async syncTariffSpreadsheets(spreadsheetIds: string[], values: unknown[][], range: string) {
        const jobs = spreadsheetIds.map((spreadsheetId) => this.updateSpreadsheet(spreadsheetId, values, range));

        const result = await Promise.allSettled(jobs);

        for (const promise of result) {
            if (promise.status === "rejected") {
                console.error(promise.reason);
            }
        }
    }

    private async createSheetIfNotExists(spreadsheetId: string, sheetName: string) {
        const response = await this.sheets.spreadsheets.get({
            spreadsheetId: spreadsheetId,
            fields: "sheets.properties.title",
        });

        const sheetsInSpreadsheet = response.data.sheets;
        if (!sheetsInSpreadsheet) {
            throw new Error(`Failed to fetch sheets' title data for spreadsheet with ID: ${spreadsheetId}`);
        }

        const sheetExists = sheetsInSpreadsheet.some((sheet) => sheet.properties?.title === sheetName);
        if (sheetExists) {
            return;
        }

        await this.sheets.spreadsheets.batchUpdate({
            spreadsheetId,
            requestBody: {
                requests: [
                    {
                        "addSheet": {
                            "properties": {
                                "title": sheetName,
                            },
                        },
                    },
                ],
            },
        });
    }

    private async updateSpreadsheet(spreadsheetId: string, values: unknown[][], range: string) {
        const sheetName = range.split("!")[0];

        await this.createSheetIfNotExists(spreadsheetId, sheetName);

        return await this.sheets.spreadsheets.values.update({
            spreadsheetId,
            range,
            valueInputOption: "RAW",
            requestBody: { values },
        });
    }
}
