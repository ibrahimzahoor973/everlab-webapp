export interface DiagnosticMetric {
  name: string;
  oruSonicCodes: string[];
  diagnostic: string;
  diagnosticGroups: string;
  oruSonicUnits: string[];
  units: string;
  minAge: number;
  maxAge: number;
  gender: 'Any' | 'Male' | 'Female';
  standardLower: number | null;
  standardHigher: number | null;
  everlabLower: number | null;
  everlabHigher: number | null;
}

export interface HL7Data {
  _id?: string;
  type?: string;
  name?: string;
  patientValue?: string;
  units?: string;
  standard_lower?: string;
  standard_higher?: string;
  everlab_lower?: string;
  everlab_higher?: string;
  abnormal?: boolean;
  labAbnormal?: boolean;
  date?: string;
  id: string;
  messageType: string;
  patientName: string;
  patientId: string;
  observationDate: string;
  testName: string;
  diagnostic: string;
  result: string;
  unit: string;
  referenceRange: string;
  isAbnormal: boolean;
  standardRange: string;
  everlabRange: string;
}

export interface Patient {
  name: string;
  id: string;
  age?: number;
  gender?: string;
}