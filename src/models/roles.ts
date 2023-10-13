import Elysia, { t } from "elysia";

const roleModel = new Elysia()
    .model({
        role: t.Object({
            name: t.Optional(t.String()),
            level: t.Optional(t.Integer()),
            active: t.Optional(t.Boolean()),
        })
    });

export default roleModel;