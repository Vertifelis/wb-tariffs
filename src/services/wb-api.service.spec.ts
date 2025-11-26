import { WbApiService } from "./wb-api.service.js";
import { tariffSchema, WBTariffResponse } from "#types/global.js";

jest.mock("#types/global.js", () => ({
    tariffSchema: {
        parseAsync: jest.fn(),
    },
}));

describe("WbApiService", () => {
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
                ],
            },
        },
    };
    const API_URL = "https://api.example.com";
    const API_TOKEN = "test-token";
    let service: WbApiService;

    beforeEach(() => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date("2023-10-05T12:00:00Z"));
        service = new WbApiService(API_URL, API_TOKEN);
    });

    afterEach(() => {
        jest.useRealTimers();
        jest.clearAllMocks();
    });

    describe("fetchTariffs", () => {
        it("should call fetch with correct URL and headers", async () => {
            const mockResponse = { json: jest.fn().mockResolvedValue({}) };
            global.fetch = jest.fn().mockResolvedValue(mockResponse);

            await service.fetchTariffs();

            expect(fetch).toHaveBeenCalledWith(`${API_URL}/tariffs/box?date=2023-10-05`, { headers: { Authorization: API_TOKEN } });
        });

        it("should return parsed data when schema validation succeeds", async () => {
            const mockResponse = { json: jest.fn().mockResolvedValue(tariffsResponse) };
            global.fetch = jest.fn().mockResolvedValue(mockResponse);
            (tariffSchema.parseAsync as jest.Mock).mockResolvedValue(tariffsResponse);

            const result = await service.fetchTariffs();

            expect(result).toEqual(tariffsResponse);
            expect(tariffSchema.parseAsync).toHaveBeenCalledWith(tariffsResponse);
        });

        it("should throw when schema validation fails", async () => {
            const mockResponse = { json: jest.fn().mockResolvedValue({ data: "invalid" }) };
            global.fetch = jest.fn().mockResolvedValue(mockResponse);
            (tariffSchema.parseAsync as jest.Mock).mockRejectedValue(new Error("Invalid data"));

            await expect(service.fetchTariffs()).rejects.toThrow("Invalid data");
        });

        it("should throw on network error", async () => {
            global.fetch = jest.fn().mockRejectedValue(new Error("Network error"));

            await expect(service.fetchTariffs()).rejects.toThrow("Network error");
        });

        it("should throw when response body is not valid JSON", async () => {
            const mockResponse = {
                json: jest.fn().mockRejectedValue(new Error("Invalid JSON")),
            };
            global.fetch = jest.fn().mockResolvedValue(mockResponse);

            await expect(service.fetchTariffs()).rejects.toThrow("Invalid JSON");
        });
    });
});
