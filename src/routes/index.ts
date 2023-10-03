import Elysia from "elysia";
import { home } from "../controllers";
import Tags from "../lib/consts/tags";
import authRouter from "./auth";
import avatarRouter from "./avatars";
import roleRouter from "./roles";
import userRouter from "./users";
import configRouter from "./configs";
import swagger from "@elysiajs/swagger";
import swaggerConf from "../lib/swagger";
import routeRouter from "./routes";

const hook = { detail: { tags: [Tags.app] } };
const router = new Elysia()
    .use(swagger(swaggerConf))
    .get("/", home, hook)
    .use(authRouter)
    .group("/api/v1", app => app
        .use(avatarRouter)
        .use(roleRouter)
        .use(userRouter)
        .use(configRouter)
        .use(routeRouter)
    );

export default router;