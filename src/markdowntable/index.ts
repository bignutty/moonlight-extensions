import { ExtensionWebpackModule } from "@moonlight-mod/types";

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  markdowntable: {
    entrypoint: true,
    dependencies: [{ id: "react" }, { ext: "markdown", id: "markdown" }],
  },
};
