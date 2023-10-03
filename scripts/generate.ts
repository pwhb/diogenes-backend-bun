import { BunFile } from "bun";
import { parseTemplate } from "../src/lib/utils";
import { config } from "./consts";
import clientPromise from "../src/lib/mongodb";
import { Collections, dbName } from "../src/lib/consts/db";

async function generateFile(file: BunFile, collectionName: string, dir: string, fileType: string = "ts")
{

    const text = await file.text();
    const parsed = parseTemplate(text, { collectionName, router: `${collectionName.slice(0, collectionName.length - 1)}Router` });
    const path = `${dir}/${collectionName}.${fileType}`;
    await Bun.write(path, parsed);
    console.log(`${path} created successfully`);

}

async function generateRoutes(collectionName: string)
{

    const access = [
        "root"
    ];

    const routes = [
        {
            // name: `POST ${collectionName}/:id`,
            path: `${collectionName}`,
            entity: collectionName,
            method: "POST",
            access
        },
        {
            // name: `PATCH ${collectionName}/:id`,
            path: `${collectionName}/:id`,
            entity: collectionName,
            method: "PATCH",
            access
        },
        {
            // name: `PUT ${collectionName}/:id`,
            path: `${collectionName}/:id`,
            entity: collectionName,
            method: "PUT",
            access
        },
        {
            // name: `DELETE ${collectionName}/:id`,
            path: `${collectionName}/:id`,
            entity: collectionName,
            method: "DELETE",
            access
        }
    ];

    const client = await clientPromise;
    const col = client.db(dbName).collection(Collections.routes);
    for (let r of routes)
    {
        try
        {

            const created = await col.insertOne(r);
            console.log(`${r.method} ${r.path} created`);
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
        // const controllerTmp = Bun.file(`${config.prefix}/${config.controllerTmpFileName}`);
        // await generateFile(controllerTmp, collectionName, config.controllerDir);

        // const routerTmp = Bun.file(`${config.prefix}/${config.routerTmpFileName}`);
        // await generateFile(routerTmp, collectionName, config.routerDir);

        // const restTmp = Bun.file(`${config.prefix}/${config.restTmpFileName}`);
        // await generateFile(restTmp, collectionName, config.restDir, "rest");

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