export interface ContactData {
  name: string;
  email: string;
  company: string;
  service: string;
  details: string;
  website: string;
}
export const allowedServices: string[];
export function validateContact(
  body: unknown,
): { data: ContactData; error?: never } | { error: string; data?: never };
export function deliverContact(
  data: ContactData,
  config: { key?: string; from?: string; to?: string },
  fetcher?: typeof fetch,
): Promise<{ status: number; error?: string; success?: boolean }>;
