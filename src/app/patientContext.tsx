import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'medflow:selected-patient';

export interface SharedPatient {
  id: string;
  fullName: string;
  tc: string;
  phone?: string;
  department?: string;
  doctor?: string;
  insurance?: string;
  complaint?: string;
  source?: string;
  protocolNo?: string;
}

interface PatientContextValue {
  currentPatient: SharedPatient | null;
  setCurrentPatient: (patient: SharedPatient | null) => void;
  clearCurrentPatient: () => void;
}

const PatientContext = createContext<PatientContextValue | null>(null);

function readInitialPatient() {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || typeof parsed.fullName !== 'string') {
      return null;
    }

    return parsed as SharedPatient;
  } catch {
    return null;
  }
}

export function PatientProvider({ children }: { children: React.ReactNode }) {
  const [currentPatient, setCurrentPatientState] = useState<SharedPatient | null>(readInitialPatient);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (!currentPatient) {
      window.sessionStorage.removeItem(STORAGE_KEY);
      return;
    }

    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(currentPatient));
  }, [currentPatient]);

  const value = useMemo<PatientContextValue>(
    () => ({
      currentPatient,
      setCurrentPatient: setCurrentPatientState,
      clearCurrentPatient: () => setCurrentPatientState(null),
    }),
    [currentPatient],
  );

  return <PatientContext.Provider value={value}>{children}</PatientContext.Provider>;
}

export function usePatientContext() {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error('usePatientContext must be used within PatientProvider');
  }

  return context;
}
