import { BunFile } from "bun";
import { parseTemplate } from "../src/lib/utils";
import { config } from "./consts";
import { Collections, dbName } from "../src/lib/consts/db";
import clientPromise from "../src/lib/services/mongodb";

async function generateFile(file: BunFile, collectionName: string, dir: string, fileType: string = "ts")
{

    const text = await file.text();
    const singular = collectionName.slice(0, collectionName.length - 1);
    const parsed = parseTemplate(text, { collectionName, router: `${singular}Router`, singular });
    const path = `${dir}/${collectionName}.${fileType}`;
    await Bun.write(path, parsed);
    console.info(`${path} created successfully`);

}

async function generateCodes(collectionName: string)
{
    const controllerTmp = Bun.file(`${config.prefix}/${config.controllerTmpFileName}`);
    await generateFile(controllerTmp, collectionName, config.controllerDir);

    const routerTmp = Bun.file(`${config.prefix}/${config.routerTmpFileName}`);
    await generateFile(routerTmp, collectionName, config.routerDir);

    const modelTmp = Bun.file(`${config.prefix}/${config.modelTmpFileName}`);
    await generateFile(modelTmp, collectionName, config.modelDir);

    const restTmp = Bun.file(`${config.prefix}/${config.restTmpFileName}`);
    await generateFile(restTmp, collectionName, config.restDir, "rest");
}

async function generateRoutes(collectionName: string)
{

    const access = [
        "root"
    ];

    const routes = [
        {
            // name: `GET ${collectionName}/:id`,
            path: `${collectionName}`,
            entity: collectionName,
            method: "GET",
            access: ["all"],
            many: true,
            active: true,
            createdBy: "system",
            createdAt: new Date()
        },
        {
            // name: `GET ${collectionName}/:id`,
            path: `${collectionName}/:id`,
            entity: collectionName,
            method: "GET",
            access: ["all"],
            active: true,
            createdBy: "system",
            createdAt: new Date()
        },
        {
            // name: `POST ${collectionName}/:id`,
            path: `${collectionName}`,
            entity: collectionName,
            method: "POST",
            access,
            active: true,
            createdBy: "system",
            createdAt: new Date()
        },
        {
            // name: `PATCH ${collectionName}/:id`,
            path: `${collectionName}/:id`,
            entity: collectionName,
            method: "PATCH",
            access,
            active: true,
            createdBy: "system",
            createdAt: new Date()
        },
        {
            // name: `PUT ${collectionName}/:id`,
            path: `${collectionName}/:id`,
            entity: collectionName,
            method: "PUT",
            access,
            active: false,
            createdBy: "system",
            createdAt: new Date()
        },
        {
            // name: `DELETE ${collectionName}/:id`,
            path: `${collectionName}/:id`,
            entity: collectionName,
            method: "DELETE",
            access,
            active: false,
            createdBy: "system",
            createdAt: new Date()
        }
    ];

    const client = await clientPromise;
    const col = client.db(dbName).collection(Collections.routes);
    for (let r of routes)
    {
        try
        {

            const created = await col.insertOne(r);
            console.info(`${r.method} ${r.path} created`);
        } catch (error)
        {
            console.error(`${r.method} ${r.path} already exists`);
        }
    }

}




async function main()
{
    try
    {
        const collectionName = Bun.argv[2];
        if (!collectionName)
        {
            console.error("No collection name specified.\nPlease specify a collection name: bun run add users");
            return;
        }

        await generateRoutes(collectionName);
        await generateCodes(collectionName);


    } catch (error)
    {
        console.error(error);
    }
}

main().then(() =>
{
    process.exit(0);
}).catch((error) =>
{
    console.error(error);
    process.exit(1);
});