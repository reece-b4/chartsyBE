const isProd = process.env.NODE_ENV === "production";
// In production, set up module-alias so @ points at dist/src
if (isProd) {
  require("module-alias/register");
}
// In dev (ts-node), tsconfig-paths will resolve "@/app" to src/app.ts
// In prod (node dist/index.js), module-alias will resolve "@/app" to dist/src/app.js
const { app } = require("@/app");


const PORT = process.env.PORT || 4000;

// lambda uses production and handles the server itself
if (process.env.NODE_ENV !== "production" || process.env.LOCAL === "true") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
