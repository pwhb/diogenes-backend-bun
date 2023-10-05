import Elysia, { t } from "elysia";
import { createOne, deleteOne, getMany, getOne, replaceOne, updateOne } from "../controllers/roles";
import { Collections } from "../lib/consts/db";
import Tags from "../lib/consts/tags";
import { authenticate, authorize } from "../middlewares/auth";
import { create, update } from "../middlewares/body";
import { setup } from "../lib/config/plugins";

const hook = { detail: { tags: [Tags.roles] } };

const roleRouter = new Elysia({ prefix: `/${Collections.roles}` })
    .use(setup)
    .post("/", createOne, {
        ...hook,
        beforeHandle: [authenticate, create, authorize],
        body: t.Object({
            name: t.String(),
            level: t.Integer(),
        })
    },)
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

export default roleRouter;