import { PrismaClient } from "@prisma/client";
import Fastify from "fastify";
import jwtPlugin from "./plugins/jwt";
import { authRoutes } from "./routes/auth";
import { userRoutes } from "./routes/user";

export const prisma = new PrismaClient();
export const app = Fastify();

app.get("/ping", async () => {
	return "pong";
});

app.register(authRoutes, { prefix: "/auth" });

// Private routes
app.register(jwtPlugin);

app.register(userRoutes, { prefix: "/user" });
