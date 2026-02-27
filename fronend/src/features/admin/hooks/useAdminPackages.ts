import { useCallback, useEffect, useState } from "react";
import { PackageApi } from "../../../api/packages";
import type { CreatePackagePayload, StudioPackage } from "../../../types/package";

const initialForm: CreatePackagePayload = {
  name: "",
  price: "",
  description: "",
  features: [],
  enquiry_message: "",
};

export function useAdminPackages(token: string) {
  const [packages, setPackages] = useState<StudioPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    featuresText: "",
    enquiry_message: "",
  });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!token) {
      setPackages([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await PackageApi.getAdminAll(token);
      setPackages(data);
    } catch {
      setError("Unable to load packages.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  const submit = async () => {
    if (!token) {
      setError("Admin authentication required.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload: CreatePackagePayload = {
        ...initialForm,
        name: form.name,
        price: form.price,
        description: form.description,
        enquiry_message: form.enquiry_message || undefined,
        features: form.featuresText
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      await PackageApi.create(payload, token);
      setForm({
        name: "",
        price: "",
        description: "",
        featuresText: "",
        enquiry_message: "",
      });
      await load();
    } catch {
      setError("Unable to create package.");
    } finally {
      setSaving(false);
    }
  };

  return {
    packages,
    loading,
    error,
    form,
    setForm,
    saving,
    submit,
    refresh: load,
  };
}
