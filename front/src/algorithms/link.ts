import type { 
  LookupTable,
  SystemParams,
  LinkParams
} from 'src/types/evaluation';
import type { State } from 'src/pages/home';
import { boltzmann_dBW_HzK, EARTH_RADIUS_m } from 'src/utils/constants/physical';

/**
 * Parameters needed to calculate gain. 
 *
 * @export
 * @interface GainInputs
 */
export interface GainInputs {
  eirp: number;
  powerAmplifier: number;
  isPhasedArray: boolean;
};

/**
 * Calculate EIRP
 * @param {SystemParams} systemCharacteristics
 * @param {LinkParams} linkParams
 * @param {State} state
 * @return {number =>}
 */
export const computeEirp = (systemCharacteristics: SystemParams, linkParams: LinkParams, state: State): number => {
  const { 
    isBentPipe,
    gOverT,
    implementationLoss,
    atmosphericLoss_dB,
    rainAttenuation_dB,
    cloudAttenuation_dB,
    scintillationLoss_dB,
    // polarizationLoss_dB,
    sslAtmosphericLoss_dB,
    rtnLinkFreqMHz,
    theta,
    elevationConstraint_deg,
    networkType,
    systemName,
    sglRelayEirp_dBW,
    A_r,
    gatewayGOverT_dB_K,
    sglFrequency_MHz,
    relayToGroundDistance_km,
    sslBandwidth_dBHz,
    sglBandwidth_dBHz,
    carrierToInterferenceRatio_dB,
    rfInterferenceLoss_dB,
    imDegradation_dB,
    sglAtmosphericLoss_dB,
    sglRainAttenuation_dB,
    sglPolarizationLoss_dB,
  } = systemCharacteristics;
  const { propagationLosses } = linkParams;
  const {
    isOrbital,
    longitude,
    latitude,
    altitude
  } = state.parameters;
  const {
    ebNo_dB,
    dataRate_kbps
  } = state.results;

  const prec = computePrec(
    isBentPipe, gOverT, implementationLoss, 
    ebNo_dB, dataRate_kbps, systemName,
    sglRelayEirp_dBW, sglPolarizationLoss_dB,
    gatewayGOverT_dB_K, sglFrequency_MHz,
    relayToGroundDistance_km,
    sslBandwidth_dBHz, sglBandwidth_dBHz,
    carrierToInterferenceRatio_dB, rfInterferenceLoss_dB,
    imDegradation_dB, sglAtmosphericLoss_dB, sglRainAttenuation_dB,
    NaN, (state.commsSpecs.commsPayloadSpecs.pointingLoss ?? 0), (state.commsSpecs.commsPayloadSpecs.otherLoss ?? 0),(state.commsSpecs.commsPayloadSpecs.polarizationLoss ?? 0), null
  );
  const freeSpaceLoss = computeFreeSpaceLoss(
    rtnLinkFreqMHz, theta, altitude, 
    A_r, elevationConstraint_deg, networkType
  );

  let propagationLoss_dB: number;
  if (networkType === 'dte') {
    propagationLoss_dB = atmosphericLoss_dB + rainAttenuation_dB + cloudAttenuation_dB + scintillationLoss_dB;
  } else if (networkType === 'relay' && isOrbital) {
    propagationLoss_dB = sslAtmosphericLoss_dB;
  } else {
    const losses = getPropagationLosses(propagationLosses, longitude, latitude);
    propagationLoss_dB = Object.values(losses).reduce((sum, loss) => sum + loss);
  }

  if(!state.commsSpecs.commsPayloadSpecs.minEIRPFlag){
    return state.commsSpecs.commsPayloadSpecs.eirp
  } else {
    return prec + freeSpaceLoss + propagationLoss_dB;
  }
};

/**
 * Calculate Gain
 * @param {GainInputs} inputs
 * @return {number =>}
 */
export const computeGain = (inputs: GainInputs): number => {
  const { 
      eirp,
      powerAmplifier,
      isPhasedArray
  } = inputs;

  if (isPhasedArray) {
      return eirp + 20;
  } else {
      return eirp - 10 * Math.log10(powerAmplifier);
  }
};

/**
 * Calculate Path Distance
 * @param {number} theta_deg
 * @param {number} userAltitude_km
 * @param {number} relayAltitude_km
 * @param {number} elevationConstraint_deg
 * @param {string} networkType
 * @return {number =>}
 */
