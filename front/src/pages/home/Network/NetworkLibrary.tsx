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
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.material.blue.light.compact.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalculator,
  faFilter,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import {
  Backdrop,
  Box,
  Checkbox,
  CircularProgress,
  Grid,
  IconButton,
  LinearProgress,
  makeStyles,
  useTheme
} from '@material-ui/core';
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
import TreeList, {
  Column,
  Selection,
  Lookup
} from 'devextreme-react/tree-list';
import React from 'react';
import { CheckBox, Template } from 'devextreme-react';
import { AttrValue } from 'src/components/Mission/CommServicesDef';
import { updateNetworkList } from 'src/slices/networkList';
import { Item } from 'devextreme-react/tag-box';

interface NetworkLibraryProps {
  state: State;
  cache: ISave;
  visible: boolean;
  isCollapsed: ICollapsed;
  onState: (name: string, value: any) => void;
  onBounds: (name: string, type: string, value: number) => void;
  setNetworks: (network: string[]) => void;
  resultsCollapsed: boolean;
  filterPanelOpen: boolean;
  closeFilterPanel: () => void;
  setFilterNameList: (l: string[]) => void;
  myFilterer: Filterer;
  setMyFilterer: any;
  resetFilterFlag: boolean;
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

export type TService = {
  antennaId: number;
  antennaName: string;
  isTx: boolean;
  frequencyBandId: number;
  frequencyBandName: string;
  antennaSize: number;
  system: string;
  location: string;
  year: number;
  gtValues: string;
  eirpValues: string;
  minFrequency: number;
  maxFrequency: number;
  scanAgreement: boolean;
  polarization: string;
  antennaGain: string;
  dataFormat: string;
  dataRate: number;
  modulationType: string;
  channelCodingType: string;
  subcarrierModulationType: string;
  standardsCompliance: number;
  networkName: string;
  platformName: string;
};

export type TPlatform = {
  id: number;
  name: string;
  type: number;
  location: string;
  services: TService[];
  antennaIds: number[];
  count: number;
  startYear: number;
};

export type TNetwork = {
  id: number;
  name: string;
  system: string;
  location: string;
  year: number;
  numLocations: number;
  supportedFrequencies: string;
  gtValues: string;
  eirpValues: string;
  minFrequency: number;
  maxFrequency: number;
  scanAgreement: boolean;
  antennaNames: string;
  antennaSize: string;
  polarization: string;
  antennaGain: string;
  dataFormat: string;
  modulationType: string;
  channelCodingType: string;
  subcarrierModulationType: string;
  standardsCompliance: number;
  platforms: TPlatform[];
  isEditable: boolean;
};

export type TNetworks = {
  networks: TNetwork[];
};

/**
 * Type for Grid LIST
 */
type TListItem = {
  id: number;
  objId: number;
  parent_id: number;
  selected: boolean;
  name: string;
  value1: string;
  value2: string;
  value3: string;
  level: string;
  count: number;
  platformType?: number;
  platformId?: number;
  platformName?: string;
  networkType?: string;
  networkId?: number;
  frequencyBandId?: number;
};

/**
 * Enum for data levels
 */
enum level {
  network = 'network',
  platform = 'platform',
  service = 'service'
}

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
  filterPanelOpen,
  resetFilterFlag,
  closeFilterPanel,
  setFilterNameList,
  myFilterer,
  setMyFilterer
}) => {
  const classes = useStyles();
  const theme = useTheme<Theme>();
  const [open, setOpen] = useState<boolean>(false);
  const [results, setResults] = useState<TNetwork[]>();
  const [source, setSource] = useState<TNetwork[]>();
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

  const [codingAttrValues, setCodingAttrValues] = useState<AttrValue[]>([]);
  const [polarizationOptions, setPolarizationOptions] = useState<AttrValue[]>(
    []
  );
  const [modulationOptions, setModulationOptions] = useState<AttrValue[]>([]);
  const [freqBandOptions, setFreqBandOptions] = useState<AttrValue[]>([]);
  const { coding, frequencyBands, modulation, polarization } = useSelector(
    (state) => state.networkList
  );
  const [loading, setLoading] = useState<boolean>(true);

  const dispatch = useDispatch();
  const { zoom } = useSelector((state) => state.zoom);
  const { selectedNetwork } = useSelector((state) => state.networkLibrary);
  const [data, setData] = useState<TListItem[]>();
  const expandedKeys = [];
  const selectedKeys = [];

  function CustomCell(options: any) {
    const data = options.data;
    try {
      if (data.level !== 'service') {
        if (data.level === 'platform') {
          if (data.count > 1 && data.platformType !== 1) {
            //constellation
            return (
              <React.Fragment>
                <img
                  src="/static/icons/Satellite_Icon-Networks_Menu-DarkMode-SVG.svg"
                  width={'25px'}
                  alt="networkLogo"
                  className="img"
                />
                &nbsp;&nbsp;&nbsp;
                <span className="name">{data.name}</span>
              </React.Fragment>
            );
          } else if (data.count <= 1 && data.platformType !== 1) {
            //single satellite
            console.log(data.type, data.name);
            return (
              <React.Fragment>
                <img
                  src="/static/icons/Satellite_Icon-Networks_Menu-DarkMode-SVG.svg"
                  width={'25px'}
                  alt="networkLogo"
                  className="img"
                />
                &nbsp;&nbsp;&nbsp;
                <span className="name">{data.name}</span>
              </React.Fragment>
            );
          } else {
            //Ground Station
            return (
              <React.Fragment>
                <img
                  src="/static/icons/Ground_Station_Individual_Icon-SVG.svg"
                  width={'20px'}
                  alt="networkLogo"
                  className="img"
                />
                &nbsp;&nbsp;&nbsp;
                <span className="name">{data.name}</span>
              </React.Fragment>
            );
          }
        } else if (data.level === 'network' && data.networkType === 'relay') {
          //Relay Network
          return (
            <React.Fragment>
              <img
                src="/static/icons/Satellite_Icon-Networks_Menu-DarkMode-SVG.svg"
                width={'25px'}
                alt="networkLogo"
                className="img"
              />
              &nbsp;&nbsp;&nbsp;
              <span className="name">{data.name}</span>
            </React.Fragment>
          );
        } else if (data.level === 'network' && data.networkType === 'dte') {
          //DTE Network
          return (
            <React.Fragment>
              <img
                src="/static/icons/Ground_Station_Group_Icon-SVG.svg"
                width={'25px'}
                alt="networkLogo"
                className="img"
              />
              &nbsp;&nbsp;&nbsp;
              <span className="name">{data.name}</span>
            </React.Fragment>
          );
        }
      } else {
        return (
          <React.Fragment>
            <IconButton onClick={() => handleContext(data)}>
              <CheckBox className="checkbox" value={data.selected} />
            </IconButton>
            <span className="name" style={{ paddingLeft: '30px' }}>
              {data.name}
            </span>
          </React.Fragment>
        );
      }
    } catch {
      return (
        <React.Fragment>
          <img
            src="/static/icons/Satellite_Icon-Networks_Menu-DarkMode-SVG.svg"
            width={'25px'}
            alt="networkLogo"
            className="img"
          />
          &nbsp;&nbsp;&nbsp;
          <span className="name">{data.name}</span>
        </React.Fragment>
      );
    }
  }

  function infoCell(options: any) {
    return options.data.level === 'network' ? (
      <div data-filter={true} style={{ paddingRight: 5, margin: 0 }}>
        <IconButton
          size={'small'}
          onClick={() => {
            handlePanel('dte', options.data.objId);
          }}
        >
          <FontAwesomeIcon
            icon={faInfoCircle}
            style={{
              color: theme.palette.grey[400]
            }}
          />
        </IconButton>
      </div>
    ) : options.data.level === 'service' ? (
      <div data-filter={true} style={{ paddingRight: 5, margin: 0 }}>
        <IconButton
          size={'small'}
          onClick={() => {
            alert('Link Budget Placeholder');
          }}
        >
          <FontAwesomeIcon
            icon={faCalculator}
            size="sm"
            style={{
              color: theme.palette.grey[400]
            }}
          />
        </IconButton>
      </div>
    ) : null;
  }

  useEffect(() => {
    if (selectedNetwork) {
      handlePanel('dte', selectedNetwork);
      dispatch(updateNetworkDetailsLoader(null));
    }
  }, [selectedNetwork]);

  const updateTable = async () => {
    const root: TListItem[] = [];
    let currId = 0;
    results.map((network: TNetwork, idx: number) => {
      currId++;
      root.push({
        id: currId,
        objId: network?.id ?? 0,
        name: network?.system ?? '',
        parent_id: 0,
        selected: null,
        value1: '',
        value2: '',
        value3: '',
        level: level.network,
        count: 1,
        networkType: network?.platforms[0]?.type === 1 ? 'dte' : 'relay'
      });
      let networkId = currId;
      network.platforms.map((platform: TPlatform, idx: number) => {
        currId++;
        root.push({
          id: currId,
          objId: platform?.id ?? 0,
          name: platform?.name ?? '',
          parent_id: networkId,
          selected: null,
          value1: platform?.location?.split('(')[0]?.trim() ?? '',
          value2: '',
          value3: '',
          level: level.platform,
          count: platform?.count ?? 0,
          platformType: platform?.type ?? 1
        });
        let platformId = currId;
        platform.services.map((service: TService, idx: number) => {
          currId++;
          return root.push({
            id: currId,
            objId: service?.antennaId ?? 0,
            name:
              service?.antennaName ?? '' + (service.isTx ? ' (Tx)' : ' (Rx)'),
            parent_id: platformId,
            selected: false,
            value1: 'Start Year: ' + platform?.startYear ?? '0',
            value2: 'Ant Size: ' + service?.antennaSize?.toFixed(1) ?? 0 + 'm',
            value3: service.frequencyBandName,
            level: level.service,
            count: 1,
            platformId: platform?.id ?? 0,
            platformName: platform?.name ?? '',
            frequencyBandId: service?.frequencyBandId ?? 0,
            networkType: network?.platforms[0]?.type === 1 ? 'dte' : 'relay',
            networkId: network?.id ?? 0
          });
        });
      });
    });

    setData(root);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      let response = await axios.get(
        `/getNetworkLibrary?email=${localStorage.getItem('email')}`
      );
      let data: TNetwork[] = response.data.sort((a, b) =>
        a.system.localeCompare(b.system)
      );
      let temp: IOptions = initialOptions;
      const root: TListItem[] = [];
      let currId = 0;
      data.map((network: TNetwork, idx: number) => {
        currId++;
        root.push({
          id: currId,
          objId: network?.id,
          name: network?.system,
          parent_id: 0,
          selected: null,
          value1: '',
          value2: '',
          value3: '',
          level: level.network,
          count: 1,
          networkType: network?.platforms[0]?.type === 1 ? 'dte' : 'relay'
        });
        let networkId = currId;
        network.platforms.map((platform: TPlatform, idx: number) => {
          currId++;
          root.push({
            id: currId,
            objId: platform?.id,
            name: platform?.name,
            parent_id: networkId,
            selected: null,
            value1: platform?.location?.split('(')[0]?.trim(),
            value2: '',
            value3: '',
            level: level.platform,
            count: platform?.count,
            platformType: platform?.type
          });
          let platformId = currId;
          platform.services.map((service: TService, idx: number) => {
            currId++;
            return root.push({
              id: currId,
              objId: service?.antennaId,
              name: service?.antennaName + (service.isTx ? ' (Tx)' : ' (Rx)'),
              parent_id: platformId,
              selected: false,
              value1: 'Start Year: ' + platform?.startYear,
              value2: 'Ant Size: ' + service?.antennaSize?.toFixed(1) + 'm',
              value3: service?.frequencyBandName,
              level: level.service,
              count: 1,
              platformId: platform?.id ?? 0,
              platformName: platform?.name,
              frequencyBandId: service?.frequencyBandId,
              networkType: network?.platforms[0]?.type === 1 ? 'dte' : 'relay',
              networkId: network?.id
            });
          });
        });
      });

      setData(root);

      setSource(data);
      setResults(data);
      setLoading(false);
    } catch {
      setData([]);

      setSource([]);
      setResults([]);
      setLoading(false);
    }
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

  useEffect(() => {
    results && updateAvailibleSelections(results);
    results && updateTable();
  }, [results]);

  const updateAvailibleSelections = (networkData: any[]) => {
    let data = {
      frequencyBands: [],
      polarization: [],
      modulation: [],
      coding: []
    };
    networkData.forEach((network) => {
      network.platforms.forEach((platform) => {
        platform.services.forEach((service) => {
          if (service.codingType) {
            codingAttrValues.forEach((coding) => {
              if (service.codingType.includes(coding.name)) {
                if (!data.coding.includes(coding.id)) {
                  data.coding.push(coding.id);
                }
              }
            });
          } else if (service.channelCodingType) {
            codingAttrValues.forEach((coding) => {
              if (service.channelCodingType.includes(coding.name)) {
                if (!data.coding.includes(coding.id)) {
                  data.coding.push(coding.id);
                }
              }
            });
          }
          modulationOptions.forEach((modulation) => {
            if (service.modulationType.includes(modulation.name)) {
              if (!data.modulation.includes(modulation.id)) {
                data.modulation.push(modulation.id);
              }
            }
          });
          freqBandOptions.forEach((band) => {
            if (service.frequencyBandName.includes(band.name)) {
              if (!data.frequencyBands.includes(band.id)) {
                data.frequencyBands.push(band.id);
              }
            }
          });
          if (service.polarization) {
            polarizationOptions.forEach((polarization) => {
              if (service.polarization.includes(polarization.name)) {
                if (!data.polarization.includes(polarization.id)) {
                  data.polarization.push(polarization.id);
                }
              }
            });
          }
        });
      });
    });
    dispatch(updateNetworkList(data));
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

  // Returns all ground stations associated with a particular DTE network.
  const fetchStations = async (networkId: number) => {
    const params = { networkId };
    const response = await axios.post<Station[]>('/getGroundStations', params);
    return response.data ?? [];
  };

  useEffect(() => {
    fetchData();
  }, []);

  // useEffect(() => {
  //   let selected: string[] = [];
  //   checked.forEach((selection) => {
  //     let currVal: System[] = results.filter(
  //       (entry: System) => entry.id === selection && entry.type === 'dte'
  //     );
  //     if (currVal.length > 0) {
  //       selected = selected.concat(currVal[0].system);
  //     }
  //   });
  //   setSelectedDTEs(selected);
  // }, [checked]);

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
                  networkType: 'dte'
                  // antennaId: 0, // Only relevant for ground stations
                  // frequencyBandId: 0 // Only relevant for ground stations
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

  const handleContext = async (value: TListItem) => {
    if (value.selected) {
      //currently selected, so let's deselect it

      onState('isDataLoaded', false);

      const newSelectedItems = state.selectedItems.filter(
        (item) => item.serviceId !== value.id
      );

      // If the item being deleted is the currently selected item,
      // select another one, or indicate that no item is currently
      // selected.
      if (value.id === state.radioButtonSelectionId) {
        if (newSelectedItems.length > 0) {
          onState('radioButtonSelectionId', newSelectedItems[0].serviceId);
        } else {
          onState('radioButtonSelectionId', 0);
        }
      }

      // Clear results returned from last API call.
      dispatch(updateResults());

      onState('selectedItems', newSelectedItems);
      onState('isLastSave', false);
      onState('isMarkedForComparison', false);
      onState('isLastAnalysis', false);
      onState('isDataLoaded', false);

      setData(
        data.map((item) =>
          item.id === value.id ? { ...item, selected: !item.selected } : item
        )
      );

      return;
    }

    // Do not allow combinations of relays and DTEs in the selection list.
    if (state.networkType === 'relay') {
      setAlertMessage({
        title: `Invalid Selection`,
        message: 'You cannot combine DTEs and relay networks at this time.'
      });
      setIsAlertOpen(true);
      return;
    }

    // Do not allow a station to be selected if it is already in the
    // selection list.
    // if (state.selectedItems.find(item => item.id === value.platformId)) {
    //   setAlertMessage({
    //     title: `Invalid Selection`,
    //     message: 'This station is already selected.'
    //   });
    //   setIsAlertOpen(true);
    //   return;
    // }

    // Do not allow a station to be selected if the mission type is terrestrial.
    if (!state.parameters.isOrbital) {
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
    if (state.parameters.altitude > 1000) {
      setAlertMessage({
        title: `Warning`,
        message: `Currently, modeled data points for ground stations only extend up to 1000 km. For accurate results, decrease the altitude of your satellite, or download our STK models for these ground stations, and run an analysis for your user.`
      });
      setIsAlertOpen(true);
      // Do not return! This is a valid selection, we just want to warn the user.
    }

    // Set the max altitude to 1000 km. Modeled data points currently
    // only extend up to 1000 km, and attempting predictions beyond
    // this point may lead to inaccurate results.
    onBounds('altitude', 'max', 1000);

    // Set the network type.
    !state.networkType && onState('networkType', 'dte');

    // Clear results returned from last API call.
    onState('isDataLoaded', false);
    dispatch(updateResults());

    // Set frequency band, antenna, and mod/cod options.
    const response = await axios.get<any>('/getModCodOptions', {
      params: {
        id: value.platformId,
        networkType: 'dte',
        antennaId: value.objId ?? 0, // Only relevant for ground stations
        frequencyBandId: value.frequencyBandId ?? 0 // Only relevant for ground stations
      }
    });
    dispatch(
      updateFrequencyBandOptions(
        value.platformId,
        response.data.frequencyBandOptions
      )
    );
    dispatch(
      updateAntennaOptions(value.platformId, response.data.antennaOptions)
    );
    dispatch(
      updateModCodOptions(value.platformId, response.data.modCodOptions)
    );

    // let finMod = state.commsSpecs.commsPayloadSpecs.modulation;
    // let finCod = state.commsSpecs.commsPayloadSpecs.coding;
    // // let finModName = "Auto-Select";
    // // let finCodName = "Auto-Select";
    // let optimized = false;

    // if(finMod === -1 && finCod === -1) {
    //   //AUTO SELECT
    //   optimized = true;

    // } else {

    //   if(finMod === -1) {
    //     //select mod to first avail
    //     finMod = response.data.modCodOptions.find(e => e.codingId === finCod)?.modulationId ?? 0;
    //   } else if (finCod === -1) {
    //     //select cod to first avail
    //     finCod = response.data.modCodOptions.find(e => e.modulationId===finMod)?.codingId ?? 0;
    //   }

    // }

    let { finMod, finCod, optimized } = getModCodForStation(
      response.data.modCodOptions,
      state.commsSpecs.commsPayloadSpecs.modulation,
      state.commsSpecs.commsPayloadSpecs.coding
    );

    // Update the items in the selection list.

    let finalValue: any = {
      id: value.platformId,
      system: value.platformName,
      antennaId: value.objId,
      antennaName: value.name.split('(')[0].trim(),
      optimizedModCod: false,
      frequencyBandId: value.frequencyBandId,
      serviceId: value.id,
      modulationId:
        state.commsSpecs.commsPayloadSpecs.modulation !== -1
          ? state.commsSpecs.commsPayloadSpecs.modulation
          : null,
      codingId:
        state.commsSpecs.commsPayloadSpecs.coding !== -1
          ? state.commsSpecs.commsPayloadSpecs.coding
          : null
    };

    // if(state.commsSpecs.freqBand !== 0 && response.data.frequencyBandOptions.find(e => e.id === state.commsSpecs.freqBand)) {
    //   finalValue.frequencyBandId = state.commsSpecs.freqBand;
    // } else {
    //   finalValue.frequencyBandId = response.data.frequencyBandOptions[0].id;
    // }
    onState('selectedItems', [...state.selectedItems, finalValue]);

    onState('isLastSave', false);
    onState('isMarkedForComparison', false);
    onState('isLastAnalysis', false);

    setData(
      data.map((item) =>
        item.id === value.id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const handleOpen = (evt?, reason?) => {
    if (reason === 'backdropClick') return;
    {
      if (open) {
        onState('resetMissionFilters', !state.resetMissionFilters);
      }
      setOpen(!open);
    }
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
    onState('resetMissionFilters', !state.resetMissionFilters);
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
        onReload={fetchData}
      />
      <TreeList
        dataSource={data}
        showBorders={true}
        showRowLines={true}
        columnAutoWidth={false}
        wordWrapEnabled={true}
        defaultExpandedRowKeys={expandedKeys}
        defaultSelectedRowKeys={selectedKeys}
        keyExpr="id"
        parentIdExpr="parent_id"
        id="networks"
        showColumnHeaders={false}
        height={
          isCollapsed === 'up'
            ? (window.screen.availHeight / zoom) * 0.8
            : (window.screen.availHeight / zoom) * 0.34
        }
        width={'100%'}
        noDataText={loading ? 'Loading Data...' : 'No Data'}
        onContextMenuPreparing={(e) => {
          let options: any[] = [];
          if (e.row?.level === 0) {
            e.items = options.concat([
              {
                text: `Select all services for ${data[e.row.key - 1].name}`,
                onClick: () => {}
              },
              {
                text: `Add New Network`,
                onClick: () => {
                  addNetwork();
                }
              }
            ]);
          } else if (e.row?.level === 1) {
            e.items = options.concat([
              {
                text: `Select all services for ${data[e.row.key - 1].name}`,
                onClick: () => {}
              }
            ]);
          } else {
            e.items = options.concat([
              {
                text: `Select ${data[e.row.key - 1].name}`,
                onClick: () => {}
              }
            ]);
          }
        }}
      >
        <Selection mode="single" />
        <Column
          dataField="id"
          caption="Assigned"
          cellTemplate="customTemplate"
          width={'30%'}
        >
          <Lookup dataSource={data} displayExpr="name" valueExpr="id" />
        </Column>
        <Column dataField="value1" width={'25%'} />
        <Column dataField="value2" width={'20%'} />
        <Column dataField="value3" width={'20%'} />
        <Column cellRender={infoCell} width={'5%'} />
        <Template name="customTemplate" render={CustomCell} />
      </TreeList>
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
        open={filterPanelOpen}
        filterer={myFilterer}
        filters={filters}
        onOpen={closeFilterPanel}
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
