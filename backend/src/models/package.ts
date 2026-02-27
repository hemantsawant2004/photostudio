import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db";

export interface PackageAttributes {
  id: number;
  name: string;
  price: string;
  description: string;
  features: string[];
  enquiry_message?: string | null;
  is_active: boolean;
  created_at?: Date;
}

type PackageCreationAttributes = Optional<
  PackageAttributes,
  "id" | "enquiry_message" | "is_active" | "created_at"
>;

export class StudioPackage
  extends Model<PackageAttributes, PackageCreationAttributes>
  implements PackageAttributes
{
  declare id: number;
  declare name: string;
  declare price: string;
  declare description: string;
  declare features: string[];
  declare enquiry_message?: string | null;
  declare is_active: boolean;
  declare created_at?: Date;
}

StudioPackage.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(180),
      allowNull: false,
    },
    price: {
      type: DataTypes.STRING(80),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    features: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    enquiry_message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "packages",
    timestamps: false,
  },
);
