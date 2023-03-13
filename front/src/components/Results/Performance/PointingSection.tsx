/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useState, useEffect } from 'react';
import { Typography, Box, ListItem, ListItemText, makeStyles } from '@material-ui/core';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary
} from '../Accordion';
import {
  BODY_POINTING_THRESHOLD,
  MECHANICAL_POINTING_THRESHOLD,
} from 'src/utils/constants/physical';
import {
  METRIC_LABELS,
  MISSION_IMPACTS_PARAMETERS
} from 'src/utils/constants/analysis';
import RegressionSection from 'src/pages/regression';
import {
  PerformInterpolation,
  InterpolationInputs
} from 'src/algorithms/interpolation';
import { getOrbitalModelValue, getValue } from 'src/algorithms/regressions';
import TerrestrialPlot from 'src/pages/regression/Terrestrial';
import type {
  PerformancePanel,
  RelayCharacteristics,
  GroundStationCharacteristics
} from 'src/types/evaluation';
import type { State } from 'src/pages/home';
import { Theme } from 'src/theme';

interface PointingProps {
  data: PerformancePanel;
  maxAltitude: number;
  state: State;
  onState: (name: string, value) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  table: {
    '& .MuiTableCell-root': {
      borderBottom: `1px solid ${theme.palette.border.opposite}`,
      padding: '6px 12px 6px 8px'
    },
    '& .MuiTableCell-head': {
      color: `${theme.palette.text.primary}`,
      backgroundColor: `${theme.palette.background.paper}`,
    },
  },
  parameter: {
    borderBottom: `1px solid ${theme.palette.background.paper}`
  },
  resultComponent: {
    width: '15%'
  }
}))

const POINTING_KEYS = ['tracking_rate', 'slew_rate', 'reduced_coverage'];

