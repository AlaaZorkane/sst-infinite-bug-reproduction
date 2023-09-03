import type { SSTConfig } from "sst";
import { NextjsSite } from "sst/constructs";

type GOptions = Parameters<SSTConfig["config"]>[0];

export default {
  config(input: GOptions) {
    const name = "sunny";
    const stage = input.stage || "kid";

    return {
      name,
      region: "eu-central-1",
      stage,
      profile: input.profile,
      advanced: {
        disableAppModeCheck: true,
      },
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const site = new NextjsSite(stack, "site", {
        runtime: "nodejs18.x",
        edge: true,
        path: "apps/web",
        // remove this line and the build will work
        customDomain: "test.acme.io",
      });

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;
