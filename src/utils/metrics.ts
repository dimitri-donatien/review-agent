import express from "express";
import client from "prom-client";

const register = client.register;

client.collectDefaultMetrics({ register });

export const reviewsCounter = new client.Counter({
  name: "agent_reviews_total",
  help: "Total number of code reviews processed",
});

export const reviewDuration = new client.Histogram({
  name: "agent_review_duration_seconds",
  help: "Duration of each code review in seconds",
  buckets: [0.5, 1, 2, 5, 10, 30],
});

export function startMetricsServer(port: number = 9091) {
  const app = express();
  app.get("/metrics", async (_req, res) => {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
  });
  app.listen(port, () => {
    console.log(`Metrics server listening at http://localhost:${port}/metrics`);
  });
}
