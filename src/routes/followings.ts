import Elysia, { t } from "elysia";
import { createOne, deleteOne, getMany, getOne, replaceOne, unfollowOne, updateOne } from "../controllers/followings";
import { Collections } from "../lib/consts/db";
import Tags from "../lib/consts/tags";
import { setup } from "../lib/config/plugins";
import { authenticate, authorize } from "../middlewares/auth";
import { create, update } from "../middlewares/body";
import followingModel from "../models/followings";

const hook = { detail: { tags: [Tags.followings] } };

const followingRouter = new Elysia({ prefix: `/${Collections.followings}` })
    .use(setup)
    .use(followingModel)
    .post("/", createOne, {
        ...hook,
        beforeHandle: [authenticate],
        body: 'following'
    })
    .post("/unfollow", unfollowOne, {
        ...hook,
        beforeHandle: [authenticate],
        body: 'following'
    })
    .get("/", getMany, hook)
    .get("/:id", getOne, hook)
    .patch("/:id", updateOne, {
        ...hook,
        beforeHandle: [authenticate, update, authorize],
        body: 'following'
    })
    .put("/:id", replaceOne, {
        ...hook,
        beforeHandle: [authenticate, update, authorize],
        body: 'following'
    })
    .delete("/:id", deleteOne, {
        ...hook, beforeHandle: [authenticate, authorize]
    });

export default followingRouter;