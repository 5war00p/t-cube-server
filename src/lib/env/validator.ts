import pg, { type PoolClient } from "pg";
import env from ".";

export class EnvValidator {
	async validateDatabaseConnection() {
		const { Pool } = pg;
		const pool = new Pool({
			connectionString: env.postgres.DATABASE_URL,
			connectionTimeoutMillis: 5000,
			ssl: ["local", "test"].includes(env.app.env)
				? undefined
				: { rejectUnauthorized: false },
		});

		const poolClient: PoolClient = await pool.connect();
		poolClient.release();
		await pool.end();
	}

	async validate() {
		await this.validateDatabaseConnection();
	}
}
