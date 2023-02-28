import {
  Box,
  FormControl,
  FormControlLabel,
  Grid,
  Link,
  makeStyles,
  Radio,
  RadioGroup,
  TextField,
  Typography
} from '@material-ui/core';
import { FC, useEffect, useState } from 'react';
import { State } from '..';
import { PerformancePanel } from 'src/types/evaluation';
import type { Theme } from 'src/theme';
import SurfacePlot from 'src/pages/regression/SurfacePlot';
import { THEMES, THEORY_AVG_COLOR } from 'src/utils/constants/general';
import { PDFViewerErgodic } from '../pdf-view-panel';
import Heatmap from 'src/pages/regression/Heatmap';
import { SelectedNetwork, StepDef } from 'src/types/preference';
import clsx from 'clsx';
import { useSelector } from 'src/store';
import { grey } from '@material-ui/core/colors';
import { useSnackbar } from 'notistack';

interface AnalysisSelectionProps {
  onOpen: () => void;
  analysisType: string;
  setAnalysisType: any;
  state: State;
  data: PerformancePanel;
  maxAltitude: number;
  values: any;
  metricType: string;
  containsPoint: boolean;
  analysisDone: boolean;
  onState: any;
  theoryPointData: {
    theoryCoverage: number;
    regressionCoverage: number;
  } | null;
  wizardIndex: number;
  setData: any;
  setAnalysisDone: any;
  refresh: boolean;
  setRefresh: (val: boolean) => void;
}

//most of these imports are for the graph

const customStyles = makeStyles((theme: Theme) => ({
  dialog: {
    minWidth: '1000px',
    alignContent: 'center',
    minHeight: '575px',
    position: 'relative',
    color: theme.palette.text.primary
  },
  title: {
    margin: 0,
    padding: theme.spacing(4),
    backgroundColor: theme.palette.primary.light
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  },
  alert: {
    border: `1px double ${theme.palette.border.main}`,
    borderRadius: '4px',
    color: `${theme.palette.border.main}`,
    alignContent: 'center',
    padding: '5px',
    marginTop: '10px',
    '@media (max-width:1600px)': {
      fontSize: '11px'
    }
  },
  input: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '5px',
    gap: '1px',

    background: theme.name === THEMES.LIGHT ? '#FFFFFF' : '#4c4c4c',
    boxShadow: '0px 4px 14px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',

    minHeight: '3vh',
    paddingLeft: '14px'
  },
  tooltip: {
    maxWidth: '500px'
  },
  span: {
    position: 'relative',
    marginRight: '20px',
    '&::before': {
      content: '""',
      width: '14px',
      height: '14px',
      borderRadius: '100%',
      backgroundColor: THEORY_AVG_COLOR,
      position: 'absolute',
      top: -3,
      transform: 'translate(0,4px)'
    }
  },
  root: {
    overflowY: 'scroll',
    overflowX: 'hidden'
  },
  box: {
    margin: theme.spacing(0, 5, 0, 5),
    backgroundColor: theme.palette.background.light,
    overflowY: 'hidden',
    overflowX: 'hidden',
    borderRight: `1px solid ${theme.palette.border.main}`,
    borderTop: `1px solid ${theme.palette.border.main}`,
    borderLeft: `1px solid ${theme.palette.border.main}`
  },
  topBox: {
    borderRadius: '8px 8px 0px 0px',
    paddingTop: '10px'
  },
  bottomBox: {
    borderRadius: '0px 0px 8px 8px',
    borderBottom: `1px solid ${theme.palette.border.main}`
  },

  header: {
    fontWeight: 'bold',
    color: theme.palette.text.primary
  },
  infoBox: {
    border: '1px solid !important',
    borderColor: `${
      theme.name === THEMES.DARK ? theme.palette.border.main : '#000000'
    }`,
    borderRadius: 6,
    backgroundColor: theme.palette.component.main
  },
  chartBox: {
    backgroundColor: `${theme.palette.background.default}`,
    border: `1px solid ${theme.palette.border.main} !important`
  },
  infoText: {
    fontStyle: 'italics',
    margin: '10px',
    fontSize: '12px',
    color: theme.palette.text.primary
  },
  none: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '15vh',
    borderRadius: 6
  },
  text: {
    color: `${theme.palette.text.primary} !important`,
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontSize: '12px',
    lineHeight: '16px',
    letterSpacing: ' 0.05em',
    display: 'flex'
  },
  subtitle: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontSize: '21px',
    lineHeight: '25px',
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.border.main,
    paddingLeft: '.5vw',
    borderBottom: `2px solid ${theme.palette.border.main}`
    // borderLeft: `1px solid ${theme.palette.border.main}`,
    // borderRight: `1px solid ${theme.palette.border.main}`,
  },
  tableHead: {
    backgroundColor: `${theme.name === THEMES.DARK ? grey[900] : grey[100]}`,
    color: theme.palette.text.primary,
    border: '1px solid #000000 !important',
    borderCollapse: 'collapse',
    margin: '0px',
    padding: '10px'
  },
  tableBody: {
    color: theme.palette.text.primary,
    border: '1px solid #000000 !important',
    borderCollapse: 'collapse',
    margin: '0px',
    padding: '10px'
  },
  datePicker: {
    backgroundColor: theme.palette.background.light,
    color: theme.palette.text.primary,
    borderRadius: 6
  }
}));

