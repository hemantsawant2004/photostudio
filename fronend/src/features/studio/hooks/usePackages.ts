import { useEffect, useState } from "react";
import { PackageApi } from "../../../api/packages";
import type { StudioPackage } from "../../../types/package";

export function usePackages() {
  const [packages, setPackages] = useState<StudioPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadPackages = async () => {
      try {
        const data = await PackageApi.getAll();
        if (active) {
          setPackages(data);
          setError(null);
        }
      } catch {
        if (active) {
          setError("Unable to load packages right now.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadPackages();

    return () => {
      active = false;
    };
  }, []);

  return {
    packages,
    loading,
    error,
  };
}
