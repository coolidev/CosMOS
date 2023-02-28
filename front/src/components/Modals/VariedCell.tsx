import { FC, useEffect, useState } from 'react';
import TagBox from 'devextreme-react/tag-box';
import TextBox from 'devextreme-react/text-box';
import { multiSelectList } from  './AdvancedOptions'
import { dropdownList } from './AdvancedOptions';
import { FormControl, MenuItem, Select } from '@material-ui/core';
import { State } from 'src/pages/home';

interface VariedCellProps {
  event: any;
  attributes: Map<any,any>;
  state: State;
  onState: (name: string, value: any) => void;
  //There should probably be a better solution to this problem than this but i dont have time lol
  dropdownVal: number
  setDropdownVal: any
}

// interface AttrValue {
//   id: number;
//   name: string;
// }
const enum DisplayType {
  MULTI_SELECT = 0,
  DROPDOWN = 1,
  TEXT_BOX = 2
}

/**
 * Multi-select type cell for changing select type in network filters
 * @param {any} event
 * @param {any[]} attributes
 * @return {=>}
 */

const VariedCell: FC<VariedCellProps> = ({event, attributes, state, onState, dropdownVal, setDropdownVal}) => {
 const [displayMode, setDisplayMode] = useState<number>(DisplayType.TEXT_BOX);
  // const [value, setValue] = useState([]);

  useEffect(() => {
        if(multiSelectList.includes(event.data.row.data.filterName)){
            setDisplayMode(DisplayType.MULTI_SELECT)
        } else if (dropdownList.includes(event.data.row.data.filterName)){
            setDisplayMode(DisplayType.DROPDOWN);
            let currDropdownVal = attributes.get(event.data.row.data.filterName).filter((value) => value.name === event.data.value)[0]?.id
            setDropdownVal(currDropdownVal?? -1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //parses the value to be readable to the filters
  const handleChange = (e) => {
    let newVal = "";
    if(e.event != null){
        if(e.value.length > 0 && displayMode === DisplayType.MULTI_SELECT){
            newVal = e.value[0];
            for(let i = 1; i < e.value.length; i++){
                newVal = newVal + ','+ e.value[i];
            }
        } else {
            newVal = e.value;
        }
        event.data.setValue(newVal); 
    } else {
      if(displayMode === DisplayType.DROPDOWN){
          let name = attributes.get(event.data.row.data.filterName).filter((value) => value.id === e.target.value)[0].name
          setDropdownVal(e.target.value);
          event.data.setValue(name); 
      }
    }
  }

  const getEntryType = () => {
    switch (displayMode) {
      case DisplayType.MULTI_SELECT:
        return(
          <TagBox
            dataSource={attributes.get(event.data.row.data.filterName)}
            defaultValue = {[]}
            valueExpr="name"
            displayExpr="name"
            showSelectionControls={true}
            maxDisplayedTags={3}
            showMultiTagOnly={false}
            applyValueMode="useButtons"
            searchEnabled={true}
            stylingMode="outlined"
            onValueChanged={handleChange}
            width="200px"
          />
        );
      case DisplayType.DROPDOWN:
        return(
          <FormControl variant="outlined" size="small" fullWidth>
            <Select
              name="antenna"
              variant="outlined"
              color="primary"
              onChange={handleChange}
              value = {dropdownVal}
            >
              {attributes.get(event.data.row.data.filterName).map((item) => (
                <MenuItem value={item.id} key={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )
        
      case DisplayType.TEXT_BOX:
        return(
          <TextBox
            defaultValue={event.data.value}
            onValueChanged={handleChange}
          />
        )
    }
  }
  
  return (getEntryType());
};

export default VariedCell;
