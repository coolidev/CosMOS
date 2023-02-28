import { makeStyles, Theme } from "@material-ui/core";
import { ReactTableHeader } from "./ReactTableHeader";
import { ReactTableRow } from "./ReactTableRow";

export interface IColumnType<T> {
  key: string;
  name: string;
  removeEnabled?: boolean;
  width?: number;
  render?: (column: IColumnType<T>, item: T) => void;
}

export interface IActionType {
  deleteColumn: Function;
}

interface Props<T> {
  data: T[];
  columns: IColumnType<T>[];
  actions?: IActionType;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
    minWidth: '600px',
  }
}));

export function ReactTable<T>({ data, columns, actions }: Props<T>): JSX.Element {
  const classes = useStyles();
  return (
    <table className={classes.root}>
      <thead>
        <ReactTableHeader columns={columns} actions={actions} />
      </thead>
      <tbody>
        <ReactTableRow data={data} columns={columns} />
      </tbody>
    </table>
  );
}