/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'src/store';
import {
  updateResults,
  updateFrequencyBandOptions,
  updateAntennaOptions,
  updateModCodOptions
} from 'src/slices/results';
import DataGrid, { Column } from 'devextreme-react/data-grid';
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.material.blue.light.compact.css';
import { makeStyles, useTheme } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import axios from 'src/utils/axios';
import type { Station } from 'src/types/system';
import type { ICollapsed, State } from 'src/pages/home';
import SelectionAlert from './SelectionAlert';
import type { GroundStationFilters, ISave } from 'src/types/preference';
import { StationFilterModal } from 'src/components/Modals';
import { THEMES } from 'src/utils/constants/general';
import type { Theme } from 'src/theme';
import { Filter, Filterer } from 'src/utils/filterer';
import { SearchOption } from 'src/types/details';
import { getModCodForStation } from 'src/utils/misc';
import { IconProp } from '@fortawesome/fontawesome-svg-core';


interface StationLibraryProps {
  state?: State;
  cache?: ISave;
  isCollapsed?: ICollapsed;
  networkSelections?: string[];
  visible?: boolean;
  onState?: (name: string, value: any) => void;
  onBounds?: (name: string, type: string, value: number) => void;
  setCount?: (count: number) => void;
  resultsCollapsed?: boolean;
}

export interface IOptions {
  networks: [];
  supportedFrequencies: string[];
  location: string[];
}

const initialFilters: GroundStationFilters = {
  name: [],
  networks: [],
  supportedFrequencies: 'none',
  location: 'none',
  scanAgreement: 'none'

};

const initialOptions: IOptions = {
  networks: [],
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
      backgroundColor: theme.name === THEMES.DARK ? theme.palette.background.dark : theme.palette.background.default,
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
  },
  image: {
    borderRadius: '1px',
    width: '80%'
  },
  relay: {
    borderRadius: '1px',
    width: '80%'
  },
  bold: {
    fontWeight: 'bolder'
  },
  header: {
    color: theme.palette.text.primary,
    "&:hover": {
      color: theme.palette.primary.main
    },
  }
}));

