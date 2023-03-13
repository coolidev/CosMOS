/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, useState, useEffect } from 'react';
import { Typography, Link, Box, ListItem, ListItemText, makeStyles } from '@material-ui/core';
import { Accordion, AccordionSummary } from '../Accordion';
import { useSelector } from 'src/store';
import LinkBudget from 'src/components/Results/Performance/LinkBudget';
import UserBurdenCalculator from 'src/components/Results/Performance/UserBurdenCalculator';
//import AlgorithmExplanation from './algorithm-explanation';
import type {
  PerformancePanel,
  RelayCharacteristics,
  GroundStationCharacteristics
} from 'src/types/evaluation';
import type { LinkBudgetRow } from 'src/types/link-budget';
import type { State } from 'src/pages/home';
import useStyles from 'src/utils/styles';
import {
  computeParabolicDiameter,
  computeParabolicMass,
  computeSteerableSize,
  computeHelicalSize,
  computePatchSize,
  computeDipoleSize,
  AntennaInputs
} from 'src/algorithms/antennas';
import { ANTENNA_TYPES } from 'src/utils/constants/analysis';
import { Theme } from 'src/theme';

interface AntennaProps {
    data: PerformancePanel;
    state: State;
    setLinkBudgets: (data: PerformancePanel, state: State, linkBudget: { [key: string]: LinkBudgetRow[] }) => Promise<{ eirp_dBW: number, ebNo_dB: number }>;
};

const newStyles = makeStyles((theme: Theme) => ({
  parameter: {
    borderBottom: `1px solid ${theme.palette.background.paper}`
  },
  resultComponent: {
    width: '15%'
  }
}))

const USER_BURDEN_FUNCS = {
  parabolicDiameter: computeParabolicDiameter,
  parabolicMass: computeParabolicMass,
  steerableSize: computeSteerableSize,
  helicalHeight: computeHelicalSize,
  patchSize: computePatchSize,
  dipoleSize: computeDipoleSize
};

const AntennaSection: FC<AntennaProps> = ({ state, data, setLinkBudgets }) => {
  const [algorithmExplanation, setAlgorithmExplanation] = useState(false);
  const [calcOpen, setCalcOpen] = useState(false);
  const [isLinkBudgetOpen, setIsLinkBudgetOpen] = useState(false);
  const [antennaType, setAntennaType] = useState('');
  const [maxEirpId, setMaxEirpId] = useState('');
  const classes = useStyles();
  const { linkBudget } = useSelector((state) => state.results);
  const [eirp, setEirp] = useState<number>(state.results.eirp_dBW);

  const newClasses = newStyles();

  useEffect(() => {
    if(state.results.eirp_dBW === Infinity || state.results.eirp_dBW === -Infinity){
      setEirp(0.00);
    }else{
      setEirp(state.results.eirp_dBW);
    }
  },[state.results.eirp_dBW]);

  useEffect(() => {
    let newMaxEirpId = '';
    let maxEirp = NaN;
    Object.keys(linkBudget).forEach((groundStationId) => {
      const currentEirp = linkBudget[groundStationId].find(
        (parameter) => parameter.key === 'userEirp_dBW'
      )?.value;
      if (isNaN(maxEirp) || currentEirp > maxEirp) {
        newMaxEirpId = groundStationId;
        maxEirp = currentEirp;
      }
    });

    setMaxEirpId(newMaxEirpId);
  }, [linkBudget]);

  function handleCalc(antenna?: string) {
    setAntennaType(antenna);
    setCalcOpen(!calcOpen);
  }

  const handleAlgo = () => {
    setAlgorithmExplanation(!algorithmExplanation);
  };

  const handleLinkBudget = () => {
    setIsLinkBudgetOpen(!isLinkBudgetOpen);
  };

  return (
    <Box>
      <ListItem className={newClasses.parameter} onClick={() => handleLinkBudget()}>
        <ListItemText
          primary={
            <React.Fragment>
              <Typography
                variant="body1"
                component="p"
                color="textPrimary"
              >
                EIRP (dBW)
              </Typography>
            </React.Fragment>
          }
        />
        <Box flexGrow={1} />
        <Box className={newClasses.resultComponent}>{state.isDataLoaded ? (!state.commsSpecs.commsPayloadSpecs.minEIRPFlag)?  (state.commsSpecs.commsPayloadSpecs.eirp.toFixed(2)): eirp.toFixed(2) : '...'}</Box>
      </ListItem>
      {
      // (state.selectedItems.length <= 1 || maxEirpId) &&
        Object.keys(ANTENNA_TYPES).map((param: string) => {
          let wavelength_m: number;
          if (!data) {
            wavelength_m = NaN;
          } else {
            if (state.selectedItems.length === 1) {
              wavelength_m = (
                data?.systemParams as
                  | RelayCharacteristics
                  | GroundStationCharacteristics
              )?.lambda;
            } else if (state.selectedItems.length > 1 && data.systemParams) {
              if (Object.keys(data.systemParams).includes(maxEirpId)) {
                wavelength_m = data?.systemParams[maxEirpId]['lambda'];
              }
            }
          }

          const antennaInputs: AntennaInputs = {
            wavelength: wavelength_m,
            eirp: state.results.eirp_dBW,
            powerAmplifier: state.constraints.powerAmplifier,
            antennaSize: null
          };
          let value = USER_BURDEN_FUNCS[param](antennaInputs);

          // Add a link to the parameters that have a deep dive
          // associated with them. Clicking on the link will open
          // the deep dive.
          const deepDiveParam =
            param === 'steerableSize' || param === 'patchSize';

          value =
            (deepDiveParam && state.isDataLoaded) ? (
              <Link
                id={`${param}_link`}
                onClick={() => handleCalc(param)}
                className={classes.analyzeResultLink}
              >
                {isNaN(value) ? '...' : value.toFixed(2)}
              </Link>
            ) : (
              isNaN(value) ? '...' : value.toFixed(2)
            );

          return (
            <ListItem key={`${param}-parameter`} className={newClasses.parameter}>
              <ListItemText
                primary={
                  <React.Fragment>
                    <Typography
                      variant="body1"
                      component="p"
                      color="textPrimary"
                    >
                      {ANTENNA_TYPES[param]}
                    </Typography>
                  </React.Fragment>
                }
              />
              <Box flexGrow={1} />
              <Box className={newClasses.resultComponent}>{value}</Box>
            </ListItem>
          );
        })
        }
      {isLinkBudgetOpen && (
        <LinkBudget
          isOpen={isLinkBudgetOpen}
          onClose={() => setIsLinkBudgetOpen(!isLinkBudgetOpen)}
          data={data}
          state={state}
          setLinkBudgets={setLinkBudgets}
        />
      )}
      {calcOpen && (
        <UserBurdenCalculator
          isOpen={calcOpen}
          onClose={handleCalc}
          title={ANTENNA_TYPES[antennaType]}
          state={state}
          systemParams={
            state.selectedItems.length > 1
              ? data?.systemParams[maxEirpId]
              : data?.systemParams
          }
          linkParams={data?.linkParams}
          antennaType={antennaType}
        />
      )}
      {/*algorithmExplanation && (
                <AlgorithmExplanation 
                    isOpen={algorithmExplanation}
                    onClose={handleAlgo}
                    title={'Data Rate vs. EIRP'}
                    bounds={props.bounds}
                    params={props.params}
                    systemParams={props.systemParams}
                    linkParams={props.linkParams}
                    onParamChange={props.onParamChange}
                />
            )*/}
    </Box>
  );
};

export default AntennaSection;

function dispatch(arg0: any) {
    throw new Error("Function not implemented.");
}
