/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from 'react';
import { makeStyles, Grid } from '@material-ui/core';
import axios from 'src/utils/axios';
import { useDispatch, useSelector } from 'src/store';
import { 
  updateLinkBudget, 
  updatePerformancePanel
} from 'src/slices/results';
import type { 
  PerformancePanel,
  RelayCharacteristics,
  GroundStationCharacteristics
} from 'src/types/evaluation';
import type { State } from 'src/pages/home';
import {
  getCoverage,
  getMaxThroughput
} from 'src/algorithms/coverage';
import { setLinkBudgets } from 'src/algorithms/link-budget';
import { calculateDataRate } from 'src/algorithms/link';
import { getOptimalModCod } from 'src/algorithms/link-optimization';
import ResultGroup from 'src/components/Results/Performance/ResultGroup';
import AntennaSection from 'src/components/Results/Performance/AntennaSection';
import PointingSection from 'src/components/Results/Performance/PointingSection';
import NavSection from 'src/components/Results/Performance/NavSection';
import PerformanceSection from 'src/components/Results/Performance/PerformanceSection';
import type { Theme } from 'src/theme';
import { LinkBudgetRow } from 'src/types/link-budget';
import {checkUserDefinedNetwork} from 'src/algorithms/combineStations';

interface PerformanceProps {
  state: State;
  bounds: { [key: string]: { min: number, max: number } };
  visible: boolean;
  onState: (name: string, value: any) => void;
  onBounds: (name: string, type: string, value: number) => void;
  onError: (message: string, warning: boolean, title?: string) => void;
};

// const plotOptions = {
//   show_surface: true,
//   show_scatter: true
// };

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: '100%',
    overflowX: 'hidden',
    overflowY: 'auto'
  },
  hide: {
    display: 'none',
  }
}));

