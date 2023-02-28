/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  makeStyles,
  Grid,
  Container,
  CssBaseline,
  Card,
  CardHeader,
  Typography
} from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import axios from 'src/utils/axios';
import { 
  getSystemsAndVersions, 
  changeDB,
  getFileId
} from '../../API';
import { Params } from 'src/types/dashboard';
import AnalyzeRegressionSection from './analyze-regression-section';
import { 
  ModelData,
  PredictedData,
  TerrestrialData
} from 'src/types/evaluation';

const useStyles = makeStyles((theme) => ({
  cartCard: {
    padding: 0,
  }
}));

const initialParams: Params = {
  database: 'production',
  missionType: 'orbital',
  networkType: 'relay',
  system: -1,
  systemName: '',
  version: -1,
  groundStation: '1',
  frequencyBand: '1',
  latitude: 30,
  longitude: 30,
  altitude: 300,
  inclination: 30,
  value: 100,
  fileId: [],
  metricType: 'coverage',
  raan: 0,
  eccentricity: 0,
  argumentOfPerigee: 0,
  trueAnomaly: 0
};

const EngineeringDashboard: FC<{}> = () => {
  const [params, setParams] = useState<Params>(initialParams);
  const [data, setData] = useState<{ modelData: ModelData, predictedData: PredictedData }>(null);
  const [regressionTypeOptions, setRegressionTypeOptions] = useState<{ [key: string]: { [key: string]: string } }>(null);
  const [regressionTypes, setRegressionTypes] = useState<{ [key: string]: string }>({});
  const [qualityIndicators, setQualityIndicators] = useState<{ [key: string]: string }>({});
  const [terrestrial, setTerrestrial] = useState<TerrestrialData>(null);
  const [incs, setIncs] = useState<Array<any>>([]);
  const [isRefresh, setIsRefresh] = useState<boolean>(false);
  const [updateSystems, setUpdateSystems] = useState<boolean>(false);
  const [refreshFileId, setRefreshFileId] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [axisLabel, setAxisLabel] = useState('');
  const [systemsAndVersions, setSystemsAndVersions] = useState(null);
  const location = useLocation<{ from: string; params: Params }>();
  const classes = useStyles();

  useEffect(() => {
    getSystemsAndVersions().then((res) => {
      // Set all options for systems and versions. 
      setSystemsAndVersions(res.data);

      if (location.state?.from === 'plot') {
        // Set the system and version to the options specified. 
        const userRequestedParams = location.state?.params;
        setParams((prevState) => ({ 
          ...prevState, 
          system: userRequestedParams.system,
          networkType: userRequestedParams.networkType,
          version: userRequestedParams.version,
          missionType: userRequestedParams.missionType
        }));
      } else {
        // Select the first system, and the max version corresponding to that system. 
        const system = Object.keys(res.data.systems.orbital)[0];
        setParams((prevState) => ({ 
          ...prevState, 
          system: parseInt(system),
          systemName: res.data.systems.orbital[system].name,
          networkType: res.data.systems.orbital[system].networkType,
          version: Math.max(...res.data.versions.orbital[system])
        }));
      }

      setIsRefresh(!isRefresh);
    });
  }, [params.database, updateSystems]);

  useEffect(() => {
    if (
      params.system >= 0 && params.version >= 0 &&
      (params.networkType === 'relay' || parseInt(params.groundStation) >= 0)
    ) {
      const axiosParams = {
        networkType: params.networkType,
        networkId: params.system,
        groundStationId: params.groundStation,
        frequencyBandId: params.frequencyBand,
        version: params.version
      };
      axios.get<{ modelData: ModelData, predictedData: PredictedData }>('/getMetricPlots', { params: axiosParams }).then(res => {
        // If the current metric type is not contained in the new data, set
        // a new metric type. 
        const metricType = Object.keys(res.data.modelData.orbital).includes(params.metricType)
          ? params.metricType : Object.keys(res.data.modelData.orbital)[0];

        if (params.networkType === 'relay') {
          // If no data is returned for terrestrial users, set the 
          // mission type to orbital. 
          if (!Object.keys(res.data.modelData.terrestrial).includes(metricType)) {
            setParams((prevState) => ({ ...prevState, missionType: 'orbital' }));
          }
  
          setTerrestrial(res.data.modelData.terrestrial[metricType] ?? null);
        } else {
          setParams((prevState) => ({ ...prevState, missionType: 'orbital' }));      
          setTerrestrial(null);
        }

        // Set the list of inclinations present in the data. 
        let uniqueInclinations: number[];
        if (res.data.modelData.orbital[metricType]) {
          let tmp = res.data.modelData.orbital[metricType].points.map(
            item => item.inclination
          );
          uniqueInclinations = [...(new Set(tmp) as any)].sort();
          setIncs(uniqueInclinations);
        }

        setUserPoint(res.data, uniqueInclinations[0], metricType, res.data.modelData.terrestrial[metricType]);
        setParams((prevState) => ({
          ...prevState,
          metricType: metricType
        }));

        // Set the regression type options for each metric. 
        const newRegressionTypeOptions = {};
        Object.keys(res.data.modelData.orbital).forEach(metric => {
          newRegressionTypeOptions[metric] = {};
          if (res.data.predictedData && Object.keys(res.data.predictedData.surfaces).includes(metric)) {
            newRegressionTypeOptions[metric]['gam'] = 'GAM';
          }
          if (res.data.predictedData && Object.keys(res.data.predictedData.coefficients).includes(metric)) {
            newRegressionTypeOptions[metric]['glm'] = 'GLM';
          }
        });
        setRegressionTypeOptions(newRegressionTypeOptions);

        setRegressionTypes((res.data.predictedData && res.data.predictedData.regressionDefaults.regressionTypes) ?? {});
        setQualityIndicators((res.data.predictedData && res.data.predictedData.regressionDefaults.qualityIndicators) ?? {});
        setData(res.data);
        setAxisLabel(res.data.modelData.orbital[params.metricType].label);
        setIsLoading(false);
      }).catch((error) => {
        console.log('error', error);
      });
    }
  }, [isRefresh]);

  // When the user changes, update the file ID. 
  useEffect(() => {
    setFileId();
  }, [refreshFileId, params.missionType, params.altitude, params.inclination, params.latitude, params.longitude]);

  // Update altitude/inclination and latitude/longitude. 
  const setUserPoint = (
    currentData: { modelData: ModelData, predictedData: PredictedData }, 
    inclination: number, 
    metricType: string, 
    terrestrialData: TerrestrialData
  ) => {
    // Set the altitude and inclination. 
    const points = currentData.modelData.orbital[metricType].points.filter(
      item => item.inclination === inclination
    );
    if (points.length > 0) {
      setParams((prevState) => ({ 
        ...prevState, 
        altitude: points[0].altitude,
        inclination: inclination,
        value: points[0].value
      }));
    }

    // Set the latitude and longitude. 
    if (terrestrialData && Object.keys(terrestrialData).length !== 0) {
      setParams((prevState) => ({ 
        ...prevState, 
        longitude: terrestrialData.heatmap.x[0],
        latitude: terrestrialData.heatmap.y[0]
      }));
    }

    setRefreshFileId(!refreshFileId);
  };

  // This function requests the file ID for the current set of parameters. 
  const setFileId = () =>  {
    const getFileIdParams = {
      missionType: params.missionType,
      userAltitude: params.altitude,
      userInclination: params.inclination,
      userLongitude: params.longitude,
      userLatitude: params.latitude,
      system: params.system,
      version: params.version,
      groundStation: params.groundStation,
      networkType: params.networkType
    };

    getFileId(getFileIdParams).then((res) => {
      setParams((prevState) => ({ 
        ...prevState, 
        fileId: res.data
      }));
    });
  };

  const handleParamChange = (name: string, value) => {
    // If system is changed, set the system, network type, and version. 
    if (name === 'system') {
      setParams((prevState) => ({ 
        ...prevState, 
        system: value,
        systemName: systemsAndVersions.systems[params.missionType][value].name,
        networkType: systemsAndVersions.systems[params.missionType][value].networkType,
        version: Math.max(...systemsAndVersions.versions[params.missionType][value])
      }));
    } 
    
    // If mission type is changed, the version needs to be updated, 
    // since for a given system, there are different versions for 
    // orbital and terrestrial user data. 
    else if (name === 'missionType') {
      setParams((prevState) => ({ 
        ...prevState, 
        missionType: value,
        version: Math.max(...systemsAndVersions.versions[value][params.system])
      }));
    }

    // If inclination is changed, select a new point. 
    else if (name === 'inclination') {
      //if (Object.keys(source).includes('plot_value')) {
        setUserPoint(data, value, params.metricType, terrestrial);
      //}
    } 
    
    // If the database is changed, set the database connection on the server. 
    else if (name === 'database') {
      changeDB({ database: value }).then((_res) => {
        setParams((prevState) => ({ 
          ...prevState, 
          database: value
        }));
      }).catch((_err) => {
        setParams((prevState) => ({ 
          ...prevState, 
          database: 'staging' 
        }));
      });
    } 
    
    // No special logic is needed when updating the other parameters. 
    else {
      setParams((prevState) => ({ 
        ...prevState, 
        [name]: value 
      }));
    }

    // If one of these parameters is changed, we need to go to the server to get new coverage data. 
    if (name === 'system' || name === 'version' || name === 'groundStation' || name === 'frequencyBand') {
      setData(null);
      setIsRefresh(!isRefresh);
    }
  };

  const handleRegressionType = (regressionType: string) => {
    setRegressionTypes((prevState) => ({
      ...prevState,
      [params.metricType]: regressionType
    }));
  };

  const handleRegressionQuality = (regressionQuality: string) => {
    setQualityIndicators((prevState) => ({
      ...prevState,
      [params.metricType]: regressionQuality
    }));
  };

  // Stores the selections for regression type and 
  // regression quality as defaults in the database. 
  const saveDefaults = () => {
    const axiosParams = {
      networkType: params.networkType,
      networkId: params.system,
      groundStationId: params.groundStation,
      frequencyBandId: params.frequencyBand,
      version: params.version,
      metricType: params.metricType,
      regressionType: regressionTypes[params.metricType],
      qualityIndicator: qualityIndicators[params.metricType]
    };

    axios.post<{}>('/saveRegressionDefaults', axiosParams).then(res => {

    }).catch((error) => {
      console.log('error', error);
    });
  };

  return (
    <Grid container>
      <Container component="main" maxWidth="xl">
        <Card className={classes.cartCard}>
          <CssBaseline />
          <CardHeader
            title={
              <Typography component="h1" variant="h6" style={{ margin: 5 }}>
                {`Engineering Dashboard`}
              </Typography>
            }
            style={{
              backgroundColor: blue[700],
              color: '#fff',
              maxHeight: '2.5rem'
            }}
          />
          {!isLoading && systemsAndVersions !== null && (
            <AnalyzeRegressionSection
              params={params}
              regressionTypeOptions={regressionTypeOptions}
              regressionTypes={regressionTypes}
              onRegressionType={handleRegressionType}
              regressionQuality={qualityIndicators}
              onRegressionQuality={handleRegressionQuality}
              data={data}
              terrestrial={terrestrial}
              zAxisLabel={axisLabel}
              systemsAndVersions={systemsAndVersions}
              incs={incs}
              onRefresh={() => setIsRefresh(!isRefresh)}
              onUpdateSystems={() => setUpdateSystems(!updateSystems)}
              onChange={handleParamChange}
              saveDefaults={saveDefaults}
            />
          )}
        </Card>
      </Container>
    </Grid>
  );
};

export default EngineeringDashboard;