import { FC } from 'react';
import clsx from 'clsx';
import { Box, Tabs, Tab, makeStyles, Theme, colors } from '@material-ui/core';

interface ResultsProps {
  resultTab: string;
  onResultTab: (value: string) => void;
}

const tabs = [
  { name: 'network', label: 'Network Selections' },
  { name: 'analytics', label: 'Analytics' },
  { name: 'performance', label: 'Performance' },
  { name: 'compare', label: 'Compare' }
];

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    display: 'flex'
  },
  tabs: {
    padding: theme.spacing(3, 0, 3, 2),
    height: '93vh',
    backgroundColor: colors.grey[700]
  },
  tab: {
    '& span': {
      textOrientation: 'mixed',
      writingMode: 'vertical-rl',
      transform: 'rotate(180deg)'
    },
    minWidth: 0,
    height: '21.65vh',
    margin: theme.spacing(1, 0),
    padding: theme.spacing(1),
    backgroundColor: colors.grey[100]
  },
  indicator: {
    backgroundColor: 'transparent'
  },
  selected: {
    backgroundColor: colors.grey[50]
  }
}));

const Results: FC<ResultsProps> = ({ resultTab, onResultTab }) => {
  const classes = useStyles();

  const handleChange = (event, newValue) => {
    onResultTab(newValue);
  };

  return (
    <div className={classes.root}>
      <Tabs
        orientation="vertical"
        value={resultTab}
        onChange={handleChange}
        className={classes.tabs}
        TabIndicatorProps={{ className: classes.indicator }}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.name}
            label={tab.label}
            value={tab.name}
            className={clsx(
              classes.tab,
              resultTab === tab.name && classes.selected
            )}
          />
        ))}
      </Tabs>
      {resultTab === 'network' && <Box p={2} />}
    </div>
  );
};

export default Results;
