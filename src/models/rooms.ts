import Elysia, { t } from "elysia";

export enum RoomTypes
{
    friendship = "friendship"
}

const roomModel = new Elysia()
    .model({
        room: t.Object({
            name: t.Optional(t.String()),
            members: t.Array(t.String()),
            active: t.Optional(t.Boolean()),
        })
    });

export default roomModel;