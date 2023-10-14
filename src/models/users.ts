import Elysia, { t } from "elysia";

const userModel = new Elysia()
    .model({
        auth: t.Object({
            username: t.String(),
            password: t.String()
        }),
        user: t.Object({
            username: t.Optional(t.String()),
            avatar: t.Optional(t.String()),
            wallpaper: t.Optional(t.String()),
            bio: t.Optional(t.String()),
            role: t.Optional(t.String()),
            active: t.Optional(t.Boolean()),
        }),
        self: t.Object({
            username: t.Optional(t.String()),
            avatar: t.Optional(t.String()),
            wallpaper: t.Optional(t.String()),
            bio: t.Optional(t.String()),
        }),
        changePassword: t.Object({
            password: t.String(),
            newPassword: t.String()
        })
    });

export default userModel;