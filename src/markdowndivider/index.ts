import { ExtensionWebpackModule } from "@moonlight-mod/types";

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  markdowndivider: {
    entrypoint: true,
    dependencies: [{ id: "react" }, { ext: "markdown", id: "markdown" }],
  },
};
