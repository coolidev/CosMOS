/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.material.blue.light.compact.css';
import { FC, useState, useEffect } from 'react';
import cloneDeep from 'lodash.clonedeep';
import { Tabs, Tab, makeStyles, useTheme } from '@material-ui/core';
import DataGrid, {
  Column,
  Scrolling,
  Paging,
  Editing,
  RowDragging
} from 'devextreme-react/data-grid';
import axios from 'src/utils/axios';
import { useSelector } from 'src/store';
import { PerformancePanel, RelayCharacteristics } from 'src/types/evaluation';
import DialogBox from 'src/components/DialogBox';
import type { State } from 'src/pages/home';
import type { LinkBudgetRow } from 'src/types/link-budget';
import type { Theme } from 'src/theme';
import { THEMES } from 'src/utils/constants/general';

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  linkBudgetDialog: {
     minWidth: theme.spacing(250) + 'px !important',
     maxWidth: theme.spacing(250) + 'px !important',
     minHeight: '85vh !important',
     maxHeight: '90vh !important',
   },
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
    '& .dx-datagrid-header-panel': {
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
      borderBottom: theme.name === THEMES.DARK ? `1px double ${theme.palette.border.main}` : ``
    },
    '& .dx-toolbar .dx-toolbar-items-container': {
      backgroundColor: theme.palette.background.paper,
    },
    '& .dx-datagrid-addrow-button .dx-icon-edit-button-addrow::before' : {
      color: theme.palette.text.primary,
    },
    '& .dx-datagrid-cancel-button .dx-icon-edit-button-cancel::before' : {
      color: theme.palette.text.primary,
    },
    '& .dx-datagrid-save-button .dx-icon-edit-button-save::before' : {
      color: theme.palette.text.primary,
    },
    '& .dx-editor-cell .dx-texteditor .dx-texteditor-input' : {
      color: theme.palette.text.primary,
    },
  }
}));

interface LinkBudgetProps {
  isOpen: boolean;
  onClose: () => void;
  data: PerformancePanel;
  state: State;
  setLinkBudgets: (data: PerformancePanel, state: State, linkBudget: { [key: string]: LinkBudgetRow[] }) => Promise<{ eirp_dBW: number, ebNo_dB: number }>;
};

// Only the parameters included in this array can be edited
// by the user.
const editableFields = ['Miscellaneous Losses (dB)'];

