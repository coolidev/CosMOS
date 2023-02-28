import React from 'react';
import {
  Typography,
  Grid,
  Box,
  Button,
  Table,
  TableBody,
  TableRow,
  TableCell,
  LinearProgress,
  CircularProgress,
  RadioGroup,
  Radio,
  FormControlLabel
} from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails
} from './CustomAccordion';

const LinearProgressWithLabel = (props) => {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
};

const NewData: React.FC<any> = (props) => {
  const handleUploadFile = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    event.preventDefault();
    const element: HTMLElement | null = document.getElementById('upload');
    element && element.click();
  };

  const filesAdded = (event) => {
    event.preventDefault();

    props.changeProgress(null);

    const element = document.getElementById('upload') as HTMLInputElement;
    const files: FileList | null = element?.files;

    if (files) {
      Array.from(files).forEach(file => {
        props.onChangeUploadedItems(file);
      });
    }
  };

  return (
    <Accordion
      square
      expanded={props.expanded === 'panel3'}
      onChange={() => props.onChange('panel3')}
    >
      <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
        <Typography>{'2. Data'}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container justifyContent="center" alignItems="center" spacing={2}>
          <Grid item md={9}>
            <Typography style={{ fontSize: '14px' }}>
              {`a. Upload the data (select files or drop files in the square).`}
            </Typography>
          </Grid>
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
              id="upload"
              type="file"
              accept=".csv"
              onChange={(e) => filesAdded(e)}
              style={{ display: 'none' }}
              multiple
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
                  {props.uploadedItems.map((row: File) => (
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
          <Grid item md={12}>
            <Typography style={{ fontSize: '14px' }}>
              {`b. Do you want to associate the data with a new version?`}
            </Typography>
          </Grid>
          <Grid item md={12}>
            <RadioGroup
              name="isNewVersion"
              value={props.values.isNewVersion}
              onChange={(event) => props.changeValues('isNewVersion', event.target.value)}
              row
            >
              <div
                style={{
                  minWidth: '15vw',
                  maxWidth: '15vw',
                  color: '#000',
                  display: 'inline-block'
                }}
              >
                <FormControlLabel
                  value="yes"
                  control={<Radio />}
                  label="Yes, create a new version"
                />
              </div>
              <div
                style={{
                  minWidth: '',
                  maxWidth: '',
                  color: '#000',
                  display: 'inline-block'
                }}
              >
                <FormControlLabel
                  value="no"
                  control={<Radio />}
                  label="No, append data to an existing version, if possible"
                />
              </div>
            </RadioGroup>
          </Grid>
          <Grid item md={12}>
            {props.progress && <LinearProgressWithLabel value={props.progress} />}
          </Grid>
          <Grid item md={12}>
            {props.progress === 100 && props.processing && (
              <>
                <Typography>
                  {`Your files have been uploaded to the server. Please wait while the data is processed.`}
                </Typography>
                <CircularProgress />
              </>
            )}
            {!props.processing && (
              <>
                <Typography>
                  {`Processing complete!`}
                </Typography>
              </>
            )}
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default NewData;
