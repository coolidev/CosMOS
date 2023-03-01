import { FC, useEffect } from 'react';
import TextBox from 'devextreme-react/text-box';

interface DataTagBoxLiteProps {
  event: any;
  setPrevValue: any;
}

interface AttrValue {
  id: number;
  name: string;
}

/**
 * Multi-select box for editing network attributes
 * @param {any} {event
 * @param {any} attrValues}
 * @return {=>}
 */
const DataTagBoxLite: FC<DataTagBoxLiteProps> = ({event, setPrevValue}) => {

  useEffect (() => {
    setPrevValue(event.data.key.value);
  }, [setPrevValue, event.data.key.value])

  const handleChange = (e) => {
    event.data.setValue(e.value); 
  }

  return (
    <>
      <TextBox
        defaultValue={event.data.value}
        onValueChanged={handleChange}
      />
    </>
  );
};

export default DataTagBoxLite;
