import { Dispatch, FC, useEffect, useState } from "react";
import TreeList, {
    Column, Selection, Lookup,
} from 'devextreme-react/tree-list';
import 'devextreme/dist/css/dx.light.css';
import { Template } from 'devextreme-react/core/template';
import { useDispatch } from "react-redux";
import React from "react";
import { CheckBox } from 'devextreme-react/check-box';
import { useSelector } from "src/store";
import { ICollapsed, State } from "..";
import { ISave } from "src/types/preference";
import { makeStyles, useTheme } from '@material-ui/core';
import { THEMES } from "src/utils/constants/general";
import { Theme } from "src/theme";

export type TService = {
    id: number;
    name: string;
    antenna: string;
    TxRx: string;
    frequencyBand: string;
}

export type TPlatform = {
    id: number;
    name: string;
    type: string;
    totalServices: string;
    location: string;
    services: TService[]
}

export type TNetwork = {
    id: number;
    name: string;
    type: string;
    operationalYear: string;
    supportedFrequencies: string;
    totalPlatforms: string;
    platforms: TPlatform[]
}

export type TNetworks = {
    networks: TNetwork[]
}

/**
 * Type for Grid LIST
 */
type TListItem = {
    id: number;
    parent_id: number;
    name: string;
    type: string;
    supportedFrequencies: string;
    location: string;
    antenna: string;
    TxRx: string;
    frequencyBand: string;
    level: string;
}

function CustomCell(options: any) {

    const data = options.data;

    if (data.level !== 'service') {
        return (
            <React.Fragment>
                {/* <img className='img' src={SatelliteIcon} /> &nbsp; */}
                <span className="name">{data.name}</span>
            </React.Fragment>
        );
    } else {
        return (
            <React.Fragment>
                <CheckBox className="checkbox" defaultValue={false} /> &nbsp;
                <span className="name">{data.name}</span>
            </React.Fragment>
        );
    }
}

/**
 * Enum for data levels
 */
enum level {
    network = 'network',
    platform = 'platform',
    service = 'service'
}

interface NodeLibraryProps {
    state: State;
    cache: ISave;
    visible: boolean;
    isCollapsed: ICollapsed;
    onState: (name: string, value: any) => void;
    onBounds: (name: string, type: string, value: number) => void;
    setNetworks: (network: string[]) => void;
    resultsCollapsed: boolean;
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
      '& .dx-data-row.dx-state-hover:not(.dx-selection):not(.dx-row-inserted):not(.dx-row-removed):not(.dx-edit-row):not(.dx-row-docused) > td': {
        color: theme.palette.text.secondary,
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
      fontWeight: 'bolder',
    },
    header: {
      color: theme.palette.text.primary,
      "&:hover": {
        color: theme.palette.primary.main
      },
    }
  }));

/**
 * Custom Networks Data grid component
 * @returns 
 */
const NodeLibrary: FC<NodeLibraryProps> = ({
    state,
    cache,
    isCollapsed,
    visible,
    onState,
    onBounds,
    setNetworks,
    resultsCollapsed
}) => {

    //const dispatch = useDispatch<Dispatch>();
    const [data, setData] = useState<TListItem[]>();
    const expandedKeys = [1, 11];
    const selectedKeys = [111];
    const { zoom } = useSelector((state) => state.zoom);
    const classes = useStyles();
    const theme = useTheme<Theme>();

    // useEffect(() => {
    //     getNetworksData();
    // }, []);

    /**
     * Get Network Data from network service
     */
    // const getNetworksData = async () => {

    //     const networksResponse = await networksService.getNetworks();

    //     // Store response to redux
    //     dispatch.Networks.setNetWorks(networksResponse);

    //     // Making new dataset for treelist format
    //     configData(networksResponse);
    // }

    /**
     * Reconfig network data for component
     * @param data TNetwork
     */
    const configData = (data: TNetwork[]) => {

        const root: TListItem[] = [];

        data.map((network: TNetwork, idx: number) => {
            root.push({
                id: network.id,
                parent_id: 0,
                name: network.name,
                type: network.type,
                supportedFrequencies: network.supportedFrequencies,
                location: "",
                antenna: "",
                TxRx: "",
                frequencyBand: "",
                level: level.network
            });

            network.platforms.map((platform: TPlatform, idx: number) => {
                root.push({
                    id: platform.id,
                    parent_id: network.id,
                    name: platform.name,
                    type: platform.type,
                    supportedFrequencies: "",
                    location: platform.location,
                    antenna: "",
                    TxRx: "",
                    frequencyBand: "",
                    level: level.platform
                });

                platform.services.map((service: TService, idx: number) => {
                    return root.push({
                        id: service.id,
                        parent_id: platform.id,
                        name: service.name,
                        type: '-',
                        supportedFrequencies: "",
                        location: "",
                        antenna: service.antenna,
                        TxRx: service.TxRx,
                        frequencyBand: service.frequencyBand,
                        level: level.service
                    });
                });
            })
        });

        setData(root);
    }

    return (
         <div data-filter-grid="true" className={visible && isCollapsed !== 'down' ? classes.root : classes.hide}>
            <TreeList
                dataSource={data}
                showBorders={true}
                showRowLines={true}
                columnAutoWidth={true}
                wordWrapEnabled={true}
                defaultExpandedRowKeys={expandedKeys}
                defaultSelectedRowKeys={selectedKeys}
                keyExpr="id"
                parentIdExpr="parent_id"
                id="networks"
                showColumnHeaders={false}
            >
                <Selection mode="single" />
                <Column
                    dataField="id"
                    caption="Assigned"
                    cellTemplate="customTemplate"
                    width={300}
                >
                    <Lookup dataSource={data} displayExpr="name" valueExpr="id" />
                </Column>
                <Column dataField="type" width={100} />
                <Column dataField="supportedFrequencies" />
                <Column dataField="location"  />
                <Column dataField="antenna"  />
                <Column dataField="TxRx"  />
                <Column dataField="frequencyBand"  />

                <Template name="customTemplate" render={CustomCell} />
            </TreeList>
        </div>
    )
}

export default NodeLibrary;