import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();

const envSchema = z.object({
    NODE_ENV: z.union([z.undefined(), z.enum(["development", "production"])]),
    POSTGRES_HOST: z.union([z.undefined(), z.string()]),
    POSTGRES_PORT: z
        .string()
        .regex(/^[0-9]+$/)
        .transform((value) => parseInt(value)),
    POSTGRES_DB: z.string(),
    POSTGRES_USER: z.string(),
    POSTGRES_PASSWORD: z.string(),
    APP_PORT: z.union([
        z.undefined(),
        z
            .string()
            .regex(/^[0-9]+$/)
            .transform((value) => parseInt(value)),
    ]),
    WB_API_URL: z.string().url(),
    WB_API_KEY: z.string().jwt(),
    WB_QUERY_INTERVAL: z
        .string()
        .regex(/^[0-9]+$/)
        .transform((value) => parseInt(value)),
    GOOGLE_APPLICATION_SHEET_IDS: z
        .string()
        .transform((value) => value.split(",").map(String))
        .pipe(z.string().array()),
});

const env = envSchema.parse({
    POSTGRES_HOST: process.env.POSTGRES_HOST,
    POSTGRES_PORT: process.env.POSTGRES_PORT,
    POSTGRES_DB: process.env.POSTGRES_DB,
    POSTGRES_USER: process.env.POSTGRES_USER,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
    NODE_ENV: process.env.NODE_ENV,
    APP_PORT: process.env.APP_PORT,
    WB_API_URL: process.env.WB_API_URL,
    WB_API_KEY: process.env.WB_API_KEY,
    WB_QUERY_INTERVAL: process.env.WB_QUERY_INTERVAL,
    GOOGLE_APPLICATION_SHEET_IDS: process.env.GOOGLE_APPLICATION_SHEET_IDS,
});

export default env;
