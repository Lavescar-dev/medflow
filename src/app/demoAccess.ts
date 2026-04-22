export const DEMO_ACCESS_ROUTE = '/demo-access';

const DEMO_SESSION_KEY = 'medflow:demo-session';
const DEMO_SESSION_TTL_MS = 8 * 60 * 60 * 1000;

export interface DemoSession {
  accessId: string;
  name: string;
  email: string;
  role: string;
  organization: string;
  startedAt: string;
}

export interface DemoAccessDraft {
  name: string;
  email: string;
  role: string;
  organization: string;
}

function hasWindow() {
  return typeof window !== 'undefined';
}

export function createDemoSession(draft: DemoAccessDraft): DemoSession {
  return {
    accessId: `demo-${Math.random().toString(36).slice(2, 10)}`,
    name: draft.name.trim(),
    email: draft.email.trim(),
    role: draft.role.trim(),
    organization: draft.organization.trim(),
    startedAt: new Date().toISOString(),
  };
}

export function readDemoSession(): DemoSession | null {
  if (!hasWindow()) {
    return null;
  }

  try {
    const raw = window.sessionStorage.getItem(DEMO_SESSION_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<DemoSession>;
    if (
      typeof parsed !== 'object' ||
      typeof parsed?.accessId !== 'string' ||
      typeof parsed?.name !== 'string' ||
      typeof parsed?.email !== 'string' ||
      typeof parsed?.role !== 'string' ||
      typeof parsed?.organization !== 'string' ||
      typeof parsed?.startedAt !== 'string'
    ) {
      window.sessionStorage.removeItem(DEMO_SESSION_KEY);
      return null;
    }

    const startedAt = new Date(parsed.startedAt);
    if (Number.isNaN(startedAt.getTime()) || Date.now() - startedAt.getTime() > DEMO_SESSION_TTL_MS) {
      window.sessionStorage.removeItem(DEMO_SESSION_KEY);
      return null;
    }

    return parsed as DemoSession;
  } catch {
    window.sessionStorage.removeItem(DEMO_SESSION_KEY);
    return null;
  }
}

export function writeDemoSession(session: DemoSession) {
  if (!hasWindow()) {
    return;
  }

  window.sessionStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(session));
}

export function clearDemoSession() {
  if (!hasWindow()) {
    return;
  }

  window.sessionStorage.removeItem(DEMO_SESSION_KEY);
}
