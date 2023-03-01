import { FC, useEffect, useState } from 'react';
import TagBox from 'devextreme-react/tag-box';
import TextBox from 'devextreme-react/text-box';
import { Switch } from 'devextreme-react';
import { calcStateKeyList, multiKeyList, dropdownList, booleanKeyList, stdsList } from '.';
import FormControl from '@material-ui/core/FormControl';
import { MenuItem, Select } from '@material-ui/core';
import { STANDARDS_MAPPING } from 'src/utils/constants/network-library';
import { convertSingleStandardToInt } from 'src/algorithms/network-library';

interface AttrValue {
  id: number;
  name: string;
}

interface DataTagBoxProps {
  event: any;
  attrValues: AttrValue[];
  platformAttrValues: AttrValue[];
  referenceBodyAttrValues: AttrValue[];
  vcmVdrAttrValues: AttrValue[];
  polarizationAttrValues: AttrValue[];
  dataFormatAttrValues: AttrValue[];
  codingAttrValues: AttrValue[];
  setPrevValue: any;
}

interface AttrValue {
  id: number;
  name: string;
}

/**
 * Variable style editing box for editing network attributes. Depending on the type of attribute,
 * the type of data entry will change
 * @param {any} {event
 * @param {any} attrValues}
 * @return {}
 */
