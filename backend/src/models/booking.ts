import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db";

export interface BookingAttributes {
  id: number;
  user_id?: number | null;
  name: string;
  email: string;
  phone?: string | null;
  date: string;
  time_slot: string;
  package?: string | null;
  message?: string | null;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  status_updated_at?: Date | null;
  status_seen_at?: Date | null;
  created_at?: Date;
}

type BookingCreationAttributes = Optional<
  BookingAttributes,
  | "id"
  | "user_id"
  | "phone"
  | "package"
  | "message"
  | "status"
  | "status_updated_at"
  | "status_seen_at"
  | "created_at"
>;

export class Booking
  extends Model<BookingAttributes, BookingCreationAttributes>
  implements BookingAttributes
{
  declare id: number;
  declare user_id?: number | null;
  declare name: string;
  declare email: string;
  declare phone?: string | null;
  declare date: string;
  declare time_slot: string;
  declare package?: string | null;
  declare message?: string | null;
  declare status: "PENDING" | "CONFIRMED" | "CANCELLED";
  declare status_updated_at?: Date | null;
  declare status_seen_at?: Date | null;
  declare created_at?: Date;
}

Booking.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    time_slot: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    package: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("PENDING", "CONFIRMED", "CANCELLED"),
      allowNull: false,
      defaultValue: "PENDING",
    },
    status_updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status_seen_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "bookings",
    timestamps: false,
  }
);