const StationLibrary: FC<StationLibraryProps> = ({
  // state,
  // cache,
  // isCollapsed,
  // networkSelections,
  // visible,
  // onState,
  // onBounds,
  // setCount,
  // resultsCollapsed
}) => {
  const classes = useStyles();
  const [results, setResults] = useState<Station[]>();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ title: '', message: '' });
  const [open, setOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<GroundStationFilters>(initialFilters);
  const [source, setSoure] = useState<Station[]>(results);
  const [options, setOptions] = useState<IOptions>(initialOptions);
  // const [checked, setChecked] = useState<number[]>([]);
  const dispatch = useDispatch();
  const theme = useTheme<Theme>();
  const [myFilterer, setMyFilterer] = useState<Filterer>(new Filterer([]));
  const [filterSource, setFilterSource] = useState<SearchOption[]>([]);
  const { zoom } = useSelector((state) => state.zoom);

  const fetchData = async () => {
    const response = await axios.get<Station[]>(
      '/requestGroundStationDashboard'
    );

    if (response.data) {
      //generate options for filtering
      let temp: IOptions = initialOptions;
      response.data.forEach((item) => {
        Object.keys(temp).forEach((key) => {
          if (item[key]) {
            let values = item[key].split(', ');
            values.forEach((el) => {
              !temp[key].includes(el) && temp[key].push(el);
            });
          }
        });
      });

      let newResults: Station[] = [];
      response.data.forEach((station) => {
        let newNetworkList = '';
        if (station['networks']) {
          station['networks'].split(', ').forEach((network) => {
            if (!newNetworkList.includes(network)) {
              newNetworkList = newNetworkList.concat(network + ', ');
            }
          });
          newNetworkList = newNetworkList.substring(
            0,
            newNetworkList.length - 2
          );
          newResults.push({
            id: station.id,
            name: station.name,
            networks: newNetworkList,
            numAntennas: station.numAntennas,
            supportedFrequencies: station.supportedFrequencies,
            location: station.location,
            type: station.type,
            antennaId: station.antennaId,
            version: station.version,
            antennaNames: station.antennaNames,
            antennaPolarizations: station.antennaPolarizations,
            antennaSize: station.antennaSize,
            minFrequency: station.minFrequency,
            maxFrequency: station.maxFrequency,
            eirpValues: station.eirpValues,
            antennaGain: station.antennaGain,
            gtValues: station.gtValues,
            dataFormat: station.dataFormat,
            modulationType: station.modulationType,
            channelCodingType: station.channelCodingType,
            subcarrierModulationType: station.subcarrierModulationType,
            SCANAgreement: station.SCANAgreement,
            startYear: station.startYear,
            stopYear: station.stopYear,
            standardsCompliance: station.standardsCompliance
          } as Station);
        }
      });

      setOptions(temp);
      setResults(newResults);
      setSoure(newResults);
      //setCount(0);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // useEffect(() => {
  //   if (!source) return;

  //   const data = source
  //     .filter((item) =>
  //       filters.name !== ''
  //         ? item.name?.toLowerCase().includes(filters.name.toLowerCase())
  //         : true
  //     )
  //     .filter((item) =>
  //       filters.networks !== 'none' && filters.networks !== ''
  //         ? item.networks?.split(', ')?.includes(filters.networks)
  //         : true
  //     )
  //     .filter((item) =>
  //       filters.location !== 'none' && filters.location !== ''
  //         ? item.location?.split(', ')?.includes(filters.location)
  //         : true
  //     )
  //     .filter((item) =>
  //       filters.supportedFrequencies !== 'none' &&
  //       filters.supportedFrequencies !== ''
  //         ? item.supportedFrequencies
  //           ?.split(', ')
  //           ?.includes(filters.supportedFrequencies)
  //         : true
  //     );
  //   setResults(data);
  //   if (networkSelections.length > 0 && filters.networks !== 'none') {
  //     setCount(data.length);
  //   } else {
  //     setCount(0);
  //   }
  // }, [filters, source]);

  // useEffect(() => {
  //   if (results && networkSelections.length > 0) {
  //     //results is the overall list
  //     //update filter to selected network


  //     if(myFilterer.getFilters().has('networks')) {
  //       myFilterer.removeFilter('networks');
  //     }

  //     const newWorkingFilter = 
  //     {
  //       filterName: "Network",
  //       filterParam: networkSelections[0]?.toString(),
  //       filterFunction: (val : any) => {
  //         {
  //           let networks;
  //           if(networkSelections === null || networkSelections.length === 0){
  //             networks = ""
  //           } else {
  //             networks = networkSelections[0];
  //           }
  //           if (networks.length === 0) {
  //             networks = ""
  //           }
  //           networks = networks.toLowerCase();
        
  
  //             if(networks === 'ksat'){
  //               let vals = val.networks.split(',')
  //               for(let j = 0; j < vals.length; j++){
  //                 if(vals[j].toLowerCase().includes(networks) && vals[j] !== 'KSAT Lite'){
  //                   return true;
  //                 } 
  //               }
  //               return false;
  //             }
  //             if (val.networks.toLowerCase().includes(networks)) return true;
    
  //             return false;
  //         };
  //       }
  //     }
      
  //     myFilterer.addFilter('networks', newWorkingFilter);
  //     handleFilterChange();
  //     setCount(myFilterer.getFilteredList().length);
  //   } else {

  //     if(myFilterer.getFilters().has('networks')) {
  //       myFilterer.removeFilter('networks');
  //     }
  //     setCount(0);
  //     handleFilterChange();
  //   }
    
  // }, [networkSelections]);

  // const handleContext = async (value) => {
  //   // Do not allow combinations of relays and DTEs in the selection list. 
  //   if (state.networkType === 'relay') {
  //     setAlertMessage({
  //       title: `Invalid Selection`,
  //       message: 'You cannot combine DTEs and relay networks at this time.'
  //     });
  //     setIsAlertOpen(true);
  //     return;
  //   }

  //   // Do not allow a station to be selected if it is already in the
  //   // selection list. 
  //   if (state.selectedItems.find(item => item.id === value.id)) {
  //     setAlertMessage({
  //       title: `Invalid Selection`,
  //       message: 'This station is already selected.'
  //     });
  //     setIsAlertOpen(true);
  //     return;
  //   }

  //   // Do not allow a station to be selected if the mission type is terrestrial. 
  //   if (!state.parameters.isOrbital) {
  //     setAlertMessage({
  //       title: `Invalid Selection`,
  //       message: 'A DTE network cannot service a terrestrial user. Please select a relay network or update your mission parameters.'
  //     });
  //     setIsAlertOpen(true);
  //     return;
  //   }

  //   // Currently, ground station modeled data points only extend up
  //   // to 1000 km. If the user selects a DTE while the user altitude 
  //   // is greater than 1000 km, notify the user of the modeling limitation. 
  //   if (state.parameters.altitude > 1000) {
  //     setAlertMessage({
  //       title: `Warning`,
  //       message: `Currently, modeled data points for ground stations only extend up to 1000 km. For accurate results, decrease the altitude of your satellite, or download our STK models for these ground stations, and run an analysis for your user.`
  //     });
  //     setIsAlertOpen(true);
  //     // Do not return! This is a valid selection, we just want to warn the user. 
  //   }

  //   // Set the max altitude to 1000 km. Modeled data points currently
  //   // only extend up to 1000 km, and attempting predictions beyond
  //   // this point may lead to inaccurate results. 
  //   onBounds('altitude', 'max', 1000);

  //   // Set the network type. 
  //   !state.networkType && onState('networkType', 'dte');

  //   // Clear results returned from last API call. 
  //   onState('isDataLoaded', false);
  //   dispatch(updateResults());

  //   // Set frequency band, antenna, and mod/cod options. 
  //   const response = await axios.get<any>('/getModCodOptions', {
  //     params: {
  //       id: value.id,
  //       networkType: 'dte',
  //       antennaId: 0, // Only relevant for ground stations
  //       frequencyBandId: 0 // Only relevant for ground stations
  //     }
  //   });
  //   dispatch(updateFrequencyBandOptions(value.id, response.data.frequencyBandOptions));
  //   dispatch(updateAntennaOptions(value.id, response.data.antennaOptions));
  //   dispatch(updateModCodOptions(value.id, response.data.modCodOptions));

  //   // let finMod = state.commsSpecs.commsPayloadSpecs.modulation;
  //   // let finCod = state.commsSpecs.commsPayloadSpecs.coding;
  //   // // let finModName = "Auto-Select";
  //   // // let finCodName = "Auto-Select";
  //   // let optimized = false;

  //   // if(finMod === -1 && finCod === -1) {
  //   //   //AUTO SELECT
  //   //   optimized = true;

  //   // } else {

  //   //   if(finMod === -1) {
  //   //     //select mod to first avail
  //   //     finMod = response.data.modCodOptions.find(e => e.codingId === finCod)?.modulationId ?? 0;
  //   //   } else if (finCod === -1) {
  //   //     //select cod to first avail
  //   //     finCod = response.data.modCodOptions.find(e => e.modulationId===finMod)?.codingId ?? 0;
  //   //   }

  //   // }

  //   let {finMod,finCod,optimized} = getModCodForStation(response.data.modCodOptions, state.commsSpecs.commsPayloadSpecs.modulation, state.commsSpecs.commsPayloadSpecs.coding)


  //   // Update the items in the selection list. 
  //   value = {
  //     ...value,
  //     antennaId: response.data.selectedAntennaId,
  //     antennaName: response.data.selectedAntennaName,
  //     modulationId : finMod,
  //     codingId : finCod,
  //     optimizedModCod : optimized
  //   };

  //   if(state.commsSpecs.freqBand !== 0 && response.data.frequencyBandOptions.find(e => e.id === state.commsSpecs.freqBand)) {
  //     value.frequencyBandId = state.commsSpecs.freqBand;
  //   } else {
  //     value.frequencyBandId = response.data.frequencyBandOptions[0].id;
  //   }
  //   onState('selectedItems', [...state.selectedItems, value]);

  //   onState('isLastSave', false);
  //   onState('isMarkedForComparison', false);
  //   onState('isLastAnalysis', false);
  // };

  const handleOpen = (evt?, reason?) => {
    if (reason === 'backdropClick') return;
    setOpen(!open)
  };

  const handleCellClick = (event) => {
    event.columnIndex === 6 && handleOpen();
    // if (event.event.ctrlKey) {
    //   // checked.includes(event.data.id)
    //     /*?*/ setChecked(checked.filter((item) => item !== event.data.id));
    //   //   : setChecked((prevState) => [...prevState, event.data.id]);
    // } else {
    //   setChecked([event.data.id]);
    // }
  }
  const handleFilter = (values): void => setFilters(values);

  const print = (toPrint): boolean => {console.log('data.id',toPrint); return true;}

  useEffect(() => {

    let newFilter = new Filterer([]);
    let filters : Map<string,Filter> = myFilterer.getFilters();
    filters.forEach((filterFunc, filterName) => {
      newFilter.addFilter(filterName, filterFunc);
    });
    setMyFilterer(newFilter);

  }, [source]);

  const handleFilterChange = (): void => {
    let l : any [] = myFilterer.getFilteredList();
    setResults(l);
  };

  const handleclear = (): void => {
    myFilterer.clearFilters();
    setFilters({name : [], networks: [], operationalYear: '', supportedFrequencies: 'none', location: 'none', scanAgreement: 'none' });
    handleFilterChange();
    setFilterSource([]);
  };
  
  return (
    <div className={/*visible ? */classes.root /*: classes.hide*/}>
      <DataGrid
        className={classes.table}
        //style={{ maxHeight: isCollapsed === 'up' ? (window.screen.availHeight / zoom) * 0.8 : (window.screen.availHeight / zoom) * 0.36  }}
        dataSource={results}
        showBorders={false}
        showRowLines={true}
        hoverStateEnabled={false}
        scrolling={{ mode: 'infinite' }}
        wordWrapEnabled={true}
        onCellClick={handleCellClick}

        //Turn on for on click color change for ground stations
        // onRowPrepared={(event) => {
        //   if (event.rowT</div>pe === 'data' && checked.includes(event.data.id))
        //     if(theme.name == THEMES.DARK){
        //       event.rowElement.style['background'] = "#5e5e5e"; //theme.palette.primary.main;
        //       event.rowElement.style['color'] = "white";
        //       event.rowElement.style['font-weight'] =  "bold";
        //       event.rowElement.style['font-size'] =  `${event.rowElement.style['font-size'] + 1}px`;
        //     } else {
        //       event.rowElement.style['background'] = theme.palette.primary.main;
        //       event.rowElement.style['font-weight'] =  "bold";
        //       event.rowElement.style['font-size'] =  `${event.rowElement.style['font-size'] + 1}px`;
        //     }

        // }}
        // onContextMenuPreparing={(e) => {
        //   if (e.row?.data && !state.loading) {
        //     e.items = [
        //       {
        //         text: 'Select',
        //         onClick: () => handleContext(e.row.data)
        //       }
        //     ];
        //   } else {
        //     e.items = [];
        //   }
        // }}
      >
        <Column
          dataField="picture"
          caption=""
          width={/*resultsCollapsed?"3.5%":*/"5%"}
          allowSorting={false}
          cellRender={(data) => (/*checked.includes(data.id)*/ false && print(data.id) ?
            <img
              src='/static/icons/Ground_Station_Individual_Icon-SVG_light.svg'
              alt="system"
              className={
                classes.image
              }
            
            />
            :
            <img
              src='/static/icons/Ground_Station_Individual_Icon-SVG.svg'
              alt="system"
              className={
                classes.image
              }
            />
            
          )}
          alignment="center"
        />
        <Column
          dataField="name"
          alignment="left"
          allowSearch={false}
          width="15%"
          cellRender={(data) => <div className={classes.bold}>{data.text}</div>}
          headerCellRender={(data) => <div className={classes.header}>{data.column.caption}</div>}
        />
        <Column dataField="networks" alignment="center" headerCellRender={(data) => <div className={classes.header}>{data.column.caption}</div>}/>
        <Column
          dataField="numAntennas"
          caption="Number of Antennas"
          alignment="center"
          width="18%"
          headerCellRender={(data) => <div className={classes.header}>{data.column.caption}</div>}
        />
        <Column
          dataField="supportedFrequencies"
          caption="Supported Frequencies"
          alignment="center"
          width="20%"
          headerCellRender={(data) => <div className={classes.header}>{data.column.caption}</div>}
        />
        <Column
          dataField="location"
          caption="Location"
          alignment="center"
          width="20%"
          headerCellRender={(data) => <div className={classes.header}>{data.column.caption}</div>}
        />
        <Column
          alignment="center"
          width="5%"
          headerCellRender={() => 
          <FontAwesomeIcon 
            icon={faFilter as IconProp} 
            style={{
              color: theme.palette.primary.main
            }}
          />}
        />
      </DataGrid>
      {/* {isAlertOpen && (
          <SelectionAlert 
            isOpen={isAlertOpen}
            onOpen={() => setIsAlertOpen(!isAlertOpen)}
            message={alertMessage}
          />
        )}
        <StationFilterModal
          open={open}
          filterer = {myFilterer}
          filters={filters}
          source = {filterSource}
          options={options}
          onOpen={handleOpen}
          onClear={handleclear}
          onFilters={handleFilter}
          onFilterChange={handleFilterChange}
          state={state}
        /> */}
    </div>
  );
};

export default StationLibrary;
