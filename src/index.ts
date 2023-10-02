import { Elysia } from "elysia";
import swagger from "@elysiajs/swagger";
import swaggerConf from "./lib/swagger";
import router from "./routes";

const port = process.env.PORT || 3000;

const app = new Elysia()
  .use(swagger(swaggerConf))
  .use(router)
  .listen(port);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
