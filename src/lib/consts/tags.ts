import { Permission } from "@aws-sdk/client-s3";

enum Tags
{
    app = "App",
    auth = "Auth",
    configs = "Configs",
    roles = "Roles",
    avatars = "Avatars",
    users = "Users",
    routes = "Routes",
    uploads = "Uploads",
    permissions = "Permissions"
}

export default Tags;