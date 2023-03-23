import { makeStyles} from "@material-ui/core";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { ContextMenu } from "devextreme-react";
import lodash from "lodash";
import { useEffect, useState } from "react";
import { Theme } from "src/theme";
import { THEMES } from "src/utils/constants/general";

import { IColumnType } from "./ReactTable";

interface Props<T> {
  index: number;
  item: T;
  column: IColumnType<T>;
}

interface Option {
  key: string;
  name: string;
  action: Function;
}

interface IContextItem {
  key: string;
  text: string;
  action: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
  },
  rowField: {
    backgroundColor: theme.palette.grey[700]
  },
  inputCell: {
    color: 'white',
    backgroundColor: `${theme.palette.border.main}`,
    border: `1px solid white`,
    minWidth: '5vw'
  },
  outputCell: {
    backgroundColor: 'white',
    minWidth: '5vw'
  }
}));

export function ReactTableRowCell<T>({ item, column, index }: Props<T>): JSX.Element {
  const classes = useStyles();
  const [options, setOptions] = useState<Option[]>()
  const [contextItems, setContextItems] = useState<IContextItem[]>([])
  const [isRowHeader, setIsRowHeader] = useState<boolean>(false)
  const value = lodash.get(item, column.key);
  const input = lodash.get(item, `input_${column.key}`)
  const output = lodash.get(item, `output_${column.key}`)
  const isCompressed = lodash.get(item, `isCompressed_${column.key}`)
  
  useEffect(() => {
    if (column.key === 'comparison') {
      const rowBreakdownOptions = lodash.get(item, 'rowBreakdownOptions');
      setOptions(rowBreakdownOptions)
      setIsRowHeader(true)
    }
  }, [item, column.key])

  useEffect(() => {
    const buffer = [];
    lodash.forEach(options, (option) => {
      buffer.push({ key: option.key, text: option.name, action: option.action })
    })
    setContextItems(buffer)
  }, [options])

  const handleSelectOption = (e) => {
    if (!e.itemData.items) {
      const test = contextItems.filter((option) => option.key === e.itemData.key)[0]
      const fn = new Function("return " + test.action)();
      fn(e.itemData.key)
    }
  }

  const renderItem = (data: IContextItem, index: number) => {
    return (
      <div key={data.key}>
        <span>{data.text}</span>
      </div>
    );
  }

  return (<>
    {isRowHeader ? (
      <td
        id={`context-menu-${index}`}
        // className={classes.rowField}
        colSpan={lodash.get(item, `isGroup_${column.key}`) === true ? 11 : 0}
        style={{
          fontSize: lodash.get(item, `isGroup_${column.key}`) === true ? '1.25rem' : '0.875rem',
          backgroundColor: lodash.get(item, `isGroup_${column.key}`) === true ? 'rgb(220, 220, 220)' : 'white',
        }}>
          {column.render ? column.render(column, item) : value}
          {contextItems.length > 0 && <>
            <ArrowDropDownIcon />
            <ContextMenu
              dataSource={contextItems}
              width={200}
              target={`#context-menu-${index}`}
              itemRender={renderItem}
              onItemClick={handleSelectOption}
            />
          </>}
      </td>) : (<>
          {!isCompressed && input ? <td className={classes.inputCell}>
            {input}
          </td> : <></>}
          {output && <td className={classes.outputCell}>
            {output}
          </td>}
        </>
      )}
    </>
  );
}