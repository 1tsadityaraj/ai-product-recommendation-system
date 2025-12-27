import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import aiRoutes from "./routes/aiRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", aiRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
