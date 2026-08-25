import { reactRouter } from "@react-router/dev/vite";
import os from "node:os";
import { defineConfig } from "vite";

function getLocalIp() {
  for (const interfaces of Object.values(os.networkInterfaces())) {
    for (const net of interfaces ?? []) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }

  return "localhost";
}

const localIp = getLocalIp();
const port = 5173;

export default defineConfig({
  plugins: [reactRouter()],
  resolve: {
    dedupe: ["react", "react-dom"],
    tsconfigPaths: true,
  },
  server: {
    host: true,
    port,
    origin: `http://${localIp}:${port}`,
    hmr: {
      host: localIp,
      port,
    },
  },
});
