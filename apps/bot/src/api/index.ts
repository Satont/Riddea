import { NestFactory } from "@nestjs/core";
import { Transport, MicroserviceOptions } from "@nestjs/microservices";
import { Logger } from "@nestjs/common";
import { AppModule } from "./app.module";
import isDocker from "is-docker";

const logger = new Logger("BOT API");
const PORT = process.env.BOT_PORT ?? 3001;

export async function microserviceInit() {
  try {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      logger,
      options: {
        host: isDocker() ? "bot" : process.env.BOT_SERVICE_HOST ?? "localhost",
        transport: Transport.TCP,
        port: PORT,
      },
    });

    await app.listenAsync();
    logger.log(`Is listening on ${PORT} port.`);
  } catch (err) {
    logger.error(`Cannot boot bot api microservice with error:`, err.message);
  }
}
