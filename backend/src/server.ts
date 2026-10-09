import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import adminRoutes from "./routes/adminRoutes";

dotenv.config();
if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is missing. Copy .env.example to .env and set a value.");
    process.exit(1);
}

const app = express();

app.use(cors({ origin: "http://localhost:4200" }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api", adminRoutes);

app.get("/", (req, res) => {
    res.send("SK Verify Portal Backend Running");
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});