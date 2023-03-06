import { makeStyles, Theme } from "@material-ui/core";
import { Status } from "src/types/comparison";
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
  compressed: boolean[];
  status: Status;
  actions?: IActionType;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    // width: '100%',
    // minWidth: '600px',
    borderSpacing: 0,
    '& td' : {
      border: '1px solid white'
    },
    '& th' : {
      border: '1px solid white'
    },
  }
}));

export function ReactTable<T>({ data, columns, actions, compressed, status }: Props<T>): JSX.Element {
  const classes = useStyles();
  return (
    <table className={classes.root}>
      <thead>
        <ReactTableHeader columns={columns} actions={actions} compressed={compressed} status={status} />
      </thead>
      <tbody>
        <ReactTableRow data={data} columns={columns} />
      </tbody>
    </table>
  );
}