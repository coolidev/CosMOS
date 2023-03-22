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
    // width: '100%',
    // minWidth: '600px',
    borderSpacing: 0,
    '& td' : {
      border: `1px solid ${theme.palette.border.main}`
    },
    '& th' : {
      border: `1px solid white`,
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