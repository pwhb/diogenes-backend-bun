export const dbName = process.env.DB_NAME || "test";

export enum Collections
{
    assets = "assets",
    configs = "configs",
    users = "users",
    roles = "roles",
    routes = "routes",
    uploads = "uploads",
    rooms = "rooms",
    followings = "followings",
}

