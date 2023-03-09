import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import DataGrid, {
  Column, Editing, Lookup,
} from 'devextreme-react/data-grid';
import { SearchOption } from 'src/types/details';
import VariedCell from './VariedCell'
import { Filterer } from 'src/utils/filterer';
import { allFilters } from './Filter';
import axios from 'src/utils/axios';
import { Button, Grid, makeStyles } from '@material-ui/core';
import { NetworkFilters } from 'src/types/preference';
import type { Theme } from 'src/theme';
import { THEMES } from 'src/utils/constants/general';
import { State } from 'src/pages/home';

interface AdvancedSearchProps {
  source: SearchOption[];
  filterer: Filterer;
  filters: NetworkFilters;
  filtererHasBeenChanged: () => void;
  setSource: Dispatch<SetStateAction<SearchOption[]>>
  onOpen: () => void;
  onClear: () => void;
  state: State;
  onState: (name: string, value: any) => void;
}

interface AttrValue {
  id: number;
  name: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  table: {
    userSelect: 'none',
    MozUserSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none',
    '& .dx-datagrid': {
      backgroundColor: theme.name === THEMES.DARK ? theme.palette.background.dark : ``,
      color: theme.palette.text.primary,
      borderRadius: '25px',
    },
    '& .dx-datagrid-rowsview .dx-row': {
      borderTop: theme.name === THEMES.DARK ? `1px double ${theme.palette.border.main}` : ``,
      borderBottom: theme.name === THEMES.DARK ? `1px double ${theme.palette.border.main}` : ``
    },
    '& .dx-datagrid-headers .dx-header-row': {
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
      borderBottom: theme.name === THEMES.DARK ? `1px double ${theme.palette.border.main}` : ``
    },
    '& .dx-datagrid-headers .dx-datagrid-table .dx-row>td .dx-sort-indicator': {
      color: theme.palette.text.primary,
      borderBottom: theme.name === THEMES.DARK ? `1px double ${theme.palette.border.main}` : ``
    },
    '& .dx-datagrid-headers .dx-datagrid-table .dx-row>td .dx-sort': {
      color: theme.palette.text.primary,
      borderBottom: theme.name === THEMES.DARK ? `1px double ${theme.palette.border.main}` : ``
    },
    '& .dx-datagrid .dx-link': {
      color: theme.palette.border.main
    },
    '& .dx-editor-cell .dx-texteditor .dx-texteditor-input': {
      color: theme.palette.text.primary,
    },
    '& .dx-datagrid-content .dx-datagrid-table .dx-row .dx-editor-cell .dx-texteditor, .dx-datagrid-content .dx-datagrid-table .dx-row .dx-editor-cell .dx-texteditor-container': {
      '& .dx-dropdowneditor-icon::before': {
        color: `${theme.palette.border.main}`
      },
    },
  },

}));

export const filterTypesUniversal = [{ filter: "missionFreqBand", filterType: "Frequency Band" }, { filter: "location", filterType: "Location" },
{ filter: "minFrequency", filterType: "Min. Frequency (MHz)" }, { filter: "maxFrequency", filterType: "Max. Frequency (MHz)" }, { filter: "antennaName", filterType: "Antenna Name" },
{ filter: "dataFormat", filterType: "Data Format" }, { filter: "missionModulationType", filterType: "Modulation Type" },
{ filter: "channelCodingType", filterType: "Channel Coding Type" }, { filter: "missionPolarization", filterType: "Polarization" },
{ filter: "subcarrierModulationType", filterType: "Sub-Carrier Modulation Type" }, { filter: "EIRP", filterType: "EIRP (dBW)" },
{ filter: "antennaSize", filterType: "Antenna Size (m)" }, { filter: "GT", filterType: "G/T (dB/k)" }, { filter: "antennaGain", filterType: "Antenna Gain (dB)" },
{ filter: "standardsCompliance", filterType: "Standards Compliance" }, { filter: "dataRate", filterType: "Data Rate" }
];

const operatorTypes = [{ operator: '=', operatorType: 'Equals (=)' }, { operator: '<', operatorType: 'Less Than (<)' }, { operator: '>', operatorType: 'Greater Than (>)' },
{ operator: '<=', operatorType: 'Less Than or Equal to (<=)' }, { operator: '>=', operatorType: 'Greater Than or Equal to (>=)' }, { operator: null, operatorType: 'N/A' }];

