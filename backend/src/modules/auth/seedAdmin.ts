import bcrypt from "bcryptjs";
import { User } from "../../models/user";
import { env } from "../../config/env";

export async function seedAdminAccount() {
  const email = env.adminEmail.toLowerCase();
  const existingUser = await User.findOne({
    where: { email },
  });

  const passwordHash = await bcrypt.hash(env.adminPassword, 10);

  if (!existingUser) {
    await User.create({
      name: env.adminName,
      email,
      password: passwordHash,
      role: "ADMIN",
    });
    return;
  }

  if (existingUser.role !== "ADMIN" || existingUser.name !== env.adminName) {
    existingUser.role = "ADMIN";
    existingUser.name = env.adminName;
  }

  existingUser.password = passwordHash;
  await existingUser.save();
}
