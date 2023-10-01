import { Elysia } from "elysia";
import avatarRouter from "./routes/avatars";
import indexRouter from "./routes";

const port = process.env.PORT || 3000;

const app = new Elysia()
  .use(indexRouter)
  .use(avatarRouter)
  .listen(port);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
