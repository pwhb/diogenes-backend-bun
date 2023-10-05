import Elysia, { t } from "elysia";
import { createMany, createOne, deleteOne, getMany, getOne, replaceOne, updateOne } from "../controllers/uploads";
import { Collections } from "../lib/consts/db";
import Tags from "../lib/consts/tags";
import { setup } from "../lib/config/plugins";
import { authenticate, authorize } from "../middlewares/auth";
import { create, update } from "../middlewares/body";

const hook = { detail: { tags: [Tags.uploads] } };

const model = new Elysia()
    .model({
        create: t.Object({
            name: t.String()
        })
    });

const uploadRouter = new Elysia({ prefix: `/${Collections.uploads}` })
    .use(setup)
    .use(model)
    .post("/", createOne, {
        ...hook, beforeHandle: []
    })
    .post("/bulk", createMany, {
        ...hook, beforeHandle: []
    })
    .get("/", getMany, hook)
    .get("/:id", getOne, hook)
    .patch("/:id", updateOne, {
        ...hook, beforeHandle: [authenticate, update, authorize]
    })
    .put("/:id", replaceOne, {
        ...hook, beforeHandle: [authenticate, update, authorize]
    })
    .delete("/:id", deleteOne, {
        ...hook, beforeHandle: [authenticate, authorize]
    });

export default uploadRouter;