export const computePathDistance = (
    theta_deg: number, 
    userAltitude_km: number, 
    relayAltitude_km: number,
    elevationConstraint_deg: number,
    networkType: string
): number => {

  if (networkType === 'relay') {
    let theta_rad = theta_deg * Math.PI / 180;
    if (relayAltitude_km === 35786 && theta_deg > 8.66) {
      theta_rad = 8.66 * Math.PI / 180;
    } 

    const A_m = userAltitude_km * 1000 + EARTH_RADIUS_m;
    const B_m = relayAltitude_km * 1000 + EARTH_RADIUS_m;
  
    let distance_m = -Math.sqrt(Math.pow(A_m, 2) - Math.pow(B_m * Math.sin(theta_rad), 2)) + B_m * Math.cos(theta_rad);

    // In some cases, the geometric calculation of path distance fails.
    // This is a second equation that gives a pretty good estimate
    // of the max range between the user and relay. 
    if (isNaN(distance_m)) {
      distance_m = Math.sqrt(Math.pow(A_m, 2) + Math.pow(B_m, 2));
    }

    // Return the distance in km. 
    return distance_m / 1000;
  } else if (networkType === 'dte') {
    const theta_rad = (elevationConstraint_deg + 90) * Math.PI / 180;
    const slantRange_m = EARTH_RADIUS_m * Math.cos(theta_rad) + 
      Math.sqrt(Math.pow(userAltitude_km * 1000 + EARTH_RADIUS_m, 2) + 
      Math.pow(EARTH_RADIUS_m * Math.cos(theta_rad), 2) - Math.pow(EARTH_RADIUS_m, 2));

    return slantRange_m / 1000;
  }
};

/**
 * Calculate Free Space Loss
 * @param {number} frequency_MHz
 * @param {number} theta_deg
 * @param {number} userAltitude_km
 * @param {number} relayAltitude_km
 * @param {number} elevationConstraint_deg
 * @param {string} networkType
 * @return {number =>}
 */
export const computeFreeSpaceLoss = (
    frequency_MHz: number, 
    theta_deg: number, 
    userAltitude_km: number, 
    relayAltitude_km: number,
    elevationConstraint_deg: number,
    networkType: string
): number => {

    const pathDistance_km = computePathDistance(
      theta_deg, userAltitude_km, relayAltitude_km, 
      elevationConstraint_deg, networkType
    );

    return 32.45 + 20 * Math.log10(frequency_MHz) + 20 * Math.log10(pathDistance_km);
};


/**
 * Calculate Prec
 * @param {boolean} isBentPipe
 * @param {number} gOverT
 * @param {number} implementationLoss_dB
 * @param {number} ebNo
 * @param {number} dataRate_kbps
 * @param {string} systemName
 * @param {number} relayEirp_dBW
 * @param {number} polarizationLoss_dB
 * @param {number} gatewayGOverT_dB_K
 * @param {number} sglFrequency_MHz
 * @param {number} relayToGroundDistance_km
 * @param {number} sslBandwidth_dBHz
 * @param {number} sglBandwidth_dBHz
 * @param {number} carrierToInterferenceRatio_dB
 * @param {number} rfInterferenceLoss_dB
 * @param {number} imDegradation_dB
 * @param {number} atmosphericLoss_dB
 * @param {number} rainAttenuation_dB
 * @return {number =>}
 */
