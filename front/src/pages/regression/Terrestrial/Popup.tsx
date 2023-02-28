import { FC } from 'react';
import {
  Grid,
  Button,
  Box,
  FormControlLabel,
  Checkbox,
  Tooltip,
  Typography,
  Divider
} from '@material-ui/core';
import useStyles from '../../../utils/styles';
import DialogBox from '../../../components/DialogBox';
import HeatMap from './HeatMap';
import type { TerrestrialData } from 'src/types/evaluation';

interface PopupProps {
  metricType: string;
  label: string;
  open: boolean;
  isEarth: boolean;
  mode: string;
  source: TerrestrialData;
  toggleEarthView: () => void;
  onChartClose: () => void;
  onViewChange: (e: any) => void;
  onReset: () => void;
  onClick: (e: any) => void;
  isClickable: boolean;
}

const Popup: FC<PopupProps> = ({
  metricType,
  label,
  open,
  isEarth,
  mode,
  source,
  toggleEarthView,
  onChartClose,
  onViewChange,
  onReset,
  onClick,
  isClickable
}) => {
  const classes = useStyles();

  return (
    <DialogBox
      title={label}
      isOpen={open}
      onClose={() => onChartClose()}
      style={{ height: '90vh' }}
      className={{ paper: classes.dialogDeep }}
    >
      <Grid container justifyContent="center" alignItems="center">
        <Grid item md={11} className="mt-4">
          <Grid container justifyContent="center" className="mb-4">
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              spacing={2}
              style={{ height: '500px' }}
            >
              <HeatMap
                metricType={metricType}
                isSubSection={true}
                isEarth={isEarth}
                mode={mode}
                size={{
                  width: 600,
                  height: 500
                }}
                source={source}
                onClick={onClick}
                isClickable={isClickable}
              />
              <>
                  <Grid item md={12}>
                    <Box
                      borderColor="primary.main"
                      border={2}
                      borderRadius={5}
                      padding={2}
                      style={{ zIndex: 1000 }}
                    >
                      <Grid container justifyContent="center" alignItems="center">
                        <Divider orientation="vertical" flexItem />
                        <Grid item md={6}>
                          <Grid container justifyContent="center" alignItems="center">
                            <Grid item md={12}>
                              <Button
                                name="heatmap"
                                variant={
                                  mode === 'heatmap' ? 'contained' : 'outlined'
                                }
                                size="small"
                                color="primary"
                                onClick={(e) => onViewChange(e)}
                                style={{ width: '92%', marginRight: '4%' }}
                                className="mb-2"
                              >
                                Model Data
                              </Button>
                            </Grid>
                            <Grid item md={12}>
                              <Button
                                name="interpolated"
                                variant={
                                  mode === 'interpolated'
                                    ? 'contained'
                                    : 'outlined'
                                }
                                size="small"
                                color="primary"
                                onClick={(e) => onViewChange(e)}
                                style={{ width: '92%', marginRight: '4%' }}
                              >
                                Interpolation
                              </Button>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Divider orientation="vertical" flexItem />
                        <Grid item md={3} className="ml-3">
                          <FormControlLabel
                            control={
                              <Checkbox
                                name="show_scatter"
                                checked={isEarth === true}
                                size="small"
                                onChange={toggleEarthView}
                                color="primary"
                              />
                            }
                            label="Show earth"
                          />
                        </Grid>
                        <Divider orientation="vertical" flexItem />
                        <Grid item md={2} className="ml-3">
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
                                variant="outlined"
                                size="small"
                                disabled={false}
                                onClick={onReset}
                                fullWidth
                              >
                                Reset
                              </Button>
                            </span>
                          </Tooltip>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                </>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </DialogBox>
  );
};

export default Popup;
