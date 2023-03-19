/* eslint-disable jsx-a11y/anchor-has-content */
import { FC, useState, useEffect } from 'react';
import DataGrid, { Column, Editing, Button } from 'devextreme-react/data-grid';
import {
  Grid,
  Box,
  Button as ButtonMUI,
  LinearProgress,
  CircularProgress,
  Typography,
  makeStyles,
  Theme
} from '@material-ui/core';
import axios from 'src/utils/axios';

interface Model {
  id?: number;
  filename: string;
  version: number;
  dateUploaded: string;
  notes: string;
}

interface ModelsProps {
  networkId?: number;
  networkName?: string;
  isEditable: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  table: {
    height: '48.5vh'
  }
}));

const EngineerModels: FC<ModelsProps> = ({ networkId, networkName, isEditable }) => {
  const [refresh, setRefresh] = useState(false);
  const [models, setModels] = useState<Model[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<FileList>(null);
  const [uploadDisabled, setUploadDisabled] = useState(true);
  const [progress, setProgress] = useState<number>(null);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [downloadedFile, setDownloadedFile] = useState('');

  const classes = useStyles();

  useEffect(() => {
    const params = {
      networkId: networkId,
      networkName: networkName,
      groundStationName: '',
      type: 'network'
    };
    axios.get('/get-engineering-models', { params }).then((res) => {
      setModels(res.data.models);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  const downloadFile = () => {
    const downloadButton = document.getElementById('download');
    downloadButton.click();
  };

  const editNotes = (event) => {
    const params = {
      modelId: event.oldData.id,
      notes: event.newData.notes
    };
    axios.post('/edit-engineering-model-notes', params).then((_res) => {
      setRefresh(!refresh);
    });
  };

  const filesAdded = (event) => {
    setProgress(null);
    if (event.target.files.length > 0) setUploadDisabled(false);
    else setUploadDisabled(true);
    setUploadedFiles(event.target.files);
  };

  const handleUpload = (event) => {
    event.preventDefault();
    setUploadDisabled(true);
    setUploadComplete(false);

    let formData = new FormData();
    formData.append('file', uploadedFiles[0]);
    formData.append('networkId', networkId.toString());
    formData.append('groundStationName', '');
    formData.append('type', 'network');

    axios
      .post('/upload-model', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (data) => {
          setProgress(Math.round((100 * data.loaded) / data.total));
        }
      })
      .then((_res) => {
        setUploadComplete(true);
        setRefresh(!refresh);
      });
  };

  const handleDownload = (event) => {
    const params = {
      modelId: event.row.data.id,
      networkName: networkName,
      groundStationName: '',
      type: 'network'
    };
    axios.get('/download-model', { params }).then((res) => {
      setDownloadedFile(res.data.filename);
      downloadFile();
    });
  };

  return (
    <div className={classes.root}>
      <DataGrid
        dataSource={models}
        showBorders={true}
        columnAutoWidth={true}
        className={classes.table}
        onRowUpdating={editNotes}
      >
        <Editing mode="batch" allowUpdating={isEditable} />
        <Column
          type="buttons"
          allowSorting={false}
          allowEditing={false}
          width="10%"
        >
          <Button
            // icon="download"
            hint="Download Model"
            onClick={handleDownload}
          >
            <svg width="19" height="24" viewBox="0 0 19 24" fill="none">
              <path d="M16.3333 0.333313H7L0 7.33331V21.3333C0 22.6166 1.05 23.6666 2.33333 23.6666H16.3333C17.6167 23.6666 18.6667 22.6166 18.6667 21.3333V2.66665C18.6667 1.38331 17.6167 0.333313 16.3333 0.333313ZM9.33333 17.8333L4.66667 13.1666H8.16667V8.52331L10.5 8.49998V13.1666H14L9.33333 17.8333Z" fill="#E34747"/>
            </svg>
          </Button>
        </Column>
        <Column
          dataField="filename"
          caption="File"
          allowSorting={false}
          allowEditing={false}
          width="20%"
        />
        <Column
          dataField="version"
          caption="Version"
          allowEditing={false}
          width="10%"
        />
        <Column
          dataField="dateUploaded"
          caption="Date Uploaded"
          allowEditing={false}
        />
        <Column
          dataField="notes"
          caption="Notes"
          allowSorting={false}
          allowEditing={isEditable}
          width="40%"
        />
      </DataGrid>
      <a
        id="download"
        href={`/${downloadedFile}`}
        download
        style={{ display: 'none' }}
      />
      {isEditable && (
        <>
          <input
            id="upload"
            type="file"
            accept=".zip"
            onChange={(e) => filesAdded(e)}
          />
          <ButtonMUI
            type="submit"
            onClick={handleUpload}
            size="small"
            variant="contained"
            color="secondary"
            disabled={uploadDisabled}
          >
            Upload New
          </ButtonMUI>
        </>
      )}
      <Grid container justifyContent="center" alignItems="center">
        <Grid item md={12}>
          {progress && (
            <Box display="flex" alignItems="center">
              <Box width="100%" mr={1}>
                <LinearProgress variant="determinate" value={progress} />
              </Box>
              <Box minWidth={35}>
                <Typography variant="body2" color="textSecondary">
                  {`${Math.round(progress)}%`}
                </Typography>
              </Box>
            </Box>
          )}
        </Grid>
        <Grid item md={12}>
          {uploadComplete && <Typography>Upload complete!</Typography>}
          {progress === 100 && !uploadComplete && (
            <>
              <Typography>
                Your file has been uploaded to the server. Please wait while the
                file is saved to the database.
              </Typography>
              <CircularProgress />
            </>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default EngineerModels;