const LinkBudget: FC<LinkBudgetProps> = ({
  isOpen,
  onClose,
  state,
  data,
  setLinkBudgets
}) => {
  const [linkBudgetType, setLinkBudgetType] = useState('');
  const [displayedLinkBudget, setDisplayedLinkBudget] = useState<
    LinkBudgetRow[]
  >([]);
  const [startIndices, setStartIndices] = useState({
    ssl: NaN,
    sgl: NaN,
    comms: NaN
  });
  const [tab, setTab] = useState<number>(null);
  const classes = useStyles();
  const { linkBudget } = useSelector((state) => state.results);
  const { isAdmin, isEngineer } = useSelector((state) => state.user);
  const theme = useTheme<Theme>();

  useEffect(() => {
    // Determines the type of link budget to display, depending on the
    // network type. If the network is a relay, the degree of onboard
    // processing is determined.
    let newLinkBudgetType: string;
    if (state.networkType === 'dte') {
      newLinkBudgetType = 'dte';
    } else {
      let systemParams = data?.systemParams as RelayCharacteristics;

      if (systemParams) {
        if (systemParams.isBentPipe) {
          newLinkBudgetType = 'relay-bent-pipe';
        } else {
          newLinkBudgetType = 'relay-regenerative';
        }
      }
    }

    setLinkBudgetType(newLinkBudgetType);
    // Select the first tab.
    const newTab = tab ?? parseInt(Object.keys(linkBudget)[0]);
    setTab(newTab);

    let sslStartIndex = NaN;
    let sglStartIndex = NaN;
    let commsStartIndex = NaN;
    const newDisplayedLinkBudget =
      linkBudget[newTab] &&
      linkBudget[newTab].map((row) => {
        if (row.parameter === 'Space-Space Link') {
          sslStartIndex = row.location - 1;
        } else if (row.parameter === 'Space-Ground Link') {
          sglStartIndex = row.location - 1;
        } else if (row.parameter === 'Comms Link Performance') {
          commsStartIndex = row.location - 1;
        }

        return {
          ...row
        };
      });

    setStartIndices({
      ssl: sslStartIndex,
      sgl: sglStartIndex,
      comms: commsStartIndex
    });
    newDisplayedLinkBudget && setDisplayedLinkBudget(newDisplayedLinkBudget);
  }, [linkBudget, tab]);

  // Convert NaN values into a nicer value to display.
  const renderNaNValues = (cellInfo) => {
    // NaN or null
    if (!cellInfo.value && cellInfo.value !== 0) {
      return '-';
      // Text
    } else if (isNaN(parseFloat(cellInfo.value))) {
      return '';
      // Numeric value
    } else if(parseFloat(cellInfo.value) === Infinity || parseFloat(cellInfo.value) === -Infinity){
      return '0.00';
    } else {
      return parseFloat(cellInfo.value).toFixed(2);
    }
  };

  // Adds a number in front of the text field. Used to display
  // line numbering for the parameters.
  const renderParameterField = (cell) => {
    if (cell.value === undefined) return cell.value;

    const headers = [
      'Space-Space Link',
      'Space-Ground Link',
      'Comms Link Performance'
    ];
    if (headers.includes(cell.value)) {
      return <b>{cell.value}</b>;
    }

    let number: number = cell.rowIndex + 1;
    if (cell.rowIndex > startIndices.ssl) number = cell.rowIndex;
    if (cell.rowIndex > startIndices.sgl) number = cell.rowIndex - 1;
    if (cell.rowIndex > startIndices.comms) number = cell.rowIndex - 2;

    if (number <= 9) {
      return '0' + number.toString() + '. ' + cell.value.toString();
    } else {
      return number.toString() + '. ' + cell.value.toString();
    }
  };

  // Handles updates to the notes and to the editable values.
  const updateParameters = (row) => {
    const selectedItem = state.selectedItems.find((item) => item.id === tab);

    let value: string = null;
    let noteId: string = null;
    let newNoteText: string = null;
    if (Object.keys(row.newData).includes('value')) {
      value = row.newData.value;
    }
    if (Object.keys(row.newData).includes('notes')) {
      noteId = row.oldData.noteId;
      newNoteText = row.newData.notes;
    }

    if (Object.keys(row.newData).includes('notes') || Object.keys(row.newData).includes('value')) {
      const axiosParams = {
        linkBudgetId: row.oldData.id,
        networkId: state.networkType === 'relay' ? selectedItem.id : 0,
        antennaId: state.networkType === 'dte' ? selectedItem.antennaId : 0,
        value: value,
        noteId: noteId,
        newNoteText: newNoteText,
        email: localStorage.getItem('email')
      };
      axios.post('/update-user-link-budget', axiosParams).then(res => {
        const newLinkBudget = { ...linkBudget };
        newLinkBudget[tab] = newLinkBudget[tab].map(item => {
          if (item.id === row.oldData.id) {
            return {
              ...row.oldData,
              value: Object.keys(row.newData).includes('value') ? parseFloat(row.newData.value) : row.oldData.value,
              noteId: res.data.noteId,
              notes: Object.keys(row.newData).includes('notes') ? row.newData.notes : row.oldData.notes
            };
          } else {
            return item;
          }
        });
        setLinkBudgets(data, state, newLinkBudget);
      });
    }
  };

  // When a cell is clicked, switches the cell to editing mode
  // if the column is notes or if the column is value and
  // the row is an editable parameter.
  const editCell = (cell) => {
    if (cell.rowType !== 'header') {
      if (
        cell.columnIndex === 2 &&
        (editableFields.includes(cell.data.parameter) || isAdmin || isEngineer)
      ) {
        cell.component.editCell(cell.rowIndex, cell.columnIndex);
      } else if (
        cell.columnIndex === 1 &&
        editableFields.includes(cell.data.parameter)
      ) {
        cell.component.editCell(cell.rowIndex, cell.columnIndex);
      }
    }
  };

  const addLinkBudgetItem = (row) => {
    if (linkBudgetType !== '') {
      const axiosParams = {
        type: linkBudgetType,
        parameter: row.data.parameter,
        location: row.component.getVisibleRows().length,
        note: row.data.notes === undefined ? '' : row.data.notes
      };
      axios.post('/add-link-budget-item', axiosParams).then((res) => {
        setLinkBudgets(data, state, linkBudget);
      });
    }
  };

  const deleteLinkBudgetItem = (row) => {
    const axiosParams = {
      linkBudgetId: row.data.id
    };
    axios.post('/delete-link-budget-item', axiosParams).then((res) => {
      setLinkBudgets(data, state, linkBudget);
    });
  };

  const reorderItems = (event) => {
    const newLinkBudget: LinkBudgetRow[] = cloneDeep(displayedLinkBudget);

    newLinkBudget.splice(event.fromIndex, 1);
    newLinkBudget.splice(event.toIndex, 0, event.itemData);

    setDisplayedLinkBudget(newLinkBudget);

    const linkBudgetOrder = newLinkBudget.map((item, index) => {
      return {
        id: item.id,
        location: index + 1
      };
    });

    const axiosParams = {
      linkBudgetOrder: linkBudgetOrder
    };
    axios.post('/reorder-link-budget', axiosParams).then((res) => {
      setLinkBudgets(data, state, linkBudget);
    });
  };

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <DialogBox
      title={'Link Budget'}
      isOpen={isOpen}
      onClose={() => onClose()}
      classes={{ paper: classes.linkBudgetDialog }}
    >
      <Tabs value={tab} onChange={handleChange} scrollButtons={'auto'} variant={'scrollable'}>
        {state.selectedItems.map((tab) => (
          <Tab key={tab.id} label={tab.system ?? tab.name} value={tab.id} />
        ))}
      </Tabs>
      <DataGrid
        dataSource={displayedLinkBudget}
        showBorders={false}
        columnAutoWidth={false}
        onRowUpdating={updateParameters}
        onRowInserting={addLinkBudgetItem}
        onRowRemoving={deleteLinkBudgetItem}
        onCellClick={editCell}
        className = {classes.table}
      >
        <Scrolling useNative />
        <Paging enabled={false} />
        <Editing
          mode="batch"
          allowUpdating={true}
          allowAdding={isAdmin}
          allowDeleting={isAdmin}
        />
        <RowDragging
          allowReordering={isAdmin}
          onReorder={reorderItems}
          showDragIcons={false}
        />
        <Column
          dataField="parameter"
          caption="Parameter"
          cellRender={renderParameterField}
          allowEditing={isAdmin}
          allowSorting={false}
          width="30%"
        />
        <Column
          dataField="value"
          caption="Value"
          customizeText={renderNaNValues}
          allowEditing={false}
          allowSorting={false}
          width="10%"
        />
        <Column
          dataField="notes"
          caption="Notes"
          allowEditing={false}
          allowSorting={false}
        />
      </DataGrid>
    </DialogBox>
  );
};

export default LinkBudget;
