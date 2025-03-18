// for testing only
import { serve } from "bun";
const BASE_PATH = "./src";
const log = true;
const server = serve({
  port: 3000,
  async fetch(req) {
    let filePath = BASE_PATH + new URL(req.url).pathname;
    if (filePath == BASE_PATH + "/") {
      // use index as base
      filePath = BASE_PATH + "/index.html";
    }
    let res;
    let file;

    // Extract client's IP address
    const clientIp =
      req.headers.get("x-forwarded-for") || req.remoteAddress || "localhost";
    const requestedFile = filePath;
    try {
      file = Bun.file(filePath);
      res = new Response(file);
      if (log) {
        console.log(`Client ${clientIp} accessed ${requestedFile}`);
      }
    } catch (err) {
      console.error(`Error accessing ${requestedFile}:`, err);
      return new Response("Fatal error:\n" + err.message, { status: 500 });
    }

    return res;
  },
  error() {
    return new Response(null, { status: 404 });
  },
});

console.log(`Listening on ${server.url}`);
