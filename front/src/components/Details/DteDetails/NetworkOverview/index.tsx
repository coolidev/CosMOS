import { Box, Button, Grid, makeStyles, Typography } from "@material-ui/core"
import { TextBox } from "devextreme-react";
import { FC, useEffect, useState } from "react"
import DialogBox from "src/components/DialogBox";
import { Theme } from "src/theme";
import axios from "src/utils/axios";
import AddNetworkAttr from "./AddNetworkAttr";
import DataTableLite from "./DataTableLite"

interface NetworkOverviewProps {
  dataSource: NetworkAttr[];
  isAdmin: boolean;
  networkId: number;
  image: BinaryData;
  details: string;
  name: string;
  refresh: () => void;
}

export interface NetworkAttr {
  id: number;
  name: string;
  value: any;
  explanation: string;
  references: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1)
  },
  image: {
    // height: '49vh',
    padding: theme.spacing(5),
    flexGrow: 1,
    overflow: 'auto'
  },
  main: {
    height: '49vh',
    padding: theme.spacing(5),
    overflow: 'auto',
    '& .dx-switch-on-value .dx-switch-handle::before': {
      backgroundColor: theme.palette.primary.main
    },
    '& .dx-switch-on-value .dx-switch-container::before': {
      backgroundColor: theme.palette.primary.main,
      opacity: 0.5
    },
    '& .dx-datagrid .dx-link': {
      color: theme.palette.primary.main,
    },
    //For multi-select checkboxes (need to find correct style class to move this to)
    // '& .dx-checkbox-indeterminate .dx-checkbox-icon': {
    //   backgroundColor: theme.palette.primary.main
    // },
    '& .dx-datagrid-focus-overlay:after': {
      backgroundColor: theme.palette.primary.main
    },
  },
  dialog: {
    width: '25vw'
  }
}));

