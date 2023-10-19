import Elysia, { t } from "elysia";

const messageModel = new Elysia()
    .model({
        message: t.Object({
            name: t.Optional(t.String()),
            active: t.Optional(t.Boolean()),
        })
    });

export default messageModel;