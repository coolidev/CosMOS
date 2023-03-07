import { FC, useEffect, useState } from 'react';
import {
  Grid,
  Box,
  TextField,
  Typography,
  makeStyles,
  Radio,
  FormControl,
  Select,
  MenuItem,
  Tooltip,
  FormControlLabel
} from '@material-ui/core';
import type { ChangeProps } from 'src/pages/home/QuickAccess';
import CustomNumberFormat from 'src/components/CustomNumberFormat';
import type { Theme } from 'src/theme';
import { State } from 'src/pages/home';
import { THEMES } from 'src/utils/constants/general';
import axios from 'src/utils/axios';
import { TooltipList } from 'src/utils/constants/tooltips';
import { isNull } from 'underscore';
import { useDispatch, useSelector } from 'src/store';

import { FilteringSelection } from 'src/pages/home/QuickAccess/Mission';

import { Autocomplete } from '@material-ui/lab';

interface ConstraintsProps {
  state: State;
  bounds: { [key: string]: { min: number; max: number } };
  onBounds: (name: string, type: string, value: number) => void;
  onChange: (values: ChangeProps) => void;
  onState: (name: string, value: any) => void;
  accordion: any;
  setAccordion: (values: any) => void;
  filterSelectionOrder: FilteringSelection[];
  setFilterSelectionOrder: any;
  filterFlag: boolean;
}

export interface AttrValue {
  id: number;
  name: string;
  disabled: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    // marginTop: theme.spacing(2)
  },
  box: {
    borderTop: `1px solid ${theme.palette.border.main}`,
    borderLeft: `1px solid ${theme.palette.border.main}`,
    borderRight: `1px solid ${theme.palette.border.main}`,
    paddingRight: '20px',
    paddingLeft: '20px',
    paddingBottom: '20px',
    paddingTop: '10px',
    margin: '0px'
  },
  textfield: {
    [`& fieldset`]: {
      borderRadius: 6,
      border: '1px solid black'
    },
    '& .MuiOutlinedInput-root': {
      background: theme.name === THEMES.LIGHT ? '#FFFFFF' : '#4c4c4c'
    }
  },
  text: {
    color: `${theme.palette.text.primary} !important`,
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontSize: '12px',
    lineHeight: '16px',
    letterSpacing: ' 0.05em'
  },
  input: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'left',
    alignItems: 'left',
    padding: '5px',
    gap: '1px',

    background: theme.name === THEMES.LIGHT ? '#FFFFFF' : '#4c4c4c',
    boxShadow: '0px 4px 14px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',

    minHeight: '3vh',
    paddingLeft: '14px'
  },
  disabledInput: {
    disabledInput: {
      textAlign: 'center',
      borderRadius: 6,
      border: `1px solid grey`,
      backgroundColor:
        theme.name !== THEMES.DARK
          ? theme.palette.grey[200]
          : theme.palette.grey[700]
    }
  },
  interiorBox: {
    backgroundColor: theme.palette.component.main
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
  enhanceDropdown: {
    padding: 0,
    //boxShadow: theme.name == THEMES.DARK? '' :'3px 3px 7px #c0c0c0', --To be added back when we make shadows everywhere
    borderRadius: '4px',
    border: `solid 1px ${theme.palette.border.main}`,
    color: `${theme.palette.text.primary} !important`,
    '& .MuiSelect-iconOutlined': {
      color: theme.palette.border.main
    }
  },
  selectedEnhanceDropdown: {
    '& .MuiAutocomplete-clearIndicator': {
      visibility: 'inherit'
    }
  },
  header: {
    fontWeight: 'bold'
  }
}));

interface Attribute {
  id: number;
  name: string;
}

