/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useState, useEffect } from 'react';
import { useDispatch } from 'src/store';
import {
  updateResults,
  updateModCodOptions,
  updateFrequencyBandOptions,
  updateAntennaOptions
} from 'src/slices/results';
import clsx from 'clsx';
import DataGrid, { Column } from 'devextreme-react/data-grid';
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.material.blue.light.compact.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { Box, colors, makeStyles, useTheme } from '@material-ui/core';
import axios from 'src/utils/axios';
import type { Relay, Dte, System, Station } from 'src/types/system';
import { DteDetails } from 'src/components/Details';
import type { ICollapsed, State } from 'src/pages/home';
import type { ModCodOption } from 'src/types/evaluation';
import SelectionAlert from './SelectionAlert';
import type { ISave, NetworkFilters } from 'src/types/preference';
import { NetworkFilterModal } from 'src/components/Modals';
import { exploreImages as images } from 'src/utils/assets';
import { FREQ_FILTERING_OPTIONS as Options } from 'src/utils/constants/network-library';
import { useSelector } from 'src/store';
import AddSystem from './AddSystem';
import type { Theme } from 'src/theme';
import { SearchOption } from 'src/types/details';
import { Filter, Filterer } from 'src/utils/filterer';
import { THEMES } from 'src/utils/constants/general';
import { getModCodForStation } from 'src/utils/misc';
import { updateNetworkDetailsLoader } from 'src/slices/networkLibrary';
import { AttrValue } from 'src/components/Mission/CommServicesDef';
import { updateNetworkList } from 'src/slices/networkList';

interface NetworkLibraryProps {
  state: State;
  cache: ISave;
  visible: boolean;
  isCollapsed: ICollapsed;
  onState: (name: string, value: any) => void;
  onBounds: (name: string, type: string, value: number) => void;
  setNetworks: (network: string[]) => void;
  resultsCollapsed: boolean;
  myFilterer: Filterer;
  setMyFilterer: any;
  resetFilterFlag: boolean;
  setFilterNameList: (l: string[]) => void;
}

export interface IOptions {
  supportedFrequencies: string[];
  location: string[];
}

interface Panel {
  dte: number | null;
  relay: number | null;
}

const initialPanel: Panel = {
  dte: null,
  relay: null
};

const initialFilters: NetworkFilters = {
  name: [],
  type: 'none',
  operationalYear: '',
  supportedFrequencies: 'none',
  location: 'none',
  scanAgreement: 'none'
};

const initialOptions: IOptions = {
  supportedFrequencies: [],
  location: []
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  hide: {
    display: 'none'
  },
  table: {
    userSelect: 'none',
    MozUserSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none',
    '& .dx-datagrid': {
      backgroundColor:
        theme.name === THEMES.DARK
          ? theme.palette.background.dark
          : theme.palette.background.default,
      color: theme.palette.text.primary
    },
    '& .dx-datagrid-rowsview .dx-row': {
      borderTop:
        theme.name === THEMES.DARK
          ? `1px double ${theme.palette.border.main}`
          : ``,
      borderBottom:
        theme.name === THEMES.DARK
          ? `1px double ${theme.palette.border.main}`
          : ``
    },
    '& .dx-datagrid-headers .dx-header-row': {
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
      borderBottom:
        theme.name === THEMES.DARK
          ? `1px double ${theme.palette.border.main}`
          : ``
    },
    '& .dx-datagrid-headers .dx-datagrid-table .dx-row>td .dx-sort-indicator': {
      color: theme.palette.text.primary,
      borderBottom:
        theme.name === THEMES.DARK
          ? `1px double ${theme.palette.border.main}`
          : ``
    },
    '& .dx-datagrid-headers .dx-datagrid-table .dx-row>td .dx-sort': {
      color: theme.palette.text.primary,
      borderBottom:
        theme.name === THEMES.DARK
          ? `1px double ${theme.palette.border.main}`
          : ``
    },
    '& .dx-data-row.dx-state-hover:not(.dx-selection):not(.dx-row-inserted):not(.dx-row-removed):not(.dx-edit-row):not(.dx-row-docused) > td':
      {
        color: theme.palette.text.secondary
      }
  },
  image: {
    borderRadius: '1px',
    width: '75%'
  },
  relay: {
    borderRadius: '1px',
    width: '75%'
  },
  bold: {
    fontWeight: 'bolder'
  },
  header: {
    color: theme.palette.text.primary,
    '&:hover': {
      color: theme.palette.primary.main
    }
  }
}));

