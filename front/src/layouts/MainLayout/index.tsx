import { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Theme } from '@material-ui/core';

interface LayoutProps {
  children?: ReactNode;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: 0,
    paddingTop: '7vh'
  }
}));

const MainLayout: FC<LayoutProps> = ({ children }) => {
  const classes = useStyles();

  return <div className={classes.root}>{children}</div>;
};

MainLayout.propTypes = {
  children: PropTypes.node
};

export default MainLayout;
