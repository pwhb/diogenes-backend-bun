import Elysia from "elysia";
import { home } from "../controllers";
import Tags from "../lib/consts/tags";
import authRouter from "./auth";
import roleRouter from "./roles";
import userRouter from "./users";
import configRouter from "./configs";
import swagger from "@elysiajs/swagger";

import routeRouter from "./routes";
import cors from "@elysiajs/cors";
import wsRouter from "./ws";
import uploadRouter from "./uploads";
import swaggerConf from "../lib/config/swagger";
import permissionRouter from "./permissions";
import roomRouter from "./rooms";
import assetRouter from "./assets";
import followingRouter from "./followings";
import messageRouter from "./messages";

const hook = { detail: { tags: [Tags.app] } };

const router = new Elysia()
    .use(cors())
    .use(swagger(swaggerConf))
    .use(wsRouter)
    .get("/", home, hook)
    .use(authRouter)
    .group("/api/v1", app => app
        .use(assetRouter)
        .use(roleRouter)
        .use(permissionRouter)
        .use(userRouter)
        .use(configRouter)
        .use(routeRouter)
        .use(uploadRouter)
        .use(roomRouter)
        .use(messageRouter)
        .use(followingRouter)
    );

export default router;