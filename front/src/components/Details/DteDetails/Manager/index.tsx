import { useEffect, useState } from 'react';
import type { FC } from 'react';

import _ from 'underscore';
import {
  Grid,
  Box,
  Breadcrumbs,
  Link,
  Menu,
  MenuItem,
  Typography,
  makeStyles,
  Theme
} from '@material-ui/core';
import TreeView from '@material-ui/lab/TreeView';
import {
  StyledTreeItem,
  PlusSquare,
  MinusSquare
} from 'src/components/Details/StyledTreeItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Source, State } from 'src/components/Details/DteDetails';
import { Section, SubSection } from 'src/types/details';
import { OVERVIEW_KEY, ANTENNA_KEY, STATION_KEY } from 'src/utils/constants/network-library';
import DataTable from './DataTable';
import AddStation from './AddStation';
import AddAntenna from './AddAntenna';
import AddBand from './AddBand';
import AddModDemod from './AddModDemod';
import { Tabs } from 'devextreme-react';
import ConnectivityPanel from './ConnectivityPanel';
import axios from 'src/utils/axios';

interface ManagerProps {
  state: State;
  dataSource: Source;
  initialize: () => void;
  onState: (name: string, value: string | boolean) => void;
  isEditable: boolean;
  isAdvanced: boolean;
  refresh: () => void;
}

interface NodeMenu {
  nodeId: string;
  add: string;
  remove: string;
}

export interface ConnectivitySource {
  id: number;
  platform_src: string;
  platform_src_id: number;
  antenna_src: string | null;
  antenna_src_id: number | null;
  rfFrontEnd_src: string | null;
  rfFrontEnd_src_id: number | null;
  modDemod_src: string | null;
  modDemod_src_id: number | null;
  platform_dest: string | null;
  platform_dest_id: number | null;
  antenna_dest: string | null;
  antenna_dest_id: number | null;
  rfFrontEnd_dest: string | null;
  rfFrontEnd_dest_id: number | null;
  modDemod_dest: string | null;
  modDemod_dest_id: number | null;
  isconnected: boolean;
  down: boolean;
}

const initialMenu: NodeMenu = {
  nodeId: '',
  add: '',
  remove: ''
};

const MENU_NAMES = [
  { key: 'station', keyName: 'stationName', name: 'Platform' },
  { key: 'antenna', keyName: 'antennaName', name: 'Antenna' },
  { key: 'band', keyName: 'bandName', name: 'RF Front-End' },
  { key: 'modDemod', keyName: 'modDemodName', name: 'Mod/Demod' }
];

const depths = ['system', 'antennaName', 'frequencyBand', 'modDemod'];

const banned = [STATION_KEY, ANTENNA_KEY];

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1)
  },
  tree: {
    height: '49vh',
    padding: theme.spacing(5),
    flexGrow: 1,
    overflow: 'auto'
  },
  main: {
    height: '49vh',
    padding: theme.spacing(5),
    overflow: 'auto',
    '& .dx-switch-on-value .dx-switch-handle::before': {
      backgroundColor: theme.palette.primary.main
    },
    '& .dx-switch-on-value .dx-switch-container::before': {
      backgroundColor: theme.palette.primary.main,
      opacity: 0.5
    },
    '& .dx-datagrid .dx-link': {
      color: theme.palette.primary.main,
    },
    //For multi-select checkboxes (need to find correct style class to move this to)
    // '& .dx-checkbox-indeterminate .dx-checkbox-icon': {
    //   backgroundColor: theme.palette.primary.main
    // },
    '& .dx-datagrid-focus-overlay:after': {
      backgroundColor: theme.palette.primary.main
    }
  },
  dialog: {
    width: '25vw'
  },
  note: {
    textAlign: 'right'
  },
  tabPanel: {
    display: 'block',
    '& .dx-item.dx-tab-selected': {
      color: '#e34747'
    },
    '& .dx-tab.dx-tab-selected::before': {
      backgroundColor: '#e34747'
    }
  }
}));

/**
 * DTE Network Details tab
 *
 * @param {*} {
 *   dataSource,
 *   state,
 *   onState,
 *   initialize
 * }
 * @return {*} 
 */
