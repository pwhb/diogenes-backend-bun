import Elysia, { t } from "elysia";

const followingModel = new Elysia()
    .model({
        following: t.Object({
            // follower: t.Optional(t.String()),
            followed: t.Optional(t.String()),
        })
    });

export default followingModel;