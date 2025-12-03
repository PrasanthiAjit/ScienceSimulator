export enum Subject {
  PHYSICS = 'Physics',
  CHEMISTRY = 'Chemistry',
  BIOLOGY = 'Biology',
  LIFESCIENCE = 'Life Science'
}

export enum EducationLevel {
  ELEMENTARY = 'Elementary',
  MIDDLE = 'Middle School',
  HIGH = 'High School'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface Chemical {
  formula: string;
  name: string;
  state: 's' | 'l' | 'g' | 'aq';
  type: 'acid' | 'base' | 'salt' | 'metal' | 'oxide' | 'household';
  color: string;
}

export interface SimulationResult {
    balancedEquation: string;
    products: string[];
    observation: string;
    type: string;
    enthalpy: 'Exothermic' | 'Endothermic' | 'Neutral';
}

export interface Genotype {
    alleles: string; // e.g. "Bb"
    label: string; // e.g. "Heterozygous"
}