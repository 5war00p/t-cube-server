import type { FastifyInstance } from "fastify";
import { prisma } from "../server";
import { comparePasswords, hashPassword } from "../utils/hash";

export const authRoutes = (app: FastifyInstance) => {
	app.post("/signup", async (req, reply) => {
		const { email, password } = req.body as {
			email: string;
			password: string;
		};
		const existing = await prisma.user.findUnique({ where: { email } });

		if (existing) {
			return reply.code(400).send({ message: "Username already exists" });
		}

		const hashed = await hashPassword(password);

		const user = await prisma.user.create({
			data: { email, password: hashed },
		});

		return reply.code(201).send({ id: user.id, username: user.email });
	});

	app.post("/signin", async (req, reply) => {
		const { email, password } = req.body as {
			email: string;
			password: string;
		};

		const user = await prisma.user.findUnique({ where: { email } });
		if (!user || !(await comparePasswords(password, user.password))) {
			return reply.code(401).send({ message: "Invalid credentials" });
		}

		const token = app.jwt.sign({ id: user.id, username: user.email });
		return reply.send({ token });
	});

	app.post("/forgot-password", async (req, reply) => {
		const { email } = req.body as { email: string };
		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) {
			return reply.code(404).send({ message: "User not found" });
		}

		// In production, generate and email a real token
		const resetToken = app.jwt.sign({ id: user.id }, { expiresIn: "15m" });
		console.log(
			`🔗 Password reset link: https://yourapp.com/reset-password?token=${resetToken}`,
		);

		return reply.send({ message: "Password reset email sent (mocked)" });
	});

	app.post("/reset-password", async (req, reply) => {
		const { token, newPassword } = req.body as {
			token: string;
			newPassword: string;
		};
		try {
			const decoded = app.jwt.verify(token) as { id: string };
			const hashed = await hashPassword(newPassword);
			await prisma.user.update({
				where: { id: decoded.id },
				data: { password: hashed },
			});
			return reply.send({ message: "Password reset successful" });
		} catch (err) {
			return reply.code(400).send({ message: "Invalid or expired token" });
		}
	});
};
