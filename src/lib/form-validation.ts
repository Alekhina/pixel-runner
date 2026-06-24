export type LeadFormFields = {
  firstName: string;
  lastName: string;
  city: string;
  phone: string;
  consent: boolean;
  honeypot: string;
};

export type LeadFormField = keyof LeadFormFields;
export type LeadFormErrors = Partial<Record<LeadFormField, string>>;

const NAME_RE = /^[a-zA-Zа-яА-ЯёЁ\s-]{2,50}$/u;
const CITY_RE = /^[a-zA-Zа-яА-ЯёЁ\s-]{2,100}$/u;

export function normalizePhoneDigits(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("8")) return `7${digits.slice(1, 11)}`;
  if (digits.startsWith("7")) return digits.slice(0, 11);
  return `7${digits}`.slice(0, 11);
}

export function formatPhoneInput(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 0) return "";

  const normalized = normalizePhoneDigits(value);
  const local = normalized.slice(1);
  if (local.length === 0) return "";
  if (local.length <= 3) return `+7 (${local}`;
  if (local.length <= 6) return `+7 (${local.slice(0, 3)}) ${local.slice(3)}`;
  if (local.length <= 8) return `+7 (${local.slice(0, 3)}) ${local.slice(3, 6)} ${local.slice(6)}`;
  return `+7 (${local.slice(0, 3)}) ${local.slice(3, 6)} ${local.slice(6, 8)} ${local.slice(8, 10)}`;
}

export function isValidPhone(value: string): boolean {
  return normalizePhoneDigits(value).length === 11;
}

function validateName(value: string, label: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return `Введи ${label}`;
  if (!NAME_RE.test(trimmed)) return `Только буквы, от 2 до 50 символов`;
  return undefined;
}

export function validateLeadField(field: LeadFormField, values: LeadFormFields): string | undefined {
  switch (field) {
    case "firstName": return validateName(values.firstName, "имя");
    case "lastName": return validateName(values.lastName, "фамилию");
    case "city": {
      const trimmed = values.city.trim();
      if (!trimmed) return "Введи город";
      if (!CITY_RE.test(trimmed)) return "Только буквы, от 2 до 100 символов";
      return undefined;
    }
    case "phone":
      if (!values.phone.trim()) return "Введи телефон";
      if (!isValidPhone(values.phone)) return "Введи номер в формате +7 (XXX) XXX XX XX";
      return undefined;
    case "consent":
      return values.consent ? undefined : "Нужно согласие на обработку данных";
    case "honeypot":
      return values.honeypot ? "Не удалось отправить форму" : undefined;
    default: return undefined;
  }
}

export function validateLeadForm(values: LeadFormFields): LeadFormErrors {
  return (["firstName", "lastName", "city", "phone", "consent", "honeypot"] as const)
    .reduce<LeadFormErrors>((errors, field) => {
      const message = validateLeadField(field, values);
      if (message) errors[field] = message;
      return errors;
    }, {});
}

export function isLeadFormValid(values: LeadFormFields): boolean {
  return Object.keys(validateLeadForm(values)).length === 0;
}