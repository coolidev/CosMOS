/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'src/store';
import DataGrid, { Column } from 'devextreme-react/data-grid';
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.material.blue.light.compact.css';
import { makeStyles, useTheme } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import axios from 'src/utils/axios';
import type { Station } from 'src/types/system';
import type { ICollapsed, State } from 'src/pages/home';
import type { GroundStationFilters, ISave } from 'src/types/preference';
import { THEMES } from 'src/utils/constants/general';
import type { Theme } from 'src/theme';
import { Filter, Filterer } from 'src/utils/filterer';
import { SearchOption } from 'src/types/details';
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
  const [open, setOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<GroundStationFilters>(initialFilters);
  const [source, setSoure] = useState<Station[]>(results);
  const [options, setOptions] = useState<IOptions>(initialOptions);
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

  const handleOpen = (evt?, reason?) => {
    if (reason === 'backdropClick') return;
    setOpen(!open)
  };

  const handleCellClick = (event) => {
    event.columnIndex === 6 && handleOpen();
  }
  const handleFilter = (values): void => setFilters(values);

  const print = (toPrint): boolean => { console.log('data.id', toPrint); return true; }

  useEffect(() => {

    let newFilter = new Filterer([]);
    let filters: Map<string, Filter> = myFilterer.getFilters();
    filters.forEach((filterFunc, filterName) => {
      newFilter.addFilter(filterName, filterFunc);
    });
    setMyFilterer(newFilter);

  }, [source]);

  const handleFilterChange = (): void => {
    let l: any[] = myFilterer.getFilteredList();
    setResults(l);
  };

  const handleclear = (): void => {
    myFilterer.clearFilters();
    setFilters({ name: [], networks: [], operationalYear: '', supportedFrequencies: 'none', location: 'none', scanAgreement: 'none' });
    handleFilterChange();
    setFilterSource([]);
  };

  return (
    <div className={/*visible ? */classes.root /*: classes.hide*/}>
      <DataGrid
        className={classes.table}
        dataSource={results}
        showBorders={false}
        showRowLines={true}
        hoverStateEnabled={false}
        scrolling={{ mode: 'infinite' }}
        wordWrapEnabled={true}
        onCellClick={handleCellClick}
        showColumnHeaders={false}
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
        <Column dataField="networks" alignment="left" headerCellRender={(data) => <div className={classes.header}>{data.column.caption}</div>} />
        <Column
          dataField="numAntennas"
          caption="Number of Antennas"
          alignment="left"
          width="18%"
          headerCellRender={(data) => <div className={classes.header}>{data.column.caption}</div>}
        />
        <Column
          dataField="supportedFrequencies"
          caption="Supported Frequencies"
          alignment="left"
          width="20%"
          headerCellRender={(data) => <div className={classes.header}>{data.column.caption}</div>}
        />
        {/* <Column
          dataField="location"
          caption="Location"
          alignment="center"
          width="20%"
          headerCellRender={(data) => <div className={classes.header}>{data.column.caption}</div>}
        /> */}
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
    </div>
  );
};

export default StationLibrary;
