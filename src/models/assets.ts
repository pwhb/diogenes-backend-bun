import Elysia, { t } from "elysia";

const assetModel = new Elysia()
    .model({
        asset: t.Object({
            path: t.Optional(t.String()),
            name: t.Optional(t.String()),
            active: t.Optional(t.Boolean()),
        })
    });

export default assetModel;