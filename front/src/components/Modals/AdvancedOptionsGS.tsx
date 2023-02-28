import { FC, useEffect, useState } from 'react';
import DataGrid, {
  Column, Editing, Lookup,
} from 'devextreme-react/data-grid';
import { SearchOption } from 'src/types/details';
import VariedCell from './VariedCell'
import { Filterer } from 'src/utils/filterer';
import { allFilters } from './Filter';
import axios from 'src/utils/axios';
import { Button, Grid, makeStyles } from '@material-ui/core';
import type { Theme } from 'src/theme';
import { THEMES } from 'src/utils/constants/general';
import { State } from 'src/pages/home';

interface AdvancedSearchGSProps {
    source : SearchOption[]
    filterer: Filterer;
    filtererHasBeenChanged: () => void;
    onOpen: () => void;
    onClear: () => void;
    state: State;
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
    '& .dx-datagrid .dx-link' : {
      color: theme.palette.border.main
    },
    '& .dx-editor-cell .dx-texteditor .dx-texteditor-input' : {
      color: theme.palette.text.primary,
    },
    '& .dx-datagrid-content .dx-datagrid-table .dx-row .dx-editor-cell .dx-texteditor, .dx-datagrid-content .dx-datagrid-table .dx-row .dx-editor-cell .dx-texteditor-container': {
      '& .dx-dropdowneditor-icon::before': {
        color: `${theme.palette.border.main}`
      },
    },
  },
}));

const filterTypesUniversal = [{filter: "frequencyBands", filterType: "Frequency Bands"}, {filter: "location", filterType: "Location"}, 
  {filter: "minFrequency", filterType: "Min. Frequency (MHz)"}, {filter: "maxFrequency", filterType: "Max. Frequency (MHz)"}];

  const filterTypesDTE = [{filter: "antennaName", filterType: "Antenna Name"}, {filter: "dataFormat", filterType: "Data Format"}, {filter: "modulationType", filterType: "Modulation Type"}, 
  {filter: "channelCodingType", filterType: "Channel Coding Type"}, {filter: "polarization", filterType: "Polarization"}, 
  {filter: "subcarrierModulationType", filterType: "Sub-Carrier Modulation Type"}, {filter: "EIRP", filterType: "EIRP (dBW)"},  
  {filter: "antennaSize", filterType: "Antenna Size (m)"}, {filter: "GT", filterType: "G/T (dB/k)"}, {filter: "antennaGain", filterType: "Antenna Gain (dB)"}];

//Master list for all of the operator types 
const operatorTypes = [{operator: '=', operatorType: 'Equals (=)'}, {operator: '<', operatorType: 'Less Than (<)'}, {operator: '>', operatorType: 'Greater Than (>)'}, 
  {operator: '<=', operatorType: 'Less Than or Equal to (<=)'}, {operator: '>=', operatorType: 'Greater Than or Equal to (>=)'}, {operator: null, operatorType: 'N/A'} ];

//The list of attributes that need an operator in the third column
const operatorList = ["EIRP", "antennaSize", "GT", "antennaGain", "maxFrequency", "minFrequency"];

//the list of attributes that need a multiselect for searching. 
export const multiSelectList = ["frequencyBands", "location", "antennaName", "dataFormat", "modulationType", "channelCodingType", "polarization", "subcarrierModulationType"];

