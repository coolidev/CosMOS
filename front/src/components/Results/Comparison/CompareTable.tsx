import { FC, useState, useEffect } from 'react';
import {
  makeStyles,
  colors,
  useTheme
} from '@material-ui/core';
import type { State } from 'src/pages/home';
import type { ICellType, IColumnType, IComparisonType, IData, IRowBreakdownOption, IRowType, Status } from 'src/types/comparison';
import type { Theme } from 'src/theme';
import { ReactTable } from './ReactTable/ReactTable';
import axios from 'src/utils/axios';
import { useDispatch, useSelector } from 'src/store';
import { updateComparisonIds } from 'src/slices/pinnedResults';

interface CompareTableProps {
  state: State;
  status: Status;
  source: IComparisonType;
  refresh: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: theme.spacing(3),
    overflowY: 'hidden',
    overflowX: 'scroll'
  },
  table: {
    '& .MuiTableCell-root': {
      borderBottom: `1px solid ${theme.palette.border.main}`
    }
  },
  tooltip: {
    maxWidth: '500px'
  },
  analyzeResultLink: {
    textDecoration: 'underline !important',
    '&:hover': {
      cursor: 'pointer !important',
      color: '#3f51b5 !important'
    }
  },
  iconBtn: {
    padding: theme.spacing(1)
  },
  rankingLabel: {
    width: '20px',
    height: '20px',
    border: '3px solid ' + colors.grey[700],
    borderRadius: '10px',
    color: colors.grey[700],
    fontSize: '15px',
    fontWeight: 'bold',
    position: 'relative'
  },
  column: {
    backgroundColor: theme.palette.background.light,
    padding: 0
  },
  normalPointer: {
    userSelect: 'none',
    MozUserSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none',
    cursor: 'default'
  },
  paramName: {
    display: 'inline-block',
    verticalAlign: 'middle'
  },
  graphMenu: {
    display: 'inline-block',
    verticalAlign: 'middle'
  },
  accordion: {
    backgroundColor: theme.palette.component.main
  }
}));

const CompareTable: FC<CompareTableProps> = ({
  state,
  status,
  source,
  refresh,
}) => {
  const classes = useStyles();
  const theme = useTheme<Theme>();

  const [columns, setColumns] = useState<IColumnType<IData>[]>([])
  const [rowNames, setRowNames] = useState<IRowType<IData>[]>([])
  const [rowBreakdownOptions, setRowBreakdownOptions] = useState<IRowBreakdownOption<IData>[]>([])
  const [cellData, setCellData] = useState<IData[]>([])
  const [columnSequence, setColumnSequence] = useState<string[]>([])
  const [pageLoaded, setPageLoaded] = useState<boolean>(false)
  const [sortString, setSortString] = useState<string>('')

  const {comparisonIds} = useSelector((state) => state.pinnedResults);
  const dispatch = useDispatch();

  
  const deleteColumn = async (columnKey: string) => {
    source.columnData.forEach(async (column) => {
      if(column.key === columnKey){
        let params = {
          resultId: Number(column.key), 
          email: localStorage.getItem('email'),
          projectId: String(localStorage.getItem('project'))
        }
        await axios.post('/deleteAnalysisResults', params);
        let newComparisonIds = comparisonIds.slice();
        newComparisonIds.splice(newComparisonIds.indexOf(column.key), 1);
        dispatch(updateComparisonIds(newComparisonIds));
      }
    });
    const columnsBuffer = columns;
    setColumns(columnsBuffer.filter((column) => column.key !== columnKey))
    const dataBuffer = cellData;
    const newData = dataBuffer.map((row) => {
      delete row[columnKey];
      return row;
    })
    setCellData(newData);
  }

  const sortColumn = () => {
    const columnsBuffer = [...columns];
    const sortedColumns = columnsBuffer.sort((column1, column2) => {
      const idx1 = columnSequence.indexOf(column1.key)
      const idx2 = columnSequence.indexOf(column2.key)
      if (column2.key === 'comparison') {
        return 0;
      }
      return idx1 - idx2;
    })
    setColumns(sortedColumns)
  }

  useEffect(() => {
    if (source !== undefined) {
      // Columns
      const columnData = source.columnData
      const columnsBuffer = [
        { key: 'comparison', name: "" },
        ...columnData.map((column) => {
          return { key: column.key, name: column.name, removeEnabled: true }
        })
      ]
      setColumns(columnsBuffer);
      // Column sequence
      const sequenceData = source.columnSequence;
      setSortString(sequenceData.toString());
      // Row Breakdown options
      const optionsData = source.tableStructure.rowBreakdownOptions;
      setRowBreakdownOptions(optionsData);
      // Row names
      const rowData = source.tableStructure.group;
      const rows = rowData.map((group, idx) => {
        return [
          {
            name: group.name,
            key: `group_${idx}`,
            isGroup: true
          }, ...group.items];
      }).flat();
      setRowNames(rows);
    }
  }, [source, refresh])

  useEffect(() => {
    const handleData = () => {
      //if (!pageLoaded) {
        const comparison = rowNames.map((row: IRowType<IData>): ICellType<IData> => {
          return {
            key: row.key,
            colKey: "comparison",
            value: row.name,
            isGroup: row.isGroup,
            rowBreakdownOptions: row.rowBreakdownOptions
                  ? row.rowBreakdownOptions
                    .map((key) => (rowBreakdownOptions.filter((option) => option.key === key)[0]))
                  : undefined
          }
        })
        // fetch data initially
        const columnData = source.columnData.map((column) => {
          return column.data.map((row: IData): ICellType<IData> => {
            return {
              key: row.key,
              colKey: column.key,
              value: row.value
            }
          })
        })
        // combine row names to data
        columnData.unshift(comparison)

        const processed = columnData[0].map((rowKey, idx) => {
          return columnData.map(row => {
            return row.filter((cell) => cell.key === rowKey.key)[0]
          })
        }).map((row) => {
          let grouped = {}
          row.filter(cell => cell !== undefined).map((cell) => {
            grouped = {
              ...grouped,
              [cell.colKey]: cell.value,
              isGroup: cell.isGroup
            }
            return { [cell.colKey]: cell.value }
          })
          grouped = {
            ...grouped,
            rowBreakdownOptions: row[0].rowBreakdownOptions
          }
          return grouped
        })
        setCellData(processed)
      //} else {
        // Todo: need to manage table data
        // const columnData = [...data]
        // setCellData(columnData)
      //}
    }
    if (source !== undefined) {
      handleData()
    }
  }, [source, columns, rowNames, rowBreakdownOptions, pageLoaded])

  useEffect(() => {
    if (cellData.length) {
      setPageLoaded(true)
    }
  }, [cellData])

  useEffect(() => {
    const handleColumnSequence = () => {
      const sequenceData = sortString.split(',');
      const columnData = [...columns];
      sequenceData.push(...columnData.map((column) => column.key).filter((column) => column !== 'comparison'));
      const buffer = sequenceData.filter((c, index) => {
        return sequenceData.indexOf(c) === index;
      });
      setColumnSequence(buffer);
    }
  
    handleColumnSequence();
  }, [sortString, columns])

  return (
    <div data-rank-table='true' className={classes.root}>
      <ReactTable data={cellData} columns={columns} actions={{ deleteColumn: deleteColumn}} />
      <input type={'text'} value={sortString} onChange={(e) => {setSortString(e.target.value);}} />
      <button onClick={sortColumn}>Sort</button>
    </div>
  );
};

export default CompareTable;
