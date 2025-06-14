import "dotenv/config";
import { z } from "zod";

export enum ENVIRONMENT {
	LOCAL = "local",
	DEV = "dev",
	PROD = "prod",
	TEST = "test",
}

const envSchema = z.object({
	ENVIRONMENT: z.enum(Object.values(ENVIRONMENT) as [string, ...string[]]),
	PORT: z.string().transform(Number),

	DATABASE_URL: z.string().url("Invalid DATABASE_URL format"),

	SALT: z
		.string()
		.base64("Not a valid base64 string")
		.transform((x) => Buffer.from(x, "base64").toString("utf-8")),
});

const env = envSchema.parse(process.env);
const envObject = Object.freeze({
	app: {
		env: env.ENVIRONMENT,
		port: env.PORT,
	},
	postgres: {
		DATABASE_URL: env.DATABASE_URL,
	},
	auth: {
		salt: env.SALT,
	},
});

export default envObject;
