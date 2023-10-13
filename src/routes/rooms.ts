import Elysia, { t } from "elysia";
import { createOne, deleteOne, getMany, getOne, replaceOne, updateOne } from "../controllers/rooms";
import { Collections } from "../lib/consts/db";
import Tags from "../lib/consts/tags";
import { setup } from "../lib/config/plugins";
import { authenticate, authorize } from "../middlewares/auth";
import { create, update } from "../middlewares/body";
import roomModel from "../models/rooms";

const hook = { detail: { tags: [Tags.rooms] } };

const roomRouter = new Elysia({ prefix: `/${Collections.rooms}` })
    .use(setup)
    .use(roomModel)
    .post("/", createOne, {
        ...hook,
        beforeHandle: [authenticate, create],
        body: 'room'
    })
    .get("/", getMany, hook)
    .get("/:id", getOne, hook)
    .patch("/:id", updateOne, {
        ...hook,
        beforeHandle: [authenticate, update, authorize],
        body: 'room'
    })
    .put("/:id", replaceOne, {
        ...hook,
        beforeHandle: [authenticate, update, authorize],
        body: 'room'
    })
    .delete("/:id", deleteOne, {
        ...hook, beforeHandle: [authenticate, authorize]
    });

export default roomRouter;