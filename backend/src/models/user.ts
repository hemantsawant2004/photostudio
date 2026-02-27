import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db";

export interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "USER";
  created_at?: Date;
}

type UserCreationAttributes = Optional<UserAttributes, "id" | "role" | "created_at">;

export class User extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  declare id: number;
  declare name: string;
  declare email: string;
  declare password: string;
  declare role: "ADMIN" | "USER";
  declare created_at?: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("ADMIN", "USER"),
      allowNull: false,
      defaultValue: "USER",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: false, // or true if you want createdAt/updatedAt
  }
);
