import dotenv from "dotenv";
import { Command } from "commander";

const program = new Command();
program
  .option("-m, --mode <mode>", "Modo de trabajo", "production")
  .option("-p <port>", "Port on server", 8080);

program.parse();

dotenv.config({
  path: program.opts().mode === "dev" ? "./.env.dev" : "./.env.prod",
});

export default {
  app: {
    PORT: process.env.PORT || 8080,
    PERSISTENCE: process.env.PERSISTENCE || 'MONGO',
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  },
  mongo: {
    URL: process.env.MONGO_URL || "localhost:27017",
  },
  jwt: {
    COOKIE: process.env.JWT_COOKIE,
    SECRET: process.env.JWT_SECRET,
  },
  google: {
    CLIENT: process.env.GOOGLE_CLIENT || "test",
    SECRET: process.env.GOOGLE_SECRET,
    KEY_FILE: process.env.GOOGLE_KEY_FILE,
    BUCKET_NAME: process.env.GOOGLE_BUCKET_NAME
  }, 
  mailer: {
    USER: process.env.MAILER_USER,
    PWD: process.env.MAILER_PASSWORD
  },
  logging: {
    LEVEL: process.env.LOGGING_LEVEL,
  }
};