//the list of all of the lists that are used for the multiselects. Note the the format for the lists must be {id, name} or the multi select will not work
export var attributes = new Map(); 
const AdvancedSearchGS: FC<AdvancedSearchGSProps>  = ({state, source, filterer, filtererHasBeenChanged, onClear, onOpen}) => {

  // const theme = useTheme<Theme>();
  const classes = useStyles();
  const [grid, setGrid] = useState(null);
  const [filterTypes, setFilterTypes] = useState([]);
  var operators = operatorTypes;
  
  useEffect(() => {
    if(filterer.getFilters().has('missionLaunchYearDTE')) filterer.removeFilter('missionLaunchYearDTE');
    if(state.constraints.launchYear && state.constraints.launchYear !== -1){
      filterer.addFilter('missionLaunchYearDTE', allFilters.get('missionLaunchYearDTE')(state.constraints.launchYear));
    }
    filtererHasBeenChanged();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[state.constraints.launchYear]);

  useEffect(() => {
    if(filterer.getFilters().has('missionModulationType')) filterer.removeFilter('missionModulationType');
    if(state.commsSpecs.commsPayloadSpecs.modulation && state.commsSpecs.commsPayloadSpecs.modulation !== -1){
      filterer.addFilter('missionModulationType', allFilters.get('missionModulationType')(attributes.get('modulationType')?.filter((band) => band.id===state.commsSpecs.commsPayloadSpecs.modulation)[0]?.name));
    }
    filtererHasBeenChanged();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[state.commsSpecs.commsPayloadSpecs.modulation]);

  useEffect(() => {
    if(filterer.getFilters().has('missionCodingType')) filterer.removeFilter('missionCodingType');
    if(state.commsSpecs.commsPayloadSpecs.coding && state.commsSpecs.commsPayloadSpecs.coding !== 0){
      filterer.addFilter('missionCodingType', allFilters.get('missionCodingType')(attributes.get('channelCodingType')?.filter((band) => band.id===state.commsSpecs.commsPayloadSpecs.coding)[0]?.name));
    }
    filtererHasBeenChanged();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[state.commsSpecs.commsPayloadSpecs.coding]);

  useEffect(() => {
    if(filterer.getFilters().has('missionPolarization')) filterer.removeFilter('missionPolarization');
    if(state.commsSpecs.commsPayloadSpecs.polarizationType && state.commsSpecs.commsPayloadSpecs.polarizationType !== -1){
      filterer.addFilter('missionPolarization', allFilters.get('missionPolarization')(attributes.get('polarization')?.filter((band) => band.id===state.commsSpecs.commsPayloadSpecs.polarizationType)[0]?.name));
    }
    filtererHasBeenChanged();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[state.commsSpecs.commsPayloadSpecs.polarizationType]);

  useEffect(() => {
    if(filterer.getFilters().has('missionFreqBand')) filterer.removeFilter('missionFreqBand');
    if(state.commsSpecs.freqBand && state.commsSpecs.freqBand !== -1){
      filterer.addFilter('missionFreqBand', allFilters.get('missionFreqBand')(attributes.get('frequencyBands')?.filter((band) => band.id===state.commsSpecs.freqBand)[0]?.name));
    }
    filtererHasBeenChanged();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[state.commsSpecs.freqBand]);

  useEffect(() => {
    if(filterer.getFilters().has('standardsCompliance')) filterer.removeFilter('standardsCompliance');
    if(state.commsSpecs.standardsCompliance != null && state.commsSpecs.standardsCompliance !== 0){
      filterer.addFilter('standardsCompliance', allFilters.get('standardsCompliance')(state.commsSpecs.standardsCompliance));
    }
    filtererHasBeenChanged();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[state.commsSpecs.standardsCompliance]);
  
  // useEffect(() => {
  //   console.log('Center Frequency changed: ', state.constraints.centerFreqFilter);
  // },[state.constraints.centerFreqFilter]);

  useEffect(() => {
    //Fetches all of the options for the editing multiselects (we do it in this level to prevent the api calls being needed every time an edit is made)
    const fetchFrequencyBandData = async () => {
      const response = await axios.get<AttrValue[]>('/getAttributeValues', {
        params: { sub_key: 'frequency_bands ' }
      });
      response.data && setAttributes(response.data, 'frequencyBands');
    };
    //this one is hard coded
    const fetchLocationData = async () => {
       const response = [{id: "Global", name: "Global"}, {id: "North America", name: "North America"}, {id: "South America", name: "South America"},
      {id: "Pacific", name: "Pacific"}, {id: "Antarctica", name: "Antarctica"}, {id: "Southeast Asia", name: "Southeast Asia"}, {id: "Europe", name: "Europe"},
      {id: "Africa", name: "Africa"}, {id: "Central America", name: "Central America"}, {id: "Middle East", name: "Middle East"}, {id: "Oceania", name: "Oceania"},
      {id: "Australia", name: "Australia"},{id: "Pacific", name: "Pacific"}, {id: "Arctic", name: "Arctic"}]
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
},[]);

  const setAttributes = (value, index) => {
    attributes.set(index, value);
  }

  useEffect(() => {
    let newFilterTypes = [];
    newFilterTypes = filterTypesUniversal;
    newFilterTypes = newFilterTypes.concat(filterTypesDTE);
    setFilterTypes(newFilterTypes);
  },[]);

  const onFilterTypeChanged = (rowData, value, oldRow) => {
    rowData.value = null;
    rowData.filterName = value;

    if(operatorList.includes(rowData.filterName)){
      rowData.operator = "="
    } else {
      rowData.operator = null
    }
    //Previous name
    // oldRow.filterName;
    //previous value
    // oldRow.value;
    
  }


  const onFilterUpdate = (event) => {
    if(event == null){
      return;
    }
    if(event.type === "remove"){
      let oldFilterName = event.key.filterName;
      oldFilterName = oldFilterName && event.key.operator? oldFilterName + event.key.operator: oldFilterName;
      if(filterer.getFilters().has(oldFilterName)) {
        filterer.removeFilter(oldFilterName);
        filtererHasBeenChanged();
      }
      return;
    }
    //most of this mess is here to account for the operator
    let oldFilterName = event.key.filterName;
    oldFilterName = oldFilterName && event.key.operator? oldFilterName + event.key.operator: oldFilterName;
    let newFilterName = event.data.filterName? event.data.filterName: event.key.filterName;
    newFilterName = newFilterName && event.data.operator? newFilterName + event.data.operator: newFilterName;
    newFilterName = newFilterName && operatorList.includes(newFilterName) && !event.data.operator && event.key.operator? newFilterName + event.key.operator: newFilterName;
    let newValue = event.data.value? event.data.value: event.key.value;
    if(filterer.getFilters().has(oldFilterName)) {
      filterer.removeFilter(oldFilterName);
    }
    if(newFilterName){
      const newFilter = (allFilters.get(newFilterName))(newValue);
      filterer.addFilter(newFilterName, newFilter);
      filtererHasBeenChanged();
    }
    
    
  };

  const getOperatorsSource = (options) => {
    if(!options.data){
      return operators;
    }
    if(operatorList.includes(options.data.filterName)){
      operators = [{operator: '=', operatorType: 'Equals (=)'}, {operator: '<', operatorType: 'Less Than (<)'}, {operator: '>', operatorType: 'Greater Than (>)'}, 
          {operator: '<=', operatorType: 'Less Than or Equal to (<=)'}, {operator: '>=', operatorType: 'Greater Than or Equal to (>=)'}]
    } else {
      operators = [{operator: null, operatorType: 'N/A'}];
    }
    return operators;
  }

  const getAvailiblefilterTypes = (options) => {
    if(!options.data){
      return filterTypes;
    }
    let filteredFilterTypes = []
    let getFilteredFilter = false
    filterTypes.forEach(filter => {
      source.forEach(entry => {
        if(entry.filterName === filter.filter && entry.filterName !== options.data.filterName){
          getFilteredFilter = true;
        }
      })
      if(!getFilteredFilter){
        filteredFilterTypes.push(filter)
      }
      getFilteredFilter = false;
    })
    return filteredFilterTypes;
  }
  //I just want this code to compile, we are gonna delete this file soon anyways
 const onState = (name, value) => {
  return("oops");
 }
 const [dropdownVal, setDropdownVal] = useState<number>(7);

    return (
<Grid container justifyContent="flex-start" alignItems="center" spacing = {1}>
  <Grid item xs = {12}>
        <DataGrid
          id="grid"
          className= {classes.table}
          dataSource={source}
          ref={(ref) => { setGrid(ref); }}
          showBorders={true}
          onSaving = {(e) => {
            onFilterUpdate(e.changes[0]);
          }}
          
          activeStateEnabled = {true}>
            <Editing mode="row" allowDeleting = {true} allowUpdating = {true}>
            </Editing>
          <Column dataField = "filterName" caption = "Filter Name" setCellValue = {onFilterTypeChanged}> 
            <Lookup dataSource = {getAvailiblefilterTypes} valueExpr = "filter" displayExpr = "filterType"/>
          </Column>
          <Column dataField = "operator" caption = "Operator">
          <Lookup dataSource = {getOperatorsSource} valueExpr = "operator" displayExpr = "operatorType"/>
          </Column>
          <Column 
          dataField="value" 
          caption = "Value" 
          editCellComponent={(event) => VariedCell({event, attributes, state, onState, dropdownVal, setDropdownVal})}>
          </Column> 
        </DataGrid>
        </Grid>
        <Grid item xs = {2}>
        <Button
              autoFocus
              variant="contained"
              color="primary"
              style={{marginTop: '20px'}}
              onClick={(e) => grid.instance.addRow()}
            >
              + Add Filter
        </Button>
        </Grid>
        <Grid item xs = {7}></Grid>
        <Grid item xs = {2}>
        <Button
          autoFocus
          style={{marginTop: '20px', marginLeft: "30px", marginRight: "0"}}
          variant="outlined"
          color="primary"
          onClick={onClear}
        >
          Reset Filters
        </Button>
        </Grid>
        <Grid item xs = {1}>
        <Button 
          style={{marginTop: '20px', marginLeft: "5px"}}
          variant="contained" 
          color="primary" 
          onClick={onOpen}>
             Close
        </Button>
        </Grid>
      </Grid>
    );
  }

export default AdvancedSearchGS;

          // useEffect(() => {
  //   if(filterer.getFilters().has('missionLaunchYear')) filterer.removeFilter('missionLaunchYear');
  //   if(state.constraints.launchYear && state.constraints.launchYear !== -1){
  //     filterer.addFilter('missionLaunchYear', allFilters.get('missionLaunchYear')(state.constraints.launchYear));
  //   }
  //   filtererHasBeenChanged();
  // },[state.constraints.launchYear]);

  // useEffect(() => {
  //   if(filterer.getFilters().has('missionModulationType')) filterer.removeFilter('missionModulationType');
  //   if(state.constraints.modulationFilter && state.constraints.modulationFilter !== -1){
  //     filterer.addFilter('missionModulationType', allFilters.get('missionModulationType')(attributes.get('modulationType')?.filter((band) => band.id===state.constraints.modulationFilter)[0].name));
  //   }
  //   filtererHasBeenChanged();
  // },[state.constraints.modulationFilter]);

  // useEffect(() => {
  //   if(filterer.getFilters().has('missionCodingType')) filterer.removeFilter('missionCodingType');
  //   if(state.constraints.codingFilter && state.constraints.codingFilter !== -1){
  //     filterer.addFilter('missionCodingType', allFilters.get('missionCodingType')(attributes.get('channelCodingType')?.filter((band) => band.id===state.constraints.codingFilter)[0].name));
  //   }
  //   filtererHasBeenChanged();
  // },[state.constraints.codingFilter]);

  // useEffect(() => {
  //   if(filterer.getFilters().has('missionPolarization')) filterer.removeFilter('missionPolarization');
  //   if(state.constraints.polarizationType && state.constraints.polarizationType !== -1){
  //     filterer.addFilter('missionPolarization', allFilters.get('missionPolarization')(attributes.get('polarization')?.filter((band) => band.id===state.constraints.polarizationType)[0].name));
  //   }
  //   filtererHasBeenChanged();
  // },[state.constraints.polarizationType]);

  // useEffect(() => {
  //   if(filterer.getFilters().has('missionFreqBand')) filterer.removeFilter('missionFreqBand');
  //   if(state.constraints.freqBandFilter && state.constraints.freqBandFilter !== -1){
  //     filterer.addFilter('missionFreqBand', allFilters.get('missionFreqBand')(attributes.get('frequencyBands')?.filter((band) => band.id===state.constraints.freqBandFilter)[0].name));
  //   }
  //   filtererHasBeenChanged();
  // },[state.constraints.freqBandFilter]);
  