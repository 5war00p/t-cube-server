import type { FastifyInstance } from "fastify";

export const userRoutes = async (app: FastifyInstance) => {
	app.get("/", (_, replay) => {
		replay.send("Welcome to the Fastify server!");
	});
};
