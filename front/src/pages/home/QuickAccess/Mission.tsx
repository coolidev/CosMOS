import { FC, useEffect, useState } from 'react';
import { Box, Grid, makeStyles, Typography } from '@material-ui/core';
import { CommServicesDef, Parameters, TimeFrame } from 'src/components/Mission';
import type { ChangeProps } from 'src/pages/home/QuickAccess';
import type { State } from 'src/pages/home';
import type { Theme } from 'src/theme';
import CoverageMetricsDialog from 'src/components/Mission/CommServicesDef/CoverageMetricsDialog';
import CommsPayloadSpecDialog from 'src/components/Mission/CommServicesDef/CommsPayloadSpecsDialog';
import { useSelector } from 'src/store';

interface MissionProps {
  state: State;
  bounds: { [key: string]: { min: number; max: number } };
  onBounds: (name: string, type: string, value: number) => void;
  setWizardIndex: any;
  onChange: (values: ChangeProps) => void;
  onState: (name: string, value: any) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    color: '#fff'
  },
  title: {
    fontStyle: 'italic',
    fontWeight: 'normal'
  },
  box: {
    backgroundColor: theme.palette.background.light,
    borderRadius: "0px 0px 8px 8px"
  },
  subtitle: {
    fontFamily: 'Roboto',
    fontStyle: "normal",
    fontSize: "21px",
    lineHeight: "25px",
    display: "flex",
    alignItems: "center",
    color: theme.palette.border.main,
    paddingLeft: '.5vw',
    borderBottom: `2px solid ${theme.palette.border.main}`,
    borderLeft: `1px solid ${theme.palette.border.main}`,
    borderRight: `1px solid ${theme.palette.border.main}`, 
  }
}));

export enum FilteringSelection {
  FREQUENCY_BAND = 0,
  POLARIZATION = 1,
  MODULATION = 2,
  CODING_TYPE = 3,
  CODING_RATE = 4,
}

const Mission: FC<MissionProps> = ({ state, bounds, onBounds, setWizardIndex, onChange, onState }) => {
  const classes = useStyles();
  const [accordion, setAccordion] = useState({});
  const [filterSelectionOrder, setFilterSelectionOrder] = useState<FilteringSelection[]>([]);
  const [filterFlag, setFilterFlag] = useState<boolean>(false);
  const missionFilterList = useSelector((state) => state.networkList);

  
  useEffect(() => {
    setFilterFlag(!filterFlag);
  }, [missionFilterList])

  useEffect(() => {
      onState(
        'commsSpecs', {...state.commsSpecs, freqBand: 0, standardsComplience: 0, dataRateKbps: 0, 
        commsPayloadSpecs: {...state.commsSpecs.commsPayloadSpecs, coding: -1, modulation: -1, polarizationType: -1}}
      );
      setFilterSelectionOrder([]);
  }, [state.resetMissionFilters])

  return (
    <div className={classes.root}>
      <Box className={classes.box}>
        <Grid container spacing = {0}>
          <Grid item xs = {12}>
            <Parameters
              state = {state}
              parameters={state.parameters}
              networkType={state.networkType}
              noRegression = {state.noRegression}
              bounds={bounds}
              onChange={onChange}
              onState = {onState}
              setWizardIndex = {setWizardIndex}
            />
          </Grid>
          <Grid item xs = {12}>
            <Typography className={classes.subtitle}>
              Mission Time1
            </Typography>
          </Grid>
          <Grid item xs = {12}>
            <TimeFrame
              result={state}
              bounds={bounds}
              onChange={onChange}
              accordion={accordion}
              setAccordion={setAccordion}
              onState = {onState}
            />
          </Grid>
          <Grid item xs ={12}>
            <Typography className={classes.subtitle}>
              Services Definition
            </Typography>
          </Grid>
          <Grid item xs = {12}>
            <CommServicesDef 
              state={state} 
              bounds={bounds}
              onChange={onChange}
              accordion={accordion}
              onState = {onState}
              setAccordion={setAccordion}
              onBounds = {onBounds}
              filterSelectionOrder = {filterSelectionOrder}
              setFilterSelectionOrder = {setFilterSelectionOrder}
              filterFlag = {filterFlag}
            />
          </Grid>
          <Grid item xs = {12}>
            <Typography className={classes.subtitle}>
              Coverage Metrics
            </Typography>
          </Grid>
          <Grid item xs = {12}>
            <CoverageMetricsDialog 
              state={state}
              bounds={bounds}
              onChange={onChange}
              onState={onState} 
            />
          </Grid>
          <Grid item xs = {12}>
            <Typography className={classes.subtitle}>
              Comms Payload Specifications
            </Typography>
          </Grid>
          <Grid item xs = {12}>
            <CommsPayloadSpecDialog 
              state={state}
              bounds={bounds}
              onChange={onChange}
              onState={onState}
              onBounds = {onBounds}
              filterSelectionOrder = {filterSelectionOrder}
              setFilterSelectionOrder = {setFilterSelectionOrder}
              filterFlag = {filterFlag}
            />
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default Mission;