const AnalysisSelection: FC<AnalysisSelectionProps> = ({
  onOpen,
  analysisType,
  setAnalysisType,
  state,
  data,
  maxAltitude,
  values,
  metricType,
  containsPoint,
  analysisDone,
  onState,
  theoryPointData,
  wizardIndex,
  setData,
  setAnalysisDone,
  refresh,
  setRefresh
}) => {
  const classes = customStyles();
  const [modelType, setModelType] = useState<string>('spa');
  const [localAnalysisType, setLocalAnalysisType] =
    useState<string>('no-point');
  const [showTheory, setShowTheory] = useState<boolean>(false);
  const [stepDef, setStepDef] = useState<{
    startAltitude: number;
    stopAltitude: number;
    altitudeStep: number;
    startInclination: number;
    stopInclination: number;
    inclinationStep: number;
    startEccentricity: number;
    stopEccentricity: number;
    eccentricityStep: number;
  }>({
    startAltitude: state.parameters.altitude,
    stopAltitude: state.parameters.altitude + 100,
    altitudeStep: 50,
    startInclination: state.parameters.inclination,
    stopInclination: state.parameters.inclination + 10,
    inclinationStep: 5,
    startEccentricity: state.parameters.eccentricity,
    stopEccentricity: state.parameters.eccentricity + 0.1,
    eccentricityStep: 0.05
  });
  const [startDate, setStartDate] = useState<string>(
    state.step.timeStep.start.toLocaleDateString('en-US')
  );
  const [endDate, setEndDate] = useState<string>(
    state.step.timeStep.end.toLocaleDateString('en-US')
  );
  const [timeStep, setTimeStep] = useState<number>(state.step.timeStep.step);
  const [selectedGraph, setSelectedGraph] = useState<string>(
    state.parameters.isOrbital && state.parameters.eccentricity === 0
      ? '3d-view'
      : '4d-view'
  );
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [needsUpdating, setNeedsUpdating] = useState<boolean>(false);
  const [metricChanged, setMetricChanged] = useState<boolean>(false);
  const [disableParametric, setDisableParametric] = useState<boolean>(false);
  const { zoom } = useSelector((state) => state.zoom);
  const { enqueueSnackbar } = useSnackbar();

  const isCircular = state.parameters.orbitState !== 1;

  useEffect(() => {
    if (refresh) {
      setAnalysisType('no-point');
      setLocalAnalysisType('no-point');
      setRefresh(false);
    } else {
      setAnalysisType('point');
      setLocalAnalysisType('point');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  useEffect(() => {
    if (selectedGraph === '3d-view' && state.parameters.eccentricity > 0) {
      setSelectedGraph('4d-view');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.parameters.eccentricity]);

  useEffect(() => {
    if (state.networkType === 'dte' && state.parameters.altitude > 1000) {
      setLocalAnalysisType('point');
      setAnalysisType('point');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.parameters.altitude, state.selectedItems]);

  useEffect(() => {
    if (state.parameters.inclination > 120) {
      setLocalAnalysisType('point');
      setAnalysisType('point');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.parameters.inclination]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalAnalysisType((event.target as HTMLInputElement).value);
    if (event.target.value !== 'point') {
      onState('pointSync', false);
      onState('parametric', false);
    }
    if (event.target.value === 'point') {
      if (modelType === 'spa') {
        onState('pointSync', true);
        onState('parametric', false);
      } else if (modelType === 'pma') {
        onState('pointSync', true);
        onState('parametric', false);
      }
    } else if (event.target.value === 'no-point') {
      onState('pointSync', false);
      onState('parametric', false);
    }
  };

  const updateStateWithStep = () => {
    if (needsUpdating) {
      if (state.parameters.isOrbital && state.parameters.eccentricity === 0) {
        setSelectedGraph('3d-view');
      } else {
        setSelectedGraph('4d-view');
      }

      let newStep: StepDef = {
        altitudeStep: { start: 0, end: 0, step: 0 },
        inclinationStep: { start: 0, end: 0, step: 0 },
        eccentricityStep: { start: 0, end: 0, step: 0 },
        timeStep: {
          start: state.step.timeStep.start,
          end: state.step.timeStep.end,
          step: state.step.timeStep.step
        }
      };

      newStep.altitudeStep.start = stepDef.startAltitude;
      newStep.altitudeStep.end = stepDef.stopAltitude;
      newStep.altitudeStep.step = stepDef.altitudeStep;
      newStep.inclinationStep.start = stepDef.startInclination;
      newStep.inclinationStep.end = stepDef.stopInclination;
      newStep.inclinationStep.step = stepDef.inclinationStep;
      newStep.eccentricityStep.start = stepDef.startEccentricity;
      newStep.eccentricityStep.end = stepDef.stopEccentricity;
      newStep.eccentricityStep.step = stepDef.eccentricityStep;

      onState('step', newStep);

      setNeedsUpdating(false);
    }
  };

  useEffect(() => {
    adjustTimeRange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    adjustTimeRange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.networkType]);

  useEffect(() => {
    if (state.step.timeStep.start.toLocaleDateString('en-US') !== startDate) {
      setStartDate(state.step.timeStep.start.toLocaleDateString('en-US'));
    }
    if (state.step.timeStep.end.toLocaleDateString('en-US') !== endDate) {
      setStartDate(state.step.timeStep.end.toLocaleDateString('en-US'));
    }
    if (state.step.timeStep.step !== timeStep) {
      setTimeStep(state.step.timeStep.step);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.step.timeStep]);

  const adjustTimeRange = () => {
    if (state.networkType === 'dte') {
      onState('step', {
        ...state.step,
        timeStep: { start: new Date(), end: seeTheFuture(30), step: 30 }
      });
      setEndDate(seeTheFuture(30).toLocaleDateString('en-US'));
    } else if (state.networkType === 'relay') {
      onState('step', {
        ...state.step,
        timeStep: { start: new Date(), end: seeTheFuture(1), step: 1 }
      });
      setEndDate(seeTheFuture(1).toLocaleDateString('en-US'));
    }
  };

  const seeTheFuture = (days: number) => {
    let tomorrow = new Date();
    tomorrow.setDate(new Date().getDate() + days);
    return tomorrow;
  };

  // const nullifyStepOnState = () => {

  //   let newStep: StepDef = {
  //     altitudeStep: {start: 0, end: 0, step: 0},
  //     inclinationStep: {start: 0, end: 0, step: 0},
  //     eccentricityStep: {start: 0, end: 0, step: 0}
  //   };

  //   newStep.altitudeStep.start = state.parameters.altitude;
  //   newStep.altitudeStep.end = state.parameters.altitude;
  //   newStep.altitudeStep.step = 0;
  //   newStep.inclinationStep.start = state.parameters.inclination;
  //   newStep.inclinationStep.end = state.parameters.inclination;
  //   newStep.inclinationStep.step = 0;
  //   newStep.eccentricityStep.start = state.parameters.eccentricity;
  //   newStep.eccentricityStep.end = state.parameters.eccentricity;
  //   newStep.eccentricityStep.step = 0;

  //   onState('step', newStep);
  // };

  const updateAnalysisType = () => {
    if (localAnalysisType === 'point') {
      if (modelType === 'spa') {
        //Temporarily set step sizes and such to 0
        //nullifyStepOnState();
        setAnalysisType('point');
      } else if (modelType === 'pma') {
        //...
        updateStateWithStep();
        setAnalysisType('parametric');
      }
    }
  };

  useEffect(() => {
    setMetricChanged(true);
  }, [metricType]);

  useEffect(() => {
    if (analysisType === 'no-point') {
      onState('pointSync', false);
      onState('parametric', false);
    } else if (analysisType === 'point') {
      onState('pointSync', true);
      onState('parametric', false);
    } else if (analysisType === 'parametric') {
      onState('parametric', true);
      onState('pointSync', true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analysisType]);

  useEffect(() => {
    updateAnalysisType();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelType]);

  useEffect(() => {
    if (localAnalysisType === 'no-point') {
      setAnalysisType('no-point');
    } else {
      updateAnalysisType();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localAnalysisType]);

  const handleSubChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setModelType(event.target.value);
  };

  useEffect(() => {
    updateStateWithStep();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepDef]);

  useEffect(() => {
    setDisableParametric(
      !state.parameters.isOrbital || state.parameters.orbitState === 2
    );
    if (!state.parameters.isOrbital || state.parameters.orbitState === 2) {
      setModelType('spa');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.parameters.isOrbital, state.parameters.orbitState]);

  useEffect(() => {
    let newValue = { ...stepDef };
    let difference = state.parameters.altitude - stepDef.startAltitude;
    newValue.startAltitude = state.parameters.altitude;
    newValue.stopAltitude =
      newValue.stopAltitude + difference > 0
        ? newValue.stopAltitude + difference
        : 0;
    setStepDef(newValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.parameters.altitude]);

  useEffect(() => {
    let newValue = { ...stepDef };
    let difference = state.parameters.inclination - stepDef.startInclination;
    newValue.startInclination = state.parameters.inclination;
    newValue.stopInclination =
      newValue.stopInclination + difference > 0
        ? newValue.stopInclination + difference
        : 0;
    setStepDef(newValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.parameters.inclination]);

  useEffect(() => {
    let newValue = { ...stepDef };
    let difference = state.parameters.eccentricity - stepDef.startEccentricity;
    newValue.startEccentricity = state.parameters.eccentricity;
    newValue.stopEccentricity =
      newValue.stopEccentricity + difference > 0
        ? newValue.stopEccentricity + difference
        : 0;
    setStepDef(newValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.parameters.eccentricity]);

  useEffect(() => {
    if (analysisType === 'math' && state.networkType === 'relay') {
      setAnalysisType('no-point');
    } else {
      setAnalysisType(localAnalysisType);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let listChange = listChanged(state.selectedItems);
    if (wizardIndex === 1) {
      if (listChange) {
        onOpen();
        let newList = [];
        state.selectedItems.forEach((station) => {
          newList.push(station.name);
        });
        setSelectedItems(newList);
        setMetricChanged(false);
      }
      updateStateWithStep();
    }
    if (wizardIndex !== 0 && listChange) {
      setData(null);
      setAnalysisDone(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wizardIndex]);

  const listChanged = (newList: SelectedNetwork[]) => {
    let result = false;
    if (newList.length !== selectedItems.length) {
      return true;
    }
    selectedItems.forEach((item, index) => {
      if (item !== newList[index].name) {
        result = true;
      }
    });
    return result;
  };

  const onGraphChange = (event) => {
    setSelectedGraph(event.currentTarget.name);
  };

  //we change the values based on the name of the text box that was changed
  //this is the funciton that gets used for the parametric tab
  //be sure to name boxes properly
  const onChangeParameters = (event): void => {
    const { name, value } = event.target;
    if (isNaN(value)) return;
    let newValue = { ...stepDef };
    newValue[name] = Number(value);

    setStepDef(newValue);
    setNeedsUpdating(true);
    if (name.includes('start')) {
      if (name.includes('Altitude')) {
        onState('parameters', { ...state.parameters, altitude: Number(value) });
      } else if (name.includes('Inclination')) {
        onState('parameters', {
          ...state.parameters,
          inclination: Number(value)
        });
      } else if (name.includes('Eccentricity')) {
        onState('parameters', {
          ...state.parameters,
          eccentricity: Number(value)
        });
      }
    }
  };

  const handleDateChange = (event) => {
    const { name, value } = event.target;
    if (name === 'step') {
      if (!isNaN(value) && value > 0 && value < Number.MAX_SAFE_INTEGER) {
        onState('step', {
          ...state.step,
          timeStep: { ...state.step.timeStep, step: value }
        });
        setTimeStep(value);
      } else {
        setTimeStep(state.step.timeStep.step);
      }
      return;
    } else {
      const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
      if (dateRegex.test(value)) {
        let dateArray = value.split('/');
        if (
          isValidDate(
            Number(dateArray[1]),
            Number(dateArray[0]),
            Number(dateArray[2])
          )
        ) {
          let potentialDate = new Date(
            Number(dateArray[2]),
            Number(dateArray[0]) - 1,
            Number(dateArray[1])
          );
          if (name === 'start') {
            if (potentialDate < state.step.timeStep.end) {
              onState('step', {
                ...state.step,
                timeStep: { ...state.step.timeStep, start: potentialDate }
              });
              setStartDate(value);
            } else {
              enqueueSnackbar(
                'Please enter a start date less than the end date',
                {
                  variant: 'error',
                  anchorOrigin: { vertical: 'bottom', horizontal: 'right' }
                }
              );
              setStartDate(
                state.step.timeStep.start.toLocaleDateString('en-US')
              );
            }
          } else if (name === 'end') {
            if (potentialDate > state.step.timeStep.start) {
              onState('step', {
                ...state.step,
                timeStep: { ...state.step.timeStep, end: potentialDate }
              });
              setEndDate(value);
            } else {
              enqueueSnackbar(
                'Please enter an end date greater than the start date',
                {
                  variant: 'error',
                  anchorOrigin: { vertical: 'bottom', horizontal: 'right' }
                }
              );
              setEndDate(state.step.timeStep.end.toLocaleDateString('en-US'));
            }
          }
        } else {
          enqueueSnackbar(
            'Please enter a valid date beyond 01/01/2000, and before 01/01/2099',
            {
              variant: 'error',
              anchorOrigin: { vertical: 'bottom', horizontal: 'right' }
            }
          );
          if (name === 'start') {
            setStartDate(state.step.timeStep.start.toLocaleDateString('en-US'));
          } else if (name === 'end') {
            setEndDate(state.step.timeStep.end.toLocaleDateString('en-US'));
          }
        }
      } else {
        enqueueSnackbar(
          'Date format is incorrect. Please enter as mm/dd/yyyy',
          {
            variant: 'error',
            anchorOrigin: { vertical: 'bottom', horizontal: 'right' }
          }
        );
        if (name === 'start') {
          setStartDate(state.step.timeStep.start.toLocaleDateString('en-US'));
        } else if (name === 'end') {
          setEndDate(state.step.timeStep.end.toLocaleDateString('en-US'));
        }
      }
    }
  };

  const isValidDate = (day, month, year): boolean => {
    let earliestPossibleDate = new Date(2000, 1, 1);
    let possibleDate = new Date(year, month, day);
    let latestPossibleDate = new Date(2099, 1, 1);
    if (
      possibleDate < earliestPossibleDate ||
      possibleDate > latestPossibleDate
    ) {
      return false;
    }
    switch (month) {
      case 1:
      case 3:
      case 5:
      case 7:
      case 8:
      case 10:
      case 12:
        if (day > 31) {
          return false;
        }
        break;
      case 4:
      case 6:
      case 9:
      case 11:
        if (day > 30) {
          return false;
        }
        break;
      case 2:
        if (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) {
          if (day > 29) {
            return false;
          }
        } else if (day > 28) {
          return false;
        }
        break;
      default:
        return false;
    }
    return true;
  };
  const disableMe = (type) => {
    if (type === 'alt') {
      return (
        state.parameters.orbitState === 2 && !state.parameters.sunSyncUseAlt
      );
    } else if (type === 'inc') {
      return (
        state.parameters.orbitState === 2 && state.parameters.sunSyncUseAlt
      );
    }
  };

  const onEditParameters = (event) => {
    const { name, value } = event.target;
    if (isNaN(value)) return;
    let newValue = { ...stepDef };
    newValue[name] = Number(value);

    setStepDef(newValue);
  };

  return (
    <div
      className={classes.root}
      style={{
        minHeight: (window.screen.availHeight / zoom) * 0.765,
        maxHeight: (window.screen.availHeight / zoom) * 0.765
      }}
    >
      <Grid item md={12} />
      <Box className={clsx(classes.box, classes.topBox)}>
        {/* <Grid item md = {12} style={{margin:'20px'}}>
            <Typography
              variant="body1"
              component="p"
              className={classes.header}
            >
              {'Analysis Type'}
            </Typography>
          </Grid> */}
        <Grid item md={12} style={{ margin: '0px 20px 0px 20px' }}>
          <FormControl fullWidth>
            <Grid container spacing={2}>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                name="radio-buttons-group"
                value={localAnalysisType}
                onChange={handleChange}
              >
                <Box display={'flex'} overflow="hidden">
                  <Grid
                    item
                    md={5}
                    style={{ minWidth: '50%', overflow: 'hidden' }}
                  >
                    {' '}
                    <FormControlLabel
                      value="point"
                      control={<Radio />}
                      label="Real Time Modeling"
                      className={classes.text}
                      style={{ fontSize: 'small' }}
                    />
                  </Grid>
                  <Grid
                    item
                    md={7}
                    style={{ minWidth: '53%', overflow: 'hidden' }}
                  >
                    {' '}
                    <FormControlLabel
                      value="no-point"
                      control={<Radio />}
                      label="Regression Estimation"
                      className={classes.text}
                      style={{ fontSize: 'small' }}
                      disabled={state.parameters.inclination > 120}
                    />
                  </Grid>
                </Box>
              </RadioGroup>
            </Grid>
          </FormControl>
        </Grid>
        {/* <Grid item md={12} style={{margin:'0px 20px 20px 20px'}}>
            <Box m={2} className={classes.infoBox}>
              <Typography variant="body2" className={classes.infoText}>
                {localAnalysisType === 'point'?REAL_TIME_MODELING_DESCRIPTION:REGRESSION_ESTIMATION_DESCRIPTION}
              </Typography>
            </Box>
          </Grid> */}
        <Grid item xs={12}>
          <Typography
            className={classes.subtitle}
            style={{ marginTop: '10px' }}
          >
            {localAnalysisType === 'no-point'
              ? 'Data & Regression'
              : 'Analysis Time Range'}
          </Typography>
        </Grid>
      </Box>

      <Box className={clsx(classes.box, classes.bottomBox)}>
        <Grid container spacing={3}>
          {/*The view for the regression analysis. Its a graph that displays the coverage data that we get from the RFCoverage API call
          If the data doesn't show up, a warning is displayed and this analysis type is disabled (see OK button below)*/}
          {localAnalysisType === 'no-point' &&
            state.selectedItems.length > 0 && (
              <Grid container item md={12} xs={12} alignItems="center">
                <Grid container spacing={3}>
                  {/* <Grid item md = {12} style={{marginLeft: '20px', marginTop: '20px', marginBottom: '10px'}}>
                <Typography
                  variant="body1"
                  component="p"
                  color="textPrimary"
                  className={classes.header}
                >
                  {'Orbital Statistics'}
                </Typography>
              </Grid> */}
                  {/* <Grid item md = {6} style={{paddingLeft: '10px'}}>
                <Button
                  name="3d-view"
                  variant={selectedGraph === '3d-view' ? 'contained' : 'outlined'}
                  size="small"
                  color="primary"
                  onClick={(e) => onGraphChange(e)}
                  style={{ borderRadius: 6 }}
                  disabled = {state.parameters.eccentricity > 0 || (localAnalysisType === 'no-point' && data == null && analysisDone && state.selectedItems.length > 0)}
                  fullWidth
                >
                  3D
                </Button>
              </Grid>
              <Grid item md = {6} style={{paddingRight: '10px'}}>
                <Button
                  name="4d-view"
                  variant={selectedGraph === '4d-view' ? 'contained' : 'outlined'}
                  size="small"
                  color="primary"
                  onClick={(e) => onGraphChange(e)}
                  style={{ borderRadius: 6 }}
                  fullWidth
                  disabled={(localAnalysisType === 'no-point' && data == null && analysisDone && state.selectedItems.length > 0)}
                >
                  4D
                </Button>
              </Grid> */}
                  <Grid item xs={1}>
                    <Radio
                      name={'3d-view'}
                      checked={selectedGraph === '3d-view'}
                      onChange={onGraphChange}
                      disabled={
                        state.parameters.eccentricity > 0 ||
                        (localAnalysisType === 'no-point' &&
                          data == null &&
                          analysisDone &&
                          state.selectedItems.length > 0)
                      }
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <Typography
                      className={classes.text}
                      style={{ paddingLeft: '8px', marginTop: '14px' }}
                    >
                      3D
                    </Typography>
                  </Grid>
                  <Grid item xs={1}>
                    <Radio
                      name={'4d-view'}
                      checked={selectedGraph === '4d-view'}
                      onChange={onGraphChange}
                      disabled={
                        localAnalysisType === 'no-point' &&
                        data == null &&
                        analysisDone &&
                        state.selectedItems.length > 0
                      }
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <Typography
                      className={classes.text}
                      style={{ paddingLeft: '8px', marginTop: '14px' }}
                    >
                      4D
                    </Typography>
                  </Grid>
                  <Box
                    display={'center'}
                    mx={3}
                    my={1}
                    className={classes.chartBox}
                    style={{
                      width: '100%',
                      height: (window.screen.availHeight / zoom) * 0.303
                    }}
                  >
                    {state.parameters.eccentricity === 0 &&
                      data != null &&
                      !metricChanged &&
                      state.parameters.isOrbital && (
                        <Grid
                          item
                          md={12}
                          xs={12}
                          /*Maybe somebody with more time than me can figure out how to center this thing*/ style={{
                            display: selectedGraph === '3d-view' ? '' : 'none'
                          }}
                        >
                          <SurfacePlot
                            state={[state]}
                            data={[data]}
                            metricType={metricType}
                            regressionTypes={[state].map(
                              (s) => s.regressionTypes[metricType]
                            )}
                            minAltitude={0}
                            maxAltitude={maxAltitude}
                            values={values}
                            isLegend={true}
                            isSub={false}
                            zAxisLabel={
                              data.modelData.orbital[metricType]
                                ? data.modelData.orbital[metricType].label
                                : 'placeholder'
                            }
                            plotOptions={{
                              show_scatter: true,
                              show_surface: true
                            }}
                            chartDiv={metricType + 'plotly'}
                            size={{
                              width: (window.screen.availWidth / zoom) * 0.2,
                              height: (window.screen.availHeight / zoom) * 0.3
                            }}
                            maxInclination={
                              state.networkType === 'relay' ? 90 : 120
                            }
                            reset={false}
                            forceSize={true}
                          />
                        </Grid>
                      )}
                    {data != null &&
                      !metricChanged &&
                      state.parameters.isOrbital && (
                        <Grid
                          item
                          md={12}
                          xs={12}
                          style={{
                            display: selectedGraph === '4d-view' ? '' : 'none'
                          }}
                          alignContent={'center'}
                        >
                          <Heatmap
                            state={[state]}
                            data={[data]}
                            metricType={metricType}
                            minAltitude={0}
                            maxAltitude={maxAltitude}
                            values={values}
                            isLegend={true}
                            isSub={false}
                            plotOptions={{
                              show_scatter: true,
                              show_surface: false
                            }}
                            chartDiv={metricType + 'plotly'}
                            size={{
                              width: (window.screen.availWidth / zoom) * 0.2,
                              height: (window.screen.availHeight / zoom) * 0.3
                            }}
                            maxInclination={
                              state.networkType === 'relay' ? 90 : 120
                            }
                            reset={false}
                            forceSize={true}
                            title={
                              data.modelData.orbital[metricType]
                                ? data.modelData.orbital[metricType].label
                                : 'placeholder'
                            }
                          />
                        </Grid>
                      )}
                    {/*Our loading text. Please be patient, girls are praying...*/}
                    {data == null && !analysisDone && (
                      <Grid item md={12} className={classes.none}>
                        <Typography align="center" variant="body1">
                          Loading Data...
                        </Typography>
                      </Grid>
                    )}
                    {/*Say that we don't have the regression if nothing shows up after we do the API call for the coverage data
              This also probably means that CART is in no-regression mode*/}
                    {localAnalysisType === 'no-point' &&
                      data == null &&
                      analysisDone &&
                      state.selectedItems.length > 0 && (
                        <Grid item md={12} className={classes.none}>
                          <Typography align="center" variant="body1">
                            No Regression Available For This Network
                          </Typography>
                        </Grid>

                        // <Grid item md={12} xs={12} alignItems="center">
                        //   <div className= {classes.alert}><i>A regression for this configuration may not exist. Either a new regression will need to be generated, or the regression analysis will be unavailible
                        //     <br></br>For additional information, please contact the CART team.</i></div>
                        // </Grid>
                      )}
                  </Box>
                  {localAnalysisType === 'no-point' && (
                    <Grid item xs={12}>
                      <Typography
                        className={classes.subtitle}
                        style={{ borderBottom: `3px solid #E34747` }}
                      >
                        Average Coverage
                      </Typography>
                    </Grid>
                  )}

                  {theoryPointData != null ? (
                    <>
                      {/* <Grid item md={7}>
                    <div style={{ padding:'10px',}}>
                      <table style = {{ fontSize: '12px', borderCollapse:'collapse',  padding: '5px', textAlign: 'center', height: (window.screen.availHeight / zoom) * .1, width: (window.screen.availHeight / zoom)* .21}}> 
                        <tbody>
                          <tr>
                            <th className = {classes.tableHead} colSpan= {100}>Average Coverage</th>
                          </tr>
                          <tr>
                            <td className = {classes.tableBody}>Regression</td>
                            <td className = {classes.tableBody}>{theoryPointData.regressionCoverage ? (<><span style={{color:THEORY_AVG_COLOR}}>{(theoryPointData.regressionCoverage*(60*24)).toFixed(1)}</span> mins/day</>) : <span style={{color:THEORY_AVG_COLOR}}>N/A</span>}</td>
                          </tr>
                          <tr>
                            <td className = {classes.tableBody}>Theoretical</td>
                            <td className = {classes.tableBody}><span style={{color:THEORY_AVG_COLOR}}>{(theoryPointData.theoryCoverage*(60*24)).toFixed(1)}</span> mins/day</td>
                          </tr>
                          <tr>
                            <td colSpan= {100} className = {classes.tableBody}>Difference = {theoryPointData.regressionCoverage? <span style={{color:THEORY_AVG_COLOR}}>{((Math.abs(theoryPointData.theoryCoverage - theoryPointData.regressionCoverage)/theoryPointData.theoryCoverage)*100).toFixed(1)}%</span>: <span style={{color:THEORY_AVG_COLOR}}>N/A</span>}</td>
                          </tr>
                        </tbody>
                      </table>
                      
                    </div>
                </Grid> */}
                      <Grid item xs={6}>
                        <Typography
                          className={classes.text}
                          style={{ paddingLeft: '8px' }}
                        >
                          Regression
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography className={classes.text}>
                          {theoryPointData.regressionCoverage ? (
                            <span style={{ color: '#E34747' }}>
                              {(
                                theoryPointData.regressionCoverage *
                                (60 * 24)
                              ).toFixed(1)}{' '}
                              mins/day
                            </span>
                          ) : (
                            <span style={{ color: '#E34747' }}>N/A</span>
                          )}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          className={classes.text}
                          style={{ paddingLeft: '8px' }}
                        >
                          Theoretical
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography className={classes.text}>
                          {theoryPointData.regressionCoverage ? (
                            <span style={{ color: '#E34747' }}>
                              {(
                                theoryPointData.theoryCoverage *
                                (60 * 24)
                              ).toFixed(1)}{' '}
                              mins/day
                            </span>
                          ) : (
                            <span style={{ color: '#E34747' }}>N/A</span>
                          )}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          className={classes.text}
                          style={{ paddingLeft: '8px' }}
                        >
                          Difference
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography className={classes.text}>
                          {theoryPointData.regressionCoverage ? (
                            <span style={{ color: '#E34747' }}>
                              {(
                                (Math.abs(
                                  theoryPointData.theoryCoverage -
                                    theoryPointData.regressionCoverage
                                ) /
                                  theoryPointData.theoryCoverage) *
                                100
                              ).toFixed(1)}
                              %
                            </span>
                          ) : (
                            <span style={{ color: '#E34747' }}>N/A</span>
                          )}
                        </Typography>
                      </Grid>
                      <Grid item md={12} style={{ padding: '8px' }}>
                        <div style={{ padding: '8px' }}>
                          <Typography
                            style={{ fontSize: '12px', fontWeight: 'bold' }}
                            className={classes.text}
                          >
                            <Link
                              href="#"
                              underline="always"
                              onClick={() => {
                                setShowTheory(true);
                              }}
                            >
                              Theoretical Value
                            </Link>
                          </Typography>
                          <Typography className={classes.text}>
                            Click above to learn more on how theoretical average
                            is calculated.
                          </Typography>
                        </div>
                      </Grid>
                    </>
                  ) : (
                    <>
                      <Grid item xs={6}>
                        <Typography
                          className={classes.text}
                          style={{ paddingLeft: '8px' }}
                        >
                          Regression
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography className={classes.text}>
                          <span style={{ color: '#E34747' }}>N/A</span>
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          className={classes.text}
                          style={{ paddingLeft: '8px' }}
                        >
                          Theoretical
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography className={classes.text}>
                          <span style={{ color: '#E34747' }}>N/A</span>
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          className={classes.text}
                          style={{ paddingLeft: '8px' }}
                        >
                          Difference
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography className={classes.text}>
                          <span style={{ color: '#E34747' }}>N/A</span>
                        </Typography>
                      </Grid>
                      <Grid item md={12}>
                        <div style={{ padding: '8px' }}>
                          <Typography
                            style={{ fontSize: '12px', fontWeight: 'bold' }}
                            className={classes.text}
                          >
                            <Link
                              href="#"
                              underline="always"
                              onClick={() => {
                                setShowTheory(true);
                              }}
                            >
                              Theoretical Value
                            </Link>
                          </Typography>
                          <Typography className={classes.text}>
                            Click above to learn more on how theoretical average
                            is calculated.
                          </Typography>
                        </div>
                      </Grid>
                    </>
                  )}
                </Grid>
              </Grid>
            )}
          {/* {(localAnalysisType === 'no-point' && state.parameters.eccentricity > 0 && analysisDone) && (

            <Grid item md={9} xs={12} alignItems="center">
              <div className= {classes.alert} style = {{textAlign: 'center'}}><i>No regressions exist for eccentricities greater than 0, so the regression analysis is not available</i></div>
            </Grid>
            )
          } */}
          {/*The view for the single point analysis.*/}

          {localAnalysisType === 'point' && state.selectedItems.length > 0 && (
            <>
              <Box m={6}>
                <Grid item md={12} xs={12}>
                  {/* <Grid item md = {12}>
              <Typography
                variant="body1"
                component="p"
                className={classes.header}
              >
                {'Analysis Settings'}
              </Typography>
            </Grid> */}
                  <Grid container alignItems="center" spacing={4}>
                    <Grid item md={12} xs={12}>
                      <Grid container alignItems="center" spacing={4}>
                        {/* <Grid item md = {12} xs = {12}>
                    <Typography variant="body1" component="p" className={classes.header} style={{marginTop: '10px'}}>
                      {'Time Range (mm/dd/yyyy)'}
                    </Typography>
                  </Grid> */}
                        <Grid item xs={5}>
                          <Typography variant="body1" className={classes.text}>
                            Start Date (mm/dd/yyyy)
                          </Typography>
                        </Grid>
                        <Grid item xs={7}>
                          {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label=""
                        value={startDate}
                        onChange={(newValue) => {
                          setStartDate(newValue);
                        }}
                        renderInput={({ inputRef, inputProps, InputProps }) => (
                          <Box sx={{ display: 'flex', alignItems: 'center' }} >
                            <TextField {...inputRef} className = {classes.datePicker}/>
                            {InputProps?.endAdornment}
                          </Box>
                        )}
                      />
                      </LocalizationProvider> */}
                          <TextField
                            size="small"
                            fullWidth
                            value={startDate}
                            name="start"
                            InputProps={{
                              disableUnderline: true,
                              inputProps: {
                                className: classes.input
                              }
                            }}
                            onBlur={handleDateChange}
                            onChange={(event) =>
                              setStartDate(event.target.value)
                            }
                            onKeyPress={(ev) => {
                              if (ev.key === 'Enter') {
                                handleDateChange(ev);
                              }
                            }}
                          />
                        </Grid>
                        <Grid item xs={5}>
                          <Typography variant="body1" className={classes.text}>
                            End Date (mm/dd/yyyy)
                          </Typography>
                        </Grid>
                        <Grid item xs={7}>
                          {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label=""
                          value={endDate}
                          onChange={(newValue) => {
                            setEndDate(newValue);
                          }}
                          renderInput={({ inputRef, inputProps, InputProps }) => (
                            <Box sx={{ display: 'flex', alignItems: 'center' }} >
                              <TextField {...inputRef} className = {classes.datePicker}/>
                              {InputProps?.endAdornment}
                            </Box>
                          )}
                        />
                        </LocalizationProvider> */}
                          <TextField
                            size="small"
                            fullWidth
                            value={endDate}
                            name="end"
                            InputProps={{
                              disableUnderline: true,
                              inputProps: {
                                className: classes.input
                              }
                            }}
                            onBlur={handleDateChange}
                            onChange={(event) => setEndDate(event.target.value)}
                            onKeyPress={(ev) => {
                              if (ev.key === 'Enter') {
                                handleDateChange(ev);
                              }
                            }}
                          />
                        </Grid>

                        <Grid item sm={5}>
                          <Typography variant="body1" className={classes.text}>
                            Time Step (sec)
                          </Typography>
                        </Grid>
                        <Grid item xs={7}>
                          <TextField
                            size="small"
                            fullWidth
                            InputProps={{
                              disableUnderline: true,
                              inputProps: {
                                className: classes.input
                              }
                            }}
                            value={timeStep}
                            onBlur={handleDateChange}
                            name="step"
                            onChange={(event) => {
                              !isNaN(Number(event.target.value)) &&
                                setTimeStep(Number(event.target.value));
                            }}
                            onKeyPress={(ev) => {
                              if (ev.key === 'Enter') {
                                handleDateChange(ev);
                              }
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
              {localAnalysisType === 'point' && (
                <Grid item xs={12}>
                  <Typography
                    className={classes.subtitle}
                    style={{ borderBottom: `3px solid #E34747` }}
                  >
                    Analysis Run Type
                  </Typography>
                </Grid>
              )}
              <Grid item xs={12}>
                <Box m={6}>
                  <Grid item md={12} xs={12}>
                    <Grid container alignItems="center" spacing={4}>
                      <Grid item md={12} xs={12}>
                        <FormControl style={{ width: '100%' }}>
                          {/* <Grid item md = {12} xs = {12}>
                    <Typography variant="body1" component="p" className={classes.header} style={{marginTop: '10px'}}>
                      {'Analysis Run Type'}
                    </Typography>
                  </Grid> */}
                          <RadioGroup
                            aria-labelledby="modeling-type-radio-buttons-group-label"
                            name="radio-buttons-group"
                            value={modelType}
                            onChange={handleSubChange}
                            row
                            style={{
                              justifyContent: 'space-around'
                            }}
                          >
                            <FormControlLabel
                              value="spa"
                              control={<Radio />}
                              label="Single Point"
                              className={classes.text}
                            />
                            <FormControlLabel
                              value="pma"
                              control={<Radio />}
                              label="Parametric"
                              disabled={disableParametric}
                              className={classes.text}
                            />
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                      {modelType === 'pma' && (
                        <>
                          {/* Altitude step Definition */}
                          <Grid item md={12} xs={12}>
                            <Grid container alignItems="center" spacing={4}>
                              {/* <Grid item md={1}/><Grid item md={3} xs={12}>
                      <Typography variant="body1" className = {classes.text}>{modelType == 'spa' ? "Altitude (km)" : "Start"}</Typography>
                    </Grid>
                    <Grid item md={7} xs={12}>
                    <TextField
                      variant="outlined"
                      size="small"
                      fullWidth
                      value = {stepDef.startAltitude.toFixed(0)}
                      onBlur = {onChangeParameters}
                      onChange = {onEditParameters}
                      name = {'startAltitude'}
                      disabled = {disableMe('alt')}
                      className = {classes.input}
                      />
                    </Grid>
                    <Grid item md = {1}/> */}

                              <Grid
                                container
                                item
                                alignItems="center"
                                spacing={4}
                                xs={12}
                                style={{
                                  maxHeight: '300px',
                                  overflow: 'hidden',
                                  transition: 'max-height 0.4s linear',
                                  paddingLeft: 0,
                                  paddingRight: 0
                                }}
                              >
                                {/* <Grid item md = {12} xs = {12}>
                        <Typography variant="body1" component="p" className={classes.header}>
                          {'User Altitude (km)'}
                        </Typography>
                      </Grid> */}
                                <Grid item md={5} xs={12}>
                                  <Typography className={classes.text}>
                                    User Altitude Start (km)
                                  </Typography>
                                </Grid>
                                <Grid item md={7} xs={12}>
                                  <TextField
                                    size="small"
                                    fullWidth
                                    value={stepDef.startAltitude.toFixed(0)}
                                    onBlur={onChangeParameters}
                                    onChange={onEditParameters}
                                    name={'startAltitude'}
                                    InputProps={{
                                      disableUnderline: true,
                                      inputProps: {
                                        className: classes.input
                                      }
                                    }}
                                    disabled={disableMe('alt')}
                                  />
                                </Grid>
                                <Grid item md={5} xs={12}>
                                  <Typography
                                    variant="body1"
                                    className={classes.text}
                                  >
                                    User Altitude End (km)
                                  </Typography>
                                </Grid>
                                <Grid item md={7} xs={12}>
                                  <TextField
                                    size="small"
                                    fullWidth
                                    value={stepDef.stopAltitude.toFixed(0)}
                                    onBlur={onChangeParameters}
                                    onChange={onEditParameters}
                                    name={'stopAltitude'}
                                    InputProps={{
                                      disableUnderline: true,
                                      inputProps: {
                                        className: classes.input
                                      }
                                    }}
                                    disabled={disableMe('alt')}
                                  />
                                </Grid>

                                <Grid item md={5} xs={12}>
                                  <Typography
                                    variant="body1"
                                    className={classes.text}
                                  >
                                    Step Size (km)
                                  </Typography>
                                </Grid>
                                <Grid item md={7} xs={12}>
                                  <TextField
                                    size="small"
                                    fullWidth
                                    value={stepDef.altitudeStep}
                                    onBlur={onChangeParameters}
                                    onChange={onEditParameters}
                                    name={'altitudeStep'}
                                    InputProps={{
                                      disableUnderline: true,
                                      inputProps: {
                                        className: classes.input
                                      }
                                    }}
                                    disabled={disableMe('alt')}
                                  />
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>

                          {/* Inclination Step Definition */}
                          <Grid item xs={12} />
                          <Grid item md={12} xs={12}>
                            <Grid container alignItems="center" spacing={4}>
                              {/* <Grid item md={1}/><Grid item md={3} xs={12}>
                      <Typography variant="body1" className = {classes.text}>{modelType == 'spa' ? "Inclination (deg)" : "Start"}</Typography>
                    </Grid>
                    <Grid item md={7} xs={12}>
                    <TextField
                      variant="outlined"
                      size="small"
                      fullWidth
                      value = {stepDef.startInclination}
                      onBlur = {onChangeParameters}
                      onChange = {onEditParameters}
                      name = {'startInclination'}
                      className = {classes.input}
                      disabled = {disableMe('inc')}
                      />
                    </Grid>
                    <Grid item md = {1}/> */}

                              <Grid
                                container
                                item
                                alignItems="center"
                                spacing={4}
                                xs={12}
                                style={{
                                  maxHeight: '300px',
                                  overflow: 'hidden',
                                  transition: 'max-height 0.4s linear',
                                  paddingLeft: 0,
                                  paddingRight: 0
                                }}
                              >
                                {/* <Grid item md = {12} xs = {12}>
                        <Typography variant="body1" component="p" className={classes.header} style={{marginTop: '10px'}}>
                          {modelType == 'spa'?'User Inclination':'User Inclination (deg)'}
                        </Typography>
                      </Grid> */}
                                <Grid item md={5} xs={12}>
                                  <Typography
                                    variant="body1"
                                    className={classes.text}
                                  >
                                    User Inclination Start (deg)
                                  </Typography>
                                </Grid>
                                <Grid item md={7} xs={12}>
                                  <TextField
                                    size="small"
                                    fullWidth
                                    value={stepDef.startInclination}
                                    onBlur={onChangeParameters}
                                    onChange={onEditParameters}
                                    name={'startInclination'}
                                    InputProps={{
                                      disableUnderline: true,
                                      inputProps: {
                                        className: classes.input
                                      }
                                    }}
                                    disabled={disableMe('inc')}
                                  />
                                </Grid>
                                <Grid item md={5} xs={12}>
                                  <Typography
                                    variant="body1"
                                    className={classes.text}
                                  >
                                    User Altitude End (deg)
                                  </Typography>
                                </Grid>
                                <Grid item md={7} xs={12}>
                                  <TextField
                                    size="small"
                                    fullWidth
                                    value={stepDef.stopInclination}
                                    onBlur={onChangeParameters}
                                    onChange={onEditParameters}
                                    name={'stopInclination'}
                                    InputProps={{
                                      disableUnderline: true,
                                      inputProps: {
                                        className: classes.input
                                      }
                                    }}
                                    disabled={disableMe('inc')}
                                  />
                                </Grid>
                                <Grid item md={5} xs={12}>
                                  <Typography
                                    variant="body1"
                                    className={classes.text}
                                  >
                                    Step Size (deg)
                                  </Typography>
                                </Grid>
                                <Grid item md={7} xs={12}>
                                  <TextField
                                    size="small"
                                    fullWidth
                                    value={stepDef.inclinationStep}
                                    onBlur={onChangeParameters}
                                    onChange={onEditParameters}
                                    name={'inclinationStep'}
                                    InputProps={{
                                      disableUnderline: true,
                                      inputProps: {
                                        className: classes.input
                                      }
                                    }}
                                    disabled={disableMe('inc')}
                                  />
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item xs={12} />
                          {/* Eccentricity Step Definition */}
                          {!isCircular && (
                            <Grid item md={12} xs={12}>
                              <Grid container alignItems="center" spacing={4}>
                                {/* <Grid item md={1}/><Grid item md={3} xs={12}>
                      <Typography variant="body1" className = {classes.text}>{modelType == 'spa' ? "Eccentricity" : "Start"}</Typography>
                    </Grid>
                    <Grid item md={7} xs={12}>
                      <TextField
                        variant="outlined"
                        size="small"
                        fullWidth
                        value = {parseFloat(stepDef.startEccentricity.toString()).toFixed(2)}
                        onBlur = {onChangeParameters}
                        onChange = {onEditParameters}
                        name = {'startEccentricity'}
                        className = {classes.input}
                        />
                    </Grid>
                    <Grid item md = {1}/> */}

                                {/* <Tooltip
                      title={`Stepping over eccentricity has not yet been implemented. Using start value for eccentricity.`}
                      placement="top-start"
                      classes={{ tooltip: classes.tooltip }}
                    > */}
                                <Grid
                                  container
                                  item
                                  alignItems="center"
                                  spacing={4}
                                  xs={12}
                                  style={{
                                    maxHeight: '300px',
                                    overflow: 'hidden',
                                    transition: 'max-height 0.4s linear',
                                    paddingLeft: 0,
                                    paddingRight: 0
                                  }}
                                >
                                  {/* <Grid item md = {12} xs = {12}>
                          <Typography variant="body1" component="p" className={classes.header} style={{marginTop: '10px'}}>
                            {'Eccentricity'}
                          </Typography>
                        </Grid> */}
                                  <Grid item md={5} xs={12}>
                                    <Typography
                                      variant="body1"
                                      className={classes.text}
                                    >
                                      User Eccentricity Start
                                    </Typography>
                                  </Grid>
                                  <Grid item md={7} xs={12}>
                                    <TextField
                                      size="small"
                                      fullWidth
                                      value={parseFloat(
                                        stepDef.startEccentricity.toString()
                                      ).toFixed(2)}
                                      onBlur={onChangeParameters}
                                      onChange={onEditParameters}
                                      name={'startEccentricity'}
                                      InputProps={{
                                        disableUnderline: true,
                                        inputProps: {
                                          className: classes.input
                                        }
                                      }}
                                    />
                                  </Grid>
                                  <Grid item md={5} xs={12}>
                                    <Typography
                                      variant="body1"
                                      className={classes.text}
                                    >
                                      User Eccentricity End
                                    </Typography>
                                  </Grid>
                                  <Grid item md={7} xs={12}>
                                    <TextField
                                      size="small"
                                      fullWidth
                                      value={parseFloat(
                                        stepDef.stopEccentricity.toString()
                                      ).toFixed(2)}
                                      onBlur={onChangeParameters}
                                      onChange={onEditParameters}
                                      name={'stopEccentricity'}
                                      InputProps={{
                                        disableUnderline: true,
                                        inputProps: {
                                          className: classes.input
                                        }
                                      }}
                                    />
                                  </Grid>
                                  <Grid item md={5} xs={12}>
                                    <Typography
                                      variant="body1"
                                      className={classes.text}
                                    >
                                      Step Size
                                    </Typography>
                                  </Grid>
                                  <Grid item md={7} xs={12}>
                                    <TextField
                                      size="small"
                                      fullWidth
                                      value={parseFloat(
                                        stepDef.eccentricityStep.toString()
                                      ).toFixed(2)}
                                      onBlur={onChangeParameters}
                                      onChange={onEditParameters}
                                      name={'eccentricityStep'}
                                      InputProps={{
                                        disableUnderline: true,
                                        inputProps: {
                                          className: classes.input
                                        }
                                      }}
                                    />
                                  </Grid>
                                </Grid>
                                {/* </Tooltip> */}
                              </Grid>
                              <Grid item xs={12} />
                            </Grid>
                          )}
                        </>
                      )}

                      {/* {!containsPoint &&
                <Grid item md={12} xs={12}>
                  <div className= {classes.alert}><i>This point doesn't exist in the database yet, a new analysis will need to be run to determine the values at this point</i></div>
                </Grid>} */}
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </>
          )}
        </Grid>
      </Box>
      <PDFViewerErgodic
        isOpen={showTheory}
        onClose={() => setShowTheory(false)}
      />
    </div>
  );
};

export default AnalysisSelection;
