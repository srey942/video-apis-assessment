import express from "express";
import cors from "cors";
import compression from "compression";
import uploadRoutes from "./routes/videos.routes";

const app = express();

app.use(express.json());
app.use(cors());
app.use(compression());

// Routes to be defined

app.get("/", (req, res) => {
  res.send("Hello, World! Its working");
});

app.use("/upload", uploadRoutes);
// app.use("/conversion", conversionRoutes);

// app.use();

export { app };
