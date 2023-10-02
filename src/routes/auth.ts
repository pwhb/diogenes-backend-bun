import Elysia, { t } from "elysia";
import Tags from "../lib/consts/tags";
import { login, register } from "../controllers/auth";

const hook = { detail: { tags: [Tags.auth] } };

const authRouter = new Elysia({ prefix: `/auth` })
    .post("/login", login, {
        ...hook,
        body: t.Object({
            username: t.String(),
            password: t.String(),
        }
        )
    })
    .post("/register", register, hook);

export default authRouter;