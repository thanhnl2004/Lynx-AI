import 'dotenv/config';
import express from "express";
import cors from "cors";
import helloRoutes from "./routes/hello.route.js";
import aiRoutes from "./routes/ai.route.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: process.env.VERCEL_URL || 'http://localhost:3000', 
//   credentials: true,
//   // Add these headers for streaming support
//   exposedHeaders: ['Content-Type', 'Cache-Control', 'Connection'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Connection']
}));

app.use(express.json());
app.use(helloRoutes);
app.use(aiRoutes);

// global error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  });
  
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