export const computePrec = (
  isBentPipe: boolean,
  gOverT: number,
  implementationLoss_dB: number,
  ebNo: number,
  dataRate_kbps: number,
  systemName: string,
  relayEirp_dBW: number,
  polarizationLoss_dB: number,
  gatewayGOverT_dB_K: number,
  sglFrequency_MHz: number,
  relayToGroundDistance_km: number,
  sslBandwidth_dBHz: number,
  sglBandwidth_dBHz: number,
  carrierToInterferenceRatio_dB: number,
  rfInterferenceLoss_dB: number,
  imDegradation_dB: number,
  atmosphericLoss_dB: number,
  rainAttenuation_dB: number,
  dteEirP_dBw: number,
  pointingLoss_dB: number,
  otherLosses_dB: number,
  polarization_dB: number,
  losses?: {freeSpaceLoss: number, atmosphericLoss: number, polarizationLoss: number, totalPropLosses: number, miscLosses: number, pointingLoss: number}
): number => {
    // If the system is regenerative, only include the space-to-space link. 
    // If the system is bent-pipe, add in the space-to-ground link as well.
    if (!isBentPipe) {
      if(!isNaN(dteEirP_dBw) && dteEirP_dBw != null){
        return computePrecFromEirp(dteEirP_dBw, losses.freeSpaceLoss, losses.atmosphericLoss, losses.polarizationLoss, losses.totalPropLosses, losses.miscLosses, losses.pointingLoss, otherLosses_dB);
      } else {
        return boltzmann_dBW_HzK - gOverT + ebNo + implementationLoss_dB + 10 * Math.log10(1000 * dataRate_kbps);
      }
    } else {
      const cOverNo = calculateCOverNo(
        relayEirp_dBW, 
        atmosphericLoss_dB,
        polarizationLoss_dB,
        rainAttenuation_dB,
        gatewayGOverT_dB_K, 
        sglFrequency_MHz, 
        relayToGroundDistance_km
      );
      const dataRate_dBbps = 10 * Math.log10(dataRate_kbps * 1000);

      let prec: number;
      const carrierToInterferenceExists = !isNaN(carrierToInterferenceRatio_dB) && carrierToInterferenceRatio_dB !== null;
      const imDegradationExists = !isNaN(imDegradation_dB) && imDegradation_dB !== null;

      if (carrierToInterferenceExists && imDegradationExists) {
        prec = boltzmann_dBW_HzK + sslBandwidth_dBHz - gOverT + 10 * Math.log10(1 / (
          (1 / Math.pow(10, (ebNo + implementationLoss_dB + rfInterferenceLoss_dB + dataRate_dBbps - sslBandwidth_dBHz) / 10)) - 
          (1 / Math.pow(10, (cOverNo - imDegradation_dB - sglBandwidth_dBHz) / 10)) - 
          (1 / Math.pow(10, carrierToInterferenceRatio_dB / 10))
        ));
      } else if (imDegradationExists) {
        prec = boltzmann_dBW_HzK + sslBandwidth_dBHz - gOverT + 10 * Math.log10(1 / (
          (1 / Math.pow(10, (ebNo + implementationLoss_dB + rfInterferenceLoss_dB + dataRate_dBbps - sslBandwidth_dBHz) / 10)) - 
          (1 / Math.pow(10, (cOverNo - imDegradation_dB - sglBandwidth_dBHz) / 10))
        ));
      } else if (carrierToInterferenceExists) {
        prec = boltzmann_dBW_HzK + sslBandwidth_dBHz - gOverT + 10 * Math.log10(1 / (
          (1 / Math.pow(10, (ebNo + implementationLoss_dB + rfInterferenceLoss_dB + dataRate_dBbps - sslBandwidth_dBHz) / 10)) - 
          (1 / Math.pow(10, (cOverNo - sglBandwidth_dBHz) / 10)) - 
          (1 / Math.pow(10, carrierToInterferenceRatio_dB / 10))
        ));
      } else {
        prec = boltzmann_dBW_HzK + sslBandwidth_dBHz - gOverT + 10 * Math.log10(1 / (
          (1 / Math.pow(10, (ebNo + implementationLoss_dB + rfInterferenceLoss_dB + dataRate_dBbps - sslBandwidth_dBHz) / 10)) - 
          (1 / Math.pow(10, (cOverNo - sglBandwidth_dBHz) / 10))
        ));
      }

      // For TDRS, the minimum Prec is -184.1 dBW. 
      if (systemName.includes('TDRS') && prec < -184.1) prec = -184.1;

      return prec;
    }   
};

export const computePrecFromEirp = (
  eirp_dBW: number,
  freeSPacePathLoss_dB: number,
  atmosphericLoss_dB: number,
  polarizationLoss_dB: number,
  totalPropagationLoss_dB: number,
  miscLosses_dB: number,
  pointingLoss_dB: number,
  otherLosses_dB: number,
  ):number => {
    return eirp_dBW - freeSPacePathLoss_dB - atmosphericLoss_dB - polarizationLoss_dB - otherLosses_dB - totalPropagationLoss_dB - miscLosses_dB - pointingLoss_dB
}

