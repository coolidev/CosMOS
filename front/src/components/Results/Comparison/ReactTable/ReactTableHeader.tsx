import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faThumbtack } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge, IconButton, makeStyles, Theme, Tooltip } from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import React, { useEffect, useState } from "react";
import { Status } from "src/types/comparison";
import { IActionType, IColumnType } from "./ReactTable";

interface Props<T> {
  columns: IColumnType<T>[];
  actions?: IActionType;
  compressed: boolean[];
  status: Status;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: '3rem',
    // borderBottom: '1px solid red',
    backgroundColor: 'rgb(68,114,196)',
    color: 'white'
  },
  removeBtn: {
    cursor: 'pointer',
    color: '#e34747'
  }
}));

const renderPinIcon = () => {
  return (
    <Tooltip
      id="compareButton"
      title="Pin this selection for comparison"
    >
      <span>
        <IconButton
        >
          <Badge
            color="secondary"
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <FontAwesomeIcon
              icon={faThumbtack as IconProp}
              style={{ color: '#e14748' }}
              size="sm"
            />
          </Badge>
        </IconButton>
      </span>
    </Tooltip>)
}

export function ReactTableHeader<T>({ columns, actions, compressed, status }: Props<T>): JSX.Element {
  const classes = useStyles();
  const [isCompressedView, setIsCompressedView] = useState(false)
  useEffect(() => {
    if (compressed.length === 0) {
      setIsCompressedView(false)
    } else {
      setIsCompressedView(true)
    }
  }, [compressed])

  return (
    <React.Fragment>
      <tr className={classes.root}>
        {columns.map((column, columnIndex) => {
          const columnWidth = column.width === undefined ? 'auto' : (isCompressedView && columnIndex > 0 ? column.width : column.width * 2);
          return (<React.Fragment key={`table-head-cell-${columnIndex}`}>
            {columnIndex === 0 ? <>
              <th style={{ width: columnWidth }} rowSpan={2}>{column.name}</th>
            </> : isCompressedView && !compressed[columnIndex] ? <>
                <th style={{ width: columnWidth }}></th>
                <th style={{ width: columnWidth }}>
                  {column.name}{column.removeEnabled && (status.page === 1 && columnIndex === 1 ? renderPinIcon() : <DeleteIcon onClick={() => {actions?.deleteColumn(column.key)}} className={classes.removeBtn} />)}
                </th>
              </> : <>
                <th colSpan={isCompressedView ? 1 : 2} style={{ width: columnWidth }}>
                  {column.name}{column.removeEnabled && (status.page === 1 && columnIndex === 1 ? renderPinIcon() : <DeleteIcon onClick={() => {actions?.deleteColumn(column.key)}} className={classes.removeBtn} />)}
                </th>
              </>}
          </React.Fragment>)
        })}
      </tr>
      <tr className={classes.root}>
        {columns.map((column, columnIndex) => {
          return (<React.Fragment key={`table-subhead-cell-${columnIndex}`}>
            {columnIndex === 0 ? <></> : !compressed[columnIndex] ? <><th>Input</th><th>Output</th></> : <><th>Output</th></>}
          </React.Fragment>)
        })}
      </tr>
    </React.Fragment>
  );
}
