import {
  AntennaGainInputs,
  computeGainFromParabolicDiameter,
  computeGainFromSteerableSize,
  computeGainFromHelicalSize,
  computeEirpFromGain
} from './antennas';
import type {
  LookupTable,
  ModCodOption
} from 'src/types/evaluation';

// Assume that the power amplifier is 1 Watt.
const POWER_AMPLIFIER = 1;

/**
 * The input parameters needed for the algorithm
 * optimizing EIRP for a steerable antenna system.
 *
 * @export
 * @interface OptimizeEIRPInputs
 */
export interface OptimizeEIRPInputs {
  targetVolume_Gb_Day: number;
  defaultDataRate_kbps: number;
  systemBandwidth_MHz: number;
  modCodTable: LookupTable;
  ebNoTable: LookupTable;
  maxVolume_Gb_Day: number;
  coverage: number;
  systemName: string;
  multipleAccess: string;
  modCodOptions: any;
  frequency_MHz: number;
  theta_deg: number;
  isOrbital: boolean;
  userLongitude_deg: number;
  userLatitude_deg: number;
  userAltitude_km: number;
  relayAltitude_km: number;
  gOverT: number;
  implementationLoss: number;
  atmosphericLoss_dB: number;
  rainAttenuation_dB: number;
  cloudAttenuation_dB: number;
  scintillationLoss_dB: number;
  polarizationLoss_dB: number;
  sslAtmosphericLoss_dB: number;
  otherLosses_dB: number;
  elevationConstraint_deg: number;
  networkType: string;
  isBentPipe: boolean;
  propagationLosses: LookupTable;
  sglRelayEirp_dBW: number;
  gatewayGOverT_dB_K: number;
  sglFrequency_MHz: number;
  relayToGroundDistance_km: number;
  sslBandwidth_dBHz: number;
  sglBandwidth_dBHz: number;
  carrierToInterferenceRatio_dB: number;
  rfInterferenceLoss_dB: number;
  imDegradation_dB: number;
  sglAtmosphericLoss_dB: number;
  sglRainAttenuation_dB: number;
  sglPolarizationLoss_dB: number;
};

// interface LinkInformation {
//   prec: number;
//   freeSpaceLoss: number;
//   optimizedEirp: number;
//   dataRate: number;
//   ebNo: number;
//   modulation: string;
//   coding: string;
// };

// interface LinkOptions {
//   optimalOption: LinkInformation;
//   allOptions: LinkInformation[];
// };

/**
 * Return the optimal modulation and coding (the 
 * modulation and coding combination that minimizes 
 * EIRP) for the current configuration.
 * @param {ModCodOption[]} modCodOptions
 * @param {string} multipleAccess
 * @param {number} throughput_Gb_Day
 * @param {number} coverage
 * @param {number} bandwidth_MHz
 * @param {LookupTable} modCodTable
 * @param {LookupTable} ebNoTable
 * @return {ModCodOption =>}
 */
