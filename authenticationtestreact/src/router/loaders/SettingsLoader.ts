import { isAdminAuthenticated } from "../../auth-check";
import httpClient from "../../axios.config";

const DUMMY_SETTINGS = [
  { key: "GeneralSettings:ApplicationName", name: "Application Name", value: "Auth Service" },
  { key: "GeneralSettings:DefaultLanguage", name: "Default Language", value: "en" },
  { key: "GeneralSettings:MaintenanceMode", name: "Maintenance Mode", value: "false" },
  { key: "GeneralSettings:SessionTimeout", name: "Session Timeout (minutes)", value: "30" },
  { key: "EmailSettings:SmtpHost", name: "SMTP Host", value: "smtp.example.com" },
  { key: "EmailSettings:SmtpPort", name: "SMTP Port", value: "587" },
  { key: "EmailSettings:FromAddress", name: "From Email Address", value: "noreply@example.com" },
  { key: "EmailSettings:FromName", name: "From Display Name", value: "Auth Service" },
  { key: "EmailSettings:EnableSsl", name: "Enable SSL", value: "true" },
  { key: "EmailSettings:Password", name: "SMTP Password", value: "********" },
  { key: "PasswordSettings:MinLength", name: "Minimum Length", value: "8" },
  { key: "PasswordSettings:RequireUppercase", name: "Require Uppercase", value: "true" },
  { key: "PasswordSettings:RequireLowercase", name: "Require Lowercase", value: "true" },
  { key: "PasswordSettings:RequireDigit", name: "Require Digit", value: "true" },
  { key: "PasswordSettings:RequireSpecialChar", name: "Require Special Character", value: "true" },
  { key: "AccountSettings:MaxLoginAttempts", name: "Max Login Attempts", value: "5" },
  { key: "AccountSettings:LockoutDuration", name: "Lockout Duration (minutes)", value: "15" },
  { key: "AccountSettings:RequireEmailConfirmation", name: "Require Email Confirmation", value: "true" },
  { key: "AccountSettings:AllowMultipleSessions", name: "Allow Multiple Sessions", value: "false" },
  { key: "RegistrationSettings:AllowRegistration", name: "Allow Registration", value: "true" },
  { key: "RegistrationSettings:RequireApproval", name: "Require Admin Approval", value: "false" },
  { key: "RegistrationSettings:DefaultRole", name: "Default Role", value: "User" },
  { key: "RegistrationSettings:MinAge", name: "Minimum Age", value: "13" },
];

const SettingsLoader = async ({ request }: { request: Request }) => {
  isAdminAuthenticated(request);

  try {
    const result = await httpClient.get(`/api/settings`);
    const data = result?.data ?? [];
    return Array.isArray(data) && data.length > 0 ? data : DUMMY_SETTINGS;
  } catch {
    return DUMMY_SETTINGS;
  }
};

export { SettingsLoader };