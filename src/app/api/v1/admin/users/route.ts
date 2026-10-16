import { NextResponse } from 'next/server';
import {
  PERMANENT_SUPERADMINS,
  ROLE_DEFINITIONS,
  UserRole,
  UserRoleRecord,
} from '@/lib/roles';

// In-memory server cache for role records (synced with client storage)
let serverRoleRecords: Map<string, UserRoleRecord> = new Map();

// Initialize permanent superadmins
PERMANENT_SUPERADMINS.forEach((email) => {
  serverRoleRecords.set(email.toLowerCase(), {
    email,
    role: 'SUPER_ADMIN',
    name: 'Platform Founder',
    assignedAt: new Date().toISOString(),
    assignedBy: 'System Root',
    isPermanent: true,
  });
});

export async function GET() {
  const users = Array.from(serverRoleRecords.values());
  return NextResponse.json({
    success: true,
    roles: ROLE_DEFINITIONS,
    users,
    permanentSuperAdmins: PERMANENT_SUPERADMINS,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, role, name, assignedBy } = body;

    if (!email || !role || !ROLE_DEFINITIONS[role as UserRole]) {
      return NextResponse.json(
        { success: false, error: 'Valid email and role are required' },
        { status: 400 }
      );
    }

    const normalized = email.trim().toLowerCase();

    // Prevent demoting permanent superadmins
    if (PERMANENT_SUPERADMINS.includes(normalized) && role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        {
          success: false,
          error: `Пользователь ${email} является постоянным супер-администратором платформы и не может быть понижен.`,
        },
        { status: 403 }
      );
    }

    const record: UserRoleRecord = {
      email: email.trim(),
      role: role as UserRole,
      name: name || email.split('@')[0],
      assignedAt: new Date().toISOString(),
      assignedBy: assignedBy || 'Superadmin',
      isPermanent: PERMANENT_SUPERADMINS.includes(normalized),
    };

    serverRoleRecords.set(normalized, record);

    return NextResponse.json({
      success: true,
      message: `Роль ${ROLE_DEFINITIONS[role as UserRole].label} успешно назначена пользователю ${email}`,
      user: record,
      users: Array.from(serverRoleRecords.values()),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update user role' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email parameter required' }, { status: 400 });
    }

    const normalized = email.trim().toLowerCase();
    if (PERMANENT_SUPERADMINS.includes(normalized)) {
      return NextResponse.json(
        { success: false, error: 'Нельзя удалить роль корневого суперадмина платформы' },
        { status: 403 }
      );
    }

    serverRoleRecords.delete(normalized);

    return NextResponse.json({
      success: true,
      message: `Роль для ${email} сброшена`,
      users: Array.from(serverRoleRecords.values()),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete role' },
      { status: 500 }
    );
  }
}