const Manager: FC<ManagerProps> = ({
  dataSource,
  state,
  onState,
  initialize,
  isEditable,
  isAdvanced,
  refresh
}) => {
  const [expanded, setExpanded] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  const [results, setResults] = useState<Section[]>([]);
  const [source, setSource] = useState<SubSection[]>([]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [menu, setMenu] = useState<NodeMenu>(initialMenu);
  const [currentPanelTab, setCurrentPanelTab] = useState<number>(0);
  const [connectivitySource, setConnectivitySource] = useState<ConnectivitySource[]>([]);
  const [connectionChangeFlag, setConnectionChangeFlag] = useState<boolean>(false);
  const [relationHoldID, setRelationHoldID] = useState<number>(0);

  const classes = useStyles();

  useEffect(() => {
    setSelected(new Array(dataSource.detail.system_value[0]?.section_name??null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const params = { id: dataSource.id }; // update with the id of the planet
      const response = await axios.post<ConnectivitySource[]>('/requestRelationship', params);

      if (response.data) {
        setConnectivitySource(response.data)
      }
    };
    fetchData();
  }, [dataSource.id])

  // useEffect(() => {
  //   const values = results.map((item) => item.section_name);
  //   setExpanded(values);
  // }, [results]);

  useEffect(() => {
    const data = dataSource.detail.system_value.filter(
      (item: Section) => item.section_key !== OVERVIEW_KEY
    );
    setResults(data);
  }, [dataSource.detail]);

  useEffect(() => {
    const values = results.map((item) => item.section_name);
    setExpanded(values);
  }, [results]);

  useEffect(() => {
    if (selected.length === 0) return;

    const keyName = banned[selected.length - 1];
    const keyId = depths[selected.length];
    const data = results.find(
      (result) => result.section_name === selected[0]
    )?.section_value;
    const values =
      data &&
      data.filter((result) => {
        if(result.name && result.name[0] !== '['){ //filter out the attributes with '[' character (name attributes)
          return keyName && keyId
            ? result[keyId] === keyName &&
                selected
                  .slice(1)
                  .every((item, i) => result[depths[i + 1]] === item)
            : keyId
            ? !result[keyId] &&
              selected.slice(1).every((item, i) => result[depths[i + 1]] === item)
            : selected
                .slice(1)
                .every((item, i) => result[depths[i + 1]] === item);
        }
        return false;
      });
    setSource(values ?? []);
  }, [selected, results]);

  const handleAddStation = () => onState('station', true);

  const handleClose = () => setAnchorEl(null);

  const handleClick = (idx: number) => {
    setSelected(selected.filter((item, i) => i <= idx));
  };

  const handleMenu = (event, nodeId) => {
    event.preventDefault();
    event.stopPropagation();
    const values = nodeId.split('---');
    const params = { nodeId };

    if (MENU_NAMES[values.length])
      params['add'] = MENU_NAMES[values.length].name;

    if (MENU_NAMES[values.length - 1].name)
      params['remove'] = MENU_NAMES[values.length - 1].name;

    //@ts-ignore
    setMenu(params);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItem = (event, checked: boolean) => {
    event.preventDefault();
    const value = checked ? 'remove' : 'add';
    const name = MENU_NAMES.find((item) => item.name === menu[value]).key;
    const str = 'is' + name.charAt(0).toUpperCase() + name.slice(1);

    menu.nodeId.split('---').forEach((item, idx) => {
      onState(MENU_NAMES[idx].keyName, item);
    });

    onState(str, checked);
    !checked && onState(name, true);
    setAnchorEl(null);
  };

  const handleOpen = (event) => {
    const name = event.currentTarget
      ? event.currentTarget.getAttribute('name')
      : event;
    state[name] && initialize();
    onState(name, !state[name]);
  };

  const handleSelect = (event, nodeIds) => {
    setSelected(nodeIds.split('---'));
  };

  const handleState = (event) => {
    const { name, value } = event.target;
    onState(name, value);
  };

  const handleToggle = (event, nodeIds) => setExpanded(nodeIds);

  const handleRelationHold = (idx: number) => {
    setRelationHoldID(idx)
  }

  const handleRelationEject = () => {
    setRelationHoldID(0)
  }

  const getTreeID = (param) => {
    return [param.platformId, param.antennaId, param.rfFrontEndId, param.modDemodId].join('_').replace(/^_+|_+$/gm,'')
  }

  const getFromID = (param: ConnectivitySource) => {
    return [param.platform_src_id, param.antenna_src_id, param.rfFrontEnd_src_id, param.modDemod_src_id].join('_').replace(/^_+|_+$/gm,'')
  }

  const getToID = (param: ConnectivitySource) => {
    return [param.platform_dest_id, param.antenna_dest_id, param.rfFrontEnd_dest_id, param.modDemod_dest_id].join('_').replace(/^_+|_+$/gm,'')
  }

  const renderTree = (key: string, result: SubSection[], parent?: string) => {
    const index = depths.indexOf(key);
    const keys = _.uniq(
      // eslint-disable-next-line array-callback-return
      result.map((item: SubSection) => {
        if (item[key] && item[key] !== '') return item[key];
      })
    );
    const uniqueKeys = index !== 0 ? keys : [''];

    return uniqueKeys.map((item, idx) => {
      const suffix = parent ? `${parent}` : '';
      const nodeId = item ? suffix + `---${item}` : suffix;
      const data: any =
        index !== 0
          ? result.filter(
              (el) => el[key] && !banned.includes(el[key]) && el[key] === item
            )
          : result;
      const nextValid =
        depths[index + 1] && data.some((el) => Boolean(el[depths[index + 1]]));
      const isValid = index === 0 || data.length > 0;
      const treelabel = index === 3 ? `${item}` : index === 2 ? `${item}`  : index === 0 ? nodeId : item;

      const connectIcons = []

      if (data.length > 0) {
        const treeLink = getTreeID(data[0])
        const resources = connectivitySource.filter((resource) => {
          let a = getFromID(resource);
          let b = getToID(resource);
          return (a === treeLink || b === treeLink) && resource.isconnected
        })
        if (resources.length > 0) {
          resources.map(resource => {
            if (resource.down) {
              if (getFromID(resource) === treeLink) {
                connectIcons.push(`down_output_${resource.id}_${getFromID(resource)}`)
              }
              if (getToID(resource) === treeLink) {
                connectIcons.push(`down_input_${resource.id}_${getToID(resource)}`)
              }
            } else {
              if (getFromID(resource) === treeLink) {
                connectIcons.push(`up_output_${resource.id}_${getFromID(resource)}`)
              }
              if (getToID(resource) === treeLink) {
                connectIcons.push(`up_input_${resource.id}_${getToID(resource)}`)
              }
            }
          })
        }
      }
      return isValid ? (
        <div key={idx} id={depths[index] ?? ''}>
          <StyledTreeItem
            nodeId={nodeId}
            labelText={treelabel}
            labelIcon={isEditable ? MoreVertIcon : null}
            onClick={(event) => handleMenu(event, nodeId)}
            onLabelClick={(event) => {event.preventDefault()}}
            relations={connectIcons}
            onRelationCLick={handleRelationHold}
            onRelationEject={handleRelationEject}
            relationHoldID={relationHoldID}
          >
            {depths[index + 1] &&
              nextValid &&
              renderTree(depths[index + 1], data, nodeId)}
          </StyledTreeItem>
        </div>
      ) : null;
    });
  };

  const handlePanelChange = (args: any) => {
    if (args.name === 'selectedIndex' && args.value !== null && args.value !== -1) {
      setCurrentPanelTab(args.value)
    }
  }

  const updateConnectivity = (id: number) => {
    const fetchData = async () => {
      const params = { id }; // update with the id of the planet
      const response = await axios.post<ConnectivitySource[]>('/updateConnectivity', params);

      setConnectionChangeFlag(!connectionChangeFlag)
      if (response.data) {
        // setConnectivitySource(response.data)
      }
    };
    fetchData();
  }
  const updateConnectivityList = (id: number) => {
    const fetchData = async () => {
      const params = { id: id }; // update with the id of the planet
      const response = await axios.post<ConnectivitySource[]>('/requestRelationship', params);

      setConnectionChangeFlag(!connectionChangeFlag);

      if (response.data) {
        setConnectivitySource(response.data);
      }
    };
    fetchData();
  }

  useEffect(() => {
    if(currentPanelTab === -1){
      setCurrentPanelTab(1);
    }
  }, [connectivitySource, setCurrentPanelTab])

  return (
    <Grid item md={12} className={classes.root}>
      <Box border={1}>
        <Grid container>
          <Grid item md={3}>
            <TreeView
              className={classes.tree}
              expanded={expanded}
              selected={selected.join('---')}
              defaultCollapseIcon={<MinusSquare />}
              defaultExpandIcon={<PlusSquare />}
              onNodeSelect={handleSelect}
              onNodeToggle={handleToggle}
            >
              {(connectionChangeFlag || !connectionChangeFlag) &&
                results.map((result: Section, i: number) =>
                  renderTree(
                    depths[0],
                    result.section_value,
                    result.section_name
                  )
                )}
              {isEditable && (
                <StyledTreeItem
                  nodeId=""
                  labelText="Add Platform"
                  onRowClick={handleAddStation}
                  isRowEvent
                />
              )}
              {isEditable && (
                <Menu
                  keepMounted
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  getContentAnchorEl={null}
                  anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                  {menu.add && menu.add !== '' && (
                    <MenuItem onClick={(event) => handleMenuItem(event, false)}>
                      Add {menu.add}
                    </MenuItem>
                  )}
                  {menu.remove && menu.remove !== '' && (
                    <MenuItem onClick={(event) => handleMenuItem(event, true)}>
                      Remove {menu.remove}
                    </MenuItem>
                  )}
                </Menu>
              )}
            </TreeView>
          </Grid>
          <Grid item md={9} className={classes.main}>
            <Breadcrumbs aria-label="breadcrumb">
              {selected.map((item, idx) => (
                <div key={idx}>
                  {idx !== selected.length - 1 ? (
                    <Link
                      component="button"
                      color="inherit"
                      href=""
                      onClick={() => handleClick(idx)}
                    >
                      {idx === 3 ? `${item}` : idx === 2 ? `${item}` : item}
                    </Link>
                  ) : (
                    <Typography color="textPrimary">
                      {idx === 3 ? `${item}` : idx === 2 ? `${item}` : item}
                    </Typography>
                  )}
                </div>
              ))}
            </Breadcrumbs>
            <Box mt={3}>
              <Tabs
                dataSource={
                  (isEditable && isAdvanced)
                    ? [
                        {
                          text: 'Attributes'
                        },
                        {
                          text: 'Connectivity'
                        }
                      ]
                    : [
                        {
                          text: 'Attributes'
                        }
                      ]
                }
                selectedIndex={isEditable ? currentPanelTab : 0}
                onOptionChanged={handlePanelChange}
                className={classes.tabPanel}
              />
              {currentPanelTab === 0 && (
                <DataTable
                  // @ts-ignore
                  id={dataSource.id}
                  isAdmin={isEditable}
                  source={source}
                  refresh={async () => {
                    await refresh();
                    setSelected(new Array(dataSource.detail.system_value[0]?.section_name??null));
                    setExpanded([]);
                  }}
                />
              )}
              {currentPanelTab === 1 && (
                <ConnectivityPanel
                  id={dataSource.id}
                  selected={selected}
                  selectedSource={source}
                  relations={connectivitySource}
                  updateConnectivity={updateConnectivity}
                  updateConnectivityList={updateConnectivityList}
                  setReloadFlag={() => setCurrentPanelTab(-1)}
                />
              )}
              {/* {(source[0] != null) && (source[0].sub_key === "antenna_frequency")
                  ?<Typography display="block" align="right" variant="caption" className="classes.note"><br></br>{DTE_NOTES}</Typography>
                  :null
                } */}
            </Box>
          </Grid>
        </Grid>
      </Box>
      {isEditable && (
        <Box m={2}>
          <AddStation
            id={dataSource.id.toString()}
            state={state}
            onState={handleState}
            onOpen={handleOpen}
            initialize={initialize}
          />
          <AddAntenna
            id={dataSource.id.toString()}
            state={state}
            onState={handleState}
            onOpen={handleOpen}
            initialize={initialize}
          />
          <AddBand
            id={dataSource.id.toString()}
            state={state}
            onState={handleState}
            onOpen={handleOpen}
            initialize={initialize}
          />
          <AddModDemod
            id={dataSource.id.toString()}
            state={state}
            onState={handleState}
            onOpen={handleOpen}
            initialize={initialize}
          />
        </Box>
      )}
    </Grid>
  );
};

export default Manager;
