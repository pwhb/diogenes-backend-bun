export const elements = ["model", "controller", "router", "rest"];

export const config = {
    prefix: "scripts/templates",
    model: {
        tmp: "model.ts.tmp",
        dir: "src/models",
        extension: ".ts",
    },
    controller: {
        tmp: "controller.ts.tmp",
        dir: "src/controllers",
        extension: ".ts",
    },
    router: {
        tmp: "router.ts.tmp",
        dir: "src/routes",
        extension: ".ts",
    },
    rest: {
        tmp: "rest.rest.tmp",
        dir: "tmp/rest",
        extension: ".rest",
    },
    modelTmpFileName: "model.ts.tmp",
    controllerTmpFileName: "controller.ts.tmp",
    routerTmpFileName: "router.ts.tmp",
    restTmpFileName: "rest.rest.tmp",

    modelDir: "src/models",
    controllerDir: "src/controllers",
    routerDir: "src/routes",
    restDir: "tmp/rest",

};