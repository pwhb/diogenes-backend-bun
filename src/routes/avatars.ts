import Elysia, { t } from "elysia";
import { createOne, deleteOne, getMany, getOne, replaceOne, updateOne } from "../controllers/avatars";
import { Collections } from "../lib/consts/db";
import Tags from "../lib/consts/tags";
import { setup } from "../lib/config/plugins";
import { authenticate, authorize } from "../middlewares/auth";
import { create, update } from "../middlewares/body";
import avatarModel from "../models/avatars";

const hook = { detail: { tags: [Tags.avatars] } };


const avatarRouter = new Elysia({ prefix: `/${Collections.avatars}` })
    .use(setup)
    .use(avatarModel)
    .post("/", createOne, {
        ...hook, beforeHandle: [authenticate, create]
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

export default avatarRouter;