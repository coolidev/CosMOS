import type { IResults } from 'src/pages/home';
import { number } from 'yup';

export interface Preference {
  project: Project[];
}

export interface Project {
  id: string;
  projectName: string;
  missionName: string;
  missionDescription: string;
  saves: ISave[];
}

export interface ISave {
  id?: string;
  name?: string;
  dateTime: number;
  selectedTabRight: string;
  selectedTabCenter: string;
  selectedFrequencyBandId: number;
  selectedSystemId: number;
  isBaseline: boolean;
  isCompared: boolean;
  parameters: Parameter;
  specifications: Specifications;
  constraints: Constraints;
  results: IResults;
  networkFilters: NetworkFilters;
  groundStationFilters: GroundStationFilters;
  selectedNetworks: SelectedNetwork[];
  commsSpecs: CommsSpecs;
  regressionTypes: { [key: string]: string };
  comparisonIds?: string[];
}

export interface Parameter {
  isOrbital: boolean;
  sunSyncUseAlt: boolean;
  orbitState: number;
  altitude: number;
  inclination: number;
  latitude: number;
  longitude: number;
  raan: number;
  ltan: string;
  eccentricity: number;
  argumentOfPerigee: number;
  trueAnomaly: number;
  gain: number;
  transmitterPower: number;
  eirp: number;
}

export interface Specifications {
  availability: number;
  throughput: number;
  tolerableGap: number;
  trackingServiceRangeError: number;
  eirp: number;
}

export interface StepDef {
  altitudeStep: {[key: string]: number}
  inclinationStep: {[key: string]: number}
  eccentricityStep: {[key: string]: number}
  timeStep: {start: Date, end: Date, step: number}
}

export interface Constraints {
  throughputFlag: boolean;
  launchDay: number;
  launchMonth: number;
  launchYear: number;
  endDay: number;
  endMonth: number;
  endYear: number;
  defaultTime: boolean;
  powerAmplifier: number;
  freqBandFilter: number;
  centerFreqFilter: number;
  polarizationType: number;
  modulationFilter: string;
  codingFilter: string;
}

export interface CommsSpecs {
  dataVolumeGb_day: number;
  dataRateKbps: number;
  freqBand: number;
  centerBand: number;
  standardsCompliance: number;
  coverageMetrics: {
    meanNumContacts: number;
    meanContactDur: number;
    averageGap: number;
    maxGap: number;
    meanResponse: number;
    meanRFCoverage: number;
    serviceEfficiency: number;
  },
  commsPayloadSpecs: {
    minEIRPFlag: boolean;
    gain: number;
    eirp: number;
    polarizationType: number;
    polarizationLoss: number;
    passiveLoss: number;
    pointingLoss: number;
    transmitterPower: number;
    otherLoss: number;
    modulation: number;
    coding: number;
    codingType: number;
    gainOn: boolean;
  }
  usingDataRate?: boolean;
}

export interface NetworkFilters {
  name: string[];
  type: string;
  operationalYear: string;
  supportedFrequencies: string;
  location: string;
  scanAgreement: string;
}

export interface GroundStationFilters {
  name: string[];
  networks: string[];
  operationalYear?: string;
  supportedFrequencies: string;
  location: string;
  scanAgreement: string;
}

export interface SelectedNetwork {
  id?: number;
  name?: string;
  system?: string;
  altitude?: number;
  type?: string;
  freqBandId?: number;
  supportedFrequencies?: string;
  version: number;
  versions?: { [key: string]: number };
  optimizedModCod: boolean;
  modulationId: number | null;
  modulation?: string;
  modulationType?: string;
  codingId: number | null;
  coding?: string;
  codingType?: string;
  channelCodingType?: string;
  antennaId: number | null;
  antennaName?: string;
  frequencyBandId?: number;
  serviceId?: number;
};