/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState } from 'react';
import {
  Grid,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Checkbox,
  makeStyles,
  colors,
  useTheme
} from '@material-ui/core';
import { useDispatch } from 'src/store';
import { useSelector } from 'src/store';
import { updateResults } from 'src/slices/results';
import axios from 'src/utils/axios';
import type { State } from 'src/pages/home';
import { calculateDataRate } from 'src/algorithms/link';
import { getValidModCods } from 'src/algorithms/link-optimization';
import { getValue } from 'src/algorithms/regressions';
import type { Theme } from 'src/theme';
import { THEMES } from 'src/utils/constants/general';
import { getOptimalModCod } from 'src/algorithms/link-optimization';
import { getCoverage } from 'src/algorithms/coverage';
import { calculateMaxAchievableDataRate } from 'src/algorithms/link';
import { ModCodOption } from 'src/types/evaluation';
import { StateStoring } from 'devextreme-react/data-grid';
import { isNull } from 'underscore';

interface ModulationProps {
  state: State;
  onState: (name: string, value: any) => void;
  onBounds: (name: string, type: string, value: number) => void;
}

interface Attribute {
  id: number;
  name: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: theme.spacing(0, 5, 0, 5),
    padding: theme.spacing(3),
    border: `1px solid ${theme.palette.border.main}`,
    borderRadius: '0px 0px 8px 8px',
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.component.main
  },
  subtitle: {
    margin: theme.spacing(0, 5, 0, 5),
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontSize: '21px',
    lineHeight: '25px',
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.border.main,
    paddingLeft: '.5vw',
    borderRadius: '8px 8px 0px 0px',
    borderTop: `1px solid ${theme.palette.border.main}`,
    borderBottom: `2px solid ${theme.palette.border.main}`,
    borderLeft: `1px solid ${theme.palette.border.main}`,
    borderRight: `1px solid ${theme.palette.border.main}`,
    backgroundColor: theme.palette.background.light
  },
  title: {
    textAlign: 'left',
    marginBottom: theme.spacing(3)
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
  paperComment: {
    fontStyle: 'italic',
    fontSize: 10,
    textAlign: 'left',
    color: theme.palette.text.secondary,
    borderRadius: 0
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
  placeholder: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontSize: '12px',
    lineHeight: '14px',
    letterSpacing: '0.05em',

    color: `${theme.palette.text.secondary}`
  }
}));

const initialOptions = {
  modulation: -1,
  coding: -1
};

const Modulation: FC<ModulationProps> = ({ state, onState, onBounds }) => {
  const classes = useStyles();
  const { zoom } = useSelector((state) => state.zoom);
  const theme = useTheme<Theme>();
  const [options, setOptions] = useState(initialOptions);
  const [frequencyBands, setFrequencyBands] = useState<Attribute[]>([]);
  const [antennas, setAntennas] = useState<Attribute[]>([]);
  const [moduls, setModuls] = useState<Attribute[]>([]);
  const [codings, setCodings] = useState<Attribute[]>([]);
  const [modCods, setModCods] = useState(null);
  const [noVal, setNoVal] = useState<boolean>(true);
  const dispatch = useDispatch();
  const { performancePanel, modCodOptions } = useSelector(
    (state) => state.results
  );

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
  }, [state.save, state.radioButtonSelectionId]);

  // useEffect(() => {
  //   // console.log(`frequency bands changed`);
  //   // console.log(state.selectedItems.map(e => e.frequencyBandId));
  //   handleAntennas(state.selectedItems.find(e => e.id === state.radioButtonSelectionId)?.frequencyBandId ?? null)
  // }, [(state.selectedItems.find(e => e.id === state.radioButtonSelectionId)?.frequencyBandId ?? null)]);

  useEffect(() => {
    if (state.radioButtonSelectionId <= 0) return;
    const selectedItem = state.selectedItems.find(
      (item) => item.id === state.radioButtonSelectionId
    );

    if (Object.keys(modCodOptions).includes(selectedItem?.id.toString())) {
      const validCodings = modCodOptions[selectedItem.id]
        .filter((option) => option.modulation === selectedItem.modulation)
        .map((option) => option.coding);

      const newModulations: Attribute[] = [];
      const newCodings: Attribute[] = [];
      modCodOptions[selectedItem.id].forEach((option) => {
        if (
          newModulations.filter((mod) => mod.id === option.modulationId)
            .length === 0
        ) {
          newModulations.push({
            id: option.modulationId,
            name: option.modulation
          });
        }

        if (
          newCodings.filter((cod) => cod.id === option.codingId).length === 0 &&
          validCodings.includes(option.coding)
        ) {
          newCodings.push({
            id: option.codingId,
            name: option.coding
          });
        }
      });

      setModuls(newModulations);
      setCodings(newCodings);
      setOptions((prevState) => ({
        ...prevState,
        modulation: selectedItem.modulationId,
        coding: selectedItem.codingId
      }));
    }
  }, [state.selectedItems, modCodOptions]);

  //Change the modulation and coding default option to reflect the selection made in the
  //mission panel
  useEffect(() => {
    const selectedItem = state.selectedItems.find(
      (item) => item.id === state.radioButtonSelectionId
    );
    if (
      state.commsSpecs.commsPayloadSpecs.modulation === -1 &&
      state.commsSpecs.commsPayloadSpecs.coding !== -1
    ) {
      if (noVal) {
        if (
          selectedItem &&
          (isNull(selectedItem.optimizedModCod) || selectedItem.optimizedModCod)
        ) {
          let newCodings = codings.slice();
          let toAdd = modCodOptions[selectedItem.id].filter(
            (option) =>
              option.codingId === state.commsSpecs.commsPayloadSpecs.coding
          );
          if (toAdd.length > 0) {
            newCodings.push({ id: toAdd[0].codingId, name: toAdd[0].coding });
            setCodings(newCodings);
          }
          setNoVal(false);
        }
      } else {
        selectedItem &&
          handleModCods(
            selectedItem.frequencyBandId,
            selectedItem.antennaId,
            selectedItem.antennaName,
            selectedItem.optimizedModCod ?? true
          );
      }
    } else {
      selectedItem &&
        handleModCods(
          selectedItem.frequencyBandId,
          selectedItem.antennaId,
          selectedItem.antennaName,
          selectedItem.optimizedModCod ?? true
        );
    }
    if (
      state.commsSpecs.commsPayloadSpecs.modulation === -1 &&
      state.commsSpecs.commsPayloadSpecs.coding === -1
    ) {
      setNoVal(true);
    }
  }, [
    state.commsSpecs.commsPayloadSpecs.modulation,
    state.commsSpecs.commsPayloadSpecs.coding
  ]);

  // Query the database for the frequency band options associated
  // with the selected ground station (this function is not currently
  // called for relays).
  const handleFrequencyBands = async () => {
    if (state.networkType === 'relay') {
      // Set the frequency band for relays, using a dummy ID value,
      // since we're currently only interested in displaying this
      // value, not using it for analysis.
      const frequencyBandId = 1;
      const frequencyBand = {
        id: frequencyBandId,
        name: state.selectedItems[0].supportedFrequencies
      };

      setFrequencyBands([frequencyBand]);

      const optimizedModCod = state.selectedItems.find(
        (item) => item.id === state.radioButtonSelectionId
      )?.optimizedModCod;
      handleModCods(frequencyBandId, 0, '', optimizedModCod ?? true);
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

      setFrequencyBands(response.data.frequencyBandOptions);
      // If no frequency band is currently selected for this item,
      let frequencyBandId = 0;
      if (
        !state.selectedItems.find(
          (item) => item.id === state.radioButtonSelectionId
        )?.frequencyBandId
      ) {
        // if (data.frequencyBandOptions[0]) {
        //   frequencyBandId = data.frequencyBandOptions[0].id;
        // } else {
        //   return;
        // }
      } else {
        frequencyBandId = state.selectedItems.find(
          (item) => item.id === state.radioButtonSelectionId
        )?.frequencyBandId;
      }

      handleAntennas(frequencyBandId);
    }
  };

  // Fetch the antennas associated with the selected ground station
  // and frequency band.
  const handleAntennas = async (frequencyBandId: number) => {
    // Query the database for antenna options, if a ground station and frequency band
    // are both currently selected.
    const params = {
      groundStationId: state.radioButtonSelectionId,
      frequencyBandId: frequencyBandId
    };

    const response = await axios.post<any>('/getAvailableAntennas', params);
    response.data && setAntennas(response.data.antennaOptions);

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
    if (state.selectedItems.length > 0)
      onState(
        'selectedItems',
        state.selectedItems.map((e) => {
          if (e.id !== state.radioButtonSelectionId) return e;
          else {
            return { ...e, antennaId: antennaId };
          }
        })
      );
    handleModCods(
      frequencyBandId,
      antennaId,
      antennaName,
      optimizedModCod ?? true
    );
  };

  // Query the database for modulation and coding options for the
  // selected relay or for the selected antenna and frequency band
  // combination.
  const handleModCods = async (
    frequencyBandId: number,
    antennaId: number,
    antennaName: string,
    optimizedModCod: boolean
  ) => {
    // If the Optimized Modulation and Coding checkbox is checked, update the
    // state with the optimized modulation and coding values.
    if (optimizedModCod) {
      let modulationId = -1;
      let codingId = -1;
      let modulation = '';
      let coding = '';

      if (performancePanel && modCodOptions) {
        const selectedItem = state.selectedItems.find(
          (item) => item.id === state.radioButtonSelectionId
        );
        const { modCodOptions, multipleAccess, bandwidthMHz, R_kbps } =
          state.selectedItems.length > 1
            ? performancePanel.systemParams[selectedItem.id]
            : performancePanel.systemParams;

        let throughput = state.commsSpecs.dataRateKbps;
        if (state.selectedItems.length > 1) {
          const stationCoverage = getCoverage(
            state,
            performancePanel,
            selectedItem.id.toString()
          );
          throughput = ((R_kbps * stationCoverage) / Math.pow(10, 6)) * 86400;
        }

        // Determine the optimal modulation and coding for the current
        // specified throughput.
        const modCodOption = getOptimalModCod(
          modCodOptions,
          multipleAccess,
          throughput,
          getCoverage(state, performancePanel),
          bandwidthMHz,
          performancePanel.linkParams.modCodTable,
          performancePanel.linkParams.ebNoTable
        );
        modulationId = modCodOption.modulationId;
        codingId = modCodOption.codingId;
        modulation = modCodOption.modulation;
        coding = modCodOption.coding;
      }

      //overrides the optimized mod cod if there is already a selection in the mission panel
      let cod = codings.filter(
        (coding) => coding.id === state.commsSpecs.commsPayloadSpecs.coding
      );
      let mod = moduls.filter(
        (modulation) =>
          modulation.id === state.commsSpecs.commsPayloadSpecs.modulation
      );
      if (cod.length > 0 && mod.length > 0) {
        modulationId = mod[0].id;
        modulation = mod[0].name;
        codingId = cod[0].id;
        coding = cod[0].name;
      } else if (mod.length > 0) {
        modulationId = mod[0].id;
        modulation = mod[0].name;
      }

      setOptions((prevState) => ({
        ...prevState,
        modulation: modulationId,
        coding: codingId
      }));
      updateState(
        frequencyBandId,
        antennaId,
        antennaName,
        modulationId,
        codingId,
        modulation,
        coding,
        true
      );
      updateThroughput(modulation, coding);
      return;
    }

    updateModCods(
      modCodOptions,
      frequencyBandId,
      antennaId,
      antennaName,
      optimizedModCod
    );
  };

  const updateModCods = (
    newModCodOptions,
    frequencyBandId: number,
    antennaId: number,
    antennaName: string,
    optimizedModCod: boolean,
    modulationId?: number
  ) => {
    const currentModCodOptions = modCodOptions[state.radioButtonSelectionId];

    // If the Redux object storing the modulation and coding options for the current
    // selection is empty, throw an error.
    if (!currentModCodOptions || currentModCodOptions.length === 0) {
      //throw new Error(`No valid modulation and coding combinations.`);
      return;
    }

    // Check whether
    //  1) the modulation/coding IDs are currently set, and
    //  2) whether the modulation/coding that are currently selected exist in the list of options
    //     that was returned.
    if (!modulationId) {
      modulationId = -1;
      if (
        !state.selectedItems.find(
          (item) => item.id === state.radioButtonSelectionId
        )?.modulationId
      ) {
        // Select the first modulation from the list.
        modulationId = currentModCodOptions[0].modulationId;
      } else {
        // Check whether the selected modulation is in the list
        // of valid options. If not, select a new modulation.
        modulationId = state.selectedItems.find(
          (item) => item.id === state.radioButtonSelectionId
        )?.modulationId;

        if (
          !currentModCodOptions
            .map((option) => option.modulationId)
            .includes(modulationId)
        ) {
          modulationId = currentModCodOptions[0].modulationId;
        }
      }
    }

    // Extract the modulation and coding names.
    const modulation = currentModCodOptions.find(
      (modul) => modul.modulationId === modulationId
    )?.modulation;

    // Get the valid modulation and coding combinations that
    // include the currently selected modulation.
    const filteredCodings = currentModCodOptions
      .filter((option) => option.modulation === modulation)
      .map((option) => option.coding);

    // Iterate over the valid modulation and coding combinations and create
    // the arrays used to populate the modulation and coding dropdowns.
    const validModulations: Attribute[] = [];
    const validCodings: Attribute[] = [];
    currentModCodOptions.forEach(
      (option: {
        modulationId: number;
        modulation: string;
        codingId: number;
        coding: string;
        dataRate_kbps?: number;
      }) => {
        // Add unique modulation and codings to arrays. These arrays are used to
        // populate the dropdowns.
        if (
          validModulations.filter(
            (validMod) => validMod.id === option.modulationId
          ).length === 0
        ) {
          validModulations.push({
            id: option.modulationId,
            name: option.modulation
          });
        }
        if (
          validCodings.filter((validCod) => validCod.id === option.codingId)
            .length === 0 &&
          filteredCodings.includes(option.coding)
        ) {
          validCodings.push({
            id: option.codingId,
            name: option.coding
          });
        }
      }
    );

    let codingId = -1;
    if (
      !state.selectedItems.find(
        (item) => item.id === state.radioButtonSelectionId
      )?.codingId
    ) {
      if (validCodings.length > 0) {
        // Select the first coding from the list.
        codingId = validCodings[0].id;
      } else {
        // If there is not currently a selcted coding and
        // no coding options were returned, return from this
        // function.
        return;
      }
    } else {
      // Check whether the selected coding is in the list
      // of valid options. If not, select a new coding.
      codingId = state.selectedItems.find(
        (item) => item.id === state.radioButtonSelectionId
      )?.codingId;

      if (!validCodings.map((option) => option.id).includes(codingId)) {
        if (validCodings.length > 0) {
          codingId = validCodings[0].id;
        } else {
          return;
        }
      }
    }

    const coding = currentModCodOptions.find(
      (coding) => coding.codingId === codingId
    )?.coding;

    setModuls(validModulations);
    setCodings(validCodings);
    setModCods(newModCodOptions);
    setOptions((prevState) => ({
      ...prevState,
      modulation: modulationId,
      coding: codingId
    }));
    updateThroughput(modulation, coding);

    // If the code reaches this point, a valid frequency band, antenna (in the case
    // a ground station is selected), and a modulation and coding have been selected.
    // Update the selectedItems state object with these values.
    updateState(
      frequencyBandId,
      antennaId,
      antennaName,
      modulationId,
      codingId,
      modulation,
      coding,
      optimizedModCod
    );
  };

  const updateState = (
    frequencyBandId: number,
    antennaId: number,
    antennaName: string,
    modulationId: number,
    codingId: number,
    modulation: string,
    coding: string,
    optimizedModCod: boolean
  ) => {
    const newSelectedItems = state.selectedItems.map((item) => {
      if (item.id === state.radioButtonSelectionId) {
        return {
          ...item,
          frequencyBandId: frequencyBandId,
          antennaId: antennaId,
          antennaName: antennaName,
          modulationId: modulationId,
          codingId: codingId,
          modulation: modulation,
          coding: coding,
          optimizedModCod: optimizedModCod
        };
      } else {
        return item;
      }
    });

    onState('selectedItems', newSelectedItems);
  };

  // This function is called when any of the dropdown values are changed.
  // These are currently frequency band, antenna, modulation, and coding.
  // Updates the state.
  const handleOption = (event): void => {
    const { name, value } = event.target;

    const selectedItem = state.selectedItems.find(
      (item) => item.id === state.radioButtonSelectionId
    );

    if (name === 'modulation') {
      const modulation = moduls.find((modul) => modul.id === value)?.name;
      setOptions((prevState) => ({
        ...prevState,
        modulation: value
      }));
      updateModCods(
        modCods,
        selectedItem?.frequencyBandId,
        selectedItem?.antennaId,
        selectedItem?.antennaName,
        selectedItem?.optimizedModCod,
        value
      );
      updateState(
        selectedItem?.frequencyBandId,
        selectedItem?.antennaId,
        selectedItem?.antennaName,
        value,
        selectedItem?.codingId,
        modulation,
        selectedItem?.coding,
        selectedItem?.optimizedModCod
      );
    } else if (name === 'coding') {
      const coding = codings.find((coding) => coding.id === value)?.name;
      setOptions((prevState) => ({
        ...prevState,
        coding: value
      }));

      updateThroughput(selectedItem?.modulation, coding);
      updateState(
        selectedItem?.frequencyBandId,
        selectedItem?.antennaId,
        selectedItem?.antennaName,
        selectedItem?.modulationId,
        value,
        selectedItem?.modulation,
        coding,
        selectedItem?.optimizedModCod
      );
    } else if (name === 'antenna') {
      const antennaName = antennas.find(
        (antenna) => antenna.id === value
      )?.name;
      handleModCods(
        selectedItem?.frequencyBandId,
        value,
        antennaName,
        selectedItem?.optimizedModCod
      );

      onState('isDataLoaded', false);
      dispatch(updateResults());
      onState('isLastAnalysis', false);
    } else if (name === 'frequencyBand') {
      handleAntennas(value);

      onState('isDataLoaded', false);
      dispatch(updateResults());
      onState('isLastAnalysis', false);
    }

    onState('isLastSave', false);
    onState('isMarkedForComparison', false);
  };

  // This function is called when the Optimized Modulation and Coding checkbox
  // is checked (or unchecked). The modulation and coding values are also
  // updated accordingly.
  const handleCheck = (event): void => {
    const { checked } = event.currentTarget;

    const selectedItem = state.selectedItems.find(
      (item) => item.id === state.radioButtonSelectionId
    );
    handleModCods(
      selectedItem?.frequencyBandId,
      selectedItem?.antennaId,
      selectedItem?.antennaName,
      checked
    );
    onState('isLastSave', false);
    onState('isMarkedForComparison', false);
  };

  const updateThroughput = (modulation: string, coding: string) => {
    // If an analysis is loaded, update the throughput /
    // max throughput if necessary.
    if (performancePanel && modCodOptions) {
      let maxAchievableDataRate_kbps: number;
      if (performancePanel.systemParams.multipleAccess === 'TDMA') {
        const option: ModCodOption =
          performancePanel.systemParams.modCodOptions.find(
            (opt) => opt.modulation === modulation && opt.coding === coding
          );
        if (!option) return;
        maxAchievableDataRate_kbps = option.dataRate_kbps;
      } else {
        maxAchievableDataRate_kbps = calculateMaxAchievableDataRate(
          performancePanel.systemParams.R_kbps as number,
          performancePanel.systemParams.bandwidthMHz as number,
          performancePanel.linkParams.modCodTable,
          modulation,
          coding
        );
      }
      const maxThroughput_Gb_Day =
        ((maxAchievableDataRate_kbps * getCoverage(state, performancePanel)) /
          Math.pow(10, 6)) *
        86400;

      // Update the throughput input field in the parameters panel.
      // If the current throughput is greater than the max possible
      // throughput for the selected network and the currently
      // selected user, set the throughput to the max throughput.
      onBounds('throughput', 'max', maxThroughput_Gb_Day);
      onState('results', {
        ...state.results,
        maxThroughput_Gb_Day: maxThroughput_Gb_Day
      });
      if (state.commsSpecs.dataRateKbps > maxThroughput_Gb_Day) {
        onState('commsSpecs', {
          ...state.commsSpecs,
          dataRate: maxThroughput_Gb_Day
        });
        //onError(`The throughput you've entered is greater than the throughput this network can support. Your throughput specification has been adjusted to ${maxThroughput_Gb_Day.toFixed(2)} Gb/Day.`, true, 'Warning');
      }
    }
  };
  // if(state.radioButtonSelectionId > 0 && state.networkType === 'dte')
  return (
    <Grid container spacing={0}>
      <Grid item xs={12}>
        <Typography className={classes.subtitle}>Options</Typography>
      </Grid>
      <Grid item xs={12}>
        <div
          className={classes.root}
          style={{
            height:
              state.networkType === 'dte'
                ? (window.screen.availHeight / zoom) * 0.34
                : (window.screen.availHeight / zoom) * 0.34,
            overflowY: 'auto',
            overflowX: 'hidden'
          }}
        >
          <Grid container alignItems="center" spacing={2}>
            <Grid item md={12} className={classes.title}>
              <Typography variant="h6" component="h6">
                Options
              </Typography>
            </Grid>
            <Grid item md={5}>
              <Typography className={classes.text}>Frequency Band</Typography>
            </Grid>
            <Grid item md={7}>
              <FormControl
                variant="outlined"
                size="small"
                fullWidth
                className={classes.select}
              >
                <Select
                  name="frequencyBand"
                  variant="outlined"
                  color="primary"
                  value={
                    state.selectedItems.find(
                      (item) => item.id === state.radioButtonSelectionId
                    )?.frequencyBandId ?? 0
                  }
                  onChange={handleOption}
                  disabled={true}
                  fullWidth
                >
                  <MenuItem value={0} disabled>
                    None
                  </MenuItem>
                  {frequencyBands.map((item) => (
                    <MenuItem value={item.id} key={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <>
              <Grid item md={5}>
                <Typography className={classes.text}>Antenna</Typography>
              </Grid>
              <Grid item md={7}>
                <FormControl
                  variant="outlined"
                  size="small"
                  fullWidth
                  className={classes.select}
                >
                  <Select
                    name="antenna"
                    variant="outlined"
                    color="primary"
                    value={
                      state.selectedItems.find(
                        (item) => item.id === state.radioButtonSelectionId
                      )?.antennaId ?? 0
                    }
                    onChange={handleOption}
                    disabled={true}
                    fullWidth
                  >
                    <MenuItem value={0}>
                      <em>Auto-Select</em>
                    </MenuItem>
                    {antennas.map((item) => (
                      <MenuItem value={item.id} key={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </>

            {/* <Grid item md={2}>
                <Checkbox
                  color="primary"
                  style={{
                    color: `${theme.palette.primary.main} `
                  }}
                  checked={
                    state.selectedItems.find(
                      (item) => item.id === state.radioButtonSelectionId
                    )?.optimizedModCod ?? true
                  }
                  onChange={handleCheck}
                  disabled={state.radioButtonSelectionId === 0 || state.loading}
                />
              </Grid>
              <Grid item md={10}>
                <Typography variant="body1" component="p" color="textPrimary">
                  {'Auto-Selected Modulation & Coding'}
                </Typography>
              </Grid> */}
            <Grid item md={5}>
              <Typography className={classes.text}>Modulation</Typography>
            </Grid>
            <Grid item md={7}>
              <FormControl
                variant="outlined"
                size="small"
                fullWidth
                className={classes.select}
              >
                <Select
                  name="modulation"
                  variant="outlined"
                  value={options.modulation}
                  onChange={handleOption}
                  disabled={
                    state.selectedItems.find(
                      (item) => item.id === state.radioButtonSelectionId
                    )?.optimizedModCod ||
                    state.radioButtonSelectionId === 0 ||
                    state.loading
                  }
                  fullWidth
                >
                  {moduls.map((item) => (
                    <MenuItem value={item.id} key={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={5}>
              <Typography className={classes.text}>Coding</Typography>
            </Grid>
            <Grid item md={7}>
              <FormControl
                variant="outlined"
                size="small"
                fullWidth
                className={classes.select}
              >
                <Select
                  name="coding"
                  variant="outlined"
                  value={options.coding}
                  onChange={handleOption}
                  disabled={
                    state.selectedItems.find(
                      (item) => item.id === state.radioButtonSelectionId
                    )?.optimizedModCod ||
                    state.radioButtonSelectionId === 0 ||
                    state.loading
                  }
                  fullWidth
                >
                  {codings.map((item) => (
                    <MenuItem value={item.id} key={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={12}>
              <Typography className={classes.paperComment}>
                *By selecting Auto-Select, the best parameter choice is selected
                by the CART analysis such that the highest data rate can be
                achieved with the allocated bandwidth and power for the selected
                asset.
              </Typography>
            </Grid>
          </Grid>
        </div>
      </Grid>
    </Grid>
  );
  // else{
  //   return (
  //     <Grid container spacing = {0}>
  //       <Grid item xs = {12}>
  //         <Typography className={classes.subtitle}>
  //           Options
  //         </Typography>
  //       </Grid>
  //       <Grid item xs = {12}>
  //         <div
  //           className={classes.root}
  //           style={{ height:  state.networkType === 'dte'?((window.screen.availHeight / zoom) * 0.11):((window.screen.availHeight / zoom) * 0.11), overflowY: 'auto'}}
  //         >
  //           <Grid container alignItems="center" spacing={2}>
  //             <Grid item xs = {12}>
  //               <Typography className = {classes.placeholder}>
  //                 <i>* No Options Available</i>
  //               </Typography>
  //             </Grid>
  //           </Grid>
  //         </div>
  //       </Grid>
  //     </Grid>
  //   );
  // }
};

export default Modulation;
