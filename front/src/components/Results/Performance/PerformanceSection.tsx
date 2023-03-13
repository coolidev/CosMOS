import React, { FC, useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Grid,
  makeStyles,
  ListItem,
  ListItemText
} from '@material-ui/core';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary
} from '../Accordion';
import {
  DTE_PERFORMANCE_PARAMETERS,
  METRIC_LABELS,
  PERFORMANCE_PARAMETERS,
  PERFORMANCE_KEYS,
} from 'src/utils/constants/analysis';
import Regression from 'src/pages/regression';
import type {
  PerformancePanel,
  RelayCharacteristics,
  GroundStationCharacteristics
} from 'src/types/evaluation';
import type { State } from 'src/pages/home';
import TerrestrialPlot from 'src/pages/regression/Terrestrial';
import { interpolate } from 'src/algorithms/interpolation';
import { getOrbitalModelValue, getValue } from 'src/algorithms/regressions';
import { Theme } from 'src/theme';

interface PerformanceProps {
  data: PerformancePanel;
  state: State;
  maxAltitude: number;
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

const PerformanceSection: FC<PerformanceProps> = ({
  state,
  data,
  maxAltitude,
  onState
}) => {
  const [accordion, setAccordion] = useState({});
  // const { performancePanel } = useSelector(state => state.results);

  const handleAccordion = (event) => {
    const { id } = event.currentTarget;
    const value = event.currentTarget.getAttribute('aria-expanded') === 'false';
    setAccordion((prevState) => ({ ...prevState, [id]: value }));
  };
  const classes = useStyles();

  useEffect(() => {
    if (!state.isDataLoaded) {
      setAccordion({});
    }
  }, [state.isDataLoaded]);

  const getCoverageDataForStation = (gsId: number) => {
    const calcDist = (alt, incl) => { return Math.sqrt(Math.pow(state.parameters.altitude - alt, 2) + Math.pow(state.parameters.inclination - incl, 2)) };
    if (data && data.predictedData.coveragePerStation && data.predictedData.coveragePerStation[gsId]) {
      let closestPoint = { dist: calcDist(-10000, -10000), value: 0 };
      closestPoint = data.predictedData.coveragePerStation[gsId].reduce((reduceClosest, currentPoint) => {
        let currentDist = calcDist(currentPoint.altitude, currentPoint.inclination);
        if (currentDist < reduceClosest.dist) {
          return { dist: currentDist, value: currentPoint.value }
        } else {
          return reduceClosest;
        }
      }, closestPoint);
      return closestPoint ? closestPoint.value.toFixed(2) : '0.0';
    } else if (data.coveragePerStation) {
      let toReturn = '0.0'
      data.coveragePerStation.forEach((element) => {
        if (element.id === gsId) {
          toReturn = element.coverageMinutes.toFixed(2);
        }
      })
      return toReturn
    } else {
      return '0.0';
    }
  }
  return (
    <Box>
      {(state.parameters.isOrbital && state.networkType === 'relay') || state.selectedItems.length === 0
        ? PERFORMANCE_KEYS.map((key: string) => {
          var value = getOrbitalModelValue(
            state.parameters.altitude,
            state.parameters.inclination,
            key,
            data?.modelData,
            (data?.systemParams as RelayCharacteristics)?.systemName);
          if ((isNaN(value) || (!state.pointSync && !state.parametric && !state.mathematical)) && !state.noRegression) {
            value = getValue(
              state.parameters.altitude,
              state.parameters.inclination,
              key,
              state.regressionTypes[key],
              data?.predictedData,
              (data?.systemParams as RelayCharacteristics)?.systemName
            );
          }
          if (isNaN(value)) {
            if (PERFORMANCE_PARAMETERS.includes(key) && !state.isDataLoaded) {
              return (
                <ListItem key={key} className={classes.parameter}>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body1"
                        component="p"
                        color="textPrimary"
                      >
                        {METRIC_LABELS[key]}
                      </Typography>
                    }
                  />
                  <Box flexGrow={1} />
                  <Box className={classes.resultComponent}>...</Box>
                </ListItem>
              );
            } else { return null }
          }

          // If the regression quality is set to the lowest value, 
          // we want to show the underlying model data, but not 
          // the regression predictions.
          // 1 is bad, and we should probably be not showing the value when the regression is 1, but since things don't work otherwise we will be going with this for now  
          const showRegression = !state.noRegression && state.qualityIndicators[key] > 1;
          const displayedValue = showRegression || state.pointSync || state.parametric ? value ? value.toFixed(2) : 0 : '-';

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
            <ListItem key={key} className={classes.parameter}>
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
            //   <AccordionSummary id={`${key}-panel`} onClick={handleAccordion}>
            //     <Typography style={{ width: '95%' }}>
            //       {`${METRIC_LABELS[key]}: ${displayedValue}`}
            //     </Typography>
            //     {!Object.keys(accordion).includes(`${key}-panel`) ||
            //       !accordion[`${key}-panel`] ? (
            //       <KeyboardArrowDownIcon fontSize="small" />
            //     ) : (
            //       <KeyboardArrowUpIcon fontSize="small" />
            //     )}
            //   </AccordionSummary>
            //   <AccordionDetails>
            //     <Regression
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
        : PERFORMANCE_KEYS.map((key: string) => {
          if (
            !data?.modelData ||
            !Object.keys(data?.modelData.terrestrial).includes(key)
          ) {
            if (PERFORMANCE_PARAMETERS.includes(key) && state.networkType === 'relay' && !state.isDataLoaded) {
              return (
                <ListItem key={key} className={classes.parameter}>
                  <ListItemText
                    primary={
                      <React.Fragment>
                        <Typography
                          variant="body1"
                          component="p"
                          color="textPrimary"
                        >
                          {`${METRIC_LABELS[key]}`}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                  <Box flexGrow={1} />
                  <Box className={classes.resultComponent}>...</Box>
                </ListItem>
              );
            } else { return null }
          }

          let interpolatedValue = interpolate(
            state.parameters.longitude,
            state.parameters.latitude,
            key,
            data?.modelData.terrestrial[key].table
          );
          if (interpolatedValue < 0) interpolatedValue = 0;

          return (
            <ListItem key={key} className={classes.parameter}>
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
              <Box className={classes.resultComponent}>{interpolatedValue.toFixed(2)}</Box>
            </ListItem>
            // <Accordion key={key}>
            //   <AccordionSummary id={`${key}-panel`} onClick={handleAccordion}>
            //     <Typography style={{ width: '95%' }}>
            //       {`${METRIC_LABELS[key]}: ${interpolatedValue.toFixed(2)}`}
            //     </Typography>
            //     {!Object.keys(accordion).includes(`${key}-panel`) ||
            //       !accordion[`${key}-panel`] ? (
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
      {state.networkType === 'dte'
        ? PERFORMANCE_KEYS.map((key: string) => {
          var value = getOrbitalModelValue(
            state.parameters.altitude,
            state.parameters.inclination,
            key,
            data?.modelData,
            (data?.systemParams as RelayCharacteristics)?.systemName);
          if ((isNaN(value) || (!state.pointSync && !state.parametric && !state.mathematical)) && !state.noRegression) {
            value = getValue(
              state.parameters.altitude,
              state.parameters.inclination,
              key,
              state.regressionTypes[key],
              data?.predictedData,
              state.selectedItems.length === 1
                ? (data?.systemParams as GroundStationCharacteristics)
                  ?.systemName
                : ''
            );
          }
          if (isNaN(value)) {
            if (DTE_PERFORMANCE_PARAMETERS.includes(key) && !state.isDataLoaded) {
              return (
                <ListItem key={key} className={classes.parameter}>
                  <ListItemText
                    primary={
                      <React.Fragment>
                        <Typography
                          variant="body1"
                          component="p"
                          color="textPrimary"
                        >
                          {METRIC_LABELS[key]}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                  <Box flexGrow={1} />
                  <Box className={classes.resultComponent}>...</Box>
                </ListItem>
              );
            } else {
              return null;
            }
          }

          // If the regression quality is set to the lowest value, 
          // we want to show the underlying model data, but not 
          // the regression predictions. 
          const showRegression = !state.noRegression && state.qualityIndicators[key] ? state.qualityIndicators[key] !== 1 : true;
          const displayedValue = showRegression || state.pointSync || state.parametric ? value ? value.toFixed(2) : 0 : '-';

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
            <ListItem key={key} className={classes.parameter}>
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
            //   <AccordionSummary id={`${key}-panel`} onClick={handleAccordion}>
            //     <Typography style={{ width: '95%' }}>
            //       {`${METRIC_LABELS[key]}: ${displayedValue}`}
            //     </Typography>
            //     {!Object.keys(accordion).includes(`${key}-panel`) ||
            //       !accordion[`${key}-panel`] ? (
            //       <KeyboardArrowDownIcon fontSize="small" />
            //     ) : (
            //       <KeyboardArrowUpIcon fontSize="small" />
            //     )}
            //   </AccordionSummary>
            //   <AccordionDetails>
            //     <Grid container spacing={2}>
            //       {
            //         state.selectedItems.length > 1 && key === 'coverageMinutes' &&
            //         <Grid item md={12}>
            //           <TableContainer style={{ maxHeight: '30vh' }}>
            //             <Table stickyHeader size="small" className={classes.table}>
            //               <TableHead>
            //                 <TableRow>
            //                   <TableCell>
            //                     {'Station'}
            //                   </TableCell>
            //                   <TableCell>
            //                     {'Antenna'}
            //                   </TableCell>
            //                   <TableCell>
            //                     {'Coverage Per Day (min)'}
            //                   </TableCell>
            //                 </TableRow>
            //               </TableHead>
            //               <TableBody>
            //                 {state.selectedItems.map((row) => {
            //                   return (
            //                     <TableRow>
            //                       <TableCell>
            //                         {row.name}
            //                       </TableCell>
            //                       <TableCell>
            //                         {row.antennaName ?? '--'}
            //                       </TableCell>
            //                       <TableCell>
            //                         {getCoverageDataForStation(row.id)}
            //                       </TableCell>
            //                     </TableRow>
            //                   )
            //                 }
            //                 )}
            //               </TableBody>
            //             </Table>
            //           </TableContainer>
            //         </Grid>
            //       }
            //       <Grid item md={12}>
            //         <Regression
            //           state={[state]}
            //           data={[data]}
            //           system={state.radioButtonSelectionId}
            //           version={version}
            //           networkType={state.networkType}
            //           minAltitude={300}
            //           maxAltitude={maxAltitude}
            //           maxInclination={120}
            //           values={[value]}
            //           metricType={key}
            //           chartDiv={key + 'plotly'}
            //           isClickable={false}
            //           showRegression={showRegression}
            //           onState={onState}
            //         />
            //       </Grid>
            //     </Grid>
            //   </AccordionDetails>
            // </Accordion>
          );
        })
        : null}
      {state.selectedItems.length === 1 && (
        <ListItem className={classes.parameter}>
          <ListItemText
            primary={
              <React.Fragment>
                <Typography
                  variant="body1"
                  component="p"
                  color="textPrimary"
                >
                  Data Rate (Mbps):{' '}
                </Typography>
              </React.Fragment>
            }
          />
          <Box flexGrow={1} />
          <Box className={classes.resultComponent}>{state.isDataLoaded ? (state.results.dataRate_kbps / 1000).toFixed(2) : '...'}</Box>
        </ListItem>
      )}
      {state.selectedItems.length > 1 ? (
        <ListItem className={classes.parameter}>
          <ListItemText
            primary={
              <React.Fragment>
                <Typography
                  variant="body1"
                  component="p"
                  color="textPrimary"
                >
                  Throughput (GB/Day):{' '}
                  {state.isDataLoaded && (!Object.keys(accordion).includes(`throughput-panel`) || !accordion[`throughput-panel`] ? (
                    <KeyboardArrowDownIcon fontSize="small" />
                  ) : (
                    <KeyboardArrowUpIcon fontSize="small" />
                  ))}
                </Typography>
              </React.Fragment>
            }
          />
          <Box flexGrow={1} />
          <Box className={classes.resultComponent}>{state.isDataLoaded ? (state.results.maxThroughput_Gb_Day / 8).toFixed(2) : '...'}</Box>
        </ListItem>
        // <Accordion key={'throughput'}>
        //   <AccordionSummary id={`throughput-panel`} onClick={handleAccordion}>
        //     <Typography style={{ width: '95%' }}>
        //       Throughput (GB/Day):{' '}
        //       {state.isDataLoaded
        //         ? (state.results.maxThroughput_Gb_Day / 8).toFixed(2)
        //         : '-'}
        //     </Typography>
        //     {state.isDataLoaded && (!Object.keys(accordion).includes(`throughput-panel`) ||
        //       !accordion[`throughput-panel`] ? (
        //       <KeyboardArrowDownIcon fontSize="small" />
        //     ) : (
        //       <KeyboardArrowUpIcon fontSize="small" />
        //     ))}
        //   </AccordionSummary>
        //   <AccordionDetails>
        //     <div>
        //       <TableContainer component={Paper} style={{ width: '20vw' }}>
        //         <Table size="small">
        //           <TableHead>
        //             <TableRow>
        //               <TableCell
        //                 style={{
        //                   backgroundColor: 'lightgray',
        //                   color: 'black',
        //                   width: '6.6vw',
        //                   lineHeight: '14px'
        //                 }}
        //                 align="center"
        //               >
        //                 Station
        //               </TableCell>
        //               <TableCell
        //                 style={{
        //                   backgroundColor: 'lightgray',
        //                   color: 'black',
        //                   width: '6.6vw',
        //                   lineHeight: '14px'
        //                 }}
        //                 align="center"
        //               >
        //                 Coverage <br />
        //                 <small>(Min/Day)</small>
        //               </TableCell>
        //               <TableCell
        //                 style={{
        //                   backgroundColor: 'lightgray',
        //                   color: 'black',
        //                   width: '6.6vw',
        //                   lineHeight: '14px'
        //                 }}
        //                 align="center"
        //               >
        //                 Throughput <br />
        //                 <small>(Gb/Day)</small>
        //               </TableCell>
        //             </TableRow>
        //           </TableHead>
        //           <TableBody>
        //             {state.selectedItems.map((item) => {
        //               if (!data) return null;
        //               if (!Object.keys(data.systemParams).includes(item.id.toString())) return null;

        //               return (
        //                 <TableRow key={item.name}>
        //                   <TableCell
        //                     style={{ backgroundColor: 'whitesmoke' }}
        //                     align="center"
        //                   >
        //                     {item.name}
        //                   </TableCell>
        //                   <TableCell align="center">
        //                     {state.noRegression ?
        //                       getOrbitalModelValue(
        //                         state.parameters.altitude,
        //                         state.parameters.inclination,
        //                         `coveragePerStation-${item.id}`,
        //                         data?.modelData,
        //                         '').toFixed(2)
        //                       : getValue(
        //                         state.parameters.altitude,
        //                         state.parameters.inclination,
        //                         `coveragePerStation-${item.id}`,
        //                         'gam',
        //                         data?.predictedData,
        //                         ''
        //                       ).toFixed(2)}
        //                   </TableCell>
        //                   <TableCell align="center">
        //                     {state.noRegression ?
        //                       ((((getOrbitalModelValue(
        //                         state.parameters.altitude,
        //                         state.parameters.inclination,
        //                         `coveragePerStation-${item.id}`,
        //                         data?.modelData,
        //                         '') /
        //                         1440) *
        //                         data?.systemParams[item.id].R_kbps) /
        //                         Math.pow(10, 6)) *
        //                         86400).toFixed(2)
        //                       : (
        //                         (((getValue(
        //                           state.parameters.altitude,
        //                           state.parameters.inclination,
        //                           `coveragePerStation-${item.id}`,
        //                           'gam',
        //                           data?.predictedData,
        //                           ''
        //                         ) /
        //                           1440) *
        //                           data?.systemParams[item.id].R_kbps) /
        //                           Math.pow(10, 6)) *
        //                         86400
        //                       ).toFixed(2)}
        //                   </TableCell>
        //                 </TableRow>
        //               );
        //             })}
        //           </TableBody>
        //         </Table>
        //       </TableContainer>
        //     </div>
        //   </AccordionDetails>
        // </Accordion>
      ) : (
        <ListItem className={classes.parameter}>
          <ListItemText
            primary={
              <React.Fragment>
                <Typography
                  variant="body1"
                  component="p"
                  color="textPrimary"
                >
                  Throughput (GB/Day)
                </Typography>
              </React.Fragment>
            }
          />
          <Box flexGrow={1} />
          <Box className={classes.resultComponent}>{state.isDataLoaded ? (state.commsSpecs.dataVolumeGb_day / 8).toFixed(2) : '...'}</Box>
        </ListItem>
      )}
    </Box>
  );
};

export default PerformanceSection;