/**
 * Returns the Eb/No corresponding to a target EIRP,
 * for a given user altitude and data rate. 
 * @param {number} gOverT
 * @param {number} cOverNo
 * @param {number} implementationLoss
 * @param {number} eirp
 * @param {number} dataRate_kbps
 * @param {number} frequency_MHz
 * @param {number} theta_deg
 * @param {number} userAltitude_km
 * @param {number} relayAltitude_km
 * @param {number} elevationConstraint_deg
 * @param {string} networkType
 * @return {number =>}
 */
export const computeEbNoFromEirp = (
  gOverT: number,
  cOverNo: number,
  implementationLoss: number,
  eirp: number,
  dataRate_kbps: number,
  frequency_MHz: number, 
  theta_deg: number, 
  userAltitude_km: number, 
  relayAltitude_km: number,
  elevationConstraint_deg: number,
  networkType: string
): number => {

  // Compute the required Prec from the required EIRP. 
  const freeSpaceLoss = computeFreeSpaceLoss(
    frequency_MHz, theta_deg, userAltitude_km, relayAltitude_km, 
    elevationConstraint_deg, networkType
  );
  const prec = eirp - freeSpaceLoss;

  // If no C/No value is provided, the system is
  // regenerative. Otherwise, it is a bent-pipe system. 
  let ebNo = NaN;
  if (cOverNo === null) {
    ebNo = prec + 228.6 + gOverT - implementationLoss - 10 * Math.log10(dataRate_kbps * 1000);
  } else {
    // Terms in the Prec equation for bent-pipe systems. 
    const a = Math.pow(10, (gOverT + 228.6 + cOverNo) / 10);
    const b = Math.pow(10, (gOverT + 228.6) / 10);
    const c = Math.pow(10, cOverNo / 10);

    ebNo = 10 * Math.log10(a * Math.pow(10, prec / 10) / 
      (c * dataRate_kbps * 1000 + b * dataRate_kbps * 1000 * 
      Math.pow(10, prec / 10))) - implementationLoss;
  }

  return ebNo;
};

/**
 * Calculate C/No
 * @param {number} relayEirp_dBW
 * @param {number} atmosphericLoss_dB
 * @param {number} polarizationLoss_dB
 * @param {number} rainAttenuation_dB
 * @param {number} gatewayGOverT_dB_K
 * @param {number} sglFrequency_MHz
 * @param {number} relayToGroundDistance_km
 * @return {=>}
 */
export const calculateCOverNo = (
  relayEirp_dBW: number,
  atmosphericLoss_dB: number,
  polarizationLoss_dB: number,
  rainAttenuation_dB: number,
  gatewayGOverT_dB_K: number,
  sglFrequency_MHz: number,
  relayToGroundDistance_km: number
) => {
  const freeSpaceLoss_dB = 32.45 + 20 * Math.log10(sglFrequency_MHz) + 
    20 * Math.log10(relayToGroundDistance_km);

  return relayEirp_dBW - freeSpaceLoss_dB - atmosphericLoss_dB -
    polarizationLoss_dB - rainAttenuation_dB + gatewayGOverT_dB_K -
    boltzmann_dBW_HzK;
};

/**
 * Calculate Data Rate
 * @param {number} throughput_Gb_Day
 * @param {number} coverage Between 0 and 1
 * @param {{modulation:string} modCodOptions
 * @param {string} coding
 * @param {number}[]} dataRate_kbps
 * @param {string} multipleAccess
 * @param {LookupTable} ebNoTable
 * @param {string} modulation?
 * @param {string} coding?
 * @return {=>}
 */
