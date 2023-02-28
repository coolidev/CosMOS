import { State } from 'src/pages/home';
import {
  PerformancePanel,
  SystemParams,
  GroundStationCharacteristics
} from 'src/types/evaluation';
import { getOrbitalModelValue, getValue } from 'src/algorithms/regressions';
import { interpolate } from 'src/algorithms/interpolation';

/**
 * Get the RF Coverage of the selected system(s)
 * @param {State} state
 * @param {PerformancePanel} data
 * @param {string} id?
 * @return {number =>}
 */
export const getCoverage = (state: State, data: PerformancePanel, id?: string): number => {
    let coverage: number;
    if (id) {
      if(state.noRegression){
        coverage = getOrbitalModelValue(
          state.parameters.altitude,
          state.parameters.inclination,
          `coveragePerStation-${id}`, 
          data.modelData,
          data.systemParams.systemName as string
        ) / 1440
      } else {
        coverage = getValue(
          state.parameters.altitude, 
          state.parameters.inclination, 
          `coveragePerStation-${id}`,
          'gam', 
          data.predictedData,
          ''
        ) / 1440;
      }
      if(isNaN(coverage)){
        try{
          coverage = parseFloat(data.coveragePerStation.filter((element) => {return element.id.toString() === id})[0].coverageMinutes)/1440;
        }catch{}
      }
    } else if (state.networkType === 'relay') {
      if (state.parameters.isOrbital) {
        if(state.noRegression){
          coverage = getOrbitalModelValue(
              state.parameters.altitude,
              state.parameters.inclination,
              'coverage', 
              data.modelData,
              data.systemParams.systemName as string,
            ) / 100
        }else {
          coverage = getValue(
            state.parameters.altitude,
            state.parameters.inclination,
            'coverage',
            data.predictedData.regressionDefaults.regressionTypes['coverage'],
            data.predictedData,
            data.systemParams.systemName as string,
          ) / 100;
        }
        
      } else {
        coverage = interpolate(
          state.parameters.longitude,
          state.parameters.latitude,
          'coverage',
          data.modelData.terrestrial['coverage'].table
        ) / 100;
      }
    } else if (state.networkType === 'dte') {
      if(state.noRegression){
        coverage = getOrbitalModelValue(
          state.parameters.altitude,
          state.parameters.inclination,
          'coverageMinutes', 
          data.modelData,
          data.systemParams.systemName as string
        ) / 1440
      } else {
        coverage = getValue(
          state.parameters.altitude,
          state.parameters.inclination,
          'coverageMinutes',
          data.predictedData.regressionDefaults.regressionTypes['coverageMinutes'],
          data.predictedData,
          data.systemParams.systemName as string
      ) / 1440;
      }
    }

    // If a negative value is calculated for coverage,
    // set the coverage to 0. 
    if (coverage < 0 || isNaN(coverage)) coverage = 0;

    return coverage;
};

interface GetMaxThroughput {
  maxThroughput_Gb_Day: number;
  maxDataRate_kbps: number;
};


/**
 * Get the Max Throughput of the selected system(s)
 * @param {State} state
 * @param {PerformancePanel} data
 * @return {GetMaxThroughput =>}
 */
export const getMaxThroughput = (state: State, data: PerformancePanel): GetMaxThroughput => {
  let maxDataRate = NaN;
  let maxDataVolume = 0;
  const coverage = getCoverage(state, data);
  if (state.selectedItems.length > 1) {
    Object.keys(data.systemParams as { [key: string]: GroundStationCharacteristics }).forEach(item => {
      maxDataVolume += getCoverage(state, data, item) * data.systemParams[item].R_kbps / Math.pow(10, 6) * 86400;

      if (isNaN(maxDataRate) || data.systemParams[item].R_kbps > maxDataRate) {
        maxDataRate = data.systemParams[item].R_kbps;
      }
    });
  } else {
    const systemCharacteristics = data.systemParams as SystemParams;
    maxDataRate = systemCharacteristics.R_kbps;
    maxDataVolume = maxDataRate * coverage / Math.pow(10, 6) * 86400;
  }

  return {
    maxThroughput_Gb_Day: maxDataVolume,
    maxDataRate_kbps: maxDataRate
  };
};