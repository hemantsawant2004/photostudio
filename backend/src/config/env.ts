import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT || 5000,
  dbHost: process.env.DB_HOST || "localhost",
  dbUser: process.env.DB_USER || "root",
  dbPassword: process.env.DB_PASSWORD || "",
  dbName: process.env.DB_NAME || "photostudio_db",
  dbPort: Number(process.env.DB_PORT) || 3306,
  jwtSecret: process.env.JWT_SECRET || "photostudio-dev-secret",
  dbAlter: process.env.DB_ALTER === "true" || process.env.NODE_ENV !== "production",
  adminName: process.env.ADMIN_NAME || "Studio Admin",
  adminEmail: process.env.ADMIN_EMAIL || "admin@studio.com",
  adminPassword: process.env.ADMIN_PASSWORD || "Admin@123",
};
