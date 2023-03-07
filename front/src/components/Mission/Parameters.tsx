import { FC, useEffect, useState } from 'react';
import {
  Grid,
  Box,
  Button,
  TextField,
  Typography,
  makeStyles,
  useTheme,
  FormControl,
  MenuItem,
  Select,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
  Radio,
  RadioGroup,
  FormControlLabel
} from '@material-ui/core';
import type { Parameter } from 'src/types/preference';
import CustomNumberFormat from 'src/components/CustomNumberFormat';
import type { Theme } from 'src/theme';
import { THEMES } from 'src/utils/constants/general';
import { EARTH_RADIUS_km } from 'src/utils/constants/physical';
import { useDispatch, useSelector } from 'src/store';
import { State } from 'src/pages/home';
import { updateResults } from 'src/slices/results';
import { TooltipList } from 'src/utils/constants/tooltips';
import {
  calculate_sun_synchronous_orbit_altitude,
  calculate_sun_synchronous_orbit_inclination
} from 'src/algorithms/sunsync-calc';
import SelectionAlert from 'src/pages/home/Network/SelectionAlert';

interface ParametersProps {
  state: State;
  parameters: Parameter;
  networkType: string;
  noRegression: boolean;
  bounds: { [key: string]: { min: number; max: number } };
  onChange: (values: {
    name: string;
    value: number | boolean;
    category: string;
  }) => void;
  setWizardIndex: any;
  onState: (name: string, value: any) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginTop: theme.spacing(2)
  },
  box: {
    borderTop: `1px solid ${theme.palette.border.main}`,
    borderLeft: `1px solid ${theme.palette.border.main}`,
    borderRight: `1px solid ${theme.palette.border.main}`,
    paddingRight: '20px',
    paddingLeft: '20px',
    paddingBottom: '20px',
    paddingTop: '10px'
  },
  tabs: {
    minHeight: theme.spacing(4)
  },
  tab: {
    border: '1px solid #000',
    minHeight: theme.spacing(4),
    padding: 0
  },
  indicator: {
    backgroundColor: 'transparent'
  },
  selected: {
    backgroundColor: '#1565c0'
  },
  grid: {
    marginTop: theme.spacing(3)
  },
  tab1: {
    borderTopLeftRadius: theme.spacing(3),
    borderBottomLeftRadius: theme.spacing(3)
  },
  tab2: {
    borderTopRightRadius: theme.spacing(3),
    borderBottomRightRadius: theme.spacing(3)
  },
  textfield: {
    [`& fieldset`]: {
      borderRadius: 6,
      border: '1px solid black'
    },
    '& .MuiOutlinedInput-root': {
      background: '#fff'
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
  disabledInput: {
    textAlign: 'left',
    borderRadius: 6,
    border: `#eeeeee solid grey`,
    backgroundColor:
      theme.name !== THEMES.DARK
        ? theme.palette.grey[200]
        : theme.palette.grey[700],
    paddingLeft: '14px'
  },
  select: {
    background: theme.name === THEMES.LIGHT ? '#FFFFFF' : '#4c4c4c',
    boxShadow: '0px 4px 14px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0px',
    gap: '1px',
    border: '0px'
  },
  noOutline: {
    '& .MuiOutlinedInput-notchedOutline': {
      border: '0px'
    }
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
  disabledText: {
    color: `${theme.palette.text.secondary} !important`,
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontSize: '12px',
    lineHeight: '16px',
    letterSpacing: ' 0.05em',
    display: 'flex'
  }
}));

