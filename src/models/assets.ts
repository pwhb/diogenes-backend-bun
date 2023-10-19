import Elysia, { t } from "elysia";

const assetModel = new Elysia()
    .model({
        asset: t.Object({
            path: t.Optional(t.String()),
            name: t.Optional(t.String()),
            category: t.Optional(t.String()),
            source: t.Optional(t.String()),
            type: t.Optional(t.String()),
            active: t.Optional(t.Boolean()),
        })
    });

export default assetModel;