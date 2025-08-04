import 'dotenv/config';
import express from "express";
import cors from "cors";
import aiRoutes from "./routes/ai.route.js";
import conversationRoutes from "./routes/conversation.route.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: process.env.VERCEL_URL || 'http://localhost:3000', 
}));

app.use(express.json());
app.use(aiRoutes);
app.use(conversationRoutes); 

// global error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  });
  
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

