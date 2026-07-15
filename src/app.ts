import express from "express";
import cors from "cors";


const app = express();


app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);


app.get("/", (_req, res) => {
  res.send("Server is running 🚀");
});


export default app;