const PointingSection: FC<PointingProps> = ({
  data,
  maxAltitude,
  state,
  onState
}) => {
  const [accordion, setAccordion] = useState({});
  const [trackingRate, setTrackingRate] = useState(NaN);

  const classes = useStyles();

  useEffect(() => {
    let newTrackingRate = NaN;
    if (state.isDataLoaded) {
      if (state.parameters.isOrbital) {
        newTrackingRate = getOrbitalModelValue(
          state.parameters.altitude,
          state.parameters.inclination,
          'tracking_rate',
          data?.modelData,
          state.selectedItems.length === 1
            ? (
              data.systemParams as
              | RelayCharacteristics
              | GroundStationCharacteristics
            ).systemName
            : ''
        );
        if (isNaN(newTrackingRate)) {
          newTrackingRate = getValue(
            state.parameters.altitude,
            state.parameters.inclination,
            'tracking_rate',
            state.regressionTypes['tracking_rate'],
            data?.predictedData,
            state.selectedItems.length === 1
              ? (
                data.systemParams as
                | RelayCharacteristics
                | GroundStationCharacteristics
              ).systemName
              : ''
          );
        }
      } else {
        if (Object.keys(data?.modelData.terrestrial).includes('tracking_rate')) {
          newTrackingRate = interpolate('tracking_rate');
        }
      }
      setTrackingRate(newTrackingRate);
    }
  }, [data, state.parameters]);

  const handleAccordion = (event) => {
    const { id } = event.currentTarget;
    const value = event.currentTarget.getAttribute('aria-expanded') === 'false';
    setAccordion((prevState) => ({ ...prevState, [id]: value }));
  };

  const interpolate = (metric: string): number => {
    const interpolationInputs: InterpolationInputs = {
      x: state.parameters.longitude,
      y: state.parameters.latitude,
      data: data?.modelData.terrestrial[metric].table,
      metricType: metric
    };

    return PerformInterpolation(interpolationInputs);
  };

  return (
    <Box>
      {state.parameters.isOrbital
        ? POINTING_KEYS.map((key: string) => {
          var value = getOrbitalModelValue(
            state.parameters.altitude,
            state.parameters.inclination,
            key,
            data?.modelData,
            state.selectedItems.length === 1
              ? (
                data?.systemParams as
                | RelayCharacteristics
                | GroundStationCharacteristics
              )?.systemName
              : ''
          );
          if (isNaN(value)) {
            value = getValue(
              state.parameters.altitude,
              state.parameters.inclination,
              key,
              state.regressionTypes[key],
              data?.predictedData,
              state.selectedItems.length === 1
                ? (
                  data?.systemParams as
                  | RelayCharacteristics
                  | GroundStationCharacteristics
                )?.systemName
                : ''
            );
          }

          if (isNaN(value)) {
            if (MISSION_IMPACTS_PARAMETERS.includes(key)) {
              return (
                <ListItem key={key + 'placeholder'} className={classes.parameter}>
                  <ListItemText
                    primary={
                      <React.Fragment>
                        <Typography
                          variant="body1"
                          component="p"
                          color="textPrimary"
                        >
                          {METRIC_LABELS[key]}
                          {!Object.keys(accordion).includes(`${key}-panel`) ||
                            !accordion[`${key}-panel`] ? (
                            <KeyboardArrowDownIcon fontSize="small" />
                          ) : (
                            <KeyboardArrowUpIcon fontSize="small" />
                          )}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                  <Box flexGrow={1} />
                  <Box className={classes.resultComponent}>...</Box>
                </ListItem>
              )
            } else {
              return null;
            }
          }

          // If the regression quality is set to the lowest value, 
          // we want to show the underlying model data, but not 
          // the regression predictions. 
          // Or if there isn't a regression at all, we would like to not show it
          // But if there isn't a regression, since we are locking the user to the model
          // points only, we do want to show the data
          const showRegression = !state.noRegression && state.qualityIndicators[key] > 1;
          const displayedValue = showRegression || state.pointSync || state.parametric ? value.toFixed(2) : '-';

          // Find the entry in the selected items list that is
          // currently selected.
          const selectedItem = state.selectedItems.find(
            (item) => item.id === state.radioButtonSelectionId
          );
          if (!selectedItem) return null;

          // Update parameters using values in the cache object.
          const missionType = state.parameters.isOrbital
            ? 'orbital'
            : 'terrestrial';
          const version =
            state.networkType === 'relay'
              ? selectedItem.versions[missionType]
              : selectedItem.version;

          return (
            <ListItem
              key={key}
              className={classes.parameter}
            // onClick={handleAccordion}
            >
              <ListItemText
                primary={
                  <React.Fragment>
                    <Typography
                      variant="body1"
                      component="p"
                      color="textPrimary"
                    >
                      {METRIC_LABELS[key]}
                      {!Object.keys(accordion).includes(`${key}-panel`) ||
                        !accordion[`${key}-panel`] ? (
                        <KeyboardArrowDownIcon fontSize="small" />
                      ) : (
                        <KeyboardArrowUpIcon fontSize="small" />
                      )}
                    </Typography>
                  </React.Fragment>
                }
              />
              <Box flexGrow={1} />
              <Box className={classes.resultComponent}>{displayedValue}</Box>
            </ListItem>
            // <Accordion key={key}>
            //   <AccordionSummary
            //     aria-controls="panel1d-content"
            //     id={`${key}-panel`}
            //     onClick={handleAccordion}
            //   >
            //     <Typography style={{ width: '95%' }}>
            //       {`${METRIC_LABELS[key]}: ${displayedValue}`}
            //     </Typography>
            //     {!Object.keys(accordion).includes(`${key}-panel`) ||
            //     !accordion[`${key}-panel`] ? (
            //       <KeyboardArrowDownIcon fontSize="small" />
            //     ) : (
            //       <KeyboardArrowUpIcon fontSize="small" />
            //     )}
            //   </AccordionSummary>
            //   <AccordionDetails>
            //     <RegressionSection
            //       state={[state]}
            //       data={[data]}
            //       system={state.radioButtonSelectionId}
            //       version={version}
            //       networkType={state.networkType}
            //       minAltitude={0}
            //       maxAltitude={maxAltitude}
            //       maxInclination={90}
            //       values={[value]}
            //       metricType={key}
            //       chartDiv={key + 'plotly'}
            //       isClickable={false}
            //       showRegression={showRegression}
            //       onState={onState}
            //     />
            //   </AccordionDetails>
            // </Accordion>
          );
        })
        : POINTING_KEYS.map((key: string) => {
          if (!state.isDataLoaded) {
            return null;
          }
          if (!Object.keys(data?.modelData.terrestrial).includes(key)) {
            return null;
          }

          return (
            <ListItem
              key={key}
              className={classes.parameter}
            >
              <ListItemText
                primary={
                  <React.Fragment>
                    <Typography
                      variant="body1"
                      component="p"
                      color="textPrimary"
                    >
                      {METRIC_LABELS[key]}
                      {!Object.keys(accordion).includes(`${key}-panel`) ||
                        !accordion[`${key}-panel`] ? (
                        <KeyboardArrowDownIcon fontSize="small" />
                      ) : (
                        <KeyboardArrowUpIcon fontSize="small" />
                      )}
                    </Typography>
                  </React.Fragment>
                }
              />
              <Box flexGrow={1} />
              <Box className={classes.resultComponent}>{interpolate(key).toFixed(2)}</Box>
            </ListItem>
            // <Accordion key={key}>
            //   <AccordionSummary id={`${key}-panel`} onClick={handleAccordion}>
            //     <Typography style={{ width: '95%' }}>
            //       {`${METRIC_LABELS[key]}: ${interpolate(key).toFixed(2)}`}
            //     </Typography>
            //     {!Object.keys(accordion).includes(`${key}-panel`) ||
            //     !accordion[`${key}-panel`] ? (
            //       <KeyboardArrowDownIcon fontSize="small" />
            //     ) : (
            //       <KeyboardArrowUpIcon fontSize="small" />
            //     )}
            //   </AccordionSummary>
            //   <AccordionDetails>
            //     <TerrestrialPlot
            //       system={state.radioButtonSelectionId}
            //       type={key}
            //       label={METRIC_LABELS[key]}
            //       source={data?.modelData.terrestrial[key]}
            //       isClickable={false}
            //     />
            //   </AccordionDetails>
            // </Accordion>
          );
        })}
      <ListItem className={classes.parameter} onClick={handleAccordion}>
        <ListItemText
          primary={
            <React.Fragment>
              <Typography
                variant="body1"
                component="p"
                color="textPrimary"
              >
                Body Pointing Feasibility
              </Typography>
            </React.Fragment>
          }
        />
        <Box flexGrow={1} />
        <Box className={classes.resultComponent}>{state.isDataLoaded ? (trackingRate < BODY_POINTING_THRESHOLD ? 'Feasible' : 'Not feasible') : '...'}</Box>
      </ListItem>
      {/* <Accordion expanded={false}>
        <AccordionSummary
          id={`bodyPointingFeasibility-panel`}
          onClick={handleAccordion}
        >
          <Typography style={{ width: '95%' }}>
            Body Pointing Feasibility:
            {state.isDataLoaded
              ? trackingRate < BODY_POINTING_THRESHOLD
                ? 'Feasible'
                : 'Not feasible'
              : '-'}
          </Typography>
        </AccordionSummary>
      </Accordion> */}

      <ListItem className={classes.parameter} onClick={handleAccordion}>
        <ListItemText
          primary={
            <React.Fragment>
              <Typography
                variant="body1"
                component="p"
                color="textPrimary"
              >
                Mechanical Pointing Feasibility
              </Typography>
            </React.Fragment>
          }
        />
        <Box flexGrow={1} />
        <Box className={classes.resultComponent}>{state.isDataLoaded ? (trackingRate < MECHANICAL_POINTING_THRESHOLD ? 'Feasible' : 'Not feasible') : '...'}</Box>
      </ListItem>
      {/* <Accordion expanded={false}>
        <AccordionSummary
          id={`mechanicalPointingFeasibility-panel`}
          onClick={handleAccordion}
        >
          <Typography style={{ width: '95%' }}>
            Mechanical Pointing Feasibility:
            {state.isDataLoaded
              ? trackingRate < MECHANICAL_POINTING_THRESHOLD
                ? 'Feasible'
                : 'Not feasible'
              : '-'}
          </Typography>
        </AccordionSummary>
      </Accordion> */}
    </Box>
  );
};

export default PointingSection;
