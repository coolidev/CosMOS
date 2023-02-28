import { SelectedNetwork } from 'src/types/preference';
import axios from 'src/utils/axios';

interface UserDefinedNetworkProps {
    selectedNetworks: SelectedNetwork[];
    frequencyBandId: number;
    userAltitude_km: number;
    userInclination_deg: number;
    networkId?: number;
};

/**
 * Save a Ground Station Combination
 * @param {UserDefinedNetworkProps} props
 * @return {Promise<number> =>}
 */
export const saveUserDefinedNetwork = async (props: UserDefinedNetworkProps): Promise<number> => {
    const {
        selectedNetworks,
        frequencyBandId,
        userAltitude_km,
        userInclination_deg
    } = props;

    const groundStations = selectedNetworks.map(item => {
        return {
            groundStationId: item.id,
            version: item.version
        };
    });
    const data = {
        groundStations: groundStations,
        frequencyBand: frequencyBandId,
        userAltitude: userAltitude_km,
        userInclination: userInclination_deg
    };
    
    const response = await axios.post('/saveGroundStations', data);

    return response.data.state;
};

// 
/**
 * Returns either the user defined network ID, or 0 if the combination
 * does not exist in the database, or -1 if the combination is currently
 * being processed. 
 * @param {UserDefinedNetworkProps} props
 * @return {Promise<number> =>}
 */
export const checkUserDefinedNetwork = async (props: UserDefinedNetworkProps): Promise<number> => {
    const {
        selectedNetworks,
        frequencyBandId,
        userAltitude_km,
        userInclination_deg
    } = props;

    const groundStations = selectedNetworks.map(item => {
        return {
            groundStationId: item.id,
            version: item.version
        };
    });
    const data = {
        groundStations: groundStations,
        frequencyBand: frequencyBandId,
        userAltitude: userAltitude_km,
        userInclination: userInclination_deg
    };

    const response = await axios.post('/checkGroundStations', data);

    return response.data.state;
};