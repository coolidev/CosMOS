import { FC, useState } from "react";
import { CSVLink } from "react-csv";
import {
  makeStyles,
  Grid,
  Button,
  Box,
  Typography,
  Tooltip,
  IconButton,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import LaunchIcon from "@material-ui/icons/Launch";
import SaveIcon from '@material-ui/icons/Save';
import { grey } from "@material-ui/core/colors";
import type {
  Params
} from 'src/types/dashboard';
import type {
  Metric
} from 'src/types/evaluation';

const useStyles = makeStyles((theme) => ({
  tooltip: {
    maxWidth: "500px",
  },
  formControl: {
    margin: theme.spacing(1),
  },
  tab: {
    color: '#FFF',
    '&:hover': {
      color: '#AAA'
    }
  }
}));

interface PlotOptionsProps {
  params: Params;
  regressionTypeOptions: { [key: string]: string };
  regressionType: string;
  onRegressionType: (regressionType: string) => void;
  regressionQuality: string;
  onRegressionQuality: (regressionQuality: string) => void;
  isEarth: boolean;
  toggleEarthView: () => void;
  mode: string;
  onViewChange: (event) => void;
  onReset: () => void;
  source: Metric[];
  checked: { show_surface: boolean; show_scatter: boolean; };
  viewMethod: string;
  incs: number[];
  isDash: boolean;
  onChecked: (event) => void;
  onChart: () => void;
  resetPlot: () => void;
  onInc: (value) => void;
  onViewMethod: (event) => void;
  saveDefaults: () => void;
};

const PlotOptions: FC<PlotOptionsProps> = ({
  params,
  regressionTypeOptions,
  regressionType,
  onRegressionType,
  regressionQuality,
  onRegressionQuality,
  isEarth,
  toggleEarthView,
  mode,
  onViewChange,
  onReset,
  source,
  checked,
  viewMethod,
  incs,
  isDash,
  onChecked,
  onChart,
  resetPlot,
  onInc,
  onViewMethod,
  saveDefaults
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const classes = useStyles();

  return (
    <Grid container justifyContent="center" alignItems="center" spacing={2}>
      <Grid item md={4}>
        <Typography
          component="p"
          style={{
            textAlign: "end",
            position: "absolute",
            left: 0,
            top: -10,
          }}
        >
          <IconButton
            size="small"
            onClick={() => setIsOpen(!isOpen)}
            className="mt-2 mb-2"
            style={{ fontSize: 11 }}
          >
            {`Graph Options`}
            {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Typography>
      </Grid>
      <Grid item md={6} />
      {isDash && (
        <Grid item md={1}>
          <IconButton
            style={{
              padding: 0,
              position: "absolute",
              right: 10,
              top: -5,
            }}
            onClick={() => onChart()}
          >
            <LaunchIcon />
          </IconButton>
          <IconButton
            style={{
              padding: 0,
              position: "absolute",
              right: 50,
              top: -5,
            }}
          >
            <CSVLink
              data={source}
              filename={`Plot-${Date.now()}.csv`}
              className="btn btn-primary"
              target="_blank"
            >
              <Typography component="p" variant="body2">
                {"csv"}
              </Typography>
            </CSVLink>
          </IconButton>
        </Grid>
      )}
      {isOpen && (
        params.missionType === 'orbital' ? <Grid item md={11}>
          <Box
            borderColor="primary.main"
            border={2}
            borderRadius={5}
            padding={2}
          >
            <Grid container justifyContent="center" alignItems="center" spacing={2}>
              <Grid item md={3}>
                <Grid
                  container
                  justifyContent="flex-start"
                  alignItems="center"
                  spacing={2}
                >
                  <Grid item md={5}>
                    <Button
                      id={viewMethod}
                      name="2d_view"
                      variant="outlined"
                      size="small"
                      style={{
                        backgroundColor:
                          viewMethod !== "3d_view"
                            ? grey[300]
                            : "inherit",
                      }}
                      onClick={(e) => onViewMethod(e)}
                      fullWidth
                    >
                      {"2D"}
                    </Button>
                  </Grid>
                  <Grid item md={1} />
                  <Grid item md={5}>
                    <Button
                      id={viewMethod}
                      name="3d_view"
                      variant="outlined"
                      size="small"
                      style={{
                        backgroundColor:
                          viewMethod === "3d_view"
                            ? grey[300]
                            : "inherit",
                      }}
                      onClick={(e) => onViewMethod(e)}
                      fullWidth
                    >
                      {"3D"}
                    </Button>
                  </Grid>
                  <Grid item md={10}>
                  <Tooltip
                  title={
                    <Typography
                      gutterBottom
                      component="p"
                      variant="body1"
                      dangerouslySetInnerHTML={{
                        __html: "Reset plot",
                      }}
                    />
                  }
                  placement="top-start"
                  classes={{ tooltip: classes.tooltip }}
                >
                  <span>
                    <Button
                      id={'reset-button'}
                      name="Reset"
                      variant="outlined"
                      size="small"
                      onClick={() => resetPlot()}
                      fullWidth
                    >
                      {"Reset"}
                    </Button>
                  </span>
                </Tooltip>
                  </Grid>
                  <Grid item md={1} />
                </Grid>
              </Grid>
              <Divider orientation="vertical" flexItem />
              <Grid item md={5} style={{ marginRight: 15 }}>
                <FormControl
                  variant="outlined"
                  size="small"
                  className={classes.formControl}
                  fullWidth
                >
                  <InputLabel id="inclination-label">{`Inclination`}</InputLabel>
                  <Select
                    labelId="inclination-label"
                    id="inclination-label"
                    value={params.inclination}
                    onChange={(e) => onInc(e.target.value)}
                    label="Inclination"
                    defaultValue=""
                    disabled={viewMethod === "3d_view"}
                  >
                    <MenuItem value="" disabled>
                      <em>{`None`}</em>
                    </MenuItem>
                    {incs.map((item: number) => (
                      <MenuItem key={`inclination-${item}`} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Divider orientation="vertical" flexItem />
              <Grid item md={3}>
                <FormControl
                  variant="outlined"
                  size="small"
                  className={classes.formControl}
                  fullWidth
                >
                  <InputLabel id="regression-type-label">{`Regression Type`}</InputLabel>
                  <Select
                    labelId="regression-type-label"
                    id="regression-type-label"
                    name="regressionType"
                    label={'Regression Type'}
                    value={regressionType}
                    onChange={event => onRegressionType(event.target.value.toString())}
                    fullWidth
                  >
                    <MenuItem value='none' disabled>
                      <em>{`None`}</em>
                    </MenuItem>
                    {Object.keys(regressionTypeOptions).map(option => {
                      return (
                        <MenuItem value={option}>
                          {regressionTypeOptions[option]}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>

                <FormControl
                  variant="outlined"
                  size="small"
                  className={classes.formControl}
                  fullWidth
                >
                  <InputLabel id="regression-quality-label">{`Regression Quality`}</InputLabel>
                  <Select
                    labelId="regression-quality-label"
                    id="regression-quality-label"
                    name="regressionQuality"
                    label={'Regression Quality'}
                    value={regressionQuality}
                    onChange={event => onRegressionQuality(event.target.value.toString())}
                    fullWidth
                  >
                    <MenuItem value="0" disabled>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="1">Low</MenuItem>
                    <MenuItem value="2">Medium</MenuItem>
                    <MenuItem value="3">High</MenuItem>
                  </Select>
                </FormControl>

                <Tooltip id="saveButton" title="Save Defaults">
                  <span>
                    <IconButton 
                      className={classes.tab} 
                      onClick={saveDefaults}
                      disabled={false}
                    >
                      <SaveIcon color="primary" />
                    </IconButton>
                  </span>
                </Tooltip>
              </Grid>
            </Grid>
          </Box>
        </Grid> :
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
                            variant={mode === 'heatmap' ? "contained" : "outlined"}
                            size="small"
                            color="primary"
                            onClick={(e) => onViewChange(e)}
                            style={{ width: "92%", marginRight: "4%" }}
                            className="mb-2"
                        >
                            {"Model Data"}
                        </Button>
                        </Grid>
                        <Grid item md={12}>
                        <Button
                            name="interpolated"
                            variant={mode === 'interpolated' ? "contained" : "outlined"}
                            size="small"
                            color="primary"
                            onClick={(e) => onViewChange(e)}
                            style={{ width: "92%", marginRight: "4%" }}
                        >
                            {"Interpolation"}
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
                            dangerouslySetInnerHTML={{ __html: "Reset Plot" }}
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
                            {"Reset"}
                        </Button>
                        </span>
                    </Tooltip>
                    </Grid>
                </Grid>
            </Box>
        </Grid>
      )}
    </Grid>
  );
};

export default PlotOptions;