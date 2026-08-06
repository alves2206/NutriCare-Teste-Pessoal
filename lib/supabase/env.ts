export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return {
    url,
    key,
    isConfigured: Boolean(url && key)
  };
}

export function getAllowedUserEmails() {
  const rawEmails =
    process.env.ALLOWED_USER_EMAILS ?? process.env.NEXT_PUBLIC_ALLOWED_USER_EMAIL;

  return (
    rawEmails?.split(/[,\n;]/)
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean) ?? []
  );
}

export function isAllowedEmail(email?: string | null) {
  const allowedEmails = getAllowedUserEmails();

  if (allowedEmails.length === 0) {
    return true;
  }

  return Boolean(email && allowedEmails.includes(email.toLowerCase()));
}

export function getAdminUserEmails() {
  const rawEmails = process.env.ADMIN_USER_EMAILS ?? process.env.ALLOWED_USER_EMAILS;

  return (
    rawEmails?.split(/[,\n;]/)
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean) ?? []
  );
}

export function isAdminEmail(email?: string | null) {
  const adminEmails = getAdminUserEmails();

  if (adminEmails.length === 0) {
    return false;
  }

  return Boolean(email && adminEmails.includes(email.toLowerCase()));
}
