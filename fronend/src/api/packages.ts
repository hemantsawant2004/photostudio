import { api } from "./client";
import type { CreatePackagePayload, StudioPackage } from "../types/package";

export const PackageApi = {
  async getAll(): Promise<StudioPackage[]> {
    const res = await api.get("/packages");
    return res.data.data;
  },

  async getAdminAll(token: string): Promise<StudioPackage[]> {
    const res = await api.get("/packages/admin", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.data;
  },

  async create(payload: CreatePackagePayload, token: string): Promise<StudioPackage> {
    const res = await api.post("/packages", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.data;
  },
};
