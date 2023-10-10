import { Elysia } from "elysia";
import router from "./routes";

const port = process.env.PORT || 3000;

const app = new Elysia()
  .use(router)
  .listen(port);

console.info(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
