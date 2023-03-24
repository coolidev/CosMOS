import { makeStyles} from "@material-ui/core";
import { State } from "src/pages/home";
import { Theme } from "src/theme";
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
  markForComparison: Function;
}

interface Props<T> {
  data: T[];
  columns: IColumnType<T>[];
  compressed: boolean[];
  status: Status;
  actions?: IActionType;
  state: State
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
    // minWidth: '600px',
    borderSpacing: 0,
    '& tbody > tr:not(:first-child) td.row-group': {
      color: 'transparent'
    },
    '& td' : {
      borderBottom: `1px solid rgb(220, 220, 220)`,
      borderLeft: `1px solid rgb(220, 220, 220)`,
      borderRight: `1px solid rgb(220, 220, 220)`,
      '&:first-child': {
        borderLeft: 'none',
      },
      padding: '2px 12px',
    },
    '& th' : {
      // border: `1px solid white`,
      padding: '2px 12px',
      borderBottom: '0px'
    },
  }
}));

export function ReactTable<T>({ data, columns, actions, compressed, status, state }: Props<T>): JSX.Element {
  const classes = useStyles();
  return (
    <table className={classes.root}>
      <thead>
        <ReactTableHeader columns={columns} actions={actions} compressed={compressed} status={status} state={state}/>
      </thead>
      <tbody>
        <ReactTableRow data={data} columns={columns} />
      </tbody>
    </table>
  );
}