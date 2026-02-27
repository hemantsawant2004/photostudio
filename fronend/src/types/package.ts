export type StudioPackage = {
  id?: number;
  name: string;
  price: string;
  description: string;
  features: string[];
  enquiry_message?: string | null;
  is_active?: boolean;
  created_at?: string;
};

export type CreatePackagePayload = {
  name: string;
  price: string;
  description: string;
  features: string[];
  enquiry_message?: string;
};
