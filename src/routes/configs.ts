import Elysia from "elysia";
import { createOne, deleteOne, getMany, getOne, getOneByName, replaceOne, updateOne } from "../controllers/configs";
import { Collections } from "../lib/consts/db";
import Tags from "../lib/consts/tags";
import { setup } from "../lib/config/plugins";
import { authenticate, authorize } from "../middlewares/auth";
import { create, update } from "../middlewares/body";

const hook = { detail: { tags: [Tags.configs] } };



const configRouter = new Elysia({ prefix: `/${Collections.configs}` })
    .use(setup)
    .post("/", createOne, {
        ...hook, beforeHandle: [authenticate, create, authorize]
    })
    .get("/", getMany, hook)
    .get("/:id", getOne, hook)
    .get("/getOneByName/:name", getOneByName, hook)
    .patch("/:id", updateOne, {
        ...hook, beforeHandle: [authenticate, update, authorize]
    })
    .put("/:id", replaceOne, {
        ...hook, beforeHandle: [authenticate, update, authorize]
    })
    .delete("/:id", deleteOne, {
        ...hook, beforeHandle: [authenticate, authorize]
    });

export default configRouter;