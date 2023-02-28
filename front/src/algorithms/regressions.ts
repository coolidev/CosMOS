import type { PredictedData } from 'src/types/evaluation';
import { EQUATIONS } from 'src/utils/equations';
import type { Metric } from 'src/types/evaluation';

const DEFAULT_REGRESSION_TYPE = 'gam';

/**
 * Calculate Regression Value
 * @param {number} altitude_km
 * @param {number} inclination_deg
 * @param {string} metricType
 * @param {string} regressionType
 * @param {PredictedData} predictedData
 * @param {string} systemName
 * @return {number =>}
 */
export const getValue = (
    altitude_km: number, 
    inclination_deg: number, 
    metricType: string, 
    regressionType: string,
    predictedData: PredictedData,
    systemName: string
): number => {
    // If the regression type is undefined, use the default. 
    regressionType = regressionType ?? DEFAULT_REGRESSION_TYPE;
    let value = NaN;

    if (regressionType === 'glm') {
        if (!predictedData) return NaN;
        const { coefficients } = predictedData;

        if (
            Object.keys(coefficients).includes(metricType) && 
            Object.keys(EQUATIONS).includes(systemName) && 
            Object.keys(EQUATIONS[systemName]).includes(metricType)
        ) {
            const equation = EQUATIONS[systemName][metricType];
            value = equation(coefficients[metricType], altitude_km, inclination_deg);
        } else if (
            Object.keys(coefficients).includes(metricType) && 
            Object.keys(EQUATIONS.default).includes(metricType) 
        ) {
            const equation = EQUATIONS.default[metricType];
            value = equation(coefficients[metricType], altitude_km, inclination_deg);
        }
    } else if (regressionType === 'gam') {
        // Determine which data set represents the surface for this metric. 
        let surface: Metric[] = [];
        if(predictedData && metricType){
            if (
                predictedData && metricType.includes('coveragePerStation') && 
                Object.keys(predictedData).includes('coveragePerStation') 
            ) {
                const groundStationId = metricType.slice(metricType.indexOf('-') + 1);
                surface = predictedData.coveragePerStation[groundStationId];
            } else if (predictedData && Object.keys(predictedData.surfaces).includes(metricType)) {
                surface = predictedData.surfaces[metricType];
            }
        }

        if (surface.length > 0) {
            // Use the value of the point closest to the altitude and
            // inclination that are selected in the Mission Parameters panel. 
            const inclinations: number[] = [];
            const inclinationDistances: number[] = [];
            surface.forEach(point => {
                inclinations.push(point.inclination);
                inclinationDistances.push(Math.abs(point.inclination - inclination_deg));
            });
            const closestInclinationIndex = inclinationDistances.indexOf(Math.min(...inclinationDistances));
            const inclination = inclinations[closestInclinationIndex];

            const points = surface.filter(
                (item: any) => item.inclination === inclination
            );

            const altitudes: number[] = [];
            const altitudeDistances: number[] = [];
            const values: number[] = [];
            points.forEach(point => {
                altitudes.push(point.altitude);
                altitudeDistances.push(Math.abs(point.altitude - altitude_km));
                values.push(point.value);
            });
            const closestAltitudeIndex = altitudeDistances.indexOf(Math.min(...altitudeDistances));
            value = values[closestAltitudeIndex];
        }
    }

    return value;
};

export const getOrbitalModelValue = (
    altitude_km: number, 
    inclination_deg: number, 
    metricType: string, 
    modelData: any,
    systemName: string): number => {
        var value = NaN;
        if(modelData != null){
            Object.keys(modelData.orbital).forEach(metric => {
                if(modelData.orbital[metric].type === metricType){
                    let match = modelData.orbital[metric].points.filter(row => row.altitude === altitude_km && row.inclination === inclination_deg);
                    return value = match[0]? match[0].value : NaN;
                }
            })

        }
        
        return value;
    }
export const getDTEModelValue = (
    altitude_km: number, 
    inclination_deg: number, 
    metricType: string, 
    modelData: any,
    systemName: string): number => {
        var value = NaN;
        if(modelData != null){
            Object.keys(modelData.terrestrial).forEach(metric => {
                if(modelData.terrestrial[metric].type === metricType){
                    let match = modelData.terrestrial[metric].points.filter(row => row.altitude === altitude_km && row.inclination === inclination_deg);
                    return value = match[0]? match[0].value : NaN;
                }
            })
    
        }
            
        return value;
    }