const CommServicesDef: FC<ConstraintsProps> = ({
  state,
  bounds,
  onBounds,
  onChange,
  accordion,
  setAccordion,
  onState,
  filterSelectionOrder,
  setFilterSelectionOrder,
  filterFlag
}) => {
  const classes = useStyles();
  // const theme = useTheme<Theme>();
  // const { zoom } = useSelector((state) => state.zoom);
  const [throughput, setThroughput] = useState<number>(
    Number(state.commsSpecs.dataVolumeGb_day.toFixed(2))
  );
  const [freqBandOptions, setFreqBandOptions] = useState<AttrValue[]>([]);
  const [filteredFreqBandList, setFilteredFreqBandList] = useState<AttrValue[]>(
    []
  );
  const [freqBandSelection, setFreqBandSelection] = useState<number>(
    state.commsSpecs.freqBand ?? -1
  );
  const [centerFreq, setCenterFreq] = useState<number>(
    state.commsSpecs.centerBand
  );
  const [freqBandDetails, setFreqBandDetails] = useState<any[]>(null);
  const [throughputVolFlag, setThroughputVolFlag] = useState<boolean>(
    state.constraints.throughputFlag
  );
  const [dataRateMbps, setDataRateMbps] = useState<number>(
    isNaN(state.commsSpecs.dataRateKbps)
      ? 1
      : Number(Number(state.commsSpecs.dataRateKbps / 1000).toFixed(2))
  );
  // const [carouselId, setCarouselId] = useState<number>(1); //Carousel is reversed, so 1 is main view, 0 is sub-panel
  // const [panelId, setPanelId] = useState<number>(0); //0 used to trigger carousel to change back to main. 1 is coverage metrics, 2 is comms payload specs
  const dispatch = useDispatch();
  // const [antennas, setAntennas] = useState<Attribute[]>([]);
  // const [forceAntennaUpdate, setForceAntennaUpdate] = useState<number>(-9999999999);
  const [currCenterFreq, setCurrCenterFreq] = useState<number>(-1);
  const { coding, frequencyBands, modulation, polarization } = useSelector(
    (state) => state.networkList
  );

  useEffect(() => {
    try {
      if (state.radioButtonSelectionId !== 0) {
        const band =
          state.selectedItems.find(
            (item) => item.id === state.radioButtonSelectionId
          )?.frequencyBandId ?? 0;

        if (band === 0) {
          setCurrCenterFreq(-1);
          return;
        }

        const currFreq = freqBandDetails.find((curr) => curr.id === band);

        setCurrCenterFreq(
          currFreq.minFrequency_MHz +
            (currFreq.maxFrequency_MHz - currFreq.minFrequency_MHz) / 2
        );
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.radioButtonSelectionId, state.selectedItems]);

  useEffect(() => {
    filterSelectionLists(filterSelectionOrder);
  }, [filterFlag]);

  useEffect(() => {
    // If a save has just been loaded, or if the selected item
    // changes, update the selected options and the available
    // options.
    if (state.radioButtonSelectionId > 0) {
      const selectedItem = state.selectedItems.find(
        (item) => item.id === state.radioButtonSelectionId
      );
      if (!selectedItem) return;

      handleFrequencyBands();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.save, state.radioButtonSelectionId]);

  const handleFrequencyBands = async () => {
    if (state.networkType === 'relay') {
      // Set the frequency band for relays, using a dummy ID value,
      // since we're currently only interested in displaying this
      // value, not using it for analysis.
      const frequencyBand = {
        id: state.selectedItems[0].frequencyBandId,
        name: state.selectedItems[0].supportedFrequencies
      };

      // const optimizedModCod = state.selectedItems.find(
      //   (item) => item.id === state.radioButtonSelectionId
      // )?.optimizedModCod;
      // handleModCods(frequencyBandId, 0, '', optimizedModCod ?? true);
    } else {
      // Fetch the frequency band options associated with the currently
      // selected ground station.
      const response = await axios.get<any>('/getFrequencyBandOptions', {
        params: {
          id: state.radioButtonSelectionId,
          networkType: state.networkType
        }
      });
      const data = response.data;
      // If no frequency band is currently selected for this item,
      let frequencyBandId = 0;
      if (
        !state.selectedItems.find(
          (item) => item.id === state.radioButtonSelectionId
        )?.frequencyBandId
      ) {
        if (data.frequencyBandOptions[0]) {
          frequencyBandId = data.frequencyBandOptions[0].id;
        } else {
          return;
        }
      } else {
        frequencyBandId = state.selectedItems.find(
          (item) => item.id === state.radioButtonSelectionId
        )?.frequencyBandId;
      }

      handleAntennas(frequencyBandId);
    }
  };

  // useEffect(() => {
  //   if(panelId === 0){
  //     setCarouselId(1);
  //   }else{
  //     setCarouselId(0);
  //   }
  // },[panelId]);

  // const refresh = async () => {
  //   const currPanelId = panelId;
  //   await setPanelId(0);
  //   await setPanelId(currPanelId);
  // };

  // const handleAccordion = (event) => {
  //   const { id } = event.currentTarget;
  //   const value = event.currentTarget.getAttribute('aria-expanded') === 'false';
  //   setAccordion((prevState) => ({
  //     ...prevState,
  //     'specification-panel': false,
  //     [id]: value
  //   }));
  //   setPanelId(0);
  // };

  useEffect(() => {
    const fetchFrequencyBandData = async () => {
      const response = await axios.get<AttrValue[]>('/getAttributeValues', {
        params: { sub_key: 'frequency_bands ' }
      });
      response.data && setFreqBandOptions(response.data);
      response.data && setFilteredFreqBandList(response.data);
    };
    fetchFrequencyBandData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchFrequencyBandSpecs = async () => {
      const response = await axios.get<AttrValue[]>(
        '/getFrequencyBandSpecs',
        {}
      );
      response.data && setFreqBandDetails(response.data);
    };
    fetchFrequencyBandSpecs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (throughput !== state.commsSpecs.dataVolumeGb_day) {
      setThroughput(state.commsSpecs.dataVolumeGb_day);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.commsSpecs.dataVolumeGb_day]);

  useEffect(() => {
    if (freqBandSelection !== state.commsSpecs.freqBand) {
      setFreqBandSelection(state.commsSpecs.freqBand ?? 0);
    }

    if (!state.commsSpecs.freqBand || state.commsSpecs.freqBand === 0) {
      onState('commsSpecs', {
        ...state.commsSpecs,
        centerBand: -1
      });
      return;
    }

    try {
      if (freqBandDetails) {
        const currFreq = freqBandDetails.find(
          (curr) => curr.id === state.commsSpecs.freqBand
        );
        onState('commsSpecs', {
          ...state.commsSpecs,
          centerBand:
            currFreq.minFrequency_MHz +
            (currFreq.maxFrequency_MHz - currFreq.minFrequency_MHz) / 2
        });
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.commsSpecs.freqBand]);

  useEffect(() => {
    if (centerFreq !== state.commsSpecs.centerBand) {
      setCenterFreq(state.commsSpecs.centerBand ?? -1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.commsSpecs.centerBand]);

  useEffect(() => {
    setThroughputVolFlag(state.constraints.throughputFlag);
  }, [state.constraints.throughputFlag]);

  useEffect(() => {
    if (!isNaN(state.commsSpecs.dataRateKbps)) {
      setDataRateMbps(state.commsSpecs.dataRateKbps / 1000);
    }
  }, [state.commsSpecs.dataRateKbps]);

  const getFreqBandValue = () => {
    let option = freqBandOptions.filter(
      (value) => value.id === freqBandSelection
    )[0];
    if (option) {
      return option;
    } else {
      return { id: freqBandSelection, name: '', disabled: false };
    }
  };

  const handleClick = (event, targetName?, targetValue?): void => {
    let { name, value } = event.target;
    if (targetName) name = targetName;
    if (isNull(value) || value.length <= 0) {
      return;
    }
    if (name === 'throughput') {
      onState('commsSpecs', {
        ...state['commsSpecs'],
        dataVolumeGb_day: Number(
          (parseFloat(value.replaceAll(',', '')) * 8).toFixed(2)
        )
      }); //Convert GB/day to Gb/day I hate the anti-onState I hate the anti-onState
    } else if (name === 'centerFreqFilter') {
      onState('commsSpecs', { ...state.commsSpecs, centerBand: value });
    } else if (name === 'frequencyBand') {
      let newFilterSelectionOrder = filterSelectionOrder.slice();
      if (value === 0) {
        if (
          newFilterSelectionOrder.includes(FilteringSelection.FREQUENCY_BAND)
        ) {
          let index = newFilterSelectionOrder.indexOf(
            FilteringSelection.FREQUENCY_BAND
          );
          newFilterSelectionOrder.splice(index, 1);
        }
      } else {
        if (
          !newFilterSelectionOrder.includes(FilteringSelection.FREQUENCY_BAND)
        ) {
          newFilterSelectionOrder.push(FilteringSelection.FREQUENCY_BAND);
        }
      }
      setFilterSelectionOrder(newFilterSelectionOrder);
      onState('commsSpecs', { ...state.commsSpecs, freqBand: value });
    } else if (name === 'throughputFlag') {
      onChange({ name, value: value, category: 'constraints' });
    } else if (name === 'dataRateKbps') {
      onChange({
        name,
        value: Number(
          (parseFloat(value.replaceAll(',', '')) * 1000).toFixed(2)
        ),
        category: 'commsSpecs'
      });
    } else if (name === 'standardsCompliance') {
      onState('commsSpecs', {
        ...state.commsSpecs,
        standardsCompliance: value
      });
    }
  };

  const filterSelectionLists = (filterSelectionOrder: FilteringSelection[]) => {
    //Frequency Band Section
    let data = {
      frequencyBands: frequencyBands,
      polarization: polarization,
      modulation: modulation,
      coding: coding
    };
    //if its not in line, filter down the viable options
    let newFilteredFreqBandList = freqBandOptions.slice();
    newFilteredFreqBandList.forEach((option) => {
      if (data.frequencyBands.includes(option.id)) {
        option.disabled = false;
      } else {
        option.disabled = true;
      }
    });
    setFilteredFreqBandList(newFilteredFreqBandList);
  };

  //From MODULATION.tsx for FREQ BAND SELECTION OF CURRENT SELECTED
  // const handleOption = (event): void => {
  //   const { name, value } = event.target;

  //   const selectedItem = state.selectedItems.find(
  //     (item) => item.id === state.radioButtonSelectionId
  //   );

  //   if (name === 'frequencyBand') {
  //     handleAntennas(value);
  //     onState('selectedItems', state.selectedItems.map(e => {
  //       if(e.id !== selectedItem.id) {
  //         return e;
  //       } else {
  //         return {...e,
  //           frequencyBandId: value
  //         };
  //       }
  //     }))

  //     onState('isDataLoaded', false);
  //     dispatch(updateResults());
  //     onState('isLastAnalysis', false);
  //   }

  //   onState('isLastSave', false);
  //   onState('isMarkedForComparison', false);
  // };

  const handleAntennas = async (frequencyBandId: number) => {
    // Query the database for antenna options, if a ground station and frequency band
    // are both currently selected.
    const params = {
      groundStationId: state.radioButtonSelectionId,
      frequencyBandId: frequencyBandId
    };

    const response = await axios.post<any>('/getAvailableAntennas', params);
    // response.data //&& setAntennas(response.data.antennaOptions);

    // Check whether
    //  1) the antenna ID is currently set, and
    //  2) whether the antenna that is currently selected exists in the list of options
    //     that was returned.
    // Use the Optimized option by default.
    let antennaId = 0;
    if (
      state.selectedItems.find(
        (item) => item.id === state.radioButtonSelectionId
      )?.antennaId
    ) {
      // Check whether the selected antenna is in the list
      // of valid options. If not, select a new antenna.
      antennaId = state.selectedItems.find(
        (item) => item.id === state.radioButtonSelectionId
      )?.antennaId;

      if (
        !response.data.antennaOptions
          .map((option) => option.id)
          .includes(antennaId)
      ) {
        if (response.data.antennaOptions[0]) {
          antennaId = response.data.antennaOptions[0].id;
        } else {
          return;
        }
      }
    }

    const antennaName = response.data.antennaOptions.find(
      (antenna) => antenna.id === antennaId
    )?.name;
    const optimizedModCod = state.selectedItems.find(
      (item) => item.id === state.radioButtonSelectionId
    )?.optimizedModCod;
    handleModCods(
      frequencyBandId,
      antennaId,
      antennaName,
      optimizedModCod ?? true
    );
  };

  const handleModCods = async (
    frequencyBandId: number,
    antennaId: number,
    antennaName: string,
    optimizedModCod: boolean
  ) => {
    // // If the Optimized Modulation and Coding checkbox is checked, update the
    // // state with the optimized modulation and coding values.
    // if (optimizedModCod) {
    //   let modulationId = 0;
    //   let codingId = 0;
    //   let modulation = '';
    //   let coding = '';
    //   if (performancePanel && modCodOptions) {
    //     const selectedItem = state.selectedItems.find(item => item.id === state.radioButtonSelectionId);
    //     const {
    //       modCodOptions,
    //       multipleAccess,
    //       bandwidthMHz,
    //       R_kbps
    //     } = state.selectedItems.length > 1 ? performancePanel.systemParams[selectedItem.id] : performancePanel.systemParams;
    //     let throughput = state.commsSpecs.dataRateKbps;
    //     if (state.selectedItems.length > 1) {
    //       const stationCoverage = getCoverage(state, performancePanel, selectedItem.id.toString());
    //       throughput = R_kbps * stationCoverage / Math.pow(10, 6) * 86400;
    //     }
    //     // Determine the optimal modulation and coding for the current
    //     // specified throughput.
    //     const modCodOption = getOptimalModCod(
    //       modCodOptions,
    //       multipleAccess,
    //       throughput,
    //       getCoverage(state, performancePanel),
    //       bandwidthMHz,
    //       performancePanel.linkParams.modCodTable,
    //       performancePanel.linkParams.ebNoTable
    //     );
    //     modulationId = modCodOption.modulationId;
    //     codingId = modCodOption.codingId;
    //     modulation = modCodOption.modulation;
    //     coding = modCodOption.coding;
    //   }
    //   setOptions((prevState) => ({
    //     ...prevState,
    //     modulation: modulationId,
    //     coding: codingId
    //   }));
    //   updateState(frequencyBandId, antennaId, antennaName, modulationId, codingId, modulation, coding, true);
    //   updateThroughput(modulation, coding);
    //   return;
    // }
    // updateModCods(modCodOptions, frequencyBandId, antennaId, antennaName, optimizedModCod);
  };

  //END THAT

  return (
    <>
      <Box mx={1} className={classes.box}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item alignItems="stretch" xs={6}>
            <Tooltip
              title={
                'Forward Links are not currently available in this version of CART'
              }
            >
              <FormControlLabel
                name={'upService'}
                color="primary"
                checked={false}
                onChange={() => {}}
                control={<Radio />}
                label="Up/Forward Service"
                disabled={true}
                style={{ color: 'black' }}
              />
            </Tooltip>
          </Grid>
          <Grid item alignItems="stretch" xs={6}>
            <FormControlLabel
              name={'downService'}
              color="primary"
              checked={true}
              onChange={() => {}}
              control={<Radio />}
              label="Down/Return Service"
              disabled={state.loading}
              style={{ color: 'black' }}
            />
          </Grid>
          <Grid item alignItems="stretch" xs={6}>
            <FormControlLabel
              name={'throughputFlag'}
              color="primary"
              checked={throughputVolFlag}
              control={<Radio
                    onClick={() =>
                      handleClick({
                        target: { name: 'throughputFlag', value: true }
                      })
                    }
                  />}
              label="Data Volume"
              disabled={state.loading}
              style={{ color: 'black' }}
            />
          </Grid>
          <Grid item alignItems="stretch" xs={6}>
            <FormControlLabel
              name={'throughputFlag'}
              color="primary"
              checked={!throughputVolFlag}
              control={<Radio
                    onClick={() =>
                      handleClick({
                        target: { name: 'throughputFlag', value: false }
                      })
                    }
                  />}
              label="Data Rate"
              disabled={state.loading}
              style={{ color: 'black' }}
            />
          </Grid>

          {throughputVolFlag && (
            <>
              <Grid item md={6}>
                <Tooltip title={TooltipList.dataVolume}>
                  <Typography className={classes.text}>
                    {'Data Volume (GB/day)'}
                  </Typography>
                </Tooltip>
              </Grid>
              <Grid item md={6}>
                <TextField
                  name="throughput"
                  //value={throughputVolFlag ? throughput / 8 : ''} //Convert Gb/day to GB/day
                  value={throughput / 8}
                  disabled={!throughputVolFlag || state.loading}
                  onBlur={(e) => {
                    handleClick(e);
                  }}
                  InputProps={{
                    inputComponent: CustomNumberFormat,
                    disableUnderline: true,
                    inputProps: {
                      className: throughputVolFlag
                        ? classes.input
                        : classes.disabledInput,
                      min: bounds.throughput.min,
                      max: bounds.throughput.max / 8
                    }
                  }}
                  onKeyPress={(ev) => {
                    if (ev.key === 'Enter') {
                      handleClick(ev);
                    }
                  }}
                  fullWidth
                  style={{ marginRight: '10px' }}
                />
              </Grid>
            </>
          )}
          {!throughputVolFlag && (
            <>
              <Grid item md={6}>
                <Tooltip title={TooltipList.data_Rate}>
                  <Typography className={classes.text}>
                    {'Data Rate (Mbps)'}
                  </Typography>
                </Tooltip>
              </Grid>
              <Grid item md={6}>
                <TextField
                  name="dataRateKbps"
                  // value={!throughputVolFlag ? dataRateMbps : ''}
                  value={dataRateMbps}
                  onBlur={(e) => {
                    handleClick(e);
                  }}
                  disabled={throughputVolFlag || state.loading}
                  InputProps={{
                    inputComponent: CustomNumberFormat,
                    disableUnderline: true,
                    inputProps: {
                      className: !throughputVolFlag
                        ? classes.input
                        : classes.disabledInput,
                      min: bounds.dataRateMbps.min,
                      max: bounds.dataRateMbps.max
                    }
                  }}
                  onKeyPress={(ev) => {
                    if (ev.key === 'Enter') {
                      handleClick(ev);
                    }
                  }}
                  fullWidth
                />
              </Grid>
            </>
          )}
          <Grid item xs={12} />
          <Grid item xs={12} />
          <Grid item xs={12} />
          <>
            <Grid item md={6}>
              <Tooltip title={TooltipList.frequencyBand}>
                <Typography className={classes.text}>
                  {'Frequency Band'}
                </Typography>
              </Tooltip>
            </Grid>

            <Grid item md={6}>
              <Autocomplete
                options={filteredFreqBandList}
                getOptionDisabled={(option) => option.disabled}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField {...params} placeholder="---" variant="outlined" />
                )}
                color="primary"
                size="small"
                value={getFreqBandValue()}
                className={`${classes.enhanceDropdown} ${classes.noOutline} ${
                  freqBandSelection !== -1 && classes.selectedEnhanceDropdown
                }`}
                forcePopupIcon={freqBandSelection !== -1 ? false : true}
                style={{ textAlign: 'center' }}
                //@ts-ignore
                onChange={(e, newVal) => {
                  handleClick({
                    target: {
                      name: 'frequencyBand',
											//@ts-ignore
                      value: newVal ? newVal?.id : 0
                    }
                  });
                }}
                openOnFocus={true}
              />
            </Grid>
          </>

          <Grid item md={6}>
            <Tooltip title={TooltipList.centerFrequency}>
              <Typography className={classes.text}>
                {'Center Frequency (MHz)'}
              </Typography>
            </Tooltip>
          </Grid>
          <Grid item md={6}>
            {state.radioButtonSelectionId === 0 ||
            state.networkType === 'relay' ? (
              <TextField
                name="centerFreqFilter"
                value={centerFreq === -1 ? '' : centerFreq}
                onBlur={(e) => {
                  handleClick(e);
                }}
                placeholder="---"
                onChange={(e) => {
                  setCenterFreq(parseFloat(e.target.value.replaceAll(',', '')));
                }}
                InputProps={{
                  inputComponent: CustomNumberFormat,
                  disableUnderline: true,
                  inputProps: {
                    className: classes.input,
                    min: 0,
                    max: 100000
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
            ) : (
              <TextField
                name="centerFreqSelection"
                value={currCenterFreq === -1 ? null : currCenterFreq}
                placeholder="---"
                InputProps={{
                  inputComponent: CustomNumberFormat,
                  disableUnderline: true,
                  inputProps: {
                    className: classes.input
                  }
                }}
                fullWidth
                disabled={true}
              />
            )}
          </Grid>
          <Grid item md={6}>
            <Tooltip title={TooltipList.standardsCompliance}>
              <Typography className={classes.text}>
                {'Standards Compliance'}
              </Typography>
            </Tooltip>
          </Grid>
          <Grid item md={6}>
            <FormControl
              variant="filled"
              size="small"
              fullWidth
              className={classes.select}
            >
              <Select
                className={classes.noOutline}
                name="standardsCompliance"
                variant="outlined"
                data-filter-network="true"
                value={state.commsSpecs.standardsCompliance}
                color="primary"
                onChange={(e) => {
                  handleClick(e);
                }}
                //style={{ textAlign: 'center' }}
                disabled={state.loading}
                fullWidth
              >
                <MenuItem value={0}>---</MenuItem>
                <MenuItem value={1}>CCSDS</MenuItem>
                <MenuItem value={2}>DVB-S2</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item sm={12} />
        </Grid>
      </Box>
    </>
  );
};

export default CommServicesDef;
