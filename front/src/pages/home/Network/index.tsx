import { FC, useState, useEffect } from 'react';
import {
  Box,
  Tabs,
  Tab,
  IconButton,
  Typography,
  makeStyles,
  useTheme
} from '@material-ui/core';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import FiberManualRecordOutlinedIcon from '@material-ui/icons/FiberManualRecordOutlined';
import NetworkLibrary from './NetworkLibrary'; //remove 'Legacy' to connect to new table
import StationLibrary from './StationLibrary';
import type { ICollapsed, State } from 'src/pages/home';
import type { ISave } from 'src/types/preference';
import type { Theme } from 'src/theme';
import { useSelector } from 'src/store';
import { TagBox } from 'devextreme-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { Filterer } from 'src/utils/filterer';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface NetworkProps {
  state: State;
  cache: ISave;
  isCollapsed: ICollapsed;
  onState: (name: string, value: any) => void;
  onBounds: (name: string, type: string, value: number) => void;
  onCollapsed: (value: ICollapsed) => void;
  visible: boolean;
  resultsCollapsed: boolean;
}

// const tabs = [
//   { name: 'networks', label: 'Networks' },
//   { name: 'stations', label: 'Platforms' },
// ];

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  hide: {
    display: 'none'
  },
  tabs: {
    minHeight: theme.spacing(4)
  },
  tab: {
    minHeight: theme.spacing(4)
  },
  indicator: {
    backgroundColor: 'transparent'
  }
}));

