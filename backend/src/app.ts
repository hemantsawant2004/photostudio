import express from "express";
import cors from "cors";
// import { errorHandler } from "./middlewares/errorHandler";
// import { bookingRouter } from "./modules/bookings/booking.routes";
// import { galleryRouter } from "./modules/gallery/gallery.routes";
import { galleryRouter } from "./modules/gallery/gallery.routes";
import { bookingRouter } from "./modules/bookings/booking.routes";
import { authRouter } from "./modules/auth/auth.routes";
import { packageRouter } from "./modules/packages/package.routes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "PhotoStudio API running" });
});

app.use("/api/bookings", bookingRouter);
app.use("/api/gallery", galleryRouter);
app.use("/api/auth", authRouter);
app.use("/api/packages", packageRouter);

app.use(errorHandler);

export default app;
