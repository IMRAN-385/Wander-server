import express from "express";

const app = express();

app.get("/", (_req, res) => {
  res.send("Server is running 🚀");
});

export default app;