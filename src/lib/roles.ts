/**
 * Role-Based Access Control (RBAC) & Superadmin Governance
 * Handles permanent Superadmin binding, role assignments, and permission checks.
 */

export type UserRole =
  | 'SUPER_ADMIN'
  | 'OPS_LEAD'
  | 'SENTINEL_OFFICER'
  | 'CLIENT_OWNER'
  | 'LOCATION_MANAGER';

export interface RoleDefinition {
  id: UserRole;
  label: string;
  badge: string;
  description: string;
  canAccessAdmin: boolean;
  canManageRoles: boolean;
  canManageBilling: boolean;
  color: string;
}

export const ROLE_DEFINITIONS: Record<UserRole, RoleDefinition> = {
  SUPER_ADMIN: {
    id: 'SUPER_ADMIN',
    label: 'Superadmin / Platform Owner',
    badge: '👑 Superadmin',
    description: 'Полный неограниченный доступ ко всем заведениям, биллингу Creem, API-ключам и назначению ролей.',
    canAccessAdmin: true,
    canManageRoles: true,
    canManageBilling: true,
    color: 'amber',
  },
  OPS_LEAD: {
    id: 'OPS_LEAD',
    label: 'Operations & SEO Lead',
    badge: '⚡ Ops Lead',
    description: 'Управление заведениями клиентов, запуск 3x3 Geo-Grid радара и пакетное одобрение задач ИИ.',
    canAccessAdmin: true,
    canManageRoles: false,
    canManageBilling: false,
    color: 'blue',
  },
  SENTINEL_OFFICER: {
    id: 'SENTINEL_OFFICER',
    label: 'Sentinel Security Officer',
    badge: '🛡️ Sentinel Officer',
    description: 'Мониторинг журнала перехвата правок, защита от подмены телефонов и откат снимков Google Maps.',
    canAccessAdmin: true,
    canManageRoles: false,
    canManageBilling: false,
    color: 'emerald',
  },
  CLIENT_OWNER: {
    id: 'CLIENT_OWNER',
    label: 'Client Business Owner',
    badge: '🏢 Owner',
    description: 'Владелец заведения/сети: доступ к клиентскому Cockpit, аналитике трафика и инвойсам.',
    canAccessAdmin: false,
    canManageRoles: false,
    canManageBilling: false,
    color: 'indigo',
  },
  LOCATION_MANAGER: {
    id: 'LOCATION_MANAGER',
    label: 'Location Store Manager',
    badge: '☕ Manager',
    description: 'Управляющий точкой: оперативный ответ на отзывы гостей и загрузка фотографий.',
    canAccessAdmin: false,
    canManageRoles: false,
    canManageBilling: false,
    color: 'slate',
  },
};

export interface UserRoleRecord {
  email: string;
  role: UserRole;
  name?: string;
  assignedAt: string;
  assignedBy?: string;
  isPermanent?: boolean;
}

// Fixed root platform superadmins that cannot be demoted or removed
export const PERMANENT_SUPERADMINS = [
  '0451611@gmail.com',
];

const STORAGE_KEY = 'gbpilot_user_roles';

export function isPermanentSuperAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return PERMANENT_SUPERADMINS.some((sa) => sa.toLowerCase() === normalized);
}

export function getAllUserRoles(): UserRoleRecord[] {
  let stored: UserRoleRecord[] = [];
  if (typeof window !== 'undefined') {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        stored = JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to parse user roles from localStorage', e);
    }
  }

  // Ensure all permanent superadmins are always included with highest status
  const recordsMap = new Map<string, UserRoleRecord>();

  stored.forEach((item) => {
    recordsMap.set(item.email.toLowerCase(), item);
  });

  PERMANENT_SUPERADMINS.forEach((saEmail) => {
    recordsMap.set(saEmail.toLowerCase(), {
      email: saEmail,
      role: 'SUPER_ADMIN',
      name: 'Platform Founder',
      assignedAt: '2026-10-16T00:00:00Z',
      assignedBy: 'System Kernel',
      isPermanent: true,
    });
  });

  return Array.from(recordsMap.values());
}

export function getUserRole(email: string | null | undefined): UserRole {
  if (!email) return 'LOCATION_MANAGER';
  const normalized = email.trim().toLowerCase();

  if (isPermanentSuperAdmin(normalized)) {
    return 'SUPER_ADMIN';
  }

  const all = getAllUserRoles();
  const found = all.find((r) => r.email.toLowerCase() === normalized);
  return found ? found.role : 'CLIENT_OWNER';
}

export function isSuperAdmin(email: string | null | undefined): boolean {
  return getUserRole(email) === 'SUPER_ADMIN';
}

export function canAccessAdmin(email: string | null | undefined): boolean {
  const role = getUserRole(email);
  return ROLE_DEFINITIONS[role]?.canAccessAdmin || false;
}

export function setUserRole(
  targetEmail: string,
  role: UserRole,
  assignedBy: string = 'Superadmin',
  name?: string
): UserRoleRecord[] {
  if (typeof window === 'undefined') return [];
  const normalized = targetEmail.trim().toLowerCase();

  // Prevent demoting permanent superadmins
  if (isPermanentSuperAdmin(normalized) && role !== 'SUPER_ADMIN') {
    throw new Error(`Пользователь ${targetEmail} является постоянным супер-администратором платформы и не может быть понижен.`);
  }

  const current = getAllUserRoles().filter((r) => !r.isPermanent);
  const existingIdx = current.findIndex((r) => r.email.toLowerCase() === normalized);

  const updatedRecord: UserRoleRecord = {
    email: targetEmail.trim(),
    role,
    name: name || targetEmail.split('@')[0],
    assignedAt: new Date().toISOString(),
    assignedBy,
    isPermanent: isPermanentSuperAdmin(normalized),
  };

  if (existingIdx >= 0) {
    current[existingIdx] = updatedRecord;
  } else {
    current.push(updatedRecord);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  window.dispatchEvent(new CustomEvent('gbpilot_user_roles_changed', { detail: { updatedRecord } }));
  return getAllUserRoles();
}

export function removeUserRole(targetEmail: string): UserRoleRecord[] {
  if (typeof window === 'undefined') return [];
  const normalized = targetEmail.trim().toLowerCase();

  if (isPermanentSuperAdmin(normalized)) {
    throw new Error(`Нельзя удалить роль корневого суперадмина ${targetEmail}.`);
  }

  const current = getAllUserRoles().filter((r) => !r.isPermanent && r.email.toLowerCase() !== normalized);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  window.dispatchEvent(new CustomEvent('gbpilot_user_roles_changed'));
  return getAllUserRoles();
}
