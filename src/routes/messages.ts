import Elysia, { t } from "elysia";
import { createOne, deleteOne, getMany, getManyByToken, getOne, replaceOne, updateOne } from "../controllers/messages";
import { Collections } from "../lib/consts/db";
import Tags from "../lib/consts/tags";
import { setup } from "../lib/config/plugins";
import { authenticate, authorize } from "../middlewares/auth";
import { create, update } from "../middlewares/body";
import messageModel from "../models/messages";

const hook = { detail: { tags: [Tags.messages] } };

const messageRouter = new Elysia({ prefix: `/${Collections.messages}` })
    .use(setup)
    .use(messageModel)
    .get("/getbyToken", getManyByToken, {
        ...hook,
        beforeHandle: [authenticate],
    });


export default messageRouter;