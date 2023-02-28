import { makeStyles, Theme } from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import { IActionType, IColumnType } from "./ReactTable";

interface Props<T> {
  columns: IColumnType<T>[];
  actions?: IActionType;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: '3rem',
    borderBottom: '1px solid red'
  },
  removeBtn: {
    cursor: 'pointer',
    color: '#e34747'
  }
}));

export function ReactTableHeader<T>({ columns, actions }: Props<T>): JSX.Element {
  const classes = useStyles();
  return (
    <tr className={classes.root}>
      {columns.map((column, columnIndex) => (
        <th
          key={`table-head-cell-${columnIndex}`}
          style={{ width: column.width }}
        >
          {column.name}
          {column.removeEnabled && (<DeleteIcon onClick={() => {actions?.deleteColumn(column.key)}} className={classes.removeBtn} />)}
        </th>
      ))}
    </tr>
  );
}
