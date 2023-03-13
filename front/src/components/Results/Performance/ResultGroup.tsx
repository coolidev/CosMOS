import type { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { Typography, Grid, Box, makeStyles } from '@material-ui/core';
import { Theme } from 'src/theme';

interface ResultGroupProps {
  title?: string;
  children?: ReactNode;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.light
  },
  typography: {
    fontSize: '1.2rem',
    fontFamily: 'Roboto',
    fontStyle: "normal",
    lineHeight: "32px",
    display: "flex",
    alignItems: "center",
    color: theme.palette.border.main,
    paddingLeft: '1rem',
    borderBottom: `4px solid ${theme.palette.border.main}`,
  },
}));

const ResultGroup: FC<ResultGroupProps> = ({ title, children, ...rest }) => {
  const classes = useStyles();

  return (
    <Grid item md={12} className={classes.root}>
      <Box py={2}>
        {title && <Typography component="p" className={classes.typography}>
          {title}
        </Typography>}
      </Box>
      {children}
    </Grid>
  );
};

ResultGroup.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string
};

export default ResultGroup;
