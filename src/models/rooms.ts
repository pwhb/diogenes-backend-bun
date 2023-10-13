import Elysia, { t } from "elysia";

const roomModel = new Elysia()
    .model({
        role: t.Object({
            name: t.Optional(t.String()),
            active: t.Optional(t.Boolean()),
        })
    });

export default roomModel;