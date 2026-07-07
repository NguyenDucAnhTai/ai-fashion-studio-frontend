import { ROLES, type Role } from "../../shared/constants/roles";
import type { CurrentUser, NormalizedAuthSession } from "./types";

type UnknownRecord = Record<string, unknown>;

const ROLE_VALUES = new Set<string>(Object.values(ROLES));

function isRecord(value: unknown): value is UnknownRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function unwrapApiData(raw: unknown) {
  if (isRecord(raw) && "data" in raw) {
    return raw.data;
  }

  return raw;
}

function readString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function normalizeRole(value: unknown) {
  const role = readString(value);
  return role && ROLE_VALUES.has(role) ? (role as Role) : null;
}

function normalizeRoles(value: unknown) {
  if (Array.isArray(value)) {
    return value
      .map((item) => normalizeRole(item))
      .filter((item): item is Role => Boolean(item));
  }

  const singleRole = normalizeRole(value);
  return singleRole ? [singleRole] : [];
}

function uniqueRoles(roles: Role[]) {
  return Array.from(new Set(roles));
}

export function normalizeUser(raw: unknown): CurrentUser | null {
  const data = unwrapApiData(raw);

  if (!isRecord(data)) {
    return null;
  }

  const email = readString(data.email);

  if (!email) {
    return null;
  }

  const primaryRole = normalizeRole(data.role);
  const roles = uniqueRoles([
    ...normalizeRoles(data.roles),
    ...(primaryRole ? [primaryRole] : []),
  ]);

  return {
    id: readString(data.id) ?? readString(data.userId) ?? undefined,
    email,
    fullName: readString(data.fullName) ?? readString(data.name) ?? undefined,
    phone: readString(data.phone),
    avatarUrl: readString(data.avatarUrl),
    role: primaryRole ?? roles[0],
    roles,
    status: readString(data.status) ?? undefined,
  };
}

export function normalizeAuthResponse(raw: unknown): NormalizedAuthSession {
  const data = unwrapApiData(raw);
  const record = isRecord(data) ? data : {};
  const userCandidate =
    record.user ?? record.account ?? record.customer ?? record.profile ?? data;
  const accessToken =
    readString(record.accessToken) ??
    readString(record.token) ??
    readString(record.jwt);
  const refreshToken =
    readString(record.refreshToken) ?? readString(record.refresh_token);

  return {
    accessToken,
    refreshToken,
    user: normalizeUser(userCandidate),
  };
}
