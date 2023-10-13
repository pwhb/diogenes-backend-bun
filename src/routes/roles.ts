import Elysia, { t } from "elysia";
import { createOne, deleteOne, getMany, getOne, replaceOne, updateOne } from "../controllers/roles";
import { Collections } from "../lib/consts/db";
import Tags from "../lib/consts/tags";
import { authenticate, authorize } from "../middlewares/auth";
import { create, update } from "../middlewares/body";
import { setup } from "../lib/config/plugins";
import roleModel from "../models/roles";

const hook = { detail: { tags: [Tags.roles] } };

const roleRouter = new Elysia({ prefix: `/${Collections.roles}` })
    .use(setup)
    .use(roleModel)
    .post("/", createOne, {
        ...hook,
        beforeHandle: [authenticate, create, authorize],
        body: 'role'
    })
    .get("/", getMany, hook)
    .get("/:id", getOne, hook)
    .patch("/:id", updateOne, {
        ...hook,
        beforeHandle: [authenticate, update, authorize],
        body: 'role'
    })
    // .put("/:id", replaceOne, {
    //     ...hook, beforeHandle: [authenticate, update, authorize]
    // })
    .delete("/:id", deleteOne, {
        ...hook,
        beforeHandle: [authenticate, authorize]
    });

export default roleRouter;