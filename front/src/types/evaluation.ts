export interface Params {
  singleOrMultipleStations?: string;
  missionType?: string;
  system: number;
  systemName?: string;
  version?: number;
  model?: number;
  groundStation?: string;
  groundStations: number[];
  antenna?: number;
  frequencyBand: number;
  latitude?: number;
  longitude?: number;
  altitude: string;
  inclination: string;
  variabilityOption?: string;
  defaultEIRP?: number;
  eirp?: number; // The required EIRP for the current orbit, volume, and antenna parameters
  dataRate?: number; // The required data rate for the current volume and antenna parameters
  ebNo?: number; // The Eb/No corresponding to the current modulation and coding
  dataVolume?: number;
  coverage?: number;
  parabolicDiameter?: number;
  steerableSize?: number;
  helicalHeight?: number;
  showAllLinkOptions?: boolean;
}

export interface SystemParams {
  system: number;
  systemName: string;
  version: number;
  antennaId?: number;
  antennaName?: string;
  model: number;
  networkType: string;
  P_rec: number;
  G_relay: number;
  A_r: number;
  bandwidthMHz: number;
  defaultEbNo: number;
  inclination: number;
  fwdLinkFreqMHz: number;
  rtnLinkFreqMHz: number;
  operationalYear: number;
  trackingAccuracy: number | string;
  theta: number;
  T_sys: number;
  f_MHz: number;
  R_kbps: number;
  d1: number;
  eirp1: number;
  lambda: number;
  beam_type: string;
  modCodOptions: any; // TODO: Specify data type
  multipleAccess: string;
  gOverT: number;
  cOverNo: number;
  implementationLoss: number;
  polarizationLoss_dB?: number;
  propagationLosses_dB: number;
  otherLosses_dB: number;
  elevationConstraint_deg: number;
  sglFrequency_MHz?: number;
  sglRelayEirp_dBW?: number;
  relayToGroundDistance_km?: number;
  sglAtmosphericLoss_dB?: number;
  sglPolarizationLoss_dB?: number;
  sglRainAttenuation_dB?: number;
  gatewayGOverT_dB_K?: number;
  sslMultipathLoss_dB?: number;
  sslAtmosphericLoss_dB?: number;
  sslPolarizationLoss_dB?: number;
  sslRainAttenuation_dB?: number;
  sslBandwidth_dBHz?: number;
  imDegradation_dB?: number;
  sglBandwidth_dBHz?: number;
  isBentPipe?: boolean;
  prec_dBW?: number;
  isVariablePrec?: boolean;
  carrierToInterferenceRatio_dB?: number;
  rfInterferenceLoss_dB?: number;
  atmosphericLoss_dB?: number;
  rainAttenuation_dB?: number;
  cloudAttenuation_dB?: number;
  scintillationLoss_dB?: number;
};

// The coefficients used as input to the regression equations
// for a single system. There is a key for each metric that has
// data present for this system.
export interface RegressionCoefficients {
  [key: string]: number[];
}

// Data type to describe the lookup table structure
// used by the ModCod table and Eb/No table.
export interface LookupTable {
  [key: string]: { [key: string]: number };
}

// Reference data needed for link optimization algorithms.
export interface LinkParams {
  modCodTable: LookupTable;
  ebNoTable: LookupTable;
  propagationLosses: LookupTable;
}

export type Metric = {
  altitude?: number,
  inclination?: number,
  eccentricity?: number,
  latitude?: number,
  longitude?: number,
  theoryPoint?: boolean,
  value: number
}

export interface ModelPoints {}

// Stores model data for one system and one metric type.
export interface MetricData {
  type: string;
  label: string;
  points: Metric[];
}

// Stores terrestrial model data, a set of interpolated data ready
// to display in the heatmap plots, and the model data structured
// for input into the interpolation algorithm.
export interface TerrestrialData {
  heatmap: { x: number[]; y: number[]; z: number[] };
  interpolatedHeatmap: { x: number[]; y: number[]; z: number[] };
  table: number[][];
}

