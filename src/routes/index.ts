import Elysia from "elysia";
import { home } from "../controllers";
import Tags from "../lib/consts/tags";
import authRouter from "./auth";
import avatarRouter from "./avatars";
import roleRouter from "./roles";
import userRouter from "./users";
import configRouter from "./configs";

const hook = { detail: { tags: [Tags.app] } };

const router = new Elysia()
    .get("/", home, hook)
    .use(authRouter)
    .group("/api/v1", app => app
        .use(avatarRouter)
        .use(roleRouter)
        .use(userRouter)
        .use(configRouter)
    );

export default router;