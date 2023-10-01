import { ElysiaSwaggerConfig } from "@elysiajs/swagger/src/types";
import Tags from "./consts/tags";

const swaggerConf: ElysiaSwaggerConfig = {
    documentation: {
        info: {
            title: 'Diogenes Server',
            version: '1.0.0',
            description: 'Documentation for backend services'
        },
        tags: [
            { name: Tags.app, description: 'General endpoints' },
            { name: Tags.auth, description: 'Authentication endpoints' },
            { name: Tags.roles, description: 'Roles endpoints' },
            { name: Tags.avatars, description: 'Avatar endpoints' }
        ]
    }
};

export default swaggerConf;