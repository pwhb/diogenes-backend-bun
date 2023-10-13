import Elysia, { t } from "elysia";

const avatarModel = new Elysia()
    .model({
        avatar: t.Object({
            path: t.Optional(t.String()),
            name: t.Optional(t.String()),
            active: t.Optional(t.Boolean()),
        })
    });

export default avatarModel;