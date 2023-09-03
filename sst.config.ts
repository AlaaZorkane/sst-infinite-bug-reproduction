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
      const isPreview = stack.stage === "kid";
      const isStaging = stack.stage === "law";

      let domain = "sunny";

      // TODO: use a better random id or build hash
      const randomId = Math.random().toString(36).slice(2, 12);

      if (isPreview) {
        domain = `kid-${domain}-${randomId}`;
      } else if (isStaging) {
        domain = `law-${domain}`;
      }

      const site = new NextjsSite(stack, "site", {
        runtime: "nodejs18.x",
        edge: true,
        path: "apps/web",
        customDomain: {
          domainName: `${randomId}.acme.io`,
        },
      });

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;
