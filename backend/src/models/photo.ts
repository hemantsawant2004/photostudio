import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db";

export interface PhotoAttributes {
  id: number;
  title?: string | null;
  url: string;
  category?: string | null;
  created_at?: Date;
}

type PhotoCreationAttributes = Optional<PhotoAttributes, "id" | "title" | "category" | "created_at">;

export class Photo
  extends Model<PhotoAttributes, PhotoCreationAttributes>
  implements PhotoAttributes
{
  declare id: number;
  declare title?: string | null;
  declare url: string;
  declare category?: string | null;
  declare created_at?: Date;
}

Photo.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    url: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "photos",
    timestamps: false,
  }
);