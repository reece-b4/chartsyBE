import "module-alias/register";
import { app } from "@/app";

const PORT = process.env.PORT || 4000;

// lambda uses production and handles the server itself
if (process.env.NODE_ENV !== "production" || process.env.LOCAL === "true") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
