import { StudioPackage } from "../../models/package";
import type { CreatePackageInput } from "./package.schema";

const fallbackPackages: CreatePackageInput[] = [
  {
    name: "Portrait Session",
    price: "$180",
    description: "Studio-lit portraits for professionals, creatives, and personal branding.",
    features: ["60-minute session", "2 backdrop changes", "12 edited images"],
    enquiry_message:
      "Hello, I would like to enquire about the Portrait Session package. Kindly provide details on availability, recommended preparation, and any upgrade options. Thank you!",
  },
  {
    name: "Wedding Story",
    price: "$1,400",
    description: "Candid and editorial coverage for intimate ceremonies and full-day events.",
    features: ["8 hours coverage", "Preview in 72 hours", "Online gallery delivery"],
    enquiry_message:
      "Hello, I would like to enquire about the Wedding Story package. Kindly provide details on availability, recommended preparation, and any upgrade options. Thank you!",
  },
  {
    name: "Family Moments",
    price: "$260",
    description: "Relaxed lifestyle sessions built around connection, movement, and natural light.",
    features: ["90-minute session", "Outdoor or in-studio", "20 edited images"],
    enquiry_message:
      "Hello, I would like to enquire about the Family Moments package. Kindly provide details on availability, recommended preparation, and any upgrade options. Thank you!",
  },
];

export const PackageService = {
  async getAll() {
    const packages = await StudioPackage.findAll({
      where: { is_active: true },
      order: [["created_at", "ASC"]],
    });

    if (packages.length === 0) {
      return StudioPackage.bulkCreate(fallbackPackages);
    }

    return packages;
  },

  async create(data: CreatePackageInput) {
    const packageItem = await StudioPackage.create({
      ...data,
      enquiry_message: data.enquiry_message ?? null,
      is_active: true,
    });

    return packageItem;
  },

  async getAdminAll() {
    return StudioPackage.findAll({
      order: [["created_at", "DESC"]],
    });
  },
};
