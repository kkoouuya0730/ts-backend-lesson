import express from "express";
import userRoutes from "./routes/user.routes";
import { errorHandler } from "./middlewares/errorHandler";
import authRoutes from "./routes/auth.routes";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/users", userRoutes);
app.use("/auth", authRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
