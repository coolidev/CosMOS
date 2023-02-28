/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useState, useEffect, useRef } from 'react';
import {
  makeStyles,
  Theme
} from '@material-ui/core';
import type { State } from 'src/pages/home';

interface VisualizerProps {
    state: State;
    height: number;
};

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    iframe: {
        width: '100%',
        border: '1px solid #000',
        display: 'block'
      }
}));

const Visualizer: FC<VisualizerProps> = ({
    state,
    height
}) => {
    const [initialUrl, setInitialUrl] = useState('');
    const visualizerRef = useRef<HTMLIFrameElement>();
    const classes = useStyles();
    const [lastNetworkType, setLastNetworkType] = useState<String>();
    const [meanAnomaly, setMeanAnomaly] = useState<number>(0);

    const convertArrayToString = (array: any[]) => {
        let string = '';

        array.forEach(element => {
            string += `${element},`;
        });
        string = string.slice(0, -1);

        return string;
    };

    useEffect(() => {
        //if (state.save || state.save === '') {
        if (lastNetworkType !== state.networkType) {
            let url = '';
            if (window.location.origin.split(':').length > 2) {
                url = `${window.location.origin.slice(0, window.location.origin.lastIndexOf(':'))}:4001`;
            } else {
                url = `${window.location.origin}/visualizer`;
            }
            
    
            if (state.networkType === 'relay') {
                if (state.parameters.isOrbital) {
                    url += `/?relay=${state.radioButtonSelectionId}&gs=&freqId=&viewMode=3D&alt=${state.parameters.altitude}&inc=${state.parameters.inclination}&raan=${state.parameters.raan}?ecc=${state.parameters.eccentricity}&argper=${state.parameters.argumentOfPerigee}&meanAnom=${meanAnomaly}&lat=&long=`;
                } else {
                    url += `/?relay=${state.radioButtonSelectionId}&gs=&freqId=&viewMode=3D&alt=&inc=&lat=${state.parameters.latitude}&long=${state.parameters.longitude}`;
                }
            } else if (state.networkType === 'dte') {
                // Create arrays of ground station and frequency band IDs. 
                const groundStationIds = [];
                const frequencyBandIds = [];
                state.selectedItems.forEach(item => {
                    groundStationIds.push(item.id);

                    const frequencyBandId = item.frequencyBandId;
                    frequencyBandIds.push(frequencyBandId);
                });
    
                const groundStationString = convertArrayToString(groundStationIds);
                const frequencyBandString = convertArrayToString(frequencyBandIds);
    
                url += `/?relay=&gs=${groundStationString}&freqId=${frequencyBandString}&viewMode=2D&alt=${state.parameters.altitude}&inc=${state.parameters.inclination}&raan=${state.parameters.raan}?ecc=${state.parameters.eccentricity}&argper=${state.parameters.argumentOfPerigee}&meanAnom=${meanAnomaly}`;
            } else {
                url += `/?relay=&gs=&freqId=&viewMode=2D&alt=&inc=`;
            }
    
            setInitialUrl(url);
            setLastNetworkType(state.networkType);
        }
    }, [state.save]);

    useEffect(() => {
        if (
            visualizerRef.current !== undefined && 
            state.networkType === 'dte'
        ) {
            // Create arrays of ground station and frequency band IDs. 
            const groundStationIds = [];
            const frequencyBandIds = [];
            state.selectedItems.forEach(item => {
                groundStationIds.push(item.id);

                const frequencyBandId = item.frequencyBandId;
                frequencyBandIds.push(frequencyBandId);
            });

            const groundStationString = convertArrayToString(groundStationIds);
            const frequencyBandString = convertArrayToString(frequencyBandIds);

            const config = {
                gs: groundStationString, 
                freqId: frequencyBandString
            };
        
            visualizerRef.current.contentWindow.postMessage({ config: config }, '*');
        } else if (
            visualizerRef.current !== undefined && 
            state.networkType === 'relay'
        ) {
            const config = {
                relay: state.selectedItems[0]?.id ?? ''
            };

            visualizerRef.current.contentWindow.postMessage({ config: config }, '*');
        }
    }, [initialUrl, state.selectedItems]);
    
    useEffect(() => {
        if (!visualizerRef.current) return;

        if (state.networkType === 'relay') {
            visualizerRef.current.contentWindow.postMessage({ viewMode: '3D' }, '*');
        } else if (state.networkType === 'dte') {
            visualizerRef.current.contentWindow.postMessage({ viewMode: '2D' }, '*');
        }

    }, [state.networkType]);

    useEffect(() => {
        if(state.parameters.eccentricity && state.parameters.eccentricity > 0 && state.parameters.isOrbital){
            //Convert True Anomaly to Mean Anomaly
            const eccentricAnomaly = Math.acos(
                (
                    (Math.cos(state.parameters.trueAnomaly * Math.PI / 180) + state.parameters.eccentricity)
                    /
                    (1 + (state.parameters.eccentricity*Math.cos(state.parameters.trueAnomaly * Math.PI / 180)))
                )
                 * Math.PI / 180) * 180 / Math.PI;
            setMeanAnomaly(eccentricAnomaly - (state.parameters.eccentricity*Math.sin(eccentricAnomaly * Math.PI / 180)));
        }else{
            setMeanAnomaly(state.parameters.trueAnomaly);
        }
        if (visualizerRef.current !== undefined) {
            if (state.parameters.isOrbital) {
                const usat = { 
                    altitude: state.parameters.altitude, 
                    inclination: state.parameters.inclination,
                    eccentricity: state.parameters.eccentricity,
                    raan: state.parameters.raan,
                    argumentOfPerigee: state.parameters.argumentOfPerigee,
                    meanAnomaly: meanAnomaly,
                    show: true
                };
                const terrestrialUser = { show: false };

                visualizerRef.current.contentWindow.postMessage({ usat: usat, terrestrialUser: terrestrialUser }, '*');
            } else {
                const usat = { show: false };
                const terrestrialUser = {
                    latitude: state.parameters.latitude,
                    longitude: state.parameters.longitude,
                    show: true
                };
    
                visualizerRef.current.contentWindow.postMessage({ usat: usat, terrestrialUser: terrestrialUser }, '*');
            }
        }
    }, [state.parameters.altitude, state.parameters.inclination, state.parameters.latitude, state.parameters.longitude, state.parameters.isOrbital, state.parameters.raan, state.parameters.eccentricity, state.parameters.argumentOfPerigee, state.parameters.trueAnomaly]);

    return (
        <div className={classes.root}>
            {initialUrl !== '' && <iframe 
                id="visualizerFrame" 
                title="visualizerFrame"
                src={initialUrl} 
                ref={visualizerRef} 
                className={classes.iframe}
                style={{  height }}
            ></iframe>}
        </div>
    );
};

export default Visualizer;