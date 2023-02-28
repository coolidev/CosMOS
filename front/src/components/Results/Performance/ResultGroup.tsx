import type { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { Typography, Grid, Box, makeStyles, Theme } from '@material-ui/core';

interface ResultGroupProps {
  title: string;
  children?: ReactNode;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  typography: {
    fontSize: '1.2rem',
    marginLeft: theme.spacing(2)
  }
}));

const ResultGroup: FC<ResultGroupProps> = ({ title, children, ...rest }) => {
  const classes = useStyles();

  return (
    <Grid item md={12}>
      <Box color="text.primary" padding={1} marginBottom={1}>
        <Typography component="p" className={classes.typography}>
          {title}
        </Typography>
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