const Performance: FC<PerformanceProps> = ({
  state,
  bounds,
  visible,
  onState,
  onBounds,
  onError,
}) => {
  const [data, setData] = useState<PerformancePanel>(null);
  const [projectName, setProjectName] = useState<string | null>(null);
  const classes = useStyles();
  const dispatch = useDispatch();
  const { performancePanel, linkBudget } = useSelector(state => state.results);
  const { preference } = useSelector((state) => state.preference);
  const { project } = useSelector((state) => state.project);
  const { email } = useSelector((state) => state.user);
  // const {simulationOutputDir,results} = useSelector((state) => state.realTimeResults);


  useEffect(() => {
    if(!state.isDataLoaded){
      setData(null);
    }
  },[state.isDataLoaded]);

  const fetchData = async (): Promise<[PerformancePanel, { [key: string]: LinkBudgetRow[] }]> => {
    if (performancePanel && linkBudget) {
      return [performancePanel, linkBudget];
    } else {
      const value = preference.project.find((item) => item.id === project);
      value && setProjectName(value.projectName);
      let response;
      // var today = new Date()
      // let startDate = new Date(
      //   state.constraints.launchYear?? today.getFullYear() + 1, 
      //   state.constraints.launchMonth?? today.getMonth(), 
      //   state.constraints.launchDay?? today.getDate()
      // );
      // let endDate = new Date(
      //   state.constraints.endYear?? today.getFullYear() + 2, 
      //   state.constraints.endMonth?? today.getMonth(), 
      //   state.constraints.endDay?? today.getDate()
      // );
      let selectedNetworks = state.selectedItems.map((station) => {
        if(station.frequencyBandId === 0){
          station.frequencyBandId = 1;
        }
        return station;
      });
      let udnId;
      if(state.networkType !== 'relay' && state.selectedItems.length > 1) {
          udnId = await checkUserDefinedNetwork({
            selectedNetworks: state.selectedItems,
            frequencyBandId: state.selectedItems[0].frequencyBandId ?? 1,
            userAltitude_km: state.parameters.altitude,
            userInclination_deg: state.parameters.inclination
          });
        }
      if(state.pointSync){
        let stdParams : any = {
          missionName : projectName ?? 'couldnotfind',
          selectedNetworks : selectedNetworks,
          platformDefinition: {usatDefinition:{
            altitude : [state.parameters.altitude],
            inclination : [state.parameters.inclination],
            eccentricity : [state.parameters.eccentricity]??[0]
          },ugstDefinition:{}},
          userDefinedNetworkId : udnId,
          simPeriod: {startDate: state.step.timeStep.start, endDate: state.step.timeStep.end},
          stepSeconds: state.step.timeStep.step,
          withModel:true
        };
        if(state.parameters.isOrbital) {
          delete stdParams.platformDefinition.ugstDefinition;
          if(state.parametric) {
            stdParams.stepDefinition = {
              startAltitude : state.step.altitudeStep.start,
              stopAltitude : state.step.altitudeStep.end,
              altitudeStep : state.step.altitudeStep.step,
              startInclination : state.step.inclinationStep.start,
              stopInclination : state.step.inclinationStep.end,
              inclinationStep : state.step.inclinationStep.step,
              startEccentricity : state.parameters.orbitState === 1? state.step.eccentricityStep.start: 0,
              stopEccentricity : state.parameters.orbitState === 1? state.step.eccentricityStep.end: 0,
              eccentricityStep : state.parameters.orbitState === 1? state.step.eccentricityStep.step: 0.1,
          }
          } else if (state.parameters.orbitState === 2) {
            //sunsync
            stdParams.platformDefinition.usatDefinition = {...stdParams.platformDefinition.usatDefinition,
              altitude : [state.parameters.altitude],
              inclination : null,
            };
            //We need to fix this
            stdParams.ltan = state.parameters.ltan + ":00" ?? "12:00:00";
          }
        } else {
          //Someone fix this
          delete stdParams.platformDefinition.usatDefinition;
          stdParams.platformDefinition.ugstDefinition = {
            latitude : state.parameters.latitude,
            longitude : state.parameters.longitude,
            altitude : 0,
            minElevationAngle: 5,
            freqBandId: 1
          };
        }
          
          response = await axios.post('/requestParametricAnalysis', stdParams);

      } else {
        response = await axios.post('/requestSystemEval', {
          selectedItems: state.selectedItems,
            networkType: state.networkType,
            userDefinedNetworkId:state.userDefinedNetworkId,
            userId : email
        });
      }
      let linkBudgetType: string;
      if (state.networkType === 'relay') {
        const isBentPipe = response.data.systemParams.isBentPipe;
        linkBudgetType = isBentPipe ? 'relay-bent-pipe' : 'relay-regenerative';
      } else {
        linkBudgetType = 'dte';
      }

      let allLinkBudgets = {};
      await Promise.all(state.selectedItems.map(async item => {
        const axiosParams = {
          type: linkBudgetType,
          email: localStorage.getItem('email'),
          networkId: state.networkType === 'relay' ? item.id : 0,
          antennaId: state.networkType === 'dte' ? item.antennaId : 0
        };
        const linkBudgetResponse = await axios.get<{ linkBudget: LinkBudgetRow[] }>('/get-link-budget', { params: axiosParams });

        dispatch(updateLinkBudget(item.id.toString(), linkBudgetResponse.data.linkBudget));
        allLinkBudgets[item.id] = linkBudgetResponse.data.linkBudget;
      }));

      return [response.data, allLinkBudgets];
    }
  };

  const refreshData = async () => {
    fetchData().then(async response => {
      // if(state.pointSync) {

      //   return;
      // } 
      const data = response[0];
      const linkBudget = response[1];
      // onState('analysisData',data);
      let networkType = state.networkType;

      let newSystemParams;
      if (state.networkType === 'relay') {
        newSystemParams = data.systemParams as RelayCharacteristics;
      } else if (state.networkType === 'dte' && state.selectedItems.length === 1) {
        newSystemParams = data.systemParams as GroundStationCharacteristics;
      } else {
        newSystemParams = data.systemParams as { [key: string]: GroundStationCharacteristics };
      }

      if (networkType === 'dte') {
        const newSelectedItems = state.selectedItems.map(item => {
          let antennaId = 0;
          let antennaName = '';
          if (state.selectedItems.length > 1) {
            antennaId = newSystemParams[item.id].antennaId;
            antennaName = newSystemParams[item.id].antennaName;
          } else {
            antennaId = newSystemParams.antennaId;
            antennaName = newSystemParams.antennaName;
          }

          return {
            ...item,
            antennaId: antennaId,
            antennaName: antennaName
          };
        });

        onState('selectedItems', newSelectedItems);
      }

      
      if(!state.noRegression){
        // Set default regression types for each metric. 
        const newRegressionTypes: { [key: string]: string } = {};
        Object.keys(data.predictedData.regressionDefaults.regressionTypes).forEach(metricType => {
          /*if (Object.keys(state.regressionTypes).includes(metricType)) {
            newRegressionTypes[metricType] = state.regressionTypes[metricType];
          } else {
            newRegressionTypes[metricType] = data.predictedData.regressionDefaults.regressionTypes[metricType];
          }*/
          newRegressionTypes[metricType] = data.predictedData.regressionDefaults.regressionTypes[metricType];
        });
        onState('regressionTypes', newRegressionTypes);
        onState('qualityIndicators', data.predictedData.regressionDefaults.qualityIndicators);
      } 
      const coverage = getCoverage(state, data);

      // Use the coverage and the max data rate to determine the max
      // data volume for this user.
      let { maxThroughput_Gb_Day } = getMaxThroughput(state, data);

      
      const newSelectedItems = state.selectedItems.map(item => {
        const {
          modCodOptions,
          multipleAccess,
          bandwidthMHz,
          R_kbps
        } = state.selectedItems.length > 1 ? newSystemParams[item.id] : newSystemParams;

        let throughput = Math.min(state.commsSpecs.dataRateKbps, maxThroughput_Gb_Day);
        if (state.selectedItems.length > 1) {
          const stationCoverage = getCoverage(state, data, item.id.toString());
          throughput = R_kbps * stationCoverage / Math.pow(10, 6) * 86400;
        }

        let modulationId = item.modulationId;
        let modulation = item.modulation;
        let codingId = item.codingId;
        let coding = item.coding;
        let achievableDataRate_kbps = state.results.dataRate_kbps;
        if (!item.modulationId || !item.modulation || !item.codingId || !item.coding) {
          const modCodOption = getOptimalModCod(
            modCodOptions,
            multipleAccess,
            throughput,
            coverage,
            bandwidthMHz,
            data.linkParams.modCodTable,
            data.linkParams.ebNoTable
          );
          if (modCodOption) {
            modulationId = modCodOption.modulationId;
            modulation = modCodOption.modulation;
            codingId = modCodOption.codingId;
            coding = modCodOption.coding;
            achievableDataRate_kbps = modCodOption.dataRate_kbps;
          }
        }
        
        if (multipleAccess === 'TDMA') {
          maxThroughput_Gb_Day = achievableDataRate_kbps * coverage / Math.pow(10, 6) * 86400;
        }

        return {
          ...item,
          modulationId: modulationId,
          codingId: codingId,
          modulation: modulation,
          coding: coding
        };
      });
      onState('selectedItems', newSelectedItems);

      // Update the throughput input field in the parameters panel. 
      // If the current throughput is greater than the max possible
      // throughput for the selected network and the currently 
      // selected user, set the throughput to the max throughput. 
      let throughput_Gb_Day = state.commsSpecs.dataVolumeGb_day;
      let maxDataRate_kbps = ((maxThroughput_Gb_Day / coverage) * Math.pow(10,6)) / 86400;
      //Do NOT do this
      onBounds('throughput', 'max', maxThroughput_Gb_Day);
      onBounds('dataRateMbps', 'max', maxDataRate_kbps/1000);

      if(state.constraints.throughputFlag){
        if (state.commsSpecs.dataVolumeGb_day > maxThroughput_Gb_Day) {
          onState('commsSpecs', {
            ...state['commsSpecs'], 
            dataVolumeGb_day: maxThroughput_Gb_Day
          });
          onError(`The throughput you've entered is greater than the throughput this network can support. Your throughput specification has been adjusted to ${(maxThroughput_Gb_Day/8).toFixed(2)} GB/Day.`, true, 'Info');
        
          // If we need to adjust the throughput down to the 
          // new maximum, set the data rate to the maximum as well. 
          throughput_Gb_Day = maxThroughput_Gb_Day;
        }
      }else{
        if(state.commsSpecs.dataRateKbps > maxDataRate_kbps){
          onState('commsSpecs', {
            ...state['commsSpecs'], 
            dataVolumeGb_day: maxThroughput_Gb_Day
          });
          onState('commsSpecs', {
            ...state.commsSpecs,
            dataRateKbps: maxDataRate_kbps
          });
          onError(`The data rate you've entered is greater than the data rate this network can support. Your data rate  specification has been adjusted to ${(maxDataRate_kbps/1000).toFixed(2)} Mbps.`, true, 'Info');
          // If we need to adjust the throughput down to the 
          // new maximum, set the data rate to the maximum as well. 
          throughput_Gb_Day = maxThroughput_Gb_Day;
        }else{
          let throughputConverted = coverage * ((state.commsSpecs.dataRateKbps*86400)/1e6);
          throughput_Gb_Day = throughputConverted;
          onState('commsSpecs', {
            ...state['commsSpecs'], 
            dataVolumeGb_day: throughputConverted
          });
        }
      }

      

      // If the user ran a ground station combination, set
      // the throughput to the maximum value. Currently, we
      // do not allow the user to vary throughput for a 
      // combination of ground stations. 
      //We do NOT want to do this
      if (state.selectedItems.length > 1) {
        onState('commsSpecs', {
          ...state['commsSpecs'], 
          dataVolumeGb_day: maxThroughput_Gb_Day
        });
      }
      const { dataRate_kbps } = calculateDataRate(
        throughput_Gb_Day,
        coverage,
        newSystemParams.modCodOptions,
        newSystemParams.multipleAccess,
        data.linkParams.ebNoTable,
        state.selectedItems[0].modulation,
        state.selectedItems[0].coding
      );

      throughput_Gb_Day = dataRate_kbps * coverage / Math.pow(10, 6) * 86400;

      const newState: State = {
        ...state,
        selectedItems: newSelectedItems,
        results: {
          ...state.results,
          dataRate_kbps: dataRate_kbps,
          throughput_Gb_Day: throughput_Gb_Day,
          maxThroughput_Gb_Day: maxThroughput_Gb_Day
        }
      };
      const {
        eirp_dBW,
        ebNo_dB
      } = await updateLinkBudgets(data, newState, linkBudget);

      let newResults :any = {
        dataRate_kbps: dataRate_kbps,
        eirp_dBW: eirp_dBW,
        ebNo_dB: ebNo_dB,
        throughput_Gb_Day: throughput_Gb_Day,
        maxThroughput_Gb_Day: maxThroughput_Gb_Day,
        fullResults:data
      };
      
      if(state.pointSync) {
        data.realTime = true;
        // data.coverageEvents = data.coverageEvents;
        // data.gapEvents = data.gapEvents;
      }

      onState('results', newResults);
      dispatch(updatePerformancePanel(data));
      setData(data);
    }).then(() => {
      onState('performanceLoading', false);
      onState('comparisonLoading', false);
    }).catch((error: { error: string }) => {
      console.log('ERROR', error);
      onError(error.error && error.error.length > 0? error.error : 'Your analysis was unable to complete. If you stopped your analysis, please disregard this message. If your internet connection was dropped, please try restarting your analysis.', false, 'Unable to complete analysis');
    });
  };

  useEffect(() => {
    // If sync is false, do nothing. 
    if (!state.sync) return;

    if (state.radioButtonSelectionId > 0) refreshData();
    onState('sync', false);
  }, [state.sync]);

  const updateThroughput = () => {

    // Whenever the user changes, the throughput is adjusted,
    // or the modulation and coding options change, recalculate 
    // the link budgets. 
    if (performancePanel && state.selectedItems.length > 0) {
      // Update the throughput input field in the parameters panel. 
      // If the current throughput is greater than the max possible
      // throughput for the selected network and the currently 
      // selected user, set the throughput to the max throughput. 
      // let newSystemParams;
      // if (state.networkType === 'relay') {
      //   newSystemParams = performancePanel.systemParams as RelayCharacteristics;
      // } else if (state.networkType === 'dte' && state.selectedItems.length === 1) {
      //   newSystemParams = performancePanel.systemParams as GroundStationCharacteristics;
      // } else {
      //   newSystemParams = performancePanel.systemParams as { [key: string]: GroundStationCharacteristics };
      // }
      // Calculate the coverage this network provides this user.
      let coverage
      if(!state.noRegression){
        coverage = getCoverage(state, performancePanel);
      } else {
        coverage = 1
      }

      // let { dataRate_kbps } = calculateDataRate(
      //   state.commsSpecs.dataRateKbps,
      //   coverage,
      //   newSystemParams.modCodOptions,
      //   newSystemParams.multipleAccess,
      //   performancePanel.linkParams.ebNoTable,
      //   state.selectedItems[0].modulation,
      //   state.selectedItems[0].coding
      // );

      let dataRate_kbps = state.results.dataRate_kbps;

      let throughput_Gb_Day = dataRate_kbps * coverage / Math.pow(10, 6) * 86400;

      const newState = {
        ...state,
        results: {
          ...state.results,
          dataRate_kbps: dataRate_kbps,
          throughput_Gb_Day: throughput_Gb_Day
        }
      }

      updateLinkBudgets(performancePanel, newState, linkBudget).then(res => {
        onState('results', {
          ...state.results,
          dataRate_kbps: dataRate_kbps,
          eirp_dBW: res.eirp_dBW,
          ebNo_dB: res.ebNo_dB,
          throughput_Gb_Day: throughput_Gb_Day
        });
      });
    }
  };

  useEffect(() => {
    updateThroughput();
  }, [state.parameters, state.regressionTypes, state.selectedItems, performancePanel]);

  useEffect(() => {
    if (state.selectedItems.length === 1) {
      updateThroughput();
    }
  }, [state.commsSpecs.dataVolumeGb_day]);

  useEffect(() => {
    if (state.selectedItems.length === 1 && state.isDataLoaded) {
      let throughputConverted = getCoverage(state, data) * ((state.commsSpecs.dataRateKbps*86400)/1e6);
      onState('commsSpecs', {
        ...state['commsSpecs'], 
        dataVolumeGb_day: throughputConverted
      });
    }
  },[state.commsSpecs.dataRateKbps]);

  const updateLinkBudgets = async (data: PerformancePanel, state: State, linkBudget: { [key: string]: LinkBudgetRow[] }): Promise<{ eirp_dBW: number, ebNo_dB: number }> => {
    const linkBudgets = await setLinkBudgets(data, state, linkBudget);

    state.selectedItems.forEach(item => {
      const newLinkBudget = linkBudgets[item.id];
      dispatch(updateLinkBudget(item.id.toString(), newLinkBudget));
    });
    
    let maxEirp = NaN;
    let maxEirpId = '';
    Object.keys(linkBudgets).forEach(groundStationId => {
      const currentEirp = linkBudgets[groundStationId].find(parameter => parameter.key === 'userEirp_dBW')?.value;
      if (isNaN(maxEirp) || currentEirp > maxEirp) {
        maxEirpId = groundStationId;
        maxEirp = currentEirp;
      }
    });

    const eirp_dBW = linkBudgets[maxEirpId].find(parameter => parameter.key === 'userEirp_dBW')?.value;
    const ebNo_dB = linkBudgets[maxEirpId].find(parameter => parameter.key === 'requiredEbNo_dB')?.value;

    onState('results', {
      ...state.results,
      eirp_dBW: eirp_dBW,
      ebNo_dB: ebNo_dB
    });

    return {
      eirp_dBW,
      ebNo_dB
    };
  };

  return (
    <div className={visible ? classes.root : classes.hide}>
      <Grid container>
        <Grid item md={12}>
          <Grid
            container
            justifyContent="flex-start"
            alignItems="flex-start"
          >
            <ResultGroup title="Performance">
              <PerformanceSection
                data={data}
                state={state}
                maxAltitude={bounds.altitude.max}
                onState={onState}
              />
            </ResultGroup>
            <ResultGroup title="User Burden: Antenna Options">
              <AntennaSection
                state={state}
                data={data}
                setLinkBudgets={updateLinkBudgets}
              />
            </ResultGroup>
            {state.networkType !== 'dte' && (
              <ResultGroup title="User Burden: Mission Impacts">
                <PointingSection
                  data={data}
                  state={state}
                  maxAltitude={bounds.altitude.max}
                  onState={onState}
                />
              </ResultGroup>
            )}
            <ResultGroup title="Nav and Tracking">
              <NavSection 
                state={state}
                data={data} 
              />
            </ResultGroup>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Performance;