const Parameters: FC<ParametersProps> = ({
  state,
  parameters,
  networkType,
  noRegression,
  bounds,
  setWizardIndex,
  onChange,
  onState
}) => {
  const classes = useStyles();
  const theme = useTheme<Theme>();
  const [currentTab, setCurrentTab] = useState<string>('orbital');
  const [currentSelection, setCurrentSelection] = useState<number>(
    parameters?.orbitState ?? (parameters?.eccentricity > 0 ? 1 : 0)
  );
  const [semiMajorAxis, setSemiMajorAxis] = useState<number>(
    parameters.altitude + EARTH_RADIUS_km
  );
  const [valueNotThere, setValueNotThere] = useState<boolean>(false);
  const [prevValue, setPrevValue] = useState<{ name: string; value: string }>(
    null
  );
  const [newValue, setNewValue] = useState<{ name: string; value: string }>(
    null
  );
  const { performancePanel } = useSelector((state) => state.results);
  const [ltanLocal, setLtanLocal] = useState<string>(parameters.ltan);
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState({ title: '', message: '' });
  const dispatch = useDispatch();

  const checkLTANFormat = (ltan: string): boolean => {
    const regexp = new RegExp('^\\d{2}\\:\\d{2}$');
    return regexp.test(ltan);
  };

  useEffect(() => {
    if (parameters.ltan == null) {
      onState('parameters', { ...state['parameters'], ltan: '12:00' });
      setLtanLocal('12:00');
    } else {
      setLtanLocal(parameters.ltan);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parameters.ltan]);

  useEffect(() => {
    setSemiMajorAxis(parameters.altitude + EARTH_RADIUS_km);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parameters.altitude]);

  useEffect(() => {
    if (currentSelection === 2) {
      if (state.parameters.inclination < 96.67) {
        onState('parameters', {
          ...state['parameters'],
          orbitState: currentSelection,
          eccentricity: 0,
          inclination: 96.67,
          sunSyncUseAlt: true
        });
      } else {
        onState('parameters', {
          ...state['parameters'],
          orbitState: currentSelection,
          eccentricity: 0,
          sunSyncUseAlt: true
        });
      }
    } else {
      onState('parameters', {
        ...state['parameters'],
        orbitState: currentSelection
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSelection]);

  useEffect(() => {
    if (state.parameters.orbitState === 0) {
      //if circular set eccentricity to 0
      onChange({ name: 'eccentricity', value: 0, category: 'parameters' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.parameters.orbitState]);

  useEffect(() => {
    if (state.parameters.sunSyncUseAlt && state.parameters.orbitState === 2) {
      //if altitude selected and in sunSync state
      onState('parameters', {
        ...state['parameters'],
        inclination: parseFloat(
          calculate_sun_synchronous_orbit_inclination(
            state.parameters.altitude,
            0
          ).toFixed(2)
        )
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.parameters.altitude]);

  useEffect(() => {
    if (!state.parameters.sunSyncUseAlt && state.parameters.orbitState === 2) {
      //if inclination selected and in sunSync state
      onState('parameters', {
        ...state['parameters'],
        altitude: parseFloat(
          calculate_sun_synchronous_orbit_altitude(
            state.parameters.inclination,
            0
          ).toFixed(0)
        )
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.parameters.inclination]);

  useEffect(() => {
    if (state.parameters.orbitState === 2) {
      if (state.parameters.sunSyncUseAlt) {
        onState('parameters', {
          ...state['parameters'],
          inclination: parseFloat(
            calculate_sun_synchronous_orbit_inclination(
              state.parameters.altitude,
              0
            ).toFixed(2)
          )
        });
      } else {
        onState('parameters', {
          ...state['parameters'],
          altitude: parseFloat(
            calculate_sun_synchronous_orbit_altitude(
              state.parameters.inclination,
              0
            ).toFixed(0)
          )
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.parameters.orbitState]);

  useEffect(() => {
    if (parameters.orbitState !== currentSelection) {
      setCurrentSelection(parameters.orbitState ?? 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parameters.orbitState]);

  useEffect(() => {
    if (!parameters) return;

    const tab = parameters?.isOrbital ? 'orbital' : 'terrestrial';
    setCurrentTab(tab);
  }, [parameters]);

  const handleClick = (event): void => {
    const { name, value } = event.target;

    //Verify inclination is within bounds for sun-sync orbit
    if (
      state.parameters.orbitState === 2 &&
      name === 'inclination' &&
      (value < bounds['inclinationSunSync'].min ||
        value > bounds['inclinationSunSync'].max)
    ) {
      return;
    }

    //if we dont have a regression to display
    if (noRegression && state.isDataLoaded) {
      if (
        name === 'semiMajorAxis' ||
        name === 'altitude' ||
        name === 'inclination'
      ) {
        //If the point already exists in the dataset, just change the point normaly
        if (pointExists(performancePanel, value, name) && prevValue == null) {
          if (name === 'semiMajorAxis') {
            onChange({
              name: 'altitude',
              value: parseInt(value.replace(',', '')) - EARTH_RADIUS_km,
              category: 'parameters'
            });
          } else {
            onChange({ name, value: value, category: 'parameters' });
          }
        } else {
          //we want to save the previous Value to set the display back if it is null
          if (prevValue == null) {
            if (name === 'semiMajorAxis') {
              let altitude = 'altitude';
              setPrevValue({
                name: name,
                value: (
                  parseInt(parameters[altitude]) + EARTH_RADIUS_km
                ).toString()
              });
            } else {
              setPrevValue({ name: name, value: parameters[name] });
            }
            if (name === 'semiMajorAxis') {
              onChange({
                name: 'altitude',
                value: parseInt(value.replace(',', '')) - EARTH_RADIUS_km,
                category: 'parameters'
              });
            } else {
              onChange({ name, value: value, category: 'parameters' });
            }
            setNewValue({ name: name, value: value });
            setValueNotThere(true);
          } else {
            if (name === 'semiMajorAxis') {
              onChange({
                name: 'altitude',
                value:
                  parseInt(newValue.value.replace(',', '')) - EARTH_RADIUS_km,
                category: 'parameters'
              });
            } else {
              onChange({
                name: newValue.name,
                value: parseInt(newValue.value.replace(',', '')),
                category: 'parameters'
              });
            }
          }
        }
      }
      //normal behavior
    } else {
      if (name === 'semiMajorAxis') {
        onChange({
          name: 'altitude',
          value: parseInt(value.replace(',', '')) - EARTH_RADIUS_km,
          category: 'parameters'
        });
      } else if (name === 'raan') {
        if (!isNaN(value)) {
          onChange({ name, value: value, category: 'parameters' });
        }
      } else if (name === 'ltan') {
        if (checkLTANFormat(value)) {
          onState('parameters', { ...state.parameters, ltan: value });
        } else {
          setLtanLocal(parameters.ltan);
        }
      } else if (currentSelection === 2 && name === 'inclination') {
        if (value > 95.69) {
          onChange({ name, value: value, category: 'parameters' });
        } else {
          onChange({ name, value: 95.69, category: 'parameters' });
        }
      } else if (name === 'altitude' && state.networkType === 'dte') {
        if (
          !state.pointSync &&
          !state.parametric &&
          Number(value.replace(',', '')) > 1000
        ) {
          onChange({ name, value: 1000, category: 'parameters' });

          setIsAlertOpen(!isAlertOpen);
          setAlertMessage({
            title: `Warning`,
            message: `Currently, modeled data points for ground stations only extend up to 1000 km. For accurate results, decrease the altitude of your satellite, 
          select the real-time modeling option when running your analysis, or download our STK models for these ground stations, and run an analysis for your user.`
          });
        } else if (Number(value.replace(',', '')) > 35786) {
          setAlertMessage({
            title: 'Alert',
            message:
              'Currently, CART only supports GEO/HEO orbits up to 55786 km. Any values entered beyond this point are not officially supported.'
          });
        } else {
          onChange({ name, value: value, category: 'parameters' });
        }
      } else {
        onChange({ name, value: value, category: 'parameters' });
      }
    }
  };

  const pointExists = (data, value, name) => {
    let metricType = networkType === 'relay' ? 'coverage' : 'coverageMinutes';
    if (data) {
      if (name === 'altitude') {
        return (
          data.modelData.orbital[metricType].points.filter(
            (point) => point.altitude === value
          ).length !== 0
        );
      } else if (name === 'semiMajorAxis') {
        return (
          data.modelData.orbital[metricType].points.filter(
            (point) =>
              point.altitude ===
              parseInt(value.replace(',', '')) - EARTH_RADIUS_km
          ).length !== 0
        );
      } else if (name === 'inclination') {
        return (
          data.modelData.orbital[metricType].points.filter(
            (point) => point.inclination === value
          ).length !== 0
        );
      } else {
        return true;
      }
    } else {
      return false;
    }
  };
  const handleCurrentTab = (event): void => {
    const { name } = event.currentTarget;
    onChange({
      name: 'isOrbital',
      value: name === 'orbital',
      category: 'parameters'
    });
    setCurrentTab(name);
  };

  const handleClose = () => {
    if (prevValue.name === 'semiMajorAxis') {
      onChange({
        name: 'altitude',
        value: parseInt(prevValue.value.replace(',', '')) - EARTH_RADIUS_km,
        category: 'parameters'
      });
    } else {
      onChange({
        name: prevValue.name,
        value: parseInt(prevValue.value),
        category: 'parameters'
      });
    }
    setPrevValue(null);
    setNewValue(null);
    setValueNotThere(false);
  };

  const handleResetAnalysis = () => {
    setValueNotThere(false);
    setWizardIndex(1);

    //clear the results from the last analysis
    dispatch(updateResults());

    onState('isLastSave', false);
    onState('isMarkedForComparison', false);
    onState('isLastAnalysis', false);
    onState('isDataLoaded', false);
  };
  /* This is the function that controls what is displayed when a selection is made on the dropdown under the orbital section.
  Its like this to prevent having to do messy binairy checks in the actual React/HTML part of the code. If we want to add another state to the panel, do it here.
  Note that this is controlled by the currentSelection variable.*/
  const renderParameterPanel = () => {
    let panel;
    if (currentSelection === 0) {
      //Circular
      panel = (
        <Grid container alignItems="center" spacing={2}>
          <Grid item sm={12} />
          <Grid item md={6}>
            <Tooltip title={TooltipList.altitude}>
              <Typography className={classes.text}>
                {'Altitude (km)'}
              </Typography>
            </Tooltip>
          </Grid>
          <Grid item md={6}>
            <TextField
              name="altitude"
              value={parameters.altitude}
              onBlur={handleClick}
              InputProps={{
                inputComponent: CustomNumberFormat,
                disableUnderline: true,
                inputProps: {
                  className: classes.input,
                  min: bounds['altitude'].min,
                  max: bounds['altitude'].max
                }
              }}
              onKeyPress={(ev) => {
                if (ev.key === 'Enter') {
                  handleClick(ev);
                }
              }}
              fullWidth
              disabled={state.loading}
            />
          </Grid>
          <Grid item md={6}>
            <Tooltip title={TooltipList.inclination}>
              <Typography className={classes.text}>
                {'Inclination (deg)  '}
              </Typography>
            </Tooltip>
          </Grid>
          <Grid item md={6}>
            <TextField
              name={'inclination'}
              value={parameters.inclination}
              onBlur={handleClick}
              InputProps={{
                inputComponent: CustomNumberFormat,
                disableUnderline: true,
                inputProps: {
                  className: classes.input,
                  min: bounds['inclination'].min,
                  max: bounds['inclination'].max
                }
              }}
              onKeyPress={(ev) => {
                if (ev.key === 'Enter') {
                  handleClick(ev);
                }
              }}
              fullWidth
              disabled={state.loading}
            />
          </Grid>
          <Grid item md={6}>
            <Tooltip title={TooltipList.RAAN}>
              <Typography className={classes.text}>{'RAAN (deg)'}</Typography>
            </Tooltip>
          </Grid>
          <Grid item md={6}>
            <TextField
              name={'raan'}
              value={parameters.raan}
              onBlur={handleClick}
              InputProps={{
                inputComponent: CustomNumberFormat,
                disableUnderline: true,
                inputProps: {
                  className: classes.input,
                  min: bounds['raan'].min,
                  max: bounds['raan'].max
                }
              }}
              onKeyPress={(ev) => {
                if (ev.key === 'Enter') {
                  handleClick(ev);
                }
              }}
              fullWidth
              disabled={state.loading}
            />
          </Grid>
          <Grid item sm={12} />
        </Grid>
      );
    } else if (currentSelection === 1) {
      //Keplerian
      panel = (
        <Grid container justifyContent="center" alignItems="center" spacing={2}>
          <Grid item sm={12} />
          <Grid item md={6}>
            <Tooltip title={TooltipList.semiMajorAxis}>
              <Typography className={classes.text}>
                {'Semimajor Axis (km)'}
              </Typography>
            </Tooltip>
          </Grid>
          <Grid item md={6}>
            <TextField
              name="semiMajorAxis"
              value={semiMajorAxis}
              onBlur={handleClick}
              InputProps={{
                inputComponent: CustomNumberFormat,
                disableUnderline: true,
                inputProps: {
                  className: classes.input,
                  min: 0,
                  max: bounds['semiMajorAxis'].max
                }
              }}
              onKeyPress={(ev) => {
                if (ev.key === 'Enter') {
                  handleClick(ev);
                }
              }}
              fullWidth
              disabled={state.loading}
            />
          </Grid>
          <Grid item md={6}>
            <Tooltip title={TooltipList.eccentricity}>
              <Typography className={classes.text}>{'Eccentricity'}</Typography>
            </Tooltip>
          </Grid>
          <Grid item md={6}>
            <TextField
              name={'eccentricity'}
              value={parameters.eccentricity}
              onBlur={handleClick}
              InputProps={{
                inputComponent: CustomNumberFormat,
                disableUnderline: true,
                inputProps: {
                  className: classes.input,
                  min: bounds['eccentricity'].min,
                  max: bounds['eccentricity'].max
                }
              }}
              onKeyPress={(ev) => {
                if (ev.key === 'Enter') {
                  handleClick(ev);
                }
              }}
              fullWidth
              disabled={state.loading}
            />
          </Grid>
          <Grid item md={6}>
            <Tooltip title={TooltipList.inclination}>
              <Typography className={classes.text}>
                {'Inclination (deg)'}
              </Typography>
            </Tooltip>
          </Grid>
          <Grid item md={6}>
            <TextField
              name={'inclination'}
              value={parameters.inclination}
              onBlur={handleClick}
              InputProps={{
                inputComponent: CustomNumberFormat,
                disableUnderline: true,
                inputProps: {
                  className: classes.input,
                  min: bounds['inclination'].min,
                  max: bounds['inclination'].max
                }
              }}
              onKeyPress={(ev) => {
                if (ev.key === 'Enter') {
                  handleClick(ev);
                }
              }}
              fullWidth
              disabled={state.loading}
            />
          </Grid>
          <Grid item md={6}>
            <Tooltip title={TooltipList.argumentOfPerigee}>
              <Typography className={classes.text}>
                {'Argument of Perigee (deg)'}
              </Typography>
            </Tooltip>
          </Grid>
          <Grid item md={6}>
            <TextField
              name={'argumentOfPerigee'}
              value={parameters.argumentOfPerigee}
              onBlur={handleClick}
              InputProps={{
                inputComponent: CustomNumberFormat,
                disableUnderline: true,
                inputProps: {
                  className: classes.input,
                  min: bounds['argumentOfPerigee'].min,
                  max: bounds['argumentOfPerigee'].max
                }
              }}
              onKeyPress={(ev) => {
                if (ev.key === 'Enter') {
                  handleClick(ev);
                }
              }}
              fullWidth
              disabled={state.loading}
            />
          </Grid>
          <Grid item md={6}>
            <Tooltip title={TooltipList.RAAN}>
              <Typography className={classes.text}>{'RAAN (deg)'}</Typography>
            </Tooltip>
          </Grid>
          <Grid item md={6}>
            <TextField
              name={'raan'}
              value={parameters.raan}
              onBlur={handleClick}
              InputProps={{
                inputComponent: CustomNumberFormat,
                disableUnderline: true,
                inputProps: {
                  className: classes.input,
                  min: bounds['raan'].min,
                  max: bounds['raan'].max
                }
              }}
              onKeyPress={(ev) => {
                if (ev.key === 'Enter') {
                  handleClick(ev);
                }
              }}
              fullWidth
              disabled={state.loading}
            />
          </Grid>
          <Grid item md={6}>
            <Tooltip title={TooltipList.trueAnomaly}>
              <Typography className={classes.text}>
                {'True Anomaly (deg)'}
              </Typography>
            </Tooltip>
          </Grid>
          <Grid item md={6}>
            <TextField
              name={'trueAnomaly'}
              value={parameters.trueAnomaly}
              onBlur={handleClick}
              InputProps={{
                inputComponent: CustomNumberFormat,
                disableUnderline: true,
                inputProps: {
                  className: classes.input,
                  min: bounds['trueAnomaly'].min,
                  max: bounds['trueAnomaly'].max
                }
              }}
              onKeyPress={(ev) => {
                if (ev.key === 'Enter') {
                  handleClick(ev);
                }
              }}
              fullWidth
              disabled={state.loading}
            />
          </Grid>
          <Grid item sm={12} />
        </Grid>
      );
    } else if (currentSelection === 2) {
      //Sun Sync
      panel = (
        <Grid container justifyContent="center" alignItems="center" spacing={2}>
          <Grid item sm={12} />
          <Grid item md={6}>
            {/* <Box ml={2}> */}
              <Tooltip title={TooltipList.LTAN}>
                <Typography className={classes.text}>
                  {'LTAN (hh:mm)'}
                </Typography>
              </Tooltip>
            {/* </Box> */}
          </Grid>
          <Grid item md={6}>
            <TextField
              name={'ltan'}
              value={ltanLocal}
              onChange={(e) => {
                setLtanLocal(e.target.value);
              }}
              onBlur={handleClick}
              InputProps={{
                disableUnderline: true,
                inputProps: {
                  className: classes.input
                }
              }}
              onKeyPress={(ev) => {
                if (ev.key === 'Enter') {
                  handleClick(ev);
                }
              }}
              fullWidth
              disabled={state.loading}
            />
          </Grid>
          <Grid item alignItems="stretch" xs={6}>
            <Tooltip
              title={
                TooltipList.altitude +
                '. The sun-sync altitude is limited at 5,975 km.'
              }
            >
              <FormControlLabel
                name="sunSyncAlt"
                color="primary"
                checked={!!state.parameters.sunSyncUseAlt}
                control={<Radio size="small"
                    onChange={(e) => {
                      onState('parameters', {
                        ...state.parameters,
                        sunSyncUseAlt: e.target.checked
                      });
                    }}
                  />}
                label="Altitude (km)"
                disabled={state.loading}
                style={{ color: 'black' }}
              />
            </Tooltip>
          </Grid>
          <Grid item md={6}>
            <Box width={'100%'}>
              <TextField
                name="altitude"
                value={parameters.altitude}
                onBlur={handleClick}
                InputProps={{
                  inputComponent: CustomNumberFormat,
                  disableUnderline: true,
                  inputProps: {
                    className: state.parameters.sunSyncUseAlt
                      ? classes.input
                      : classes.disabledInput,
                    min: bounds['altitude'].min,
                    max: 5975
                  }
                }}
                onKeyPress={(ev) => {
                  if (ev.key === 'Enter') {
                    handleClick(ev);
                  }
                }}
                fullWidth
                disabled={!state.parameters.sunSyncUseAlt || state.loading}
              />
            </Box>
          </Grid>
          <Grid item alignItems="stretch" xs={6}>
            <Tooltip
              title={
                TooltipList.inclination +
                '. The sun-sync inclination is limited at 180 deg.'
              }
            >
              <FormControlLabel
                name="synSyncInc"
                color="primary"
                checked={!state.parameters.sunSyncUseAlt}
                control={<Radio size="small"
                    onChange={(e) => {
                      onState('parameters', {
                        ...state.parameters,
                        sunSyncUseAlt: !e.target.checked
                      });
                    }}
                  />}
                label="Inclination (deg)"
                disabled={state.loading}
                style={{ color: 'black' }}
              />
            </Tooltip>
          </Grid>
          <Grid item md={6}>
            <TextField
              name={'inclination'}
              value={parameters.inclination}
              onBlur={handleClick}
              InputProps={{
                inputComponent: CustomNumberFormat,
                disableUnderline: true,
                inputProps: {
                  className: state.parameters.sunSyncUseAlt
                    ? classes.disabledInput
                    : classes.input,
                  min: bounds['inclination'].min,
                  max: bounds['inclination'].max
                }
              }}
              onKeyPress={(ev) => {
                if (ev.key === 'Enter') {
                  handleClick(ev);
                }
              }}
              fullWidth
              disabled={state.parameters.sunSyncUseAlt || state.loading}
            />
          </Grid>
          <Grid item sm={12} />
        </Grid>
      );
    }
    return panel;
  };

  return (
    <>
      <Box className={classes.box}>
        <Grid container alignContent="center" spacing={2}>
          {/* <Grid item md={6}>
          <Button
              name="orbital"
              variant= {currentTab !== 'orbital' ? 'outlined' : 'contained'}
              color= {currentTab === 'orbital' ? 'primary' : 'inherit'}
              className= {classes.box}
              onClick= {handleCurrentTab}
              style= {{
                color:
                  theme.name === THEMES.LIGHT
                    ? currentTab !== 'orbital'
                      ? '#000'
                      : '#fff'
                    : theme.palette.text.primary
              }}
              size= "small"
              size= "small"
              fullWidth
              disabled= {networkType === 'dte' || state.loading}
            >
              Oribital
            </Button>
          </Grid>
          <Grid item md={6}>
            <Button
              name="terrestrial"
              variant= {currentTab !== 'terrestrial' ? 'outlined' : 'contained'}
              color= {currentTab === 'terrestrial' ? 'primary' : 'inherit'}
              className= {classes.box}
              onClick= {handleCurrentTab}
              style= {{
                color:
                  theme.name === THEMES.LIGHT
                    ? currentTab !== 'terrestrial'
                      ? '#000'
                      : '#fff'
                    : theme.palette.text.primary
              }}
              size= "small"
              fullWidth
              disabled= {networkType === 'dte' || state.loading}
            >
              Terrestrial
            </Button>
          </Grid> */}
          <Grid item alignItems="stretch" xs={6}>
            <FormControlLabel
              name={'orbital'}
              value="Orbital"
              color="primary"
              checked={currentTab === 'orbital'}
              onChange={handleCurrentTab}
              control={<Radio />}
              label="Orbital"
              style={{ color: 'black' }}
            />
          </Grid>
          <Grid item alignItems="stretch" xs={6}>
            <FormControlLabel
              name={'terrestrial'}
              value="Orbital"
              color="primary"
              checked={currentTab === 'terrestrial'}
              onChange={handleCurrentTab}
              control={<Radio />}
              label="Terrestrial"
              disabled={state.networkType === 'dte'}
              style={{ color: 'black' }}
            />
          </Grid>
        </Grid>

        <Grid
          container
          justifyContent="center"
          alignItems="center"
          spacing={2}
          className={classes.grid}
        >
          {currentTab === 'orbital' ? (
            <Grid container alignItems="center" spacing={2}>
              <Grid item md={6}>
                <Typography className={classes.text}>
                  Orbital Options
                </Typography>
              </Grid>
              <Grid item md={6}>
                <FormControl
                  variant="filled"
                  size="small"
                  fullWidth
                  className={classes.select}
                >
                  <Select
                    name="type"
                    variant="outlined"
                    data-filter-network="true"
                    value={currentSelection}
                    color="primary"
                    className={classes.noOutline}
                    onChange={(e) => {
                      const { value } = e.target;
                      setCurrentSelection(value as number);
                    }}
                    disabled={state.loading}
                    fullWidth
                  >
                    <MenuItem value={0}>Circular</MenuItem>
                    <MenuItem value={1}>Keplerian Elements</MenuItem>
                    <MenuItem value={2}>Sun-Sync</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={12}>
                {renderParameterPanel()}
              </Grid>
            </Grid>
          ) : (
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              spacing={2}
            >
              <Grid item md={6}>
                <Typography className={classes.text}>
                  {'Latitude (deg)'}
                </Typography>
              </Grid>
              <Grid item md={6}>
                <TextField
                  name="latitude"
                  value={parameters.latitude}
                  onBlur={handleClick}
                  InputProps={{
                    inputComponent: CustomNumberFormat,
                    disableUnderline: true,
                    inputProps: {
                      className: classes.input,
                      min: bounds['latitude'].min,
                      max: bounds['latitude'].max
                    }
                  }}
                  onKeyPress={(ev) => {
                    if (ev.key === 'Enter') {
                      handleClick(ev);
                    }
                  }}
                  fullWidth
                  disabled={state.loading}
                />
              </Grid>
              <Grid item md={6}>
                <Typography className={classes.text}>
                  {'Longitude (deg)'}
                </Typography>
              </Grid>
              <Grid item md={6}>
                <TextField
                  name={'longitude'}
                  value={parameters.longitude}
                  onBlur={handleClick}
                  InputProps={{
                    inputComponent: CustomNumberFormat,
                    disableUnderline: true,
                    inputProps: {
                      className: classes.input,
                      min: bounds['longitude'].min,
                      max: bounds['longitude'].max
                    }
                  }}
                  onKeyPress={(ev) => {
                    if (ev.key === 'Enter') {
                      handleClick(ev);
                    }
                  }}
                  fullWidth
                  disabled={state.loading}
                />
              </Grid>
            </Grid>
          )}
        </Grid>
      </Box>
      {valueNotThere && (
        <Dialog open={valueNotThere} keepMounted onClose={handleClose}>
          <DialogTitle
            style={{
              margin: 0,
              padding: '16px',
              backgroundColor: theme.palette.primary.light
            }}
          >
            This Point has not been found
          </DialogTitle>
          <DialogContent
            style={{ backgroundColor: theme.palette.component.main }}
          >
            <DialogContentText>
              In order to see the values at this point, a new analysis will need
              to be run. If this is OK, press the OK button. To return to the
              current analysis, press the return button.
            </DialogContentText>
          </DialogContent>
          <DialogActions
            style={{ backgroundColor: theme.palette.component.main }}
          >
            <Button onClick={handleClose} color="primary">
              {`Return`}
            </Button>
            <Button onClick={handleResetAnalysis} color="primary">
              {`OK`}
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {isAlertOpen && (
        <SelectionAlert
          isOpen={isAlertOpen}
          onOpen={() => setIsAlertOpen(!isAlertOpen)}
          message={alertMessage}
        />
      )}
    </>
  );
};

export default Parameters;
