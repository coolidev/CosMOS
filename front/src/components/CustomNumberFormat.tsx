import NumberFormat, { NumberFormatValues } from 'react-number-format';

function CustomNumberFormat(props){
    const { inputRef, onChange, ...other } = props;

    const isAllowed = (input: NumberFormatValues) => {
        const { value } = input;
        const parsedValue = parseFloat(value);

        if (props.min >= 0 && value === '-') return false;
        if (isNaN(parsedValue)) return true;
        if (parsedValue <= props.max && parsedValue >= props.min) return true;
        return false;
    };

    return (
        <NumberFormat
            {...other}
            getInputRef={inputRef}
            onValueChange={(values) => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value,
                    }
                });
            }}
            thousandSeparator={props.name === 'launchYear' || props.name === 'endYear' ? false : true}
            isNumericString
            decimalScale={props.name === 'launchYear' || props.name === 'endYear' ? 0 : props.name === "throughput" ? 4 : 2}
            isAllowed={isAllowed}
       />
    );
}

export default CustomNumberFormat;