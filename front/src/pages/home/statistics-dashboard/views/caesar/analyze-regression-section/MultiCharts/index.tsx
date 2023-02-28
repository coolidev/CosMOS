import React, { FC, useState } from 'react';
import {
  makeStyles,
  Grid,
  Card,
  CardContent,
  Dialog,
  CssBaseline,
  DialogTitle as MuiDialogTitle,
  Typography,
  IconButton,
  DialogContent,
  Slide,
  useTheme
} from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import { Close as CloseIcon } from '@material-ui/icons';
import DashAddon from '../../../../components/Button/DashAddon';
import SelectedChartSection from './SelectedChart';
import { MENU_ITEMS } from 'src/utils/constants/data-management-dashboard';
import type { AnalyticsPlotsData } from 'src/types/dashboard';
import type { Theme } from 'src/theme';

const useStyles = makeStyles((theme) => ({
  dialogCloseBtn: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
    zIndex: 100,
  }
}));

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<Function>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

interface MultiChartsProps {
  size: { width: number; height: number };
  traces: { [key: string]: AnalyticsPlotsData };
  metricType: string;
  networkType: string;
};

const MultiCharts: FC<MultiChartsProps> = ({
  size,
  traces,
  metricType,
  networkType
}) => {
  const theme = useTheme<Theme>();
  const [selected, setSelected] = useState<number[]>([1, 2, 3]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [subChart, setSubChart] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [index, setIndex] = useState<number>(0);
  const classes = useStyles();

  const handleSelected = (id: any) => {
    setSelected(
      selected.map((item: any, idx: any) => {
        if (idx === Number(index)) item = id;
        return item;
      })
    );
    setAnchorEl(null);
  };

  return (
    <>
      {selected.map((item: number, idx: number) => {
        let dset = MENU_ITEMS[metricType][item].dataset;

        return (
          <Grid
            item
            md={6}
            key={item}
            style={{
              paddingLeft: '2rem',
              paddingRight: idx % 2 === 0 ? '2rem' : '0.8rem'
            }}
          >
            <Card style={{ height: `calc(${size.height} * 0.45)` }}>
              <CardContent>
                <DashAddon
                  type={1}
                  selected={selected}
                  anchorEl={anchorEl}
                  index={idx}
                  source={
                    traces[dset] && Object.keys(traces[dset]).length > 0
                      ? traces[dset]
                      : null
                  }
                  onIndex={(value: any) => setIndex(value)}
                  onAnchorEl={(value: any) => setAnchorEl(value)}
                  onSelected={(value: any) => handleSelected(value)}
                  onSubChart={(value: any) => {
                    setSubChart(value);
                    setIsOpen(true);
                  }}
                />
                <Grid item md={12}>
                  {traces[dset] && Object.keys(traces[dset]).length > 0 && (
                    <SelectedChartSection
                      id={item}
                      size={size}
                      data={traces[dset]}
                      metricType={metricType}
                      networkType={networkType}
                    />
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
      {selected.length % 2 === 0 && <Grid item md={6} />}
      {subChart !== null && (
        <Dialog
          open={isOpen}
          TransitionComponent={Transition}
          onClose={() => setIsOpen(false)}
          PaperProps={{
            style: {
              height: size.width * 0.42,
              maxWidth: size.width * 0.6,
              minWidth: size.width * 0.6
            }
          }}
        >
          <CssBaseline />
          <MuiDialogTitle
            style={{
              margin: 0,
              padding: '16px',
              backgroundColor: theme.palette.primary.light
            }}
          >
            <Typography component="strong" variant="h6">
              {MENU_ITEMS[metricType][subChart].name}
            </Typography>
            <IconButton
              aria-label="Close"
              className={classes.dialogCloseBtn}
              onClick={() => setIsOpen(false)}
            >
              <CloseIcon />
            </IconButton>
          </MuiDialogTitle>
          <hr />
          <DialogContent>
            {traces[MENU_ITEMS[metricType][selected[subChart]].dataset] &&
              Object.keys(
                traces[MENU_ITEMS[metricType][selected[subChart]].dataset]
              ).length > 0 && (
                <SelectedChartSection
                  id={selected[subChart]}
                  size={size}
                  metricType={metricType}
                  data={traces[MENU_ITEMS[metricType][selected[subChart]].dataset]}
                  networkType={networkType}
                />
              )}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default MultiCharts;