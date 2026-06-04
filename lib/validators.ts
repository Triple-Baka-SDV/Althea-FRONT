// Shared form validators.
// Each function returns null when the value is valid, or a French error message otherwise.

export type Validator<T = string> = (value: T) => string | null;
export type FieldErrors<T extends string> = Partial<Record<T, string>>;

// ─── Generic ─────────────────────────────────────────────────────────────────

export const required =
  (label = "Ce champ"): Validator =>
  (value) =>
    value && value.toString().trim().length > 0 ? null : `${label} est requis`;

export const minLength =
  (n: number, label = "Ce champ"): Validator =>
  (value) =>
    (value ?? "").toString().trim().length >= n
      ? null
      : `${label} doit contenir au moins ${n} caractères`;

export const maxLength =
  (n: number, label = "Ce champ"): Validator =>
  (value) =>
    (value ?? "").toString().length <= n
      ? null
      : `${label} ne peut pas dépasser ${n} caractères`;

// ─── Identity ────────────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const email: Validator = (value) => {
  if (!value || !value.trim()) return "L'adresse e-mail est requise";
  return EMAIL_RE.test(value.trim()) ? null : "Adresse e-mail invalide";
};

export const name: Validator = (value) => {
  const trimmed = (value ?? "").trim();
  if (trimmed.length === 0) return "Le nom est requis";
  if (trimmed.length < 2) return "Le nom doit contenir au moins 2 caractères";
  if (trimmed.length > 80) return "Le nom est trop long";
  if (!/[A-Za-zÀ-ÖØ-öø-ÿ]/.test(trimmed)) return "Nom invalide";
  return null;
};

// Password: ≥ 8 chars, at least one letter and one digit
export const password: Validator = (value) => {
  if (!value) return "Le mot de passe est requis";
  if (value.length < 8) return "Le mot de passe doit contenir au moins 8 caractères";
  if (value.length > 128) return "Le mot de passe est trop long";
  if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) {
    return "Le mot de passe doit contenir une lettre et un chiffre";
  }
  return null;
};

export const matches =
  (other: string, label = "La confirmation"): Validator =>
  (value) =>
    value === other ? null : `${label} ne correspond pas`;

// ─── French identifiers ──────────────────────────────────────────────────────

// FR phone: 10 digits starting with 0, or international +33 X XX XX XX XX
export const phoneFR: Validator = (value) => {
  const digits = (value ?? "").replace(/[\s.\-()]/g, "");
  if (!digits) return null; // optional everywhere it's used
  if (/^0\d{9}$/.test(digits)) return null;
  if (/^\+33\d{9}$/.test(digits)) return null;
  return "Numéro de téléphone invalide (format FR attendu)";
};

// RPPS = 11 digits, Luhn-valid (same algorithm as SIRET/SIREN/RPPS)
export const rpps: Validator = (value) => {
  const digits = (value ?? "").replace(/\s/g, "");
  if (!digits) return null; // optional
  if (!/^\d{11}$/.test(digits)) return "Le numéro RPPS doit contenir 11 chiffres";
  if (!luhn(digits)) return "Numéro RPPS invalide (clé incorrecte)";
  return null;
};

// SIRET = 14 digits, Luhn-valid
export const siret: Validator = (value) => {
  const digits = (value ?? "").replace(/\s/g, "");
  if (!digits) return null;
  if (!/^\d{14}$/.test(digits)) return "Le SIRET doit contenir 14 chiffres";
  if (!luhn(digits)) return "SIRET invalide (clé incorrecte)";
  return null;
};

// TVA intracommunautaire FR : FR + 2 chars + 9 digits (SIREN)
export const tvaIntraFR: Validator = (value) => {
  const v = (value ?? "").replace(/\s/g, "").toUpperCase();
  if (!v) return null;
  if (!/^FR[0-9A-Z]{2}\d{9}$/.test(v)) {
    return "Format attendu : FR + 2 caractères + 9 chiffres";
  }
  return null;
};