const DataTagBox: FC<DataTagBoxProps> = ({ event, attrValues, platformAttrValues, referenceBodyAttrValues, vcmVdrAttrValues, polarizationAttrValues, dataFormatAttrValues, codingAttrValues, setPrevValue}) => {
  const [multiVisible, setMultiVisible] = useState<boolean>(false);
  const [calcStateVisible, setCalcStateVisible] = useState<boolean>(false);
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [booleanVisible, setBooleanVisible] = useState<boolean>(false);
  const [calcState, setCalcState] = useState<boolean>(event.data.key.value !== '');

  const [values, setValues] = useState<AttrValue[]>([]);
  const [attributes, setAttributes] = useState<AttrValue[]>([]);

  const [selectedItem, setSelectedItem] = useState<number>(Number(event.data.value));

  useEffect(() => {
    if(stdsList.includes(event.data.key.sub_key)) {
      let attrs = STANDARDS_MAPPING.map(e => {return {id:e.mask, name:e.name}});
      let selectedData = event.data.value;
      if(!Array.isArray(event.data.value)) {
        selectedData = event.data.value.split(",").map(convertSingleStandardToInt);  
      }
      setMultiVisible(true);
      setCalcStateVisible(false);
      setDropdownVisible(false);
      setBooleanVisible(false);
      setAttributes(attrs);
      setValues(selectedData);
    }
     else if (multiKeyList.includes(event.data.key.sub_key)) {
      let data = null;
      const list =
        typeof event.data.value === 'string'
          ? event.data.value.split(',')
          : event.data.value;
      if(event.data.key.sub_key === 'antenna_modulation' || event.data.key.sub_key === 'modulationType' || event.data.key.sub_key === 'antenna_subcarrier_modulation' || event.data.key.sub_key === 'rtnLnkMod'){
        setAttributes(attrValues);
        data = (list || []).map((element) => {
          const value = attrValues.find((item) => item.id === parseInt(element));
          if(typeof value === 'undefined' || value === null){
            return null;
          }
          return value.id;
        });
      }else if(event.data.key.sub_key === 'antenna_data_format' || event.data.key.sub_key === 'antenna_subcarrier_format' || event.data.key.sub_key === 'subcarrierDataFormat'){
        setAttributes(dataFormatAttrValues);
        data = (list || []).map((element) => {
          const value = attrValues.find((item) => item.id === parseInt(element));
          if(typeof value === 'undefined' || value === null){
            return null;
          }
          return value.id;
        });
      }else if(event.data.key.sub_key === 'decoding' || event.data.key.sub_key === 'channelCodingType'){
        setAttributes(codingAttrValues);
        data = (list || []).map((element) => {
          const value = attrValues.find((item) => item.id === parseInt(element));
          if(typeof value === 'undefined' || value === null){
            return null;
          }
          return value.id;
        });
      }
      else{
        data = (list || []).map((element) => {
          const value = attributes.find((item) => item.id === parseInt(element));
          if(typeof value === 'undefined' || value === null){
            return null;
          }
          return value.id;
        });
      }

      setMultiVisible(true);
      setCalcStateVisible(false);
      setDropdownVisible(false);
      setBooleanVisible(false);
      setValues(data);
      
    } else if(calcStateKeyList.includes(event.data.key.sub_key)){
      setMultiVisible(false);
      setDropdownVisible(false);
      setCalcStateVisible(true);
      setBooleanVisible(false);
      setCalcState(event.data.key.value !== '');
    } 
    else if(dropdownList.includes(event.data.key.sub_key)){
      // const list =
      // typeof event.data.value === 'string'
      //   ? event.data.value.split(',')
      //   : event.data.value;
      if(event.data.key.sub_key === 'platform_type'){
        setAttributes(platformAttrValues);
      }
      if(event.data.key.sub_key === 'reference_body'){
        setAttributes(referenceBodyAttrValues);
      }
      if(event.data.key.sub_key === 'vcmVdrSupport'){
        setAttributes(vcmVdrAttrValues);
      }
      if(event.data.key.sub_key === 'antenna_polarization'){
        setAttributes(polarizationAttrValues);
      }
      if(event.data.key.sub_key === 'antenna_data_format'){
        setAttributes(dataFormatAttrValues);
      }
      if(event.data.key.sub_key === 'decoding'){
        setAttributes(codingAttrValues);
      }
      setMultiVisible(false);
      setCalcStateVisible(false);
      setDropdownVisible(true);
      setBooleanVisible(false);
    } 
    else if(booleanKeyList.includes(event.data.key.sub_key)){
      setMultiVisible(false);
      setCalcStateVisible(false);
      setDropdownVisible(false);
      setBooleanVisible(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attrValues, platformAttrValues, referenceBodyAttrValues, vcmVdrAttrValues, codingAttrValues, dataFormatAttrValues, event]);

  useEffect (() => {
    setPrevValue(event.data.key.value);
  }, [setPrevValue, event.data.key.value])

  const handleChange = (e) => {
    const type = typeof e.value;
    //if its an array returned by the multiselect, join all of the options WITHOUT SPACES. <--This is important to the filtering
    if(type !== 'string' && type !== 'number' && type !== 'boolean' && event.data.key.sub_key !== 'standards_compliance'){
      event.data.setValue(e.value.join(','));
      return;
    //The standards compliance is special, just normally return it
    } else if (event.data.key.sub_key === 'standards_compliance') {
      event.data.setValue(e.value);
      return;
    }
    //If there is the option to calculate the value and it is left blank, we leave the value as is (Calculated)
    if(e.value.replace(' ','') === '' && calcState){
      return; 
    }
    //If the value isnt calculated and not empty, then send it back to be set
    if(e.value !== 'Calculated' && e.value.replace(' ','') !== ''){
      event.data.setValue(e.value);
    //otherwise, just send an empty string
    }else{
      event.data.setValue(''); 
    }
  }

  //a special handler for the dropdown style/component of the variable data entry box. <-- I like this name
  const handleDropdownChange = (e) => {
    setSelectedItem(Number(e.target.value))
    event.data.setValue(e.target.value.toString()); 
  }

  //When the switch is trigged it determines whether
  const handleSwitch = (e) => {
    setCalcState(e);
  }

  return (
    <>
      {multiVisible ? (
        <TagBox
          dataSource={attributes}
          defaultValue={values}
          valueExpr="id"
          displayExpr="name"
          showSelectionControls={true}
          maxDisplayedTags={3}
          showMultiTagOnly={false}
          applyValueMode="useButtons"
          searchEnabled={true}
          onValueChanged={handleChange}
          width="200px"
        />
      ) : calcStateVisible ? 
        <><div style={{ display: 'flex', flexDirection: 'row' }}>
            <TextBox
              value={!calcState?'Calculated':event.data.value}
              onValueChanged={handleChange}
              disabled={!calcState}
            />
            <Switch
              defaultValue={calcState}
              onValueChange={handleSwitch}
              hint={calcState?'Disable to allow automatic calculation':'Enable to set a custom static value'}
              style={{ paddingTop: '7px' }} 
            />
          </div></>
        : dropdownVisible ?
            <FormControl variant="outlined" size="small" fullWidth>
                <Select
                  name="antenna"
                  variant="outlined"
                  color="primary"
                  value={selectedItem}
                  onChange={handleDropdownChange}
                >
                  {attributes.map((item) => (
                    <MenuItem value={item.id} key={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
        : booleanVisible ?
        <FormControl variant="outlined" size="small" fullWidth>
          <Select
            name="YesNo"
            variant="outlined"
            color="primary"
            value={selectedItem}
            onChange={handleDropdownChange}
          >
            <MenuItem value={1} key={1}>
              Yes
            </MenuItem>
            <MenuItem value={0} key={0}>
              No
            </MenuItem>
          </Select>
        </FormControl>
        :
        <TextBox
          defaultValue={event.data.value}
          onValueChanged={handleChange}
        />
      }
    </>
  );
};

export default DataTagBox;
