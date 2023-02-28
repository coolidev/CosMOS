export type SystemType = 'dte' | 'relay' | 'default';

export type NetworkState = 'dte' | 'relay' | 'Station';

export interface FrequencyBand {
  id: number;
  name: string;
}

export interface Relay {
  id: number;
  system: string;
  ioc_year: number | string;
  total_satellites?: number;
  altitude: number;
  relay_description: string;
  max_return_data_rate: number;
  ssl_return_link_freq: number;
  picture?: string;
  versions: { [key: string]: number };
}

export interface Dte {
  system: string;
  location?: string;
  numLocations?: number;
  year: number | string;
  supportedFrequencies: string;
}

export interface System {
  id?: number;
  name?: string;
  systemName?: string;
  system: string;
  type: SystemType;
  location?: string;
  year: number | string;
  supportedFrequencies: string;
  picture?: string;
}

export interface Station {
  id: number;
  name: string;
  networks: string;
  numAntennas: number;
  supportedFrequencies: string;
  location: string;
  type: SystemType;
  antennaId?: number;
  version?: number;
  antennaNames: string;
  antennaPolarizations: string;
  antennaSize: string;
  minFrequency: string;
  maxFrequency: string;
  eirpValues: string;
  antennaGain: string;
  gtValues: string;
  dataFormat: string;
  modulationType: string;
  channelCodingType: string;
  subcarrierModulationType: string;
  SCANAgreement: string;
  startYear: string;
  stopYear: string;
  standardsCompliance:number;
}
