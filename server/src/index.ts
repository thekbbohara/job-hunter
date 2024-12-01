import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { scrapeWithAi } from "@scrapper/scapewithai";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  const url = "https://weworkremotely.com/categories/remote-full-stack-programming-jobs#job-listings";
  scrapeWithAi(url)
  res.send("Express + TypeScript Server done ");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
