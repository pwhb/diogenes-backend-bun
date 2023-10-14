import { BunFile } from "bun";
import { parseTemplate } from "../src/lib/utils";
import { config, elements } from "./consts";
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






async function main()
{
    try
    {

        const [_a, _b, from, _c, to] = Bun.argv;

        if (!from || !to)
        {
            console.error("Please specify collection names: bun scripts/change_name from to");
            return;
        }


        for (let el of elements)
        {
            const obj: any = (config as any)[el];

            const file = Bun.file(`${obj.dir}/${from}${obj.extension}`);

            await Bun.write(`tmp/trash/${el}/${from}${obj.extension}`, file);
            console.log(`backup ${obj.dir}/${from}${obj.extension} as tmp/trash/${el}/${from}${obj.extension}`);

            const fromSingular = from.slice(0, from.length - 1);
            const toSingular = to.slice(0, to.length - 1);

            const original = await file.text();
            const regex = new RegExp(fromSingular, "g");
            const replaced = original.replace(regex, toSingular);

            await Bun.write(`${obj.dir}/${to}${obj.extension}`, replaced);
            console.info(`${obj.dir}/${from}${obj.extension} is renamed to ${obj.dir}/${to}${obj.extension}`);


        }


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