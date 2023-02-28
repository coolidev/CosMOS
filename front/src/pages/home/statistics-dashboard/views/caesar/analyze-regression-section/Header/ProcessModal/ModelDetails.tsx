/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  makeStyles,
  Theme,
  Box,
  Table,
  TableBody,
  TableRow,
  TableCell
} from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import {
  getBeamTypes
} from '../../../../../API';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails
} from './CustomAccordion';

interface Model {
  MODEL_ID: number;
  BEAM_TYPE_STK: string;
}

interface Beam {
  id: number;
  name: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  formControl: {
    margin: theme.spacing(1)
  },
  font: {
    fontSize: '14px'
  }
}));

const ModelDetails: React.FC<any> = (props) => {
  const [beams, setBeams] = useState<Beam[]>([]);
  const classes: Record<string, string> = useStyles();

  useEffect(() => {
    fetchBeams();
  }, [props.system]);

  const fetchBeams = async () => {
    getBeamTypes().then((res) => {
      setBeams(res.data);
    });
  };

  const handleUploadFile = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    event.preventDefault();
    const element: HTMLElement | null = document.getElementById('upload-model');
    element && element.click();
  };

  const handleUploadedFile = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    event.preventDefault();
    const element = document.getElementById('upload-model') as HTMLInputElement;
    const modelFile: FileList | null = element?.files;

    if (modelFile && modelFile[0]) {
      props.onChangeUploadedModels(modelFile[0]);
    }
  };

  return (
    <Accordion
      square
      expanded={props.expanded === 'panel2' && props.values.type !== 'ns3'}
      onChange={() => props.onChange('panel2')}
    >
      <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
        <Typography>{'2. Model'}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container justifyContent="center" alignItems="center" spacing={2}>
          <Grid item md={8}>
            <Typography style={{ fontSize: '14px' }}>
              a. Select the type of beam model. 
            </Typography>
          </Grid>
          <Grid item md={4}>
            <FormControl
              variant="outlined"
              size="small"
              className={classes.formControl}
              fullWidth
            >
              <InputLabel>Beam Type</InputLabel>
              <Select
                name="beamType"
                value={props.values.beam}
                label="Beam Type"
                defaultValue=""
                onChange={(e) => props.changeValues('beam', e.target.value)}
              >
                <MenuItem value={-1} disabled>{`Choose Beam Type`}</MenuItem>
                {beams.map((item: Beam) => (
                  <MenuItem
                    value={item.id}
                    key={`${item.id}`}
                  >
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item md={8}>
            <Typography style={{ fontSize: '14px' }}>
              b. Attach the model. 
            </Typography>
          </Grid>
          <Grid item md={4}>
            <Button
              name="load_model"
              size="small"
              variant="outlined"
              onClick={handleUploadFile}
            >
              {`Select Model`}
            </Button>
            <input
              id="upload-model"
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
              <Table size="small" aria-label="uploaded model table">
                <TableBody>
                  {props.uploadedModel.map((row: File) => (
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
      </AccordionDetails>
    </Accordion>
  );
};

export default ModelDetails;
