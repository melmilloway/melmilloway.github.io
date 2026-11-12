import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Don't write AGENTS.md / CLAUDE.md into the repo on `next dev`.
  agentRules: false,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