export const getOptimalModCod = (
  modCodOptions: ModCodOption[],
  multipleAccess: string,
  throughput_Gb_Day: number,
  coverage: number,
  bandwidth_MHz: number,
  modCodTable: LookupTable,
  ebNoTable: LookupTable
): ModCodOption => {
  let dataRate_kbps = throughput_Gb_Day / coverage * Math.pow(10, 6) / 86400;
  if(isNaN(dataRate_kbps)){
    dataRate_kbps = 0;
  }
  const requirement = dataRate_kbps / (1000 * bandwidth_MHz);
  let ebNo = NaN;
  let modCodOption: ModCodOption;

  if (multipleAccess === 'TDMA') {
    // For networks using a TDMA scheme, there
    // is only one valid modulation and coding 
    // combination for the current required
    // data rate. 
    let requiredDataRate_kbps = throughput_Gb_Day / coverage / 86400 * Math.pow(10, 6);
    if(isNaN(requiredDataRate_kbps)){
      requiredDataRate_kbps = 0;
    }
    // let minPossibleDataRate = requiredDataRate_kbps;
    
    for (let i = 0; i < modCodOptions.length; i++) {
      const { modulation, coding, dataRate_kbps } = modCodOptions[i];
      const currentEbNo = ebNoTable[modulation][coding];
      
      if (
        dataRate_kbps >= requiredDataRate_kbps &&
        (isNaN(ebNo) || currentEbNo < ebNo)
      ) {
        modCodOption = modCodOptions[i];
        // minPossibleDataRate = dataRate_kbps;
        ebNo = currentEbNo;
      }
    }
  } else {
    // For networks not using a TDMA scheme, choose
    // the modulation and coding that allows the 
    // required data rate to fit inside the available
    // bandwidth, AND that minimizes EIRP. 
    for (let i = 0; i < modCodOptions.length; i++) {
      const { modulation, coding } = modCodOptions[i];
      const threshold = modCodTable[modulation][coding];
      const currentEbNo = ebNoTable[modulation][coding];

      if ((isNaN(ebNo) || currentEbNo < ebNo) && threshold > requirement) {
        modCodOption = modCodOptions[i];
        ebNo = currentEbNo;
      }
    }
  }
  if(!modCodOption){
    modCodOption = {coding: "Rate 1/2", codingId: 2, modulation: "QPSK", modulationId: 1}
  }
  return modCodOption;
};

/**
 * ModCod Combination
 * @export
 * @interface ModCodCombination
 */
export interface ModCodCombination {
  modulationId: number;
  modulation: string;
  codingId: number;
  coding: string;
  dataRate_kbps?: number;
};

/**
 * Input parameters for getValidModCods function
 * @export
 * @interface GetValidModCodInputs
 */
export interface GetValidModCodInputs {
  dataRate_kbps: number;
  bandwidth_MHz: number;
  modCodTable: LookupTable;
  modCodOptions: ModCodCombination[];
  multipleAccess: string;
};

/**
 * Get Valid ModCod options
 * @param {GetValidModCodInputs} inputs
 * @return {ModCodCombination[] =>}
 */
export const getValidModCods = (inputs: GetValidModCodInputs): ModCodCombination[] => {
  const {
    dataRate_kbps,
    bandwidth_MHz,
    modCodTable,
    modCodOptions,
    multipleAccess
  } = inputs;

  const requirement = dataRate_kbps / (1000 * bandwidth_MHz);
  const validModCods: ModCodCombination[] = [];

  // When the network employs a TDMA scheme, there is only one
  // allowed modulation and coding pair for the given data rate. 
  if (multipleAccess === 'TDMA') {
    // The data rate input to this function should equal one of the 
    // options in the `modCodOptions` array, but in case of rounding
    // errors in calculating the input data rate, select the closest 
    // data rate from the array. 
    let correctOption: ModCodCombination;
    let smallestDistance: number = NaN;
    modCodOptions.forEach(option => {
      if (isNaN(smallestDistance) || Math.abs(option.dataRate_kbps - dataRate_kbps) < smallestDistance) {
        correctOption = option;
        smallestDistance = Math.abs(option.dataRate_kbps - dataRate_kbps);
      }
    });

    if (!correctOption) throw new Error(`No modulation and coding selected!`);
    else return [correctOption];
  } else {
    for (let index = 0; index < modCodOptions.length; index++) {
      const modCodOption = modCodOptions[index];
      const { modulation, coding } = modCodOption;
      const threshold = modCodTable[modulation][coding];
  
      // If the threshold is greater than the required threshold, 
      // this is a valid modulation and coding combination. 
      if (threshold > requirement) {
        validModCods.push(modCodOption);
      }
    }
  }

  return validModCods;
};

/**
 * The input parameters needed for the algorithm calculating
 * EIRP given an antenna type and size.
 * @export
 * @interface AntennaSizeToEIRPInputs
 */
export interface AntennaSizeToEIRPInputs {
  antennaParameter: string;
  antennaSize: number;
  wavelength: number;
}

/**
 * Given the type of the antenna and the antenna size,
 * calculate the EIRP.
 * @param {AntennaSizeToEIRPInputs} inputs
 * @return {number =>}
 */
