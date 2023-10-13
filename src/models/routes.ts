import Elysia, { t } from "elysia";

const routeModel = new Elysia()
    .model({
        route: t.Object({
            path: t.Optional(t.String()),
            entity: t.Optional(t.String()),
            method: t.Optional(t.String()),
            access: t.Optional(t.Array(t.String())),
            active: t.Optional(t.Boolean())
        })
    });

export default routeModel;