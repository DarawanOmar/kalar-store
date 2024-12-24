import { createRouteHandler } from "uploadthing/next";

import { ourFileRouter } from "./core";

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    token:
      "eyJhcGlLZXkiOiJza19saXZlXzJiMDI3MDhlYWVhYmM3YWM4MjlhNDE2ZDkzYzQ5NDUxYmE5MWMyYWRmMDQ2YjQyOGQ5ZTk2Y2VlZDkyYjhkYTYiLCJhcHBJZCI6InlrYmNya3BsNW4iLCJyZWdpb25zIjpbInNlYTEiXX0=",
  },
});
