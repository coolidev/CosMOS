import { FC, useEffect, useState } from 'react';
import { Box, Button, FormControlLabel, makeStyles, Switch } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import type { Theme } from 'src/theme';
import { THEMES } from 'src/utils/constants/general';
import { Status } from 'src/types/comparison';

interface CompareHeaderProps {
  status: Status;
  onStatus: (values) => void;
  handleDialog: () => void;
  disabled: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  tooltip: {
    maxWidth: '500px'
  },
  pagination: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(2),
    color: `${theme.palette.text.primary} ${
      theme.name === THEMES.DARK && `!important`
    }`,
    '& .MuiPaginationItem-root': {
      backgroundColor: theme.palette.border.opposite
    }
  },
  csv: {
    padding: 0,
    margin: 0,
    color: '#fff',
    textDecoration: 'none',
    width: '100%'
  },
  button: {
    backgroundColor: `${theme.palette.border.main} !important`,
    color: `#fff !important`,
  }
}));

const CompareHeader: FC<CompareHeaderProps> = ({
  status,
  disabled,
  onStatus,
  handleDialog
}) => {
  const [isCompressedView, setIsCompressedView] = useState<boolean>(false);

  const classes = useStyles();

  const handleChangePage = (e, page) => {
    onStatus((prevState) => ({ ...prevState, page }));
  };

  useEffect(() => {
    const handleViewStyle = () => {
      onStatus((prevState) => ({
        ...prevState,
        isCompressedView
      }))
    }
  
    handleViewStyle() 
  }, [isCompressedView])

  return (
    <Box display="flex" p={3}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleDialog}
        className={classes.button}
        disabled={disabled}
      >
        Rank
      </Button>
      <Box flexGrow={1} />
      <Box>
        <FormControlLabel control={<Switch color="primary" value={isCompressedView} onChange={(e, v) => {setIsCompressedView(v)}} />} label="Compress View" />
      </Box>
      <Box flexGrow={1} />
      <Box>
        <Pagination
          page={status.page}
          count={status.totalPage}
          defaultPage={1}
          color="primary"
          variant="text"
          shape="rounded"
          className={classes.pagination}
          onChange={handleChangePage}
        />
      </Box>
    </Box>
  );
};

export default CompareHeader;
