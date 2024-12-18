import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
     webpack(config) {
      // https://react-svgr.com/docs/next/

      // Grab the existing rule that handles SVG imports
      const fileLoaderRule = config.module.rules.find((rule: any) =>
        rule.test?.test?.(".svg"),
      );

      config.module.rules.push(
        // Reapply the existing rule, but only for svg imports ending in ?url
        {
          ...fileLoaderRule,
          test: /\.svg$/i,
          resourceQuery: /url/, // *.svg?url
        },
        // Convert all other *.svg imports to React components
        {
          test: /\.svg$/i,
          issuer: fileLoaderRule.issuer,
          resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
          use: [
            {
              loader: "@svgr/webpack",
              options: {
                svgoConfig: {
                  plugins: [
                    {
                      name: "preset-default",
                      params: {
                        overrides: {
                          // Keep viewBoxes on svg files
                          removeViewBox: false,
                        },
                      },
                    },
                  ],
                },
                typescript: true,
              },
            },
          ],
        },
      );

      // Modify the file loader rule to ignore *.svg, since we have it handled now.
      fileLoaderRule.exclude = /\.svg$/i;

      return config;
    },
};

export default nextConfig;
