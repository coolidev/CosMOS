import moment from 'moment';
import type { ISave } from './types/preference';

export const BASE_VALS: ISave = {
  id: 'project-created',
  dateTime: Math.round(moment().valueOf() / 1000),
  selectedTabRight: 'networkSelection',
  selectedTabCenter: 'groundStations',
  selectedFrequencyBandId: 0,
  selectedSystemId: 0,
  selectedNetworks: [],
  isBaseline: true,
  isCompared: false,
  parameters: {
    isOrbital: true,
    orbitState: 0,
    altitude: 300,
    inclination: 30,
    latitude: 30,
    longitude: 30,
    raan: 0,
    ltan: '12:00',
    eccentricity: 0,
    argumentOfPerigee: 0,
    trueAnomaly: 0,
    gain: 0,
    transmitterPower: 0,
    eirp: 0,
    sunSyncUseAlt: true
  },
  specifications: {
    availability: 100,
    throughput: 1,
    tolerableGap: 50,
    trackingServiceRangeError: 20,
    eirp: -1
  },
  constraints: {
    throughputFlag: true,
    launchYear: new Date().getFullYear() + 1,
    launchMonth: new Date().getMonth() + 1,
    launchDay: new Date().getDate(),
    endYear: new Date().getFullYear() + 2,
    endMonth: new Date().getMonth() + 1,
    endDay: new Date().getDate(),
    defaultTime: true,
    powerAmplifier: 1,
    freqBandFilter: -1,
    centerFreqFilter: -1,
    polarizationType: -1,
    modulationFilter: '',
    codingFilter: ''
  },
  commsSpecs: {
    dataVolumeGb_day: 1,
    dataRateKbps: 1000,
    freqBand: 0,
    centerBand: null,
    standardsCompliance: 0,
    coverageMetrics: {
      meanNumContacts: 10,
      meanContactDur: 50,
      averageGap: 20,
      maxGap: 50,
      meanResponse: 1,
      meanRFCoverage: 0,
      serviceEfficiency: 65
    },
    commsPayloadSpecs: {
      minEIRPFlag: true,
      gain: null,
      eirp: null,
      polarizationType: -1,
      polarizationLoss: 0,
      passiveLoss: 0,
      pointingLoss: 0,
      transmitterPower: null,
      otherLoss: 0,
      modulation: -1,
      coding: -1,
      codingType: 1,
      gainOn: false
    }
  },
  results: {
    dataRate_kbps: 0,
    eirp_dBW: 0,
    ebNo_dB: 0,
    throughput_Gb_Day: 0,
    maxThroughput_Gb_Day: 0
  },
  networkFilters: {
    name: [],
    type: '',
    operationalYear: null,
    supportedFrequencies: '',
    location: '',
    scanAgreement: ''
  },
  groundStationFilters: {
    name: [],
    networks: [],
    operationalYear: null,
    supportedFrequencies: '',
    location: '',
    scanAgreement: 'none'
  },
  regressionTypes: {}
};

export const external = false;
