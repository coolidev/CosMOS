/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from 'react';
import {
  colors,
  makeStyles,
  // useTheme
} from '@material-ui/core';
import { useWindowSize } from 'src/utils/util';
import {
  CompareHeader,
  CompareTable
} from 'src/components/Results';
import type { State } from 'src/pages/home';
import type { Theme } from 'src/theme';
import { THEMES } from 'src/utils/constants/general';
import { IComparisonType, Status } from 'src/types/comparison';
import axios from 'src/utils/axios';

interface ComparisonProps {
  state: State;
  onState: (name: string, value: any) => void;
  visible: boolean;
}

const initialStatus: Status = {
  page: 1,
  perPage: 5,
  totalPage: 1,
  isSize: true,
  width: '150px',
  disabled: false,
  isCompressedView: false
};

const initialSource: IComparisonType = {
  tableStructure: {
    group: [],
    rowBreakdownOptions: []
  },
  columnData: [],
  columnSequence: []
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: '100%',
    overflowX: 'hidden',
    overflowY: 'auto',
    backgroundColor: theme.palette.component.main
  },
  hide: {
    display: 'none',
  },
  dialog: {
    maxWidth: '500px',
    minHeight: '55vh'
  },
  title: {
    margin: 0,
    padding: theme.spacing(4),
    backgroundColor: THEMES.DARK
      ? theme.palette.background.light
      : colors.grey[200]
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.background.dark
  },
  select: {
    verticalAlign: 'middle',
    backgroundColor: theme.palette.background.light,
    border: `1px solid ${theme.palette.border.main}`,
    color: `${theme.palette.text.primary} !important`,
    '& .MuiSelect-iconOutlined': {
      color: theme.palette.border.main
    }
  }
}));

// Group names
export const PARAMETERS_NAME = 'Parameters';
export const RANKING_NAME = 'Ranking';
export const PERFORMANCE_NAME = 'Performance';
export const ANTENNA_OPTIONS_NAME = 'User Burden: Antenna Options';
export const MISSION_IMPACTS_NAME = 'User Burden: Mission Impacts';
export const NAV_AND_TRACKING_NAME = 'Nav and Tracking';

const Comparison: FC<ComparisonProps> = ({ state, onState, visible }) => {
  const size = useWindowSize();
  // const theme = useTheme<Theme>();
  const [status, setStatus] = useState<Status>(initialStatus);
  const [source, setSource] = useState<IComparisonType>(initialSource);
  const [initialData, setInitialData] = useState<IComparisonType>(initialSource);
  const [sortString, setSortString] = useState<string>('')
  const [columnSequence, setColumnSequence] = useState<string[]>([])
  const [pageLoaded, setPageLoaded] = useState<boolean>(false)

  const classes = useStyles();

  const deleteColumn = (columnKey: string) => {
    const sourceBuf = {...initialData};
    const columnDataBuf = (sourceBuf.columnData.filter((column) => column.key !== columnKey))
    sourceBuf.columnData = columnDataBuf
    setInitialData(sourceBuf);
    setStatus({...status})
  }

  const sortColumn = () => {
    const tData = {...initialData}
    const columnsBuffer = [...initialData.columnData];
    const sortedColumns = columnsBuffer.sort((column1, column2) => {
      const idx1 = columnSequence.indexOf(column1.key)
      const idx2 = columnSequence.indexOf(column2.key)
      return idx1 - idx2;
    })
    tData.columnData = sortedColumns
    setInitialData(tData)
    setStatus({...status})
  }

  const handleStatus = (values: Status) => setStatus(values);

  useEffect(() => {
    const initializeData = async () => {
      try {
        const params = {}
        // Todo here: fetching data
        const fetchInitialData = await axios.post<IComparisonType>('/requestComparison', params);

        setInitialData(fetchInitialData.data)
        setStatus((prevState) => ({
          ...prevState,
          totalPage: Math.ceil(fetchInitialData.data.columnData.length / status.perPage),
        }))
        // Column sequence
        const sequenceData = fetchInitialData.data.columnSequence;
        setSortString(sequenceData.toString());
      }
      catch (e) {
        console.log(e)
        throw e;
      }
    }
    initializeData();
  }, [])

  useEffect(() => {
    setPageLoaded(false);
  }, [status])

  useEffect(() => {
    if (!pageLoaded && initialData !== undefined) {
      setStatus((prevState) => ({
        ...prevState,
        totalPage: Math.ceil(initialData.columnData.length / status.perPage),
      }))
      const buffer = {
        tableStructure: initialData.tableStructure,
        columnData: initialData.columnData,
        columnSequence: initialData.columnSequence
      }
      setSource(buffer)
      setPageLoaded(false);
    }
  }, [initialData, status])
  
  useEffect(() => {
    if (source.columnData.length) {
      setPageLoaded(true)
    }
  }, [source])

  useEffect(() => {
    const handleColumnSequence = () => {
      const sequenceData = sortString.split(',');
      const columnData = [...initialData.columnData];
      sequenceData.push(...columnData.map((column) => column.key));
      const buffer = sequenceData.filter((c, index) => {
        return sequenceData.indexOf(c) === index;
      });
      setColumnSequence(buffer);
    }
  
    handleColumnSequence();
  }, [sortString])

  return (
    <div className={visible ? classes.root : classes.hide}>
      <CompareHeader
        status={status}
        onStatus={handleStatus}
        handleDialog={() => { }}
        disabled={state.radioButtonSelectionId === 0}
      />
      <CompareTable
        state={state}
        status={status}
        source={source}
        action={{deleteColumn: deleteColumn}}
      />
    </div>
  );
};

export default Comparison;
