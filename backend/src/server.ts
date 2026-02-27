import app from "./app";
import { env } from "./config/env";
import { sequelize } from "./config/db";
import { User } from "./models/user";
import { Booking } from "./models/booking";
import { Photo } from "./models/photo";
import { StudioPackage } from "./models/package";
import { seedAdminAccount } from "./modules/auth/seedAdmin";

const port = env.port;

async function start() {
  try {
    void User;
    void Booking;
    void Photo;
    void StudioPackage;

    await sequelize.authenticate();
    console.log("Database connected");

    await sequelize.sync({ alter: env.dbAlter });
    await seedAdminAccount();

    app.listen(port, () => {
      console.log(`Backend server running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Unable to connect to DB:", err);
    process.exit(1);
  }
}

void start();