const NetworkOverview: FC<NetworkOverviewProps> = ({ dataSource, isAdmin, networkId, image, details, name, refresh }) => {
  const [addNetworkAttribute, setAddNetworkAttribute] = useState<boolean>(false);
  const [localSource, setLocalSource] = useState<NetworkAttr[]>(dataSource);
  //@ts-ignore
  const [base64Image, setBase64Image] = useState<string>(image?.data ? Buffer.from(image.data, 'binary').toString('base64') : null);
  const [uploadedFiles, setUploadedFiles] = useState<FileList>(null);
  const [uploadDisabled, setUploadDisabled] = useState(true);
  const [progress, setProgress] = useState<number>(null);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [detailsEditDiag, setDetailsEditDiag] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>(name)
  const [newDetails, setNewDetails] = useState<string>(details);

  const classes = useStyles();

  useEffect(() => {
    if (image) {
      //@ts-ignore
      setBase64Image(Buffer.from(image.data, 'binary').toString('base64'));
    }
  }, [image]);

  const handleDelete = async (event) => {
    event.preventDefault();
    if (window.confirm(`Are you sure you wish to delete ${name}? This action cannot be reversed!`)) {
      if (window.confirm(`Please confirm one more time that you would like to delete ${name}`)) {
        const params = { systemName: name }
        try {
          await axios.post<{ systemName: string }>('/deleteSystem', params);
        } catch (error) {
          console.log(error);
        }
        setDetailsEditDiag(false);
        refresh();
      }
    }
  }

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

    axios.post('/uploadNetworkImage', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (data) => {
        setProgress(Math.round((100 * data.loaded) / data.total));
      }
    })
      .then((_res) => {
        setUploadComplete(true);
      });
  };

  const handleUpdates = async (event) => {
    event.preventDefault();

    const params = { networkId: networkId, name: newName, details: newDetails }

    try {
      await axios.post<{ networkId: number, name: string, details: string }>('/updateNetworkDetails', params);

    } catch (error) {
      console.log(error);
    }
    setDetailsEditDiag(false);
    refresh();
  };

  return (
    <>
      <Grid container spacing={3} className={classes.root}>
        <Grid item xs={12} className={classes.image}>
          {/* {isAdmin && uploadedFiles && progress === 100 ? (
            <Typography variant="caption">
              Your image was successfully uploaded. Please reload this panel
              to load the new image.
            </Typography>
          ) : base64Image ? (
            <img
              src={`data:image/png;base64,${base64Image}`}
              style={{ width: '100%', paddingTop: '5vh' }}
              alt={`base64Image`}
            />
          ) :
            <img src={'/static/images/defaultNetwork.png'} alt="Logo" style={{ width: '100%', paddingTop: '5vh' }} />
          } */}
          <Typography align="left" style={{ paddingTop: '10px' }}>
            {details ?? `Description of ${name}`}
          </Typography>
          {isAdmin && (
            <Grid container className="my-2">
              <div className="ml-auto" />
              <Button
                type="submit"
                onClick={() => {
                  setDetailsEditDiag(true);
                }}
                size="small"
                variant="contained"
                color="secondary"
                disabled={false}
                style={{ marginTop: '10px' }}
              >
                {`Update Network Details`}
              </Button>
            </Grid>
          )}
        </Grid>
        <Grid item xs={12} className={classes.main}>
          <Grid container spacing={1} style={{ height: '100%' }}>
            <Grid item xs={12} style={{ minHeight: 'calc(100% - 40px)'}}>
              <DataTableLite
                source={localSource}
                isAdmin={isAdmin}
                networkId={networkId}
              />
            </Grid>
            {isAdmin && (
              <Grid item xs={12}>
                <Button
                  onClick={() => setAddNetworkAttribute(!addNetworkAttribute)}
                  color="primary"
                  variant="contained"
                  style={{ textAlign: 'center', float: 'right' }}
                >
                  Add New Network Attribute
                </Button>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
      <AddNetworkAttr
        isOpen={addNetworkAttribute}
        onClose={(newAddition?: NetworkAttr) => {
          if (newAddition.name) {
            let toAdd = structuredClone(localSource);
            toAdd.push(newAddition);
            setLocalSource(toAdd);
          }
          setAddNetworkAttribute(!addNetworkAttribute);
        }}
        networkId={networkId}
      />
      {detailsEditDiag && (
        <DialogBox
          id="networkDetailsDiag"
          title="Update Network Details"
          isOpen={detailsEditDiag}
          onClose={() => setDetailsEditDiag(false)}
          className={{ paper: classes.dialog }}
        >
          <Grid
            container
            justifyContent="flex-start"
            alignItems="flex-start"
            spacing={2}
          >
            <>
              <div style={{ display: 'inline-block', width: '100%' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    borderColor: 'black',
                    paddingTop: '10px'
                  }}
                >
                  <Typography variant={'subtitle1'} align="left">
                    Name:&nbsp;&nbsp;
                  </Typography>
                  <TextBox
                    value={newName}
                    onValueChanged={(e) => { setNewName(e.value) }}
                    width='100%'
                  />
                </Box>
              </div>
              <div style={{ display: 'inline-block', width: '100%' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    borderColor: 'black',
                    paddingTop: '10px'
                  }}
                >
                  <Typography variant={'subtitle1'} align="left">
                    Description:&nbsp;&nbsp;
                  </Typography>
                  <TextBox
                    value={newDetails}
                    onValueChanged={(e) => { setNewDetails(e.value) }}
                    width='100%'
                  />
                </Box>
              </div>
              <div style={{ display: 'inline-block', width: '100%' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    borderColor: 'black',
                    paddingTop: '10px'
                  }}
                >
                  <Typography variant={'subtitle1'} align="left">
                    Image:&nbsp;&nbsp;
                  </Typography>
                  <input
                    id="upload"
                    type="file"
                    accept=".png"
                    onChange={(e) => filesAdded(e)}
                  />
                </Box>
              </div>
              <div style={{ display: 'inline-block', width: '100%' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'left',
                    borderColor: 'black',
                    paddingTop: '10px'
                  }}
                >
                  <Grid
                    container
                    justifyContent="flex-start"
                    alignContent="flex-start"
                    spacing={2}
                  >
                    <Grid item md={3}>
                      <Button
                        type="submit"
                        onClick={handleDelete}
                        size="small"
                        variant="text"
                        color="secondary"
                        fullWidth
                      >
                        {`Delete Network`}
                      </Button>
                    </Grid>
                    <Grid item md={5} />
                    <Grid item md={2}>
                      <Button
                        type="submit"
                        onClick={() => {
                          setDetailsEditDiag(false);
                          setUploadedFiles(null);
                          setNewName(name);
                          setNewDetails(details);
                        }}
                        size="small"
                        variant="outlined"
                        color="secondary"
                        fullWidth
                      >
                        {`Cancel`}
                      </Button>
                    </Grid>
                    <Grid item md={2}>
                      <Button
                        type="submit"
                        onClick={(event) => {
                          !uploadDisabled && handleUpload(event);
                          newName?.length > 0 && newDetails?.length > 0 && handleUpdates(event);
                          setDetailsEditDiag(false);
                        }
                        }
                        size="small"
                        variant="contained"
                        color="secondary"
                        fullWidth
                      >
                        {`Save`}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </div>
            </>
          </Grid>
        </DialogBox>
      )}
    </>
  );
}

export default NetworkOverview
