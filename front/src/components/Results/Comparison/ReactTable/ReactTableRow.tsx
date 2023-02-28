import { makeStyles, Theme } from "@material-ui/core";
import { IColumnType } from "./ReactTable";
import { ReactTableRowCell } from "./ReactTableRowCell";

interface Props<T> {
  data: T[];
  columns: IColumnType<T>[];
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: '3rem',
    borderBottom: '1px solid red',
    '& > td:first-child': {
      fontWeight: "bold",
    },
  }
}));

export function ReactTableRow<T>({ data, columns }: Props<T>): JSX.Element {
  const classes = useStyles();
  return (
    <>
      {data.map((item, itemIndex) => (
        <tr key={`table-body-${itemIndex}`} className={classes.root}>
          {columns.map((column, columnIndex) => (
            <ReactTableRowCell
              key={`table-row-cell-${columnIndex}`}
              index={itemIndex}
              item={item}
              column={column}
            />
          ))}
        </tr>
      ))}
    </>
  );
}