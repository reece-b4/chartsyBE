import { app} from "./app";
import "module-alias/register";

const PORT = process.env.PORT || 4000;

if (process.env.NODE_ENV !== 'production') {
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
}

