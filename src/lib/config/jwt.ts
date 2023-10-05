import { JWTOption } from "@elysiajs/jwt";


const jwtConf: JWTOption = {
    name: "jwt",
    secret: process.env.JWT_SECRET as string,
    exp: '7d'
};

export default jwtConf;