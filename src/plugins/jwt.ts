import fp from "fastify-plugin";
import type { FastifyReply } from "fastify/types/reply";
import type { FastifyRequest } from "fastify/types/request";

export default fp(async (fastify) => {
	fastify.register(import("@fastify/jwt"), {
		secret: process.env.JWT_SECRET || "supersecret", // replace in prod
	});

	fastify.addHook(
		"onRequest",
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				await request.jwtVerify();
			} catch (err) {
				reply.send(err);
			}
		},
	);

	// fastify.decorate(
	// 	"authenticate",
	// 	async (request: FastifyRequest, reply: FastifyReply) => {
	// 		try {
	// 			await request.jwtVerify();
	// 		} catch (err) {
	// 			reply.send(err);
	// 		}
	// 	},
	// );
});
