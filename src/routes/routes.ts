import Elysia, { t } from "elysia";
import { createOne, deleteOne, getMany, getOne, replaceOne, updateOne } from "../controllers/routes";
import { Collections } from "../lib/consts/db";
import Tags from "../lib/consts/tags";
import { setup } from "../lib/config/plugins";
import { authenticate, authorize } from "../middlewares/auth";
import { create, update } from "../middlewares/body";

const hook = { detail: { tags: [Tags.routes] } };

export const model = new Elysia()
    .model({
        role: t.Object({
            path: t.String(),
            entity: t.String(),
            method: t.String(),
            access: t.Array(t.String()),
            active: t.Boolean()
        })
    });
const routeRouter = new Elysia({ prefix: `/${Collections.routes}` })
    .use(setup)
    .post("/", createOne, {
        ...hook, beforeHandle: [authenticate, create, authorize]
    })
    .get("/", getMany, hook)
    .get("/:id", getOne, hook)
    .patch("/:id", updateOne, {
        ...hook, beforeHandle: [authenticate, update, authorize]
    })
    // .put("/:id", replaceOne, {
    //     ...hook, beforeHandle: [authenticate, update, authorize]
    // })
    .delete("/:id", deleteOne, {
        ...hook, beforeHandle: [authenticate, authorize]
    });

export default routeRouter;