export const ConvertAntennaSizeToEIRP = (
  inputs: AntennaSizeToEIRPInputs
): number => {
  const { antennaParameter, antennaSize, wavelength } = inputs;

  const antennaInputs: AntennaGainInputs = {
    size: antennaSize,
    wavelength: wavelength
  };

  let gain: number;
  switch (antennaParameter) {
    case 'parabolicDiameter':
      gain = computeGainFromParabolicDiameter(antennaInputs);
      return computeEirpFromGain(gain, POWER_AMPLIFIER, false);
    case 'steerableSize':
      gain = computeGainFromSteerableSize(antennaInputs);
      return computeEirpFromGain(gain, POWER_AMPLIFIER, true);
    case 'helicalHeight':
      gain = computeGainFromHelicalSize(antennaInputs);
      return computeEirpFromGain(gain, POWER_AMPLIFIER, false);
    default:
      return NaN;
  }
};

/**
 * The input parameters needed for the algorithm
 * optimizing data volume for a steerable antenna system.
 * @export
 * @interface OptimizeVolumeSteerableInputs
 */
export interface OptimizeVolumeSteerableInputs {
  targetEIRP: number;
  defaultDataRate_kbps: number;
  defaultEIRP: number;
  defaultEbNo: number;
  systemBandwidth_MHz: number;
  modCodTable: LookupTable;
  ebNoTable: LookupTable;
  coverage: number;
}

/**
 * Given EIRP, calculate the optimized data volume.
 * @param {any} inputs
 * @return {any =>}
 */
export const OptimizeThroughput = (inputs: any): any => {
  //computeEbNoFromEirp();
};

/**
 * Given EIRP, calculate the optimized data volume for
 * a steerable antenna system.
 * @param {OptimizeVolumeSteerableInputs} inputs
 * @return {any =>}
 */
export const OptimizeVolumeSteerable = (
  inputs: OptimizeVolumeSteerableInputs
): any => {
  const {
    targetEIRP,
    defaultDataRate_kbps,
    defaultEIRP,
    defaultEbNo,
    systemBandwidth_MHz,
    modCodTable,
    ebNoTable,
    coverage
  } = inputs;

  // A higher data rate corresponds to a lower Eb/No. So take the maximum
  // data rate and use it to find the lowest possible Eb/No allowed.
  let requiredDataRate_kbps: number = defaultDataRate_kbps;
  let minEbNo: number =
    targetEIRP -
    defaultEIRP +
    defaultEbNo -
    10 * Math.log10(requiredDataRate_kbps / defaultDataRate_kbps);

  // Find all ModCod combinations with Eb/No above the minimum allowed Eb/No
  // that ALSO meet the requirement [modcod > (data rate)/bandwidth]. Out of
  // these possible combinations, choose the one with the lowest Eb/No.
  // Convert the bandwidth to kHz since data rate is in kbps.
  const requirement = requiredDataRate_kbps / (1000 * systemBandwidth_MHz);
  let requiredEbNo: number = NaN;
  Object.keys(ebNoTable).forEach((mod: string) => {
    const row = ebNoTable[mod];
    Object.keys(row).forEach((cod: string) => {
      if (
        row[cod] >= minEbNo &&
        modCodTable[mod][cod] > requirement &&
        (row[cod] < requiredEbNo || isNaN(requiredEbNo))
      ) {
        requiredEbNo = row[cod];
      }
    });
  });

  // Check that the required Eb/No was properly set.
  if (isNaN(requiredEbNo)) {
  }

  requiredDataRate_kbps =
    defaultDataRate_kbps *
    Math.pow(10, (targetEIRP - defaultEIRP + defaultEbNo - requiredEbNo) / 10);

  // Calculate the data volume from the data rate and RF coverage,
  // and convert to Gb/Day.
  const optimizedVolume =
    (requiredDataRate_kbps * coverage * 86400) / Math.pow(10, 6);

  return {
    optimizedVolume: optimizedVolume,
    dataRate: requiredDataRate_kbps
  };
};
