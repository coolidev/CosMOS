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
  groupField: {
    backgroundColor: 'rgb(220, 220, 220)',
    fontSize: '1rem',
  },
  normalField: {
    backgroundColor: 'white',
    fontSize: '0.875rem',
  },
}));

export function ReactTableRowCell<T>({ item, column, index }: Props<T>): JSX.Element {
  const classes = useStyles();
  const [options, setOptions] = useState<Option[]>()
  const [contextItems, setContextItems] = useState<IContextItem[]>([])
  const [isRowHeader, setIsRowHeader] = useState<boolean>(false)
  const value = lodash.get(item, column.key);
  const input = lodash.get<typeof item, string>(item, `input_${column.key}`)
  const output = lodash.get<typeof item, string>(item, `output_${column.key}`)
  const isCompressed = lodash.get(item, `isCompressed_${column.key}`)
  const isGroup = lodash.get(item, `isGroup_comparison`)
  
  useEffect(() => {
    if (column.key === 'comparison') {
      const rowBreakdownOptions = lodash.get<typeof item, string>(item, 'rowBreakdownOptions');
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
        className={isGroup ? classes.groupField : classes.normalField}
      >
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
          {isCompressed ?
            (isGroup ?
              (<>
                <td className={`${classes.groupField} row-group text-center`}>Output</td>
              </>) :
              (<>
                {output && <td className={`${classes.normalField} text-center`}>
                  {output}
                </td>}
              </>)) :
            (isGroup ?
              (<>
                <td className={`${classes.groupField} row-group text-center`} style={{ borderRight: 'none' }}>Input</td>
                <td className={`${classes.groupField} row-group text-center`} style={{ borderLeft: 'none' }}>Output</td>
              </>) :
              (<>
                {input ? <td className={`${classes.normalField} text-center`} style={{ borderRight: 'none' }}>
                  {input}
                </td> : <td className={`${classes.normalField} text-center`} style={{ borderRight: 'none' }}>
                    - -
                  </td>}
                {output ? <td className={`${classes.normalField} text-center`} style={{ borderLeft: 'none' }}>
                  {output}
                </td> : <td className={`${classes.normalField} text-center`} style={{ borderLeft: 'none' }}>
                    - -
                  </td>}
              </>))}
        </>
      )}
    </>
  );
}