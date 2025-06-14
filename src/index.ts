import { EnvValidator } from "./lib/env/validator";
import { app, prisma } from "./server";

const main = async () => {
	const port = Number(process.env.PORT) || 3000;
	app.listen({ port }, (err, address) => {
		if (err) {
			console.error(err);
			process.exit(1);
		}
		console.log(`🚀 Server running on ${address}`);
	});
};

new EnvValidator()
	.validate()
	.then(main)
	.catch(async (e) => {
		console.error(e);
		console.error("Environment validation failed!");
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
