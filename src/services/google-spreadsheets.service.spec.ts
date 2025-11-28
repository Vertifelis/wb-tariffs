import { GoogleAuth } from "google-auth-library";
import { GoogleSpreadsheetsService } from "./google-spreadsheets.service.js";
import { sheets_v4 } from "@googleapis/sheets";

jest.mock("google-auth-library", () => ({
    GoogleAuth: jest.fn(),
}));
jest.mock("@googleapis/sheets", () => ({
    sheets_v4: {
        Sheets: jest.fn(() => ({
            spreadsheets: {
                values: {
                    update: jest.fn(),
                },
                get: jest
                    .fn()
                    .mockImplementationOnce(() => ({
                        data: {
                            sheets: [{ properties: { title: "1" } }],
                        },
                    }))
                    .mockImplementationOnce(() => ({
                        data: {
                            sheets: [{ properties: { title: "1" } }, { properties: { title: "Sheet1" } }],
                        },
                    })),
                batchUpdate: jest.fn(),
            },
        })),
    },
}));

describe("GoogleSpreadsheetService", () => {
    let service: GoogleSpreadsheetsService;
    let googleSpreadsheetsMock: sheets_v4.Sheets;
    let auth: GoogleAuth;
    const spreadsheetIds = ["1Q6Jja_qss_wCIYdUlTVUSxjvdeTy1wQ0IAdVHJVclOA", "16um0sXLAH5mXtm5KPf8NPrEu4QsNkdbzLpBG6dJjHC8"];
    const range = "Sheet1!A1:B2";
    const values = [
        ["1", "2"],
        ["3", "4"],
    ];

    beforeEach(() => {
        auth = new GoogleAuth({
            keyFile: "google_key.json",
            scopes: "https://www.googleapis.com/auth/spreadsheets",
        });
        googleSpreadsheetsMock = new sheets_v4.Sheets({ auth });
        service = new GoogleSpreadsheetsService(googleSpreadsheetsMock);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("syncTariffSpreadsheets", () => {
        it("should update values in spreadsheet", async () => {
            await service.syncTariffSpreadsheets([spreadsheetIds[0]], values, range);

            expect(googleSpreadsheetsMock.spreadsheets.values.update).toHaveBeenCalledTimes(1);
            expect(googleSpreadsheetsMock.spreadsheets.values.update).toHaveBeenCalledWith({
                spreadsheetId: spreadsheetIds[0],
                range,
                valueInputOption: "RAW",
                requestBody: { values },
            });
        });
        it("should update values in multiple spreadsheets", async () => {
            await service.syncTariffSpreadsheets(spreadsheetIds, values, range);

            expect(googleSpreadsheetsMock.spreadsheets.values.update).toHaveBeenCalledTimes(2);
            expect(googleSpreadsheetsMock.spreadsheets.values.update).toHaveBeenNthCalledWith(1, {
                spreadsheetId: spreadsheetIds[1],
                range,
                valueInputOption: "RAW",
                requestBody: { values },
            });
            expect(googleSpreadsheetsMock.spreadsheets.values.update).toHaveBeenNthCalledWith(2, {
                spreadsheetId: spreadsheetIds[0],
                range,
                valueInputOption: "RAW",
                requestBody: { values },
            });
        });
        it("should create sheet if not exists", async () => {
            const sheetName = range.split("!")[0];

            await service.syncTariffSpreadsheets(spreadsheetIds, values, range);

            expect(googleSpreadsheetsMock.spreadsheets.batchUpdate).toHaveBeenCalledTimes(1);
            expect(googleSpreadsheetsMock.spreadsheets.batchUpdate).toHaveBeenCalledWith({
                spreadsheetId: spreadsheetIds[0],
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
        });
        it("should not create sheet if exists", async () => {
            const sheetName = range.split("!")[0];

            await service.syncTariffSpreadsheets(spreadsheetIds, values, range);

            expect(googleSpreadsheetsMock.spreadsheets.batchUpdate).toHaveBeenCalledTimes(1);
            expect(googleSpreadsheetsMock.spreadsheets.batchUpdate).toHaveBeenCalledWith({
                spreadsheetId: spreadsheetIds[0],
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
        });
    });
});