const Network: FC<NetworkProps> = ({
  state,
  cache,
  isCollapsed,
  onState,
  onBounds,
  onCollapsed,
  visible,
  resultsCollapsed
}) => {
  const theme = useTheme<Theme>();
  const classes = useStyles();
  const { zoom } = useSelector((state) => state.zoom);
  const [currentTab, setCurrentTab] = useState<string>('networks');
  const [stationCount, setFilterCount] = useState<number>(0);
  const [selectedNetworks, setSelectedNetworks] = useState<string[]>([]);
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [myFilterer, setMyFilterer] = useState<Filterer>(new Filterer([]));
  const [filterFlag, setFilterFlag] = useState<boolean>(false);
  const [filterNameList,setFilterNameList] = useState<string[]>([]);

  const handleChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleUpClick = (): void => onCollapsed(!isCollapsed ? 'up' : null);

  const handleDownClick = (): void => onCollapsed(!isCollapsed ? 'down' : null);

  return (
    <div
      className={visible ? classes.root : classes.hide}
      style={{
        minHeight:
          isCollapsed === 'up'
            ? (window.screen.availHeight / zoom) * 0.855
            : isCollapsed !== 'down' && (window.screen.availHeight / zoom) * 0.38
      }}
    >
      <Box display="flex" alignItems="center" style={{paddingLeft: '10px'}}>
        {/* These tabs are temporarily added to gain access to platforms. Remove with new table */}
        <IconButton size="small" onClick={() => {setOpenFilter(true)}}>
          <FontAwesomeIcon
                icon={faFilter as IconProp}
                style={{
                  color: theme.palette.primary.main,
                  padding: '2px'
                }}
          />
        </IconButton>
        <TagBox
          style = {{
            borderRadius: '4px',
            //I don't know why, but having this shadow disables the annoying highlight feature this component has. Even though it does nothing, do not remove the shadow.
            boxShadow: '0px 0px 0px #c0c0c0', 
            width: '85%'
          }}          
          dataSource={[]}
          value = {filterNameList}
          showSelectionControls={true}
          showMultiTagOnly={true}
          applyValueMode="instantly"
          searchEnabled={false}
          stylingMode="outlined"
          activeStateEnabled= {false}
          deferRendering= {false}
          openOnFieldClick= {false}
          id="filter-name"
          onValueChanged={(e) => {
            let {value} = e;
              let oldFilterList = myFilterer.getFilters();
              let newFilterList = []
              oldFilterList.forEach((filter) => {
                value.forEach((filterType) => {
                  if(filterType.includes(filter.filterName)){
                    newFilterList.push(filter);
                  }
                })
              })
              let keys = oldFilterList.keys();
              let key = keys.next()
              if(key.done){
                myFilterer.clearFilters();
              } else {
                while(!key.done){
                  if(!newFilterList.includes(oldFilterList.get(key.value))){
                    myFilterer.removeFilter(key.value);
                    setFilterFlag(!filterFlag);
                    if(key.value === "missionFreqBand"){
                      onState('commsSpecs', {...state.commsSpecs, freqBand: 0});
                    }
                    if(key.value === "channelCodingType"){
                      onState('commsSpecs', {...state.commsSpecs, commsPayloadSpecs: {...state.commsSpecs.commsPayloadSpecs, coding: -1}});
                    }
                    if(key.value === "missionModulationType"){
                      onState('commsSpecs', {...state.commsSpecs, commsPayloadSpecs: {...state.commsSpecs.commsPayloadSpecs, modulation: -1}});
                    }
                    if(key.value === "missionPolarization"){
                      onState('commsSpecs', {...state.commsSpecs, commsPayloadSpecs: {...state.commsSpecs.commsPayloadSpecs, polarizationType: -1}});
                    }
                    if(key.value === "dataRate"){
                      onState('commsSpecs', {...state.commsSpecs, dataRateKbps: 0});
                    }
                  }
                  key = keys.next();
                } 
              }
              
          }}
          
        />
      {/* <Tabs
          value={currentTab}
          onChange={handleChange}
          className={classes.tabs}
          TabIndicatorProps={{ className: classes.indicator }}
          classes={{
            root: classes.tab
          }}
        >
          {tabs.map((tab) => (
            <Tab
              key={tab.name}
              label={
                <Box display="flex" alignItems="center" justifyContent="center">
                  {currentTab === tab.name && isCollapsed !== 'down' ? (
                    <FiberManualRecordIcon
                      color="primary"
                      style={{ fontSize: '0.8rem' }}
                    />
                  ) : (
                    <FiberManualRecordOutlinedIcon
                      color="primary"
                      style={{ fontSize: '0.8rem' }}
                    />
                  )}
                  <Box flexGrow={1} mr={2} />
                  <Typography
                    variant="body1"
                    style={{ fontWeight: 600 }}
                    color="textPrimary"
                  >
                    {tab.name === 'stations' && stationCount > 0
                      ? tab.label //+ ` (${stationCount})`
                      : tab.label}
                  </Typography>
                </Box>
              }
              value={tab.name}
              classes={{
                root: classes.tab
              }}
              onClick={() =>
                isCollapsed === 'down' ? onCollapsed(null) : null
              }
            />
          ))}
        </Tabs> */}
        {/* END OF SECTION */}
        <Box flexGrow={1} />
        <Box mr={2}>
          <IconButton
            style={{ padding: 0 }}
            onClick={handleUpClick}
            disabled={isCollapsed === 'up'}
            id={"upButton"}
          >
            <ArrowDropUpIcon fontSize="large" color="primary" />
          </IconButton>
          <IconButton
            style={{ padding: 0 }}
            onClick={handleDownClick}
            disabled={isCollapsed === 'down'}
            id={"downButton"}
          >
            <ArrowDropDownIcon fontSize="large" color="primary" />
          </IconButton>
        </Box>
      </Box>
        <Box>
          <NetworkLibrary
            state={state}
            cache={cache}
            isCollapsed={isCollapsed}
            onState={onState}
            onBounds={onBounds}
            visible={currentTab === 'networks'} //this should be true with updates
            setNetworks={setSelectedNetworks}
            resultsCollapsed={resultsCollapsed}
            myFilterer = {myFilterer}
            setMyFilterer = {setMyFilterer}
            setFilterNameList = {setFilterNameList}
            resetFilterFlag = {filterFlag}
            filterPanelOpen={openFilter}
            closeFilterPanel={()=>setOpenFilter(false)}
          />
        </Box>        
    </div>
  );
};

export default Network;
