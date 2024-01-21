import express from "express";
import userRouter from "./routes/users.routes.js";
import homeRouter from "./routes/home.routes.js";
import productRouter from "./routes/product.routes.js";
import orderRouter from "./routes/orders.routes.js";
import cors from "cors";
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// routes declaration
app.use("/", homeRouter);
app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/order", orderRouter);
export default app;