//The list of attributes that need an operator in the second column
const operatorList = ["sglGT", "sglEIRP", "sslGT", "sslEIRP", "EIRP", "antennaSize", "GT", "antennaGain", "minFrequency", "maxFrequency"];

//the list of attributes that need a multiselect for searching. 
export const multiSelectList = ["frequencyBands", "location", "relayType", "antennaName", "dataFormat", "modulationType", "polarization", "subcarrierModulationType"];

//the list of attributes that need a dropdown for searching
export const dropdownList = ["missionFreqBand", "missionModulationType", "missionPolarization", "channelCodingType"]
//the list of all of the lists that are used for the multiselects. Note the the format for the lists must be {id, name} or the multi select will not work
export var attributes = new Map();
const AdvancedSearch: FC<AdvancedSearchProps> = ({ state, source, filters, filterer, filtererHasBeenChanged, setSource, onOpen, onClear, onState }) => {
  // const theme = useTheme<Theme>();
  const classes = useStyles();
  const [grid, setGrid] = useState(null);
  const [filterTypes, setFilterTypes] = useState([]);
  const [dropdownVal, setDropdownVal] = useState<number>(-1);
  var operators = operatorTypes;

  useEffect(() => {
    if (filterer.getFilters().has('operationalYear')) filterer.removeFilter('operationalYear');
    if (filterer.getFilters().has('missionLaunchYear')) filterer.removeFilter('missionLaunchYear');
    if (state.constraints.launchYear && state.constraints.launchYear !== -1) {
      filterer.addFilter('missionLaunchYear', allFilters.get('missionLaunchYear')(state.constraints.launchYear));
    }
    filtererHasBeenChanged();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.constraints.launchYear]);

  useEffect(() => {
    if (filterer.getFilters().has('missionModulationType')) filterer.removeFilter('missionModulationType');
    if (state.commsSpecs.commsPayloadSpecs.modulation && state.commsSpecs.commsPayloadSpecs.modulation !== -1) {
      filterer.addFilter('missionModulationType', allFilters.get('missionModulationType')(attributes.get('modulationType')?.filter((band) => band.id === state.commsSpecs.commsPayloadSpecs.modulation)[0]?.name));
    }
    filtererHasBeenChanged();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.commsSpecs.commsPayloadSpecs.modulation]);

  //legacy name - this is code rate
  useEffect(() => {
    if (filterer.getFilters().has('channelCodingType')) filterer.removeFilter('channelCodingType');
    if (state.commsSpecs.commsPayloadSpecs.coding && state.commsSpecs.commsPayloadSpecs.coding !== -1) {
      filterer.addFilter('channelCodingType', allFilters.get('channelCodingType')(attributes.get('channelCodingType')?.filter((band) => band.id === state.commsSpecs.commsPayloadSpecs.coding)[0]?.name));
    }
    filtererHasBeenChanged();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.commsSpecs.commsPayloadSpecs.coding]);

  //This is Coding Type
  // useEffect(() => {
  //   if(filterer.getFilters().has('codingType')) filterer.removeFilter('codingType');
  //   if(state.commsSpecs.commsPayloadSpecs.codingType && state.commsSpecs.commsPayloadSpecs.codingType !== -1){
  //     filterer.addFilter('codingType', allFilters.get('codingType')(attributes.get('codingType')?.filter((band) => band.id==state.commsSpecs.commsPayloadSpecs.codingType)[0]?.name));
  //   }
  //   filtererHasBeenChanged();
  // },[state.commsSpecs.commsPayloadSpecs.codingType]);

  useEffect(() => {
    if (filterer.getFilters().has('missionPolarization')) filterer.removeFilter('missionPolarization');
    if (state.commsSpecs.commsPayloadSpecs.polarizationType && state.commsSpecs.commsPayloadSpecs.polarizationType !== -1) {
      filterer.addFilter('missionPolarization', allFilters.get('missionPolarization')(attributes.get('polarization')?.filter((band) => band.id === state.commsSpecs.commsPayloadSpecs.polarizationType)[0]?.name));
    }
    filtererHasBeenChanged();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.commsSpecs.commsPayloadSpecs.polarizationType]);

  useEffect(() => {
    if (filterer.getFilters().has('missionFreqBand')) filterer.removeFilter('missionFreqBand');
    if (state.commsSpecs.freqBand && state.commsSpecs.freqBand !== -1) {
      filterer.addFilter('missionFreqBand', allFilters.get('missionFreqBand')(attributes.get('frequencyBands')?.filter((band) => band.id === state.commsSpecs.freqBand)[0]?.name));
    }
    filtererHasBeenChanged();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.commsSpecs.freqBand]);

  useEffect(() => {
    if (filterer.getFilters().has('standardsCompliance')) filterer.removeFilter('standardsCompliance');
    if (state.commsSpecs.standardsCompliance != null && state.commsSpecs.standardsCompliance !== 0) {
      filterer.addFilter('standardsCompliance', allFilters.get('standardsCompliance')(state.commsSpecs.standardsCompliance));
    }
    filtererHasBeenChanged();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.commsSpecs.standardsCompliance]);

  useEffect(() => {
    if (filterer.getFilters().has('dataRate')) filterer.removeFilter('dataRate');
    if (state.commsSpecs.dataRateKbps != null && state.commsSpecs.dataRateKbps !== 0) {
      filterer.addFilter('dataRate', allFilters.get('dataRate')(state.commsSpecs.dataRateKbps));
    }
    filtererHasBeenChanged();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.commsSpecs.dataRateKbps]);

  // useEffect(() => {
  //   console.log('Center Frequency changed: ', state.constraints.centerFreqFilter);
  // },[state.constraints.centerFreqFilter]);

  useEffect(() => {
    filtererHasBeenChanged();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attributes]);

  //Fetches all of the options for the editing multiselects (we do it in this level to prevent the api calls being needed every time an edit is made)
  useEffect(() => {
    const fetchFrequencyBandData = async () => {
      const response = await axios.get<AttrValue[]>('/getAttributeValues', {
        params: { sub_key: 'frequency_bands ' }
      });
      response.data && setAttributes(response.data, 'frequencyBands');
      response.data && setAttributes(response.data, 'missionFreqBand');
    };
    //this one is hard coded
    const fetchLocationData = async () => {
      const response = [{ id: "Global", name: "Global" }, { id: "North America", name: "North America" }, { id: "South America", name: "South America" },
      { id: "Pacific", name: "Pacific" }, { id: "Antarctica", name: "Antarctica" }, { id: "Southeast Asia", name: "Southeast Asia" }, { id: "Europe", name: "Europe" },
      { id: "Africa", name: "Africa" }, { id: "Central America", name: "Central America" }, { id: "Middle East", name: "Middle East" }, { id: "Oceania", name: "Oceania" },
      { id: "Australia", name: "Australia" }, { id: "Pacific", name: "Pacific" }, { id: "Arctic", name: "Arctic" }]
      setAttributes(response, 'location');
    };
    const fetchRelayTypeData = async () => {
      const response = await axios.get<AttrValue[]>('/getAttributeValues', {
        params: { sub_key: 'relay_type ' }
      });
      response.data && setAttributes(response.data, 'relayType');

    };
    const fetchAntennaNameData = async () => {
      const response = await axios.get<AttrValue[]>('/getAttributeValues', {
        params: { sub_key: 'antenna_name ' }
      });
      response.data && setAttributes(response.data, 'antennaName');
    };
    const fetchDataFormatData = async () => {
      const response = await axios.get<AttrValue[]>('/getAttributeValues', {
        params: { sub_key: 'data_format ' }
      });
      response.data && setAttributes(response.data, 'dataFormat');
    };
    const fetchModulationTypeData = async () => {
      const response = await axios.get<AttrValue[]>('/getAttributeValues', {
        params: { sub_key: 'antenna_modulation ' }
      });
      response.data && setAttributes(response.data, 'modulationType');
      response.data && setAttributes(response.data, 'missionModulationType');
    };
    const fetchChannelCodingTypeData = async () => {
      const response = await axios.get<AttrValue[]>('/getAttributeValues', {
        params: { sub_key: 'channel_coding ' }
      });
      response.data && setAttributes(response.data, 'channelCodingType');
    };
    const fetchPolarizationData = async () => {
      const response = await axios.get<AttrValue[]>('/getAttributeValues', {
        params: { sub_key: 'antenna_polarization ' }
      });
      response.data && setAttributes(response.data, 'polarization');
      response.data && setAttributes(response.data, 'missionPolarization');
    };
    const fetchsubCarrierModulationTypeData = async () => {
      const response = await axios.get<AttrValue[]>('/getAttributeValues', {
        params: { sub_key: 'subcarrier_modulation ' }
      });
      response.data && setAttributes(response.data, 'subcarrierModulationType');
    };
    fetchFrequencyBandData();
    fetchLocationData();
    fetchRelayTypeData();
    fetchAntennaNameData();
    fetchDataFormatData();
    fetchModulationTypeData();
    fetchChannelCodingTypeData();
    fetchPolarizationData();
    fetchsubCarrierModulationTypeData();
  }, []);

  const setAttributes = (value, index) => {
    attributes.set(index, value);
  }

  //changes the filters availible for selection based on what type (All, Relay, DTE) is selected
  useEffect(() => {
    let newFilterTypes = [];

    newFilterTypes = filterTypesUniversal;
    setFilterTypes(newFilterTypes);
    let newSource = [];
    let removeFilter = true;
    source.forEach(filter => {
      newFilterTypes.forEach(availibleType => {
        if (availibleType.filter === filter.filterName) {
          newSource.push(filter);
          removeFilter = false;
        }
      })
      if (removeFilter) {
        let filterToRemove = filter.operator ? filter.filterName + filter.operator : filter.filterName
        filterer.removeFilter(filterToRemove);
        filtererHasBeenChanged();
      }
      removeFilter = true;
    })
    setSource(newSource);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.type]);

  //resets the other values when the filter type is changed
  const onFilterTypeChanged = (rowData, value, oldRow) => {
    rowData.value = null;
    rowData.filterName = value;

    if (operatorList.includes(rowData.filterName)) {
      rowData.operator = "="
    } else {
      rowData.operator = null
    }
    //Previous name
    // oldRow.filterName;
    //previous value
    // oldRow.value;

  }

  //When the filter's value is changed, update the actual filter doing the filtering
  const onFilterUpdate = (event) => {
    if (event == null) {
      return;
    }
    if (event.type === "remove") {
      let oldFilterName = event.key.filterName;
      oldFilterName = oldFilterName && event.key.operator ? oldFilterName + event.key.operator : oldFilterName;
      if (filterer.getFilters().has(oldFilterName)) {
        filterer.removeFilter(oldFilterName);
        filtererHasBeenChanged();
        if (oldFilterName === "missionFreqBand") {
          onState('commsSpecs', { ...state.commsSpecs, freqBand: 0 });
        }
        if (oldFilterName === "missionPolarization") {
          onState('commsSpecs', { ...state.commsSpecs, commsPayloadSpecs: { ...state.commsSpecs.commsPayloadSpecs, polarizationType: -1 } });
        }
        if (oldFilterName === "channelCodingType") {
          onState('commsSpecs', { ...state.commsSpecs, commsPayloadSpecs: { ...state.commsSpecs.commsPayloadSpecs, coding: -1 } });
        }
        if (oldFilterName === "missionModulationType") {
          onState('commsSpecs', { ...state.commsSpecs, commsPayloadSpecs: { ...state.commsSpecs.commsPayloadSpecs, modulation: -1 } });
        }
      }
      return;
    }
    //most of this mess is here to account for the operator
    let oldFilterName = event.key.filterName;
    oldFilterName = oldFilterName && event.key.operator ? oldFilterName + event.key.operator : oldFilterName;
    let newFilterName = event.data.filterName ? event.data.filterName : event.key.filterName;
    newFilterName = newFilterName && event.data.operator ? newFilterName + event.data.operator : newFilterName;
    newFilterName = newFilterName && operatorList.includes(newFilterName) && !event.data.operator && event.key.operator ? newFilterName + event.key.operator : newFilterName;
    let newValue = event.data.value ? event.data.value : event.key.value;
    if (filterer.getFilters().has(oldFilterName)) {
      filterer.removeFilter(oldFilterName);
    }
    if (newFilterName) {
      const newFilter = (allFilters.get(newFilterName))(newValue);
      filterer.addFilter(newFilterName, newFilter);
      filtererHasBeenChanged();
      if (newFilterName === "missionFreqBand") {
        onState('commsSpecs', { ...state.commsSpecs, freqBand: dropdownVal !== -1 ? dropdownVal : 0 });
      }
      if (newFilterName === "missionPolarization") {
        onState('commsSpecs', { ...state.commsSpecs, commsPayloadSpecs: { ...state.commsSpecs.commsPayloadSpecs, polarizationType: dropdownVal } });
      }
      if (newFilterName === "channelCodingType") {
        onState('commsSpecs', { ...state.commsSpecs, commsPayloadSpecs: { ...state.commsSpecs.commsPayloadSpecs, coding: dropdownVal } });
      }
      if (newFilterName === "missionModulationType") {
        onState('commsSpecs', { ...state.commsSpecs, commsPayloadSpecs: { ...state.commsSpecs.commsPayloadSpecs, modulation: dropdownVal } });
      }
    }

  };

  //Handles the code for the operators, whether it needs them or not is determined by the operatorList constant declared at the top of the file
  const getOperatorsSource = (options) => {
    if (!options.data) {
      return operators;
    }
    if (operatorList.includes(options.data.filterName)) {
      operators = [{ operator: '=', operatorType: 'Equals (=)' }, { operator: '<', operatorType: 'Less Than (<)' }, { operator: '>', operatorType: 'Greater Than (>)' },
      { operator: '<=', operatorType: 'Less Than or Equal to (<=)' }, { operator: '>=', operatorType: 'Greater Than or Equal to (>=)' }]
    }
    else {
      operators = [{ operator: null, operatorType: 'N/A' }];
    }
    return operators;
  }

  //This bit of code makes it so that the options for selecting filters shrink down as more filters are selected
  //This is acheived by changing the source for each row depending on what filters have been selected and what filter the row has
  const getAvailiblefilterTypes = (options) => {
    if (!options.data) {
      return filterTypes;
    }
    let filteredFilterTypes = []
    let getFilteredFilter = false
    let filtertypes = filterTypes
    if (filters.type === 'none') {
      filtertypes = filterTypesUniversal
    }
    filtertypes.forEach(filter => {
      source.forEach(entry => {
        if (entry.filterName === filter.filter && entry.filterName !== options.key.filterName) {
          getFilteredFilter = true;
        }
      })
      if (!getFilteredFilter) {
        filteredFilterTypes.push(filter)
      }
      getFilteredFilter = false;
    })
    return filteredFilterTypes;
  }
  return (
    <Grid container justifyContent="flex-start" alignItems="center" spacing={1} >
      <Grid item xs={12}>
        <DataGrid
          id="grid"
          className={classes.table}
          dataSource={source}
          style={{ maxHeight: "25vh", border: '0px' }}
          ref={(ref) => { setGrid(ref); }}
          showBorders={true}
          onSaving={(e) => {
            onFilterUpdate(e.changes[0]);
          }}

          activeStateEnabled={true}>
          <Editing
            mode="row"
            allowDeleting={true}
            allowUpdating={true}
          >
          </Editing>
          <Column dataField="filterName" caption="Filter Name" setCellValue={onFilterTypeChanged}>
            <Lookup dataSource={getAvailiblefilterTypes} valueExpr="filter" displayExpr="filterType" />
          </Column>
          <Column dataField="operator" caption="Operator">
            <Lookup dataSource={getOperatorsSource} valueExpr="operator" displayExpr="operatorType" />
          </Column>
          <Column
            dataField="value"
            caption="Value"
            editCellComponent={(event) => VariedCell({ event, attributes, state, onState, dropdownVal, setDropdownVal })}>
          </Column>
        </DataGrid>
      </Grid>
      <Grid item xs={2}>
        <Button
          data-filter="addfilter"
          autoFocus
          variant="contained"
          color="primary"
          style={{ marginTop: '20px' }}
          onClick={(e) => grid.instance.addRow()}
        >
          + Add Filter
        </Button>
      </Grid>
      <Grid item xs={7}></Grid>
      <Grid item xs={2}>
        <Button
          autoFocus
          style={{ marginTop: '20px', marginLeft: "30px", marginRight: "0" }}
          variant="outlined"
          color="primary"
          onClick={onClear}
        >
          Reset Filters
        </Button>
      </Grid>
      <Grid item xs={1}>
        <Button
          style={{ marginTop: '20px', marginLeft: "5px" }}
          variant="contained"
          color="primary"
          data-filter-close='true'
          onClick={onOpen}>
          Close
        </Button>
      </Grid>
    </Grid>
  );
}

export default AdvancedSearch;
