import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import {
  makeStyles,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Slide,
  IconButton,
  Grid,
  Box,
  Table,
  TableBody,
  TableRow,
  TableCell,
  useTheme
} from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { blue } from '@material-ui/core/colors';
import { uploadRegressions } from '../../../../../API';
import type { Theme } from 'src/theme';

const useStyles = makeStyles((theme) => ({
  dialogModify: {
    minWidth: "40vw !important",
    maxWidth: "40vw !important",
  }
}));

interface RegressionModalProps {
  isOpen: boolean;
  system: number;
  attribute_version: number;
  data_version: number;
  model: number;
  onClose(): void;
  onNewSnackbar(snackbar: any): void;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<Function>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const RegressionModal: React.FC<RegressionModalProps> = (props) => {
  const theme = useTheme<Theme>();
  const [uploadedItems, setUploadedItems] = useState<File[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  const classes: Record<string, string> = useStyles();

  const handleClick = () => {
    const formData = new FormData();

    formData.append('system', props.system.toString());
    formData.append('attribute_version', props.attribute_version.toString());
    formData.append('data_version', props.data_version.toString());
    formData.append('model', props.model.toString());

    uploadedItems.forEach((file: File) => {
      formData.append('upload', file);
    });

    uploadRegressions(formData).then((res) => {
      if (res.data === 'success') {
        props.onClose();

        const snackbar = enqueueSnackbar('Files uploaded successfully!', {
          persist: true,
          variant: 'success'
        });

        props.onNewSnackbar(snackbar);
      } else {
        const snackbar = enqueueSnackbar(
          'There was an issue uploading your files.',
          {
            persist: true,
            variant: 'error'
          }
        );

        props.onNewSnackbar(snackbar);
      }
    });
  };

  const handleClose = () => {
    const element: any = document.getElementById('upload-regressions');
    element.value = '';

    setUploadedItems([]);
    props.onClose();
  };

  const handleUploadFile = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    event.preventDefault();
    const element: HTMLElement | null =
      document.getElementById('upload-regressions');
    element && element.click();
  };

  const handleUploadedFile = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    event.preventDefault();
    const element = document.getElementById(
      'upload-regressions'
    ) as HTMLInputElement;
    const files: FileList | null = element?.files;

    if (files && files[0]) {
      setUploadedItems((prevState) => [...prevState, files[0]]);
    }
  };

  return (
    <Dialog
      open={props.isOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-labelledby="modify-slide-title"
      aria-describedby="modify-slide-description"
      classes={{ paper: classes.dialogModify }}
    >
      <DialogTitle
        disableTypography
        style={{
          margin: 0,
          padding: '16px',
          backgroundColor: theme.palette.primary.light
      }}
      >
        {`Upload Regressions`}
        <IconButton
          onClick={handleClose}
          style={{ position: 'absolute', right: 10, padding: 0 }}
        >
          <HighlightOffIcon style={{ color: '#fff' }} />
        </IconButton>
      </DialogTitle>
      <DialogContent style={{ backgroundColor: theme.palette.component.main }}>
        <Grid container justifyContent="center" alignItems="center" spacing={2}>
          <Grid item md={3}>
            <Button
              name="file_select_btn"
              size="small"
              variant="outlined"
              onClick={handleUploadFile}
            >
              {'Select Files'}
            </Button>
            <input
              id="upload-regressions"
              type="file"
              accept="*"
              onChange={handleUploadedFile}
              style={{ display: 'none' }}
            />
          </Grid>
          <Grid item md={12}>
            <Box
              border={1}
              style={{
                height: '6rem',
                borderColor: blue[500],
                overflow: 'auto'
              }}
            >
              <Table size="small" aria-label="uploaded files table">
                <TableBody>
                  {uploadedItems.map((row: File) => (
                    <TableRow key={row.name}>
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell align="right">{row.size}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions style={{ backgroundColor: theme.palette.component.main }}>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleClick} color="primary">
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RegressionModal;
