import React, { FC } from 'react';
import {
  Grid,
  Button,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  CssBaseline,
  Slide,
  FormControlLabel,
  FormControl,
  Checkbox,
  Tooltip,
  Typography,
  Select,
  MenuItem,
  IconButton,
  makeStyles,
  useTheme
} from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import { Close as CloseIcon } from '@material-ui/icons';
import useStyles from '../../utils/styles';
import ThreeViewSection from './SurfacePlot';
import TwoViewSection from './LinePlot';
import type { Theme } from 'src/theme';
import {
  PerformancePanel
} from 'src/types/evaluation';
import type { State } from 'src/pages/home';
import { QUALITY_INDICATORS } from 'src/utils/constants/regressions';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import { HelpCircle } from 'react-feather';
import Heatmap from './Heatmap';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface PlotDialogProps {
  state: State[];
  data: PerformancePanel[];
  metricType: string;
  minAltitude: number;
  maxAltitude: number;
  maxInclination: number;
  values: number[];
  size: { width: number, height: number };
  plotOptions: { show_surface: boolean; show_scatter: boolean };
  reset: boolean;
  onReset: () => void;
  viewMethod: string;
  onViewChange: (event: any) => void;
  open: boolean;
  chartDiv: string;
  isClickable: boolean;
  zAxisLabel: string;
  onCheck: (event: any) => void;
  onClick: (event: any) => void;
  label: string;
  showRegressionDisabled: boolean;
  onChartClose: () => void;
  onState: (name: string, value) => void;
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<Function>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const myStyles = makeStyles((theme: Theme) => ({
  low: {
    color: '#FF0000',
    textAlign: 'right'
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  },
  medium: {
    color: '#E5A001',
    textAlign: "right"
  },
  high: {
    color: '#00A500',
    textAlign: "right"
  },
  none: {
    color: '#808080',
    textAlign: "right"
  }
}));

const PlotDialog: FC<PlotDialogProps> = ({
  state,
  data,
  metricType,
  minAltitude,
  maxAltitude,
  maxInclination,
  values,
  plotOptions,
  reset,
  onReset,
  viewMethod,
  onViewChange,
  open,
  chartDiv,
  isClickable,
  zAxisLabel,
  onCheck,
  onClick,
  label,
  onChartClose,
  size,
  showRegressionDisabled,
  onState
}) => {
  const myClasses = myStyles();
  const classes = useStyles();
  const theme = useTheme<Theme>();

  let qualityClass = myClasses.none;
  let qualityState = state.length === 1 ? QUALITY_INDICATORS[state[0].qualityIndicators[metricType]] : '';
  switch (qualityState){
    case 'Low':
      qualityClass = myClasses.low;
      break;
    case 'Medium':
      qualityClass = myClasses.medium;
      break;
    case 'High':
      qualityClass = myClasses.high;
      break;
  }

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      onClose={() => onChartClose()}
      maxWidth="md"
      fullWidth
    >
      <CssBaseline />
      <DialogTitle
        style={{
          margin: 0,
          padding: '16px',
          backgroundColor: theme.palette.primary.light
        }}
      >
        <Typography component="strong" variant="h4">
          {label}
        </Typography>
        <IconButton
          aria-label="Close"
          className={myClasses.closeButton}
          onClick={() => onChartClose()}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        dividers={true}
        style={{
          backgroundColor: theme.palette.background.light,
          padding: 0,
          overflow: 'hidden'
        }}
      >
        <Grid container>
          <Grid
            item
            md={3}
            style={{ backgroundColor: theme.palette.background.paper }}
          >
            <Box
              p={5}
              mr={4}
              justifyContent="center"
              display="flex"
              flexDirection="column"
            >
                            <Box>
                <Box mb={2}>
                  <Typography variant="body1" component="p" color="textPrimary">
                    View
                  </Typography>
                </Box>
                {(state.length === 1 && state[0].noRegression)? 
                  <Button
                    name="4d_view"
                    variant={'contained'}
                    size="small"
                    color="primary"
                    onClick={(e) => onViewChange(e)}
                    style={{ borderRadius: 0 }}
                    fullWidth
                >
                  4D
                </Button>
                :
                <>
                  <Button
                    name="2d_view"
                    variant={viewMethod === '2d_view' ? 'contained' : 'outlined'}
                    size="small"
                    color="primary"
                    onClick={(e) => onViewChange(e)}
                    style={{ borderRadius: 0 }}
                    fullWidth
                  >
                    2D
                  </Button>
                  <Button
                    name="3d_view"
                    variant={viewMethod === '3d_view' ? 'contained' : 'outlined'}
                    size="small"
                    color="primary"
                    onClick={(e) => onViewChange(e)}
                    style={{ borderRadius: 0 }}
                    fullWidth
                  >
                    3D
                  </Button>
                </>
              }
              </Box>
              <Box>
              {(state.length === 1 && !state[0].noRegression) && (<><Box mb={2} mt={6}>
                  <Typography variant="body1" component="p" color="textPrimary">
                    Regression Type
                  </Typography>
                </Box>
                <FormControl variant="filled" size="small" fullWidth>
                  <Select
                    fullWidth
                    name="regressionType"
                    variant="outlined"
                    value={state[0].regressionTypes[metricType]}
                    onChange={event => onState('regressionTypes', { ...state[0].regressionTypes, [metricType]: event.target.value.toString() })}
                    style={{
                      backgroundColor: theme.palette.background.light,
                      border: `1px solid ${theme.palette.border.main}`
                    }}
                  >
                    <MenuItem value="" disabled>
                      <em>{`None`}</em>
                    </MenuItem>
                    <MenuItem value="gam">GAM</MenuItem>
                    {Object.keys(data[0].predictedData.coefficients).length >
                      0 && <MenuItem value="glm">GLM</MenuItem>}
                  </Select>
                </FormControl></>)}
              </Box>
              <Box my={10}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="show_surface"
                      checked={plotOptions.show_surface}
                      size="small"
                      onChange={(e) => onCheck(e)}
                      color="primary"
                      disabled={showRegressionDisabled}
                    />
                  }
                  label="Show Regression"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="show_scatter"
                      checked={plotOptions.show_scatter}
                      size="small"
                      onChange={(e) => onCheck(e)}
                      color="primary"
                    />
                  }
                  label="Show Data"
                />      
              </Box>
              <Box flexGrow={1} />
              <Box mt={7}>
                <Tooltip
                  title={
                    <Typography
                      gutterBottom
                      component="p"
                      variant="body1"
                      dangerouslySetInnerHTML={{
                        __html: 'Reset Plot'
                      }}
                    />
                  }
                  placement="top-start"
                  classes={{ tooltip: classes.tooltip }}
                >
                                    <span>
                    <Button
                      name="Reset"
                      variant="contained"
                      color="primary"
                      onClick={onReset}
                      fullWidth
                    >
                      Reset
                    </Button>
                  </span>
                </Tooltip>
              </Box>
            </Box>
          </Grid>
          <Grid item md={9} style={{ position: 'relative' }}>
            <Box display="flex" justifyContent="center" p={2}>
              <Box>
                {viewMethod === '4d_view' && (
                  <Heatmap 
                    state={state} 
                    data={data} 
                    minAltitude={minAltitude} 
                    maxInclination={maxInclination} 
                    metricType={metricType} 
                    values={values} 
                    isLegend={false} 
                    isSub={false} 
                    size={size} 
                    plotOptions={plotOptions} 
                    chartDiv={chartDiv} 
                    reset={false} 
                    title={zAxisLabel}          
                  />
                )}
                {viewMethod === '3d_view' && (
                  <ThreeViewSection
                    state={state}
                    data={data}
                    metricType={metricType}
                    regressionTypes={state.map(s => s.regressionTypes[metricType])}
                    minAltitude={minAltitude}
                    maxAltitude={maxAltitude}
                    maxInclination={maxInclination}
                    values={values}
                    reset={reset}
                    isLegend={true}
                    isSub={true}
                    zAxisLabel={zAxisLabel}
                    plotOptions={plotOptions}
                    chartDiv={chartDiv}
                    size={size}
                  />
                )} {viewMethod === '2d_view' && (
                  <TwoViewSection
                    state={state}
                    data={data}
                    metricType={metricType}
                    regressionTypes={state.map(s => s.regressionTypes[metricType])}
                    minAltitude={minAltitude}
                    maxAltitude={maxAltitude}
                    values={values}
                    isLegend={true}
                    isSub={true}
                    yAxisLabel={zAxisLabel}
                    plotOptions={plotOptions}
                    onClick={onClick}
                    chartDiv={chartDiv}
                    isClickable={isClickable}
                    size={size}
                  />
                    )}
                  </Box>
                  {state.length === 1 && <Tooltip
                    id="quality"
                    title={`Regression Quality: ${
                      QUALITY_INDICATORS[state[0].qualityIndicators[metricType]]
                    }`}
                    style={{ position: 'absolute', top: 20, right: 20 }}
                  >
                    <div className={qualityClass}>
                      {qualityState === 'High' ? (
                        <CheckCircleIcon className={qualityClass} />
                      ) : qualityState === 'Medium' ? (
                        <FontAwesomeIcon
                          icon={faMinusCircle as IconProp}
                          className={qualityClass}
                          size={'lg'}
                        />
                      ) : qualityState === 'Low' ? (
                        <CancelIcon className={qualityClass} />
                      ) : (
                        <HelpCircle className={qualityClass} />
                      )}
                    </div>
                  </Tooltip>}
                </Box>
          </Grid>
        </Grid>
    </DialogContent>
  </Dialog>
  );
}

export default PlotDialog;