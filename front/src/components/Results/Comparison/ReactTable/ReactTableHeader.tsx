import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faThumbtack } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge, IconButton, makeStyles, Tooltip } from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import React, { useEffect, useState } from "react";
import { State } from "src/pages/home";
import { useDispatch, useSelector } from "src/store";
import { Theme } from "src/theme";
import { Status } from "src/types/comparison";
import { IActionType, IColumnType } from "./ReactTable";

interface Props<T> {
  columns: IColumnType<T>[];
  actions?: IActionType;
  compressed: boolean[];
  status: Status;
  state: State;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: '3rem',
    // borderBottom: '1px solid red',
    backgroundColor: `${theme.palette.border.main}`,
    color: 'white',
    fontSize: '1.5rem'
  },
  removeBtn: {
    cursor: 'pointer',
    color: '#e34747'
  }
}));

export function ReactTableHeader<T>({ columns, actions, compressed, status, state }: Props<T>): JSX.Element {
  const classes = useStyles();
  const [isCompressedView, setIsCompressedView] = useState(false);
  const {performancePanel} = useSelector((state) => state.results);

  const dispatch = useDispatch();

  useEffect(() => {
    if (compressed.length === 0) {
      setIsCompressedView(false)
    } else {
      setIsCompressedView(true)
    }
  }, [compressed])

  const renderPinIcon = () => {
    return (
      <Tooltip
        id="compareButton"
        title="Pin this selection for comparison"
      >
        <span onClick = {() => {actions.markForComparison(true)}}>
          <IconButton>
            <Badge
              color="secondary"
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <FontAwesomeIcon
                icon={faThumbtack as IconProp}
                style = {{color: 'white', float: 'right'}}
                size="sm"
              />
            </Badge>
          </IconButton>
        </span>
      </Tooltip>)
  }
  

  return (
    <React.Fragment>
      <tr className={classes.root}>
        {columns.map((column, columnIndex) => {
          const columnWidth = column.width === undefined ? 'auto' : (isCompressedView && columnIndex > 0 ? column.width : column.width * 2);
          return (<React.Fragment key={`table-head-cell-${columnIndex}`}>
            {columnIndex === 0 ? <>
              <th style={{ width: columnWidth }}>{column.name}</th>
            </> : isCompressedView && !compressed[columnIndex] ? <>
                <th style={{ width: columnWidth }}></th>
                <th style={{ width: columnWidth, textAlign: 'center' }}>
                  {column.name}{column.removeEnabled && (status.page === 1 && columnIndex === 1 && performancePanel? renderPinIcon() : <DeleteIcon onClick={() => {actions?.deleteColumn(column.key)}} className={classes.removeBtn} style = {{color: 'white', float: 'right'}}/>)}
                </th>
              </> : <>
                <th colSpan={isCompressedView ? 1 : 2} style={{ width: columnWidth, textAlign: 'center' }}>
                  {column.name}{column.removeEnabled && (status.page === 1 && columnIndex === 1 && performancePanel? renderPinIcon() : <DeleteIcon onClick={() => {actions?.deleteColumn(column.key)}} className={classes.removeBtn} style = {{color: 'white', float: 'right'}}/>)}
                </th>
              </>}
          </React.Fragment>)
        })}
        <><th colSpan={10 - compressed.map((value) => isCompressedView && !value ? 2 : 1).reduce((partialSum, a) => partialSum + a, 0)}></th></>
      </tr>
    </React.Fragment>
  );
}