// Stores model data for one system for both orbital
// and terrestrial users. Each type of user references
// an object where the keys are metric types (coverage,
// average_gap, etc.).
export interface ModelData {
  orbital: { [key: string]: MetricData };
  terrestrial: { [key: string]: TerrestrialData };
}

export interface PredictedData {
  surfaces: { [key: string]: Metric[] };
  coefficients: RegressionCoefficients;
  regressionDefaults: {
    regressionTypes: { [key: string]: string };
    qualityIndicators: { [key: string]: string };
  };
  coveragePerStation?: { [key: string]: Metric[] };
};

// The data type returned to the System Evaluation view
// in the API response.
export interface SystemEvalData {
  coefficients: RegressionCoefficients;
  systemParams: SystemParams;
  linkParams: LinkParams;
  modelData: ModelData;
}

export interface StationCoverageMinutes {
  groundStation: number;
  coverageMinutes: number;
};

export interface SimEvent {
  name:string;
  duration:number;
}

export interface StationCoverageData {
  platformName:string;
  id?:number|null;
  coverageMinutes:number;
}

export interface SPAOrbitalPoint {
  altitude:number;
  inclination:number;
  eccentricity:number;
}

export interface PerformancePanel {
  coveragePerStation?: any;
  systemParams: RelayCharacteristics | GroundStationCharacteristics | { [key: string]: GroundStationCharacteristics };
  linkParams: LinkParams;
  modelData: ModelData;
  predictedData: PredictedData;
  simulationOutputDir: string;
  coverageData?:StationCoverageData[];  
  coverageEvents?:(SPAOrbitalPoint & {coverageEvents:SimEvent[]})[];
  gapEvents?:(SPAOrbitalPoint & {gapEvents:SimEvent[]})[];
  realTime:boolean;
};

export interface RelayCharacteristics {
  system: number;
  systemName: string;
  version: number;
  networkType: string;
  bandwidthMHz: number;
  defaultEbNo: number;
  inclination: number;
  fwdLinkFreqMHz: number;
  rtnLinkFreqMHz: number;
  operationalYear: number;
  A_r: number;
  f_MHz: number;
  R_kbps: number;
  lambda: number;
  theta: number;
  gOverT: number;
  cOverNo: number;
  implementationLoss: number;
  polarizationLoss_dB: number;
  propagationLosses_dB: number;
  otherLosses_dB: number;
  isBentPipe: boolean;
  prec_dBW: number;
  isVariablePrec: boolean;
  trackingAccuracy: string | number;
  multipleAccess: string;
  modCodOptions: any;
  sslMultipathLoss_dB: number;
  sslAtmosphericLoss_dB: number;
  sslPolarizationLoss_dB: number;
  sslRainAttenuation_dB: number;
  sslBandwidth_dBHz: number;
  sglFrequency_MHz: number;
  sglRelayEirp_dBW: number;
  relayToGroundDistance_km: number;
  sglAtmosphericLoss_dB: number;
  sglPolarizationLoss_dB: number;
  rainAttenuation_dB: number;
  gatewayGOverT_dB_K: number;
  imDegradation_dB: number;
  sglBandwidth_dBHz: number;
};

export interface GroundStationCharacteristics {
  systemName: string;
  version: number;
  networkType: string;
  antennaId: number;
  antennaName: string;
  elevationConstraint_deg: number;
  gOverT: number;
  implementationLoss: number;
  polarizationLoss_dB: number;
  propagationLosses_dB: number;
  otherLosses_dB: number;
  bandwidthMHz: number;
  rtnLinkFreqMHz: number;
  lambda: number;
  multipleAccess: string;
  modCodOptions: any;
  R_kbps: number;
};

export interface ModCodOption {
  modulationId: number;
  modulation: string;
  codingId: number;
  coding: string;
  dataRate_kbps?: number;
};

export interface SPATerrestrialPoint {
  latitude:number;
  longitude:number;
  altitude:number;
}
