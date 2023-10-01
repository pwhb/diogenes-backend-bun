import { Elysia } from "elysia";
import avatarRouter from "./routes/avatars";
import indexRouter from "./routes";
import roleRouter from "./routes/roles";
import swagger from "@elysiajs/swagger";
import swaggerConf from "./lib/swagger";

const port = process.env.PORT || 3000;

const app = new Elysia()
  .use(swagger(swaggerConf))
  .use(indexRouter)
  .group("/api/v1", app => app
    .use(avatarRouter)
    .use(roleRouter)
  )
  .listen(port);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