// French postal code: 5 digits
export const postalCodeFR: Validator = (value) => {
  const v = (value ?? "").trim();
  if (!v) return null;
  return /^\d{5}$/.test(v) ? null : "Code postal invalide (5 chiffres)";
};

// IBAN: ISO 13616. Accept any country, verify mod-97 checksum.
export const iban: Validator = (value) => {
  const v = (value ?? "").replace(/\s/g, "").toUpperCase();
  if (!v) return "IBAN requis";
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/.test(v)) return "IBAN invalide (format)";
  // Move first 4 chars to end, convert letters to numbers (A=10..Z=35)
  const rearranged = v.slice(4) + v.slice(0, 4);
  const numeric = rearranged
    .split("")
    .map((c) => (/[A-Z]/.test(c) ? (c.charCodeAt(0) - 55).toString() : c))
    .join("");
  // mod 97 on a big-int string
  let remainder = 0;
  for (const ch of numeric) {
    remainder = (remainder * 10 + Number(ch)) % 97;
  }
  return remainder === 1 ? null : "IBAN invalide (clé incorrecte)";
};

// ─── Bank card ───────────────────────────────────────────────────────────────

export const cardNumber: Validator = (value) => {
  const digits = (value ?? "").replace(/\s/g, "");
  if (!digits) return "Numéro de carte requis";
  if (!/^\d{13,19}$/.test(digits)) return "Numéro de carte invalide (13–19 chiffres)";
  if (!luhn(digits)) return "Numéro de carte invalide (clé incorrecte)";
  return null;
};

export const cardExpiry: Validator = (value) => {
  const v = (value ?? "").trim();
  if (!v) return "Date d'expiration requise";
  if (!/^\d{2}\/\d{2}$/.test(v)) return "Format attendu : MM/AA";
  const [mm, yy] = v.split("/").map((n) => parseInt(n, 10));
  if (mm < 1 || mm > 12) return "Mois invalide";
  // Card valid through end of expiry month
  const expDate = new Date(2000 + yy, mm, 0, 23, 59, 59);
  if (Number.isNaN(expDate.getTime())) return "Date invalide";
  if (expDate < new Date()) return "Carte expirée";
  return null;
};

export const cardCvv: Validator = (value) => {
  const v = (value ?? "").trim();
  if (!v) return "CVV requis";
  return /^\d{3,4}$/.test(v) ? null : "CVV invalide (3 ou 4 chiffres)";
};

export const cardHolder: Validator = (value) => {
  const trimmed = (value ?? "").trim();
  if (!trimmed) return "Nom du titulaire requis";
  if (trimmed.length < 2) return "Nom du titulaire trop court";
  if (!/^[A-Za-zÀ-ÖØ-öø-ÿ' .\-]+$/.test(trimmed)) {
    return "Nom du titulaire invalide";
  }
  return null;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

// Luhn modulo-10 check, used for SIRET / RPPS / card numbers.
function luhn(digits: string): boolean {
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = digits.charCodeAt(i) - 48;
    if (n < 0 || n > 9) return false;
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

// Compose: run validators in order, return first error or null.
export function runAll(...validators: (string | null)[]): string | null {
  for (const v of validators) if (v) return v;
  return null;
}

// Validate a record of fields against a schema; returns the errors object.
// The schema can be partial — only the fields it provides will be validated.
export function validate<T extends string>(
  schema: Partial<Record<T, () => string | null>>
): FieldErrors<T> {
  const errors = {} as FieldErrors<T>;
  (Object.keys(schema) as T[]).forEach((key) => {
    const fn = schema[key];
    if (!fn) return;
    const err = fn();
    if (err) errors[key] = err;
  });
  return errors;
}

export const hasErrors = <T extends string>(errors: FieldErrors<T>): boolean =>
  Object.values(errors).some(Boolean);
