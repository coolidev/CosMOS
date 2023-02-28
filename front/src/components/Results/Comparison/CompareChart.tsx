import { FC, useState, useEffect } from 'react';
import {
  Chart,
  Legend,
  Series,
  Tooltip,
  ConstantLine,
  ValueAxis,
  ArgumentAxis,
  Label
} from 'devextreme-react/chart';
import { makeStyles, useTheme } from '@material-ui/core';
import { getLevel } from 'src/utils/util';
import DialogBox from 'src/components/DialogBox';
import type { Theme } from 'src/theme';

interface CompareChartProps {
  open: boolean;
  source: any;
  params: any;
  onClose: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  dialog: {
    width: theme.spacing(180),
    height: theme.spacing(160)
  },
  chart: {
    marginTop: '10%'
  }, 
  valueAxis: {  
    label: {  
        font: {  
            color: "red",  
            size: 14  
        }  
    }  
}  
}));

const CompareChart: FC<CompareChartProps> = ({
  open,
  source,
  params,
  onClose
}) => {
  const classes = useStyles();
  const [results, setResults] = useState(null);
  const [title, setTitle] = useState<string>('subChart');
  const theme = useTheme<Theme>();

  useEffect(() => {
    const data = Object.keys(source)[0];
    setTitle(data);
    setResults(source[data]);
  }, [source]);

  let itemVal =
    Object.values(source).length > 0 ? Object.values(source)[0][0].key : null;
  let level = itemVal ? getLevel(params, itemVal) : null;

  return (
    <DialogBox
      title={title}
      isOpen={open}
      onClose={onClose}
      className={{ paper: classes.dialog }}
    >
      <Chart
        id={'subChart' + title && `_${title.split(' ').join('_')}`}
        dataSource={results}
        className={classes.chart}
      >
        <Series valueField="value" argumentField="system_name" type="bar" color={theme.palette.primary.main} />
        {level && (
          <ValueAxis
            //@ts-ignore
            min={itemVal === 'systemIOCTime' ? 1980 : 0}
          >
            <ConstantLine width={2} value={level} color={theme.palette.primary.main}>
              <Label visible={false} />
            </ConstantLine>
            {itemVal === 'systemIOCTime' && (
              <Label customizeText={(val) => val.value} />
            )}
          </ValueAxis>
        )}
        <ArgumentAxis>
          <Label
            alignment="center"
            displayMode="rotate"
            rotationAngle={-35}
            overlappingBehavior="rotate"
            font={{color: theme.palette.text.primary}}
          />
        </ArgumentAxis>
        <Legend visible={false} />
        <Tooltip enabled={true} location="edge" zIndex={10000} />
      </Chart>
    </DialogBox>
  );
};

export default CompareChart;
