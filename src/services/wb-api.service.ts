import { tariffSchema, WBTariffResponse } from "#types/global.js";

export class WbApiService {
    constructor(
        private apiUrl: string,
        private apiToken: string,
    ) {}

    public async fetchTariffs(): Promise<WBTariffResponse> {
        const params = new URLSearchParams({ "date": new Date().toISOString().split("T")[0] });

        const response = await fetch(this.apiUrl + `/tariffs/box?${params}`, {
            headers: {
                Authorization: this.apiToken,
            },
        });

        const data = await response.json();

        const result = await tariffSchema.parseAsync(data);

        return result;
    }
}
