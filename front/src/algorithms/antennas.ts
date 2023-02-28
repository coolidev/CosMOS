import {
    GainInputs,
    computeGain
} from './link';

/** The assumed efficiency of a parabolic antenna. 
 * @type {*} 
 */
const EFFICIENCY = 0.6;

/** The speed of light in millimeters.
 * @type {*} 
 */
const C_mm = 2.99792458e11;

/**
 * Parameters needed to calculate antenna sizes and masses.
 *
 * @export
 * @interface AntennaInputs
 */
export interface AntennaInputs {
    wavelength: number;
    eirp: number;
    powerAmplifier: number,
    antennaSize?: number,
    rxAntennaGain?: number,
    antennaBeamwidth?: number
};

/**
 * Compute the diameter of a parabolic antenna. 
 * @param {AntennaInputs} inputs
 * @return {number =>}
 */
export const computeParabolicDiameter = (inputs: AntennaInputs): number => {
    const { 
        wavelength,
        eirp,
        powerAmplifier
    } = inputs;

    if(inputs.antennaSize){
        return inputs.antennaSize;
    }

    const gainInputs: GainInputs = {
        eirp: eirp,
        powerAmplifier: powerAmplifier,
        isPhasedArray: false
    };
    const gain = computeGain(gainInputs);

    return wavelength * Math.sqrt(Math.pow(10, gain / 10) / EFFICIENCY) / Math.PI;
};

/**
 * Compute the mass of a parabolic antenna. 
 * @param {AntennaInputs} inputs
 * @return {number =>}
 */
export const computeParabolicMass = (inputs: AntennaInputs): number => {    
    const diameter = computeParabolicDiameter(inputs);

    if (diameter > 0.65) {
        return 6.674 * diameter - 3.802;
    } else {
        return 3 * Math.pow(diameter, 2);
    }
};

/**
 * Compute the number of elements in a steerable antenna. 
 * @param {AntennaInputs} inputs
 * @return {number =>}
 */
export const computeNumElements = (inputs: AntennaInputs): number => {
    const { 
        eirp,
        powerAmplifier
    } = inputs;

    const gainInputs: GainInputs = {
        eirp: eirp,
        powerAmplifier: powerAmplifier,
        isPhasedArray: true
    };
    const gain = computeGain(gainInputs);

    return Math.ceil(Math.pow(10, (gain - 5) / 20));
};

/**
 * Compute the size of a steerable antenna. 
 * @param {AntennaInputs} inputs
 * @return {number =>}
 */
export const computeSteerableSize = (inputs: AntennaInputs): number => {
    const { wavelength } = inputs;
    const numElements = computeNumElements(inputs);

    return numElements * Math.pow(wavelength / 2, 2);
};

/**
 * Compute the mass of a steerable antennna. 
 * @param {AntennaInputs} inputs
 * @return {number =>}
 */
export const computeSteerableMass = (inputs: AntennaInputs): number => {
    const numElements = computeNumElements(inputs);

    return 0.9671 * numElements - 0.1826;
};

/**
 * Compute the size of a helical antenna. 
 * @param {AntennaInputs} inputs
 * @return {number =>}
 */
export const computeHelicalSize = (inputs: AntennaInputs): number => {
    const { 
        eirp,
        powerAmplifier,
        wavelength
    } = inputs;

    const gainInputs: GainInputs = {
        eirp: eirp,
        powerAmplifier: powerAmplifier,
        isPhasedArray: false
    };
    const gain = computeGain(gainInputs);

    return Math.pow(10, (gain - 10.8) / 10) * wavelength;
};

/**
 * Compute the size of a patch antenna. 
 * @param {AntennaInputs} inputs
 * @return {number =>}
 */
export const computePatchSize = (inputs: AntennaInputs): number => {
    const { wavelength } = inputs;

    return Math.pow(wavelength / 3.28, 2);
};

/**
 * Compute the width of a patch antenna. 
 * @param {number} freq_Hz
 * @param {number} eps_r
 * @return {number =>}
 */
export const computePatchWidth = (freq_Hz: number, eps_r: number): number => {
    return C_mm / (2 * freq_Hz * Math.sqrt((eps_r + 1) / 2));
};

// Compute the length of a patch antenna. 
export const computePatchLength = (
    freq_Hz: number, 
    eps_r: number,
    height: number
): number => {

    const width = computePatchWidth(freq_Hz, eps_r);
    const e_eff = ((eps_r + 1) / 2) + ((eps_r - 1) / 2) * 
        (1 / Math.sqrt(1 + 12 * height / width));

    return (C_mm / (2 * freq_Hz * Math.sqrt(e_eff))) - 
        (0.824 * height * (((e_eff + 0.3) * (width / height + 0.264)) / 
        ((e_eff - 0.258) * (width / height + 0.8))));
};

/**
 * Compute the size of a dipole antenna. 
 * @param {AntennaInputs} inputs
 * @return {number =>}
 */
export const computeDipoleSize = (inputs: AntennaInputs): number => {
    const {
        eirp,
        powerAmplifier,
        wavelength
    } = inputs;

    const gainInputs: GainInputs = {
        eirp: eirp,
        powerAmplifier: powerAmplifier,
        isPhasedArray: false
    };
    const gain = computeGain(gainInputs);

    if (gain > 2) {
        return 1.25 * wavelength;
      } else {
        return 0.5 * wavelength;
      }
};

/**
 * Parameters needed to compute gain from antenna size. 
 *
 * @export
 * @interface AntennaGainInputs
 */
export interface AntennaGainInputs {
    size: number;
    wavelength: number;
};

// Convert gain to EIRP. 
export const computeEirpFromGain = (
    gain: number, 
    powerAmplifier: number,
    isPhasedArray: boolean
): number => {

    if (isPhasedArray) {
        return gain - 20;
    } else {
        return gain + 10 * Math.log10(powerAmplifier);
    }
};

/**
 * Given the diameter of a parabolic antenna, compute the gain. 
 * @param {AntennaGainInputs} inputs
 * @return {number =>}
 */
export const computeGainFromParabolicDiameter = (inputs: AntennaGainInputs): number => {
    const {
        size,
        wavelength
    } = inputs;

    return 10 * Math.log10(Math.pow(size * Math.PI / wavelength, 2) * EFFICIENCY);
};

/**
 * Given the size of a steerable antenna, compute the gain. 
 * @param {AntennaGainInputs} inputs
 * @return {number =>}
 */
export const computeGainFromSteerableSize = (inputs: AntennaGainInputs): number => {
    const {
        size,
        wavelength
    } = inputs;

    // Calculate the number of elements in the steerable antenna. 
    const numElements = size / Math.pow(wavelength / 2, 2);

    // Calculate gain from the number of elements. 
    return 5 + 20 * Math.log10(numElements);
};

/**
 * Given the size of a helical antenna, compute the gain. 
 * @param {AntennaGainInputs} inputs
 * @return {number =>}
 */
export const computeGainFromHelicalSize = (inputs: AntennaGainInputs): number => {
    const {
        size,
        wavelength
    } = inputs;

    return 10.8 + 10 * Math.log10(size / wavelength);
};