const NetworkLibrary: FC<NetworkLibraryProps> = ({
  state,
  cache,
  isCollapsed,
  visible,
  onState,
  onBounds,
  setNetworks,
  resultsCollapsed,
  myFilterer,
  setMyFilterer,
  resetFilterFlag,
  setFilterNameList
}) => {
  const classes = useStyles();
  const theme = useTheme<Theme>();
  const [open, setOpen] = useState<boolean>(false);
  const [results, setResults] = useState<any[]>();
  const [source, setSource] = useState<any[]>();
  const [panel, setPanel] = useState<Panel>(initialPanel);
  const [checked, setChecked] = useState<number[]>([]);
  const [selectedDTEs, setSelectedDTEs] = useState<string[]>([]);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ title: '', message: '' });
  const [filters, setFilters] = useState<NetworkFilters>(initialFilters);
  const [filterSource, setFilterSource] = useState<SearchOption[]>([]);
  // const [options, setOptions] = useState<IOptions>(initialOptions);
  const { isEngineer } = useSelector((state) => state.user);
  const [newSystem, setNewSystem] = useState<boolean>(false);
  const [firstLoad, setFirstLoad] = useState<boolean>(true);
  const dispatch = useDispatch();
  const { zoom } = useSelector((state) => state.zoom);
  const { selectedNetwork } = useSelector((state) => state.networkLibrary);

  const [codingAttrValues, setCodingAttrValues] = useState<AttrValue[]>([]);
  const [polarizationOptions, setPolarizationOptions] = useState<AttrValue[]>(
    []
  );
  const [modulationOptions, setModulationOptions] = useState<AttrValue[]>([]);
  const [freqBandOptions, setFreqBandOptions] = useState<AttrValue[]>([]);

  useEffect(() => {
    if (selectedNetwork) {
      handlePanel('dte', selectedNetwork);
      dispatch(updateNetworkDetailsLoader(null));
    }
  }, [selectedNetwork]);

  const fetchData = async () => {
    Promise.all([
      await axios.get<Relay[]>('/requestRelayDashboard'),
      await axios.get<Dte[]>('/getNetworkLibrary')
    ]).then((responses) => {
      let data: System[] = [];
      let temp: IOptions = initialOptions;

      responses.forEach((response) => {
        // console.log(response);
        response.data.forEach((system) => {
          // console.log(system);
          const picture = images.find(
            (image) =>
              image.default.split('.')[0].split('/')[3].toLowerCase() ===
              system.system.toLowerCase()
          );
          if (Object.keys(system).includes('total_satellites')) {
            const freqBands = Options.find(
              (item) =>
                parseInt(item.value.split('/')[0]) <=
                  parseInt(system.ssl_return_link_freq) &&
                parseInt(system.ssl_return_link_freq) <=
                  parseInt(item.value.split('/')[1])
            );
            const entry = {
              id: system.id,
              system: system.system,
              type: 'relay',
              year: system.ioc_year,
              location: system.location,
              freqBands: freqBands?.band,
              sglEirp: system.sgl_relay_eirp_dbw,
              sglGt: system.sgl_relay_g_t_db_k,
              sslEirp: system.ssl_relay_eirp_dbw,
              sslGt: system.ssl_relay_g_t_db_k,
              minFrequency: system.minFreq,
              maxFrequency: system.maxFreq,
              scanAgreement:
                Number(system.relay_scan_agreement) === 1 ? true : false,
              standardsCompliance: system.standardsCompliance ?? 0,
              modulationType: system.modulationType ?? '',
              codingType: system.codingType ?? '',
              picture: picture
                ? picture.default
                : '/static/icons/Satellite_Icon-Networks_Menu-DarkMode-SVG.svg',
              versions: system.versions,
              altitude: parseFloat(system.altitude),
              relayType: system.relay_type
            };
            //@ts-ignore
            data.push(entry);
          } else {
            system['type'] = 'dte';
            system['picture'] = picture
              ? picture.default
              : '/static/icons/Ground_Station_Group_Icon-SVG.svg';
            data.push(system);
          }
        });

        data.forEach((item) => {
          Object.keys(temp).forEach((key) => {
            let values = item[key]?.split(', ');
            values?.forEach((el) => {
              !temp[key].includes(el) && temp[key].push(el);
            });
          });
        });
      });

      setSource(data);
      setResults(data);
      // setOptions(temp);
    });
  };

  useEffect(() => {
    if (state.networkType === 'dte' && (state.pointSync || state.parametric)) {
      onBounds('altitude', 'max', Number.MAX_SAFE_INTEGER);
    } else if (
      state.networkType === 'dte' &&
      !(state.pointSync || state.parametric)
    ) {
      if (state.parameters.altitude > 1000) {
        // onState('parameters', {...state.parameters, altitude: 1000});
        // setAlertMessage({
        //   title: `Warning`,
        //   message: `Currently, modeled data points for ground stations only extend up to 1000 km. For accurate results, decrease the altitude of your satellite, select the real-time modeling option when running your analysis, or download our STK models for these ground stations, and run an analysis for your user.`
        // });
        // setIsAlertOpen(true);
      }
    }
  }, [state.pointSync, state.parametric, state.networkType]);

  useEffect(() => {
    if (state.networkType === 'relay' && state.selectedItems.length > 0) {
      onBounds('altitude', 'max', state.selectedItems[0].altitude - 1);
      if (state.parameters.altitude > state.selectedItems[0].altitude - 1) {
        onState('parameters', {
          ...state.parameters,
          altitude: state.selectedItems[0].altitude - 1
        });
      }
    }
  }, [state.selectedItems]);
  // //update filters based on change to data
  useEffect(() => {
    let newFilter = new Filterer(source);
    let filters: Map<string, Filter> = myFilterer.getFilters();
    filters.forEach((filterFunc, filterName) => {
      newFilter.addFilter(filterName, filterFunc);
    });
    setMyFilterer(newFilter);
  }, [source]);

  useEffect(() => {
    results && updateAvailibleSelections(results);
  }, [results]);

  const updateAvailibleSelections = (networkData: any[]) => {
    let data = {
      frequencyBands: [],
      polarization: [],
      modulation: [],
      coding: []
    };
    networkData.forEach((network) => {
      if (network.codingType) {
        codingAttrValues.forEach((coding) => {
          if (network.codingType.includes(coding.name)) {
            if (!data.coding.includes(coding.id)) {
              data.coding.push(coding.id);
            }
          }
        });
      } else if (network.channelCodingType) {
        codingAttrValues.forEach((coding) => {
          if (network.channelCodingType.includes(coding.name)) {
            if (!data.coding.includes(coding.id)) {
              data.coding.push(coding.id);
            }
          }
        });
      }
      modulationOptions.forEach((modulation) => {
        if (network.modulationType.includes(modulation.name)) {
          if (!data.modulation.includes(modulation.id)) {
            data.modulation.push(modulation.id);
          }
        }
      });
      freqBandOptions.forEach((band) => {
        if (network.supportedFrequencies.includes(band.name)) {
          if (!data.frequencyBands.includes(band.id)) {
            data.frequencyBands.push(band.id);
          }
        }
      });
      if (network.polarization) {
        polarizationOptions.forEach((polarization) => {
          if (network.polarization.includes(polarization.name)) {
            if (!data.polarization.includes(polarization.id)) {
              data.polarization.push(polarization.id);
            }
          }
        });
      }
    });
    dispatch(updateNetworkList(data));
  };

  useEffect(() => {
    const fetchCodingData = async () => {
      const response = await axios.get<AttrValue[]>('/getAttributeValues', {
        params: { sub_key: 'channel_coding' }
      });
      response.data && setCodingAttrValues(response.data);
    };
    const fetchPolarizationTypeData = async () => {
      const response = await axios.get<AttrValue[]>('/getAttributeValues', {
        params: { sub_key: 'antenna_polarization' }
      });

      response.data && setPolarizationOptions(response.data);
    };
    const fetchModulationTypeData = async () => {
      const response = await axios.get<AttrValue[]>('/getAttributeValues', {
        params: { sub_key: 'antenna_modulation' }
      });

      response.data && setModulationOptions(response.data);
    };
    const fetchFrequencyBandData = async () => {
      const response = await axios.get<AttrValue[]>('/getAttributeValues', {
        params: { sub_key: 'frequency_bands ' }
      });
      response.data && setFreqBandOptions(response.data);
    };
    fetchCodingData();
    fetchPolarizationTypeData();
    fetchModulationTypeData();
    fetchFrequencyBandData();
  }, []);
  // Returns all ground stations associated with a particular DTE network.
  const fetchStations = async (networkId: number) => {
    const params = { networkId };
    const response = await axios.post<Station[]>('/getGroundStations', params);
    return response.data ?? [];
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let selected: string[] = [];
    checked.forEach((selection) => {
      let currVal: System[] = results.filter(
        (entry: System) => entry.id === selection && entry.type === 'dte'
      );
      if (currVal.length > 0) {
        selected = selected.concat(currVal[0].system);
      }
    });
    setSelectedDTEs(selected);
  }, [checked]);

  useEffect(() => {
    const shell = async () => {
      if (firstLoad && state.selectedItems.length > 0) {
        if (state.networkType === 'relay') {
          // Query the database for all modulation and coding
          // options associated with the relay.
          const response = await axios.get<{ modCodOptions: ModCodOption[] }>(
            '/getModCodOptions',
            {
              params: {
                id: state.selectedItems[0].id,
                networkType: 'relay',
                antennaId: 0, // Only relevant for ground stations
                frequencyBandId: 0 // Only relevant for ground stations
              }
            }
          );
          dispatch(
            updateModCodOptions(
              state.selectedItems[0].id,
              response.data.modCodOptions
            )
          );
        } else {
          for (let i = 0; i < state.selectedItems.length; i++) {
            const response = await axios.get<{ modCodOptions: ModCodOption[] }>(
              '/getModCodOptions',
              {
                params: {
                  id: state.selectedItems[i].id,
                  networkType: 'dte',
                  antennaId: 0, // Only relevant for ground stations
                  frequencyBandId: 0 // Only relevant for ground stations
                }
              }
            );
            dispatch(
              updateModCodOptions(
                state.selectedItems[i].id,
                response.data.modCodOptions
              )
            );
          }
        }
        setFirstLoad(false);
      }
    };
    shell();
  }, [state.selectedItems]);
  useEffect(() => {
    setNetworks(selectedDTEs);
  }, [selectedDTEs]);

  // useEffect(() => {
  //   if (!source) return;

  //   const data = source
  //     .filter((item) =>
  //       filters.name !== ''
  //         ? item.system.toLowerCase().includes(filters.name.toLowerCase())
  //         : true
  //     )
  //     .filter((item) =>
  //       filters.operationalYear !== 0 && filters.operationalYear
  //         ? item.year <= filters.operationalYear
  //         : true
  //     )
  //     .filter((item) =>
  //       filters.type !== 'none' && filters.type !== ''
  //         ? item.type === filters.type
  //         : true
  //     )
  //     .filter((item) =>
  //       filters.location !== 'none' && filters.location !== ''
  //         ? item.location.split(', ').includes(filters.location)
  //         : true
  //     )
  //     .filter((item) =>
  //       filters.supportedFrequencies !== 'none' &&
  //       filters.supportedFrequencies !== ''
  //         ? item.freqBands.split(', ').includes(filters.supportedFrequencies)
  //         : true
  //     );
  //   setResults(data);
  // }, [filters, source]);

  const handleDbClick = (event): void => {
    event?.data.type === 'relay' && handlePanel('relay', event.data.id);
    event?.data.type === 'dte' && handlePanel('dte', event.data.id);
  };

  const handleClick = (event) => {
    if (event.event.ctrlKey) {
      // checked.includes(event.data.id)
      /*?*/ setChecked(checked.filter((item) => item !== event.data.id));
      //   : setChecked((prevState) => [...prevState, event.data.id]);
    } else {
      setChecked([event.data.id]);
    }
  };

  const handleRemove = async (e): Promise<void> => {
    await axios.post('/deleteSystem', { systemName: e.key.system });
  };

  const handlePanel = (name, value): void => {
    setPanel((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleContext = async (value) => {
    // Do not allow combinations of relays and DTEs in the selection list.
    if (
      (state.networkType === 'dte' && value.type === 'relay') ||
      (state.networkType === 'relay' && value.type === 'dte')
    ) {
      setAlertMessage({
        title: `Invalid Selection`,
        message: 'You cannot combine DTEs and relay networks at this time.'
      });
      setIsAlertOpen(true);
      return;
    }

    // Only allow one relay to be selected at a time.
    if (value.type === 'relay' && state.selectedItems.length > 0) {
      setAlertMessage({
        title: `Invalid Selection`,
        message: 'You can only select one relay network at a time.'
      });
      setIsAlertOpen(true);
      return;
    }

    // Do not allow a DTE to be selected if the mission type is terrestrial.
    if (value.type === 'dte' && !state.parameters.isOrbital) {
      setAlertMessage({
        title: `Invalid Selection`,
        message:
          'A DTE network cannot service a terrestrial user. Please select a relay network or update your mission parameters.'
      });
      setIsAlertOpen(true);
      return;
    }

    // Currently, ground station modeled data points only extend up
    // to 1000 km. If the user selects a DTE while the user altitude
    // is greater than 1000 km, notify the user of the modeling limitation.
    if (
      value.type === 'dte' &&
      state.parameters.altitude > 1000 &&
      !state.pointSync &&
      !state.parametric
    ) {
      setAlertMessage({
        title: `Warning`,
        message: `Currently, modeled data points for ground stations only extend up to 1000 km. For accurate results, decrease the altitude of your satellite, select the real-time modeling option when running your analysis, or download our STK models for these ground stations, and run an analysis for your user.`
      });
      setIsAlertOpen(true);
      // Do not return! This is a valid selection, we just want to warn the user.
    }

    // Do not allow a relay to be selected if the altitude of the
    // constellation is less than or equal to the altitude of the
    // user satellite.
    if (value.type === 'relay' && state.parameters.altitude >= value.altitude) {
      setAlertMessage({
        title: `Invalid Selection`,
        message: `The relay altitude of ${value.altitude} km must be greater than the altitude of the user satellite. Please choose a different network, or decrease the altitude of your satellite.`
      });
      setIsAlertOpen(true);
      return;
    }
    if (value.type === 'relay') {
      // Set the max altitude to 1 km below the relay altitude.
      onBounds('altitude', 'max', value.altitude - 1);
    } else if (!state.pointSync && !state.parametric) {
      // For DTEs, set the max altitude to 1000 km. Modeled data points
      // currently only extend up to 1000 km, and attempting predictions
      // beyond this point may lead to inaccurate results. For regression analysis only
      // for single point analysis there is no need for limits
    }

    // Set the network type.
    !state.networkType && onState('networkType', value.type);

    // Clear results returned from last API call.
    onState('isDataLoaded', false);
    dispatch(updateResults());

    // If the selected item is a relay, add it to the
    // selection list. But if the item is a DTE network,
    // query the database for its associated ground
    // stations and add those to the list instead.
    if (value.type === 'relay') {
      // Query the database for all modulation and coding
      // options associated with the relay.
      const response = await axios.get<{
        modCodOptions: ModCodOption[];
        frequencyBandOptions: { id: number; name: string }[];
      }>('/getModCodOptions', {
        params: {
          id: value.id,
          networkType: 'relay',
          antennaId: 0, // Only relevant for ground stations
          frequencyBandId: 0 // Only relevant for ground stations
        }
      });
      dispatch(updateModCodOptions(value.id, response.data.modCodOptions));

      let { finMod, finCod, optimized } = getModCodForStation(
        response.data.modCodOptions,
        state.commsSpecs.commsPayloadSpecs.modulation,
        state.commsSpecs.commsPayloadSpecs.coding
      );

      // Update the items in the selection list.
      value = {
        ...value,
        name: value.system,
        modulationId: finMod,
        codingId: finCod,
        optimizedModCod: optimized
      };
      if (
        state.commsSpecs.freqBand !== 0 &&
        response.data.frequencyBandOptions.find(
          (e) => e.id === state.commsSpecs.freqBand
        )
      ) {
        value.frequencyBandId = state.commsSpecs.freqBand;
      } else {
        value.frequencyBandId = 1; //response.data.frequencyBandOptions[0].id;
      }
      onState('selectedItems', [...state.selectedItems, value]);
    } else {
      fetchStations(value.id).then(async (res) => {
        const newRes = [];
        await Promise.all(
          res.map(async (station) => {
            // Set frequency band, antenna, and mod/cod options.
            const response = await axios.get<any>('/getModCodOptions', {
              params: {
                id: station.id,
                networkType: 'dte',
                antennaId: 0, // Only relevant for ground stations
                frequencyBandId: 0 // Only relevant for ground stations
              }
            });
            dispatch(
              updateFrequencyBandOptions(
                station.id,
                response.data.frequencyBandOptions
              )
            );
            dispatch(
              updateAntennaOptions(station.id, response.data.antennaOptions)
            );
            dispatch(
              updateModCodOptions(station.id, response.data.modCodOptions)
            );

            // Update the items in the selection list.
            let newStation: any = { ...station };
            let { finMod, finCod, optimized } = getModCodForStation(
              response.data.modCodOptions,
              state.commsSpecs.commsPayloadSpecs.modulation,
              state.commsSpecs.commsPayloadSpecs.coding
            );

            newStation = {
              ...newStation,
              antennaId: response.data.selectedAntennaId,
              antennaName: response.data.selectedAntennaName,
              modulationId: finMod,
              codingId: finCod,
              optimizedModCod: optimized
            };

            if (
              state.commsSpecs.freqBand !== 0 &&
              response.data.frequencyBandOptions.find(
                (e) => e.id === state.commsSpecs.freqBand
              )
            ) {
              newStation.frequencyBandId = state.commsSpecs.freqBand;
            } else {
              newStation.frequencyBandId =
                response.data.frequencyBandOptions[0].id;
            }

            newRes.push(newStation);
          })
        );

        onState('selectedItems', [...state.selectedItems, ...newRes]);
      });
    }

    onState('isLastSave', false);
    onState('isMarkedForComparison', false);
    onState('isLastAnalysis', false);
  };

  const handleOpen = (evt?, reason?) => {
    if (reason === 'backdropClick') return;
    setOpen(!open);
  };

  const handleFilterChange = (): void => {
    let l: any[] = myFilterer.getFilteredList();
    let x = [];
    myFilterer.getFilters().forEach((filter) => {
      x.push(filter.filterName + ': ' + filter.filterParam);
    });
    setResults(l);
    setFilterNameList(x);
  };

  useEffect(() => {
    handleFilterChange();
  }, [resetFilterFlag]);

  const handleCellClick = (event) => event.columnIndex === 6 && handleOpen();

  const addNetwork = () => {
    setNewSystem(true);
  };

  const deleteNetwork = async (event) => {
    let result: boolean = window.confirm(
      `------- WARNING! -------- Are you sure you want to remove ${event.data['system']}? This will remove the network for all users of CART!`
    );
    if (result) {
      await axios.post('/deleteSystem', { systemName: event.key.system });
      fetchData();
    }
  };

  const handleclear = (): void => {
    myFilterer.clearFilters();
    setFilters({
      name: [],
      type: 'none',
      operationalYear: '',
      supportedFrequencies: 'none',
      location: 'none',
      scanAgreement: 'none'
    });
    handleFilterChange();
    setFilterSource([]);
  };

  return (
    <div
      data-filter-grid="true"
      className={
        visible && isCollapsed !== 'down' ? classes.root : classes.hide
      }
    >
      <AddSystem
        isSystem={newSystem}
        onIsSystem={() => setNewSystem(!newSystem)}
        onReload={() => {} /*fetchData*/}
      />
      <DataGrid
        className={classes.table}
        style={{
          maxHeight:
            isCollapsed === 'up'
              ? (window.screen.availHeight / zoom) * 0.8
              : (window.screen.availHeight / zoom) * 0.36
        }}
        dataSource={results}
        showBorders={false}
        showRowLines={true}
        hoverStateEnabled={true}
        scrolling={{ mode: 'infinite' }}
        onRowClick={handleClick}
        onCellClick={handleCellClick}
        onCellDblClick={handleDbClick}
        onRowRemoved={handleRemove}
        wordWrapEnabled={true}
        onRowPrepared={(event) => {
          if (event.rowType === 'data' && checked.includes(event.data.id))
            event.rowElement.style['background'] = colors.blue[200];
        }}
        onContextMenuPreparing={(e) => {
          let options: any[] = [];
          if (e.row?.data) {
            if (!state.loading) {
              options = [
                {
                  text: 'Select',
                  onClick: () => handleContext(e.row.data)
                }
              ];
            }
            if (isEngineer) {
              e.items = options.concat([
                {
                  text: 'View Network Details',
                  onClick: () => handleDbClick(e.row)
                },
                {
                  text: '--------- ADMIN ACTIONS ----------'
                },
                {
                  text: 'Add New Network',
                  onClick: () => addNetwork()
                },
                {
                  text: `Delete ${e.row?.data['system'] ?? 'Network'}`,
                  onClick: () => deleteNetwork(e.row)
                }
              ]);
            } else {
              e.items = options.concat([
                {
                  text: 'View Network Details',
                  onClick: () => handleDbClick(e.row)
                }
              ]);
            }
          } else {
            e.items = [];
          }
        }}
      >
        <Column
          dataField="picture"
          caption=""
          width={resultsCollapsed ? '5%' : '7%'}
          allowSorting={false}
          cellRender={(data) => (
            <img
              src={data.value}
              alt="system"
              className={clsx(
                classes.image,
                data.key.type === 'relay' && classes.relay
              )}
            />
          )}
          alignment="center"
        />
        <Column
          dataField="system"
          alignment="left"
          allowSearch={false}
          width="15%"
          cellRender={(data) => <div className={classes.bold}>{data.text}</div>}
          headerCellRender={(data) => (
            <div className={classes.header}>{data.column.caption}</div>
          )}
        />
        <Column
          dataField="type"
          caption="Type"
          alignment="center"
          width="14%"
          headerCellRender={(data) => (
            <div className={classes.header}>{data.column.caption}</div>
          )}
        />
        <Column
          dataField="year"
          caption="Operational Year"
          alignment="center"
          width="18%"
          headerCellRender={(data) => (
            <div className={classes.header}>{data.column.caption}</div>
          )}
        />
        <Column
          dataField="supportedFrequencies"
          caption="Supported Frequencies"
          alignment="center"
          width="20%"
          headerCellRender={(data) => (
            <div className={classes.header}>{data.column.caption}</div>
          )}
        />
        <Column
          dataField="location"
          caption="Location"
          alignment="center"
          width="20%"
          headerCellRender={(data) => (
            <div className={classes.header}>{data.column.caption}</div>
          )}
        />
        <Column
          alignment="center"
          width="5%"
          headerCellRender={() => (
            <div data-filter={true} style={{ padding: 0, margin: 0 }}>
              <FontAwesomeIcon
                icon={faFilter}
                style={{
                  color: theme.palette.primary.main
                }}
              />
            </div>
          )}
        />
      </DataGrid>
      {panel.relay && (
        <DteDetails
          id={panel.relay}
          onClose={() => handlePanel('relay', null)}
          platformType={2}
          refresh={() => fetchData()}
        />
      )}
      {panel.dte && (
        <DteDetails
          id={panel.dte}
          onClose={() => handlePanel('dte', null)}
          platformType={1}
          refresh={() => fetchData()}
        />
      )}
      {isAlertOpen && (
        <SelectionAlert
          isOpen={isAlertOpen}
          onOpen={() => setIsAlertOpen(!isAlertOpen)}
          message={alertMessage}
        />
      )}
      <NetworkFilterModal
        open={open}
        filterer={myFilterer}
        filters={filters}
        onOpen={handleOpen}
        onClear={handleclear}
        source={filterSource}
        onFilterChange={handleFilterChange}
        setSource={setFilterSource}
        state={state}
        onState={onState}
      />
    </div>
  );
};

export default NetworkLibrary;