export const calculateDataRate = (
  throughput_Gb_Day: number,
  coverage: number, // Between 0 and 1
  modCodOptions: { modulation: string, coding: string, dataRate_kbps: number }[],
  multipleAccess: string,
  ebNoTable: LookupTable,
  modulation?: string,
  coding?: string
) => {
  let calculatedDataRate_kbps = NaN;
  let calculatedEbNo_dB = NaN;
  let selectedModulation = '';
  let selectedCoding = '';

  if (multipleAccess === 'TDMA') {
    if (modulation && coding) {
      const modCodOption = modCodOptions.find(option => 
        option.modulation === modulation && option.coding === coding);
      
      selectedModulation = modulation;
      selectedCoding = coding;
      calculatedDataRate_kbps = modCodOption.dataRate_kbps;
      if (Object.keys(ebNoTable).includes(modulation)) {
        if (Object.keys(ebNoTable[modulation]).includes(coding)) {
          calculatedEbNo_dB = ebNoTable[modulation][coding];
        }
      }
    } else {
      let requiredDataRate_kbps = throughput_Gb_Day / coverage / 86400 * Math.pow(10, 6);
      if(isNaN(requiredDataRate_kbps)){
        requiredDataRate_kbps = 0;
      }
      calculatedDataRate_kbps = requiredDataRate_kbps;
      
      for (let modCodOption = 0; modCodOption < modCodOptions.length; modCodOption++) {
        const { modulation, coding, dataRate_kbps } = modCodOptions[modCodOption];
        const ebNo_dB = ebNoTable[modulation][coding];
        
        if (
          dataRate_kbps >= requiredDataRate_kbps &&
          (isNaN(calculatedEbNo_dB) || ebNo_dB < calculatedEbNo_dB)
        ) {
          calculatedDataRate_kbps = dataRate_kbps;
          calculatedEbNo_dB = ebNo_dB;
          selectedModulation = modulation;
          selectedCoding = coding;
        }
      }
    }
  } else {
    calculatedDataRate_kbps = throughput_Gb_Day / coverage / 86400 * Math.pow(10, 6);
    if(isNaN(calculatedDataRate_kbps)){
      calculatedDataRate_kbps = 0;
    }
  }

  return {
    dataRate_kbps: calculatedDataRate_kbps,
    ebNo_dB: calculatedEbNo_dB,
    modulation: selectedModulation,
    coding: selectedCoding
  };
};

/**
 * Calculate Maximum Achievable Data Rate
 * @param {number} maxDataRate_kbps
 * @param {number} bandwidth_MHz
 * @param {LookupTable} modCodTable
 * @param {string} modulation
 * @param {string} coding
 * @return {number =>}
 */
export const calculateMaxAchievableDataRate = (
  maxDataRate_kbps: number,
  bandwidth_MHz: number, 
  modCodTable: LookupTable, 
  modulation: string,
  coding: string
): number => {
  const threshold = modCodTable[modulation][coding];

  // Return the max achievable data rate in kbps. 
  // max achievable data rate = max threshold * max bandwidth
  const maxCalculatedDataRate_kbps = threshold * bandwidth_MHz * 1000;
  return Math.min(maxCalculatedDataRate_kbps, maxDataRate_kbps);
};

/**
 * Get Propogation Losses
 * @param {LookupTable} propagationLosses
 * @param {number} longitude_deg
 * @param {number} latitude_deg
 * @return {{ [key: string]: number } =>}
 */
export const getPropagationLosses = (
  propagationLosses: LookupTable,
  longitude_deg: number,
  latitude_deg: number
): { [key: string]: number } => {
  // 
  const oneTypeOfLoss = propagationLosses[Object.keys(propagationLosses)[0]];

  const longitudes = [];
  const longitudeDistances = [];
  Object.keys(oneTypeOfLoss).forEach(longitudeKey => {
    longitudes.push(longitudeKey);
    longitudeDistances.push(Math.abs(parseFloat(longitudeKey) - longitude_deg));
  });
  const closestLongitudeIndex = longitudeDistances.indexOf(Math.min(...longitudeDistances));
  const longitudeKey = longitudes[closestLongitudeIndex];

  const latitudes = [];
  const latitudeDistances = [];
  Object.keys(oneTypeOfLoss[longitudeKey]).forEach(latitudeKey => {
    latitudes.push(latitudeKey);
    latitudeDistances.push(Math.abs(parseFloat(latitudeKey) - latitude_deg));
  });
  const closestLatitudeIndex = latitudeDistances.indexOf(Math.min(...latitudeDistances));
  const latitudeKey = latitudes[closestLatitudeIndex];

  const losses: { [key: string]: number } = {};
  Object.keys(propagationLosses).forEach(typeOfLoss => {
    losses[typeOfLoss] = propagationLosses[typeOfLoss][longitudeKey][latitudeKey];
  });

  return losses;
};