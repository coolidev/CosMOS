import type { SystemParams, LinkParams } from 'src/types/evaluation';
import type { PerformancePanel } from 'src/types/evaluation';
import type { 
  LinkBudgetRow,
  DteLinkBudget,
  RelayRegenerativeLinkBudget,
  RelayBentPipeLinkBudget
} from 'src/types/link-budget';
import type { State } from 'src/pages/home';
import { 
    computeEirp,
    computePrec, 
    computePathDistance,
    getPropagationLosses
} from 'src/algorithms/link';
import { boltzmann_dBW_HzK } from 'src/utils/constants/physical';

/**
 * Generate Link Budget
 * @param {SystemParams} systemParams
 * @param {LinkParams} linkParams
 * @param {State} state
 * @param {number} id
 * @param {LinkBudgetRow[]} previousLinkBudget
 * @return {=>}
 */
const computeLinkBudget = (systemParams: SystemParams, linkParams: LinkParams, state: State, id: number, previousLinkBudget: LinkBudgetRow[]) => {
    const linkBudget = {};

    // Determine the modulation and coding to use. 
    const selectedItem = state.selectedItems.find(item => item.id === id);
    const modulation = selectedItem.modulation;
    const coding = selectedItem.coding;

    const ebNo_dB = linkParams.ebNoTable[modulation][coding];
    const newState = {
        ...state,
        results: {
            ...state.results,
            ebNo_dB: ebNo_dB
        }
    };
    let eirp_dBW = computeEirp(systemParams, linkParams, newState);
    const dataRate_kbps = state.results.dataRate_kbps;

    // Add the user-entered miscellaneous loss to the EIRP. 
    let miscellaneousLosses_dB: number;
    const miscellaneousLossRow = previousLinkBudget.find(parameter => parameter.key === 'miscellaneousLosses_dB');
    if (miscellaneousLossRow) {
        miscellaneousLosses_dB = miscellaneousLossRow.value ? miscellaneousLossRow.value : 0;
        if(state.commsSpecs.commsPayloadSpecs.minEIRPFlag){eirp_dBW += miscellaneousLosses_dB;}
    }

    if (systemParams.networkType === 'dte') {
        linkBudget['userEirp_dBW'] = eirp_dBW;

        const pathDistance = computePathDistance(
            NaN, state.parameters.altitude, NaN, 
            systemParams.elevationConstraint_deg, 'dte'
        );
        const freeSpaceLoss_dB = 32.45 + 20 * Math.log10(systemParams.rtnLinkFreqMHz) + 
        20 * Math.log10(pathDistance);
        linkBudget['freeSpaceLoss_dB'] = freeSpaceLoss_dB
    
        linkBudget['atmosphericLoss_dB'] = systemParams.atmosphericLoss_dB;
        linkBudget['rainAttenuation_dB'] = systemParams.rainAttenuation_dB;
        linkBudget['cloudAttenuation_dB'] = systemParams.cloudAttenuation_dB;
        linkBudget['scintillationLoss_dB'] = systemParams.scintillationLoss_dB;
        linkBudget['polarizationLoss_dB'] = state.commsSpecs.commsPayloadSpecs.polarizationLoss ?? systemParams.polarizationLoss_dB;
        linkBudget['miscellaneousLosses_dB'] = state.commsSpecs.commsPayloadSpecs.otherLoss ?? miscellaneousLosses_dB ?? 0;
        linkBudget['pointingLosses_dB'] = state.commsSpecs.commsPayloadSpecs.pointingLoss ?? 0;
        const prec_dBW = 
        !state.commsSpecs.commsPayloadSpecs.minEIRPFlag? computePrec(
            systemParams.isBentPipe, systemParams.gOverT, systemParams.implementationLoss,
            ebNo_dB, dataRate_kbps, systemParams.systemName, NaN, NaN, NaN, NaN, NaN,
            systemParams.sslBandwidth_dBHz, systemParams.sglBandwidth_dBHz, 
            systemParams.carrierToInterferenceRatio_dB, systemParams.rfInterferenceLoss_dB, 
            systemParams.imDegradation_dB, systemParams.sglAtmosphericLoss_dB, systemParams.sglRainAttenuation_dB,
            eirp_dBW, (state.commsSpecs.commsPayloadSpecs.pointingLoss ?? 0), (state.commsSpecs.commsPayloadSpecs.otherLoss ?? 0),(state.commsSpecs.commsPayloadSpecs.polarizationLoss ?? 0),{freeSpaceLoss: freeSpaceLoss_dB, 
                atmosphericLoss: systemParams.atmosphericLoss_dB, 
                polarizationLoss: state.commsSpecs.commsPayloadSpecs.polarizationLoss ?? systemParams.polarizationLoss_dB,
                totalPropLosses: systemParams.rainAttenuation_dB + systemParams.cloudAttenuation_dB + systemParams.scintillationLoss_dB,
                miscLosses: state.commsSpecs.commsPayloadSpecs.otherLoss ?? miscellaneousLosses_dB ?? 0,
                pointingLoss: state.commsSpecs.commsPayloadSpecs.pointingLoss ?? 0,
            }
        )
        :computePrec(
            systemParams.isBentPipe, systemParams.gOverT, systemParams.implementationLoss,
            ebNo_dB, dataRate_kbps, systemParams.systemName, NaN, NaN, NaN, NaN, NaN,
            systemParams.sslBandwidth_dBHz, systemParams.sglBandwidth_dBHz, 
            systemParams.carrierToInterferenceRatio_dB, systemParams.rfInterferenceLoss_dB, 
            systemParams.imDegradation_dB, systemParams.sglAtmosphericLoss_dB, systemParams.sglRainAttenuation_dB,
            NaN,  (state.commsSpecs.commsPayloadSpecs.pointingLoss ?? 0), (state.commsSpecs.commsPayloadSpecs.otherLoss ?? 0),(state.commsSpecs.commsPayloadSpecs.polarizationLoss ?? 0), null
        );
        
        linkBudget['receivedPower_dBW'] = prec_dBW;
    
        linkBudget['gainToNoiseTemperatureRatio_dB_K'] = systemParams.gOverT;
        linkBudget['boltzmann_dBW_HzK'] = boltzmann_dBW_HzK;
    
        const cOverNo_dBHz = prec_dBW + systemParams.gOverT - boltzmann_dBW_HzK;
        linkBudget['cOverNo_dBHz'] = cOverNo_dBHz;
    
        const dataRate_dBbps = 10 * Math.log10(1000 * dataRate_kbps);
        linkBudget['dataRate_dBbps'] = dataRate_dBbps
    
        const ebNoIntoDemod_dB = cOverNo_dBHz - dataRate_dBbps;
        linkBudget['ebNoIntoDemod_dB'] = ebNoIntoDemod_dB;
    
        linkBudget['implementationLoss_dB'] = systemParams.implementationLoss;

        const netEbNo_dB = ebNoIntoDemod_dB - systemParams.implementationLoss;
        linkBudget['netEbNo_dB'] = netEbNo_dB
        linkBudget['requiredEbNo_dB'] = ebNo_dB;
        linkBudget['margin_dB'] = netEbNo_dB - ebNo_dB;
    } else if (systemParams.isBentPipe) {
        linkBudget['Space-Space Link'] = 'HEADER';
        linkBudget['userEirp_dBW'] = eirp_dBW;

        // Space-Space Link 
        linkBudget['sslFrequency_MHz'] = systemParams.rtnLinkFreqMHz;

        const sslPathDistance = computePathDistance(
            systemParams.theta, state.parameters.isOrbital ? state.parameters.altitude : 0, 
            systemParams.A_r, NaN, 'relay'
        );
        linkBudget['sslDistance_km'] = sslPathDistance;

        const sslFreeSpaceLoss_dB = 32.45 + 
            20 * Math.log10(systemParams.rtnLinkFreqMHz) + 
            20 * Math.log10(sslPathDistance);
        linkBudget['freeSpaceLoss_dB'] = sslFreeSpaceLoss_dB;

        linkBudget['multipathLoss_dB'] = systemParams.sslMultipathLoss_dB;
        linkBudget['polarizationLoss_dB'] = state.commsSpecs.commsPayloadSpecs.polarizationLoss ?? systemParams.polarizationLoss_dB;
        linkBudget['pointingLosses_dB'] = state.commsSpecs.commsPayloadSpecs.pointingLoss ?? 0;
        let atmosphericLoss_dB: number;
        let rainAttenuation_dB: number;
        if (state.parameters.isOrbital) {
            // No atmospheric losses for orbital users in 
            // space-to-space link. 
            linkBudget['atmosphericLoss_dB'] = systemParams.sslAtmosphericLoss_dB;
            linkBudget['rainAttenuation_dB'] = systemParams.sslRainAttenuation_dB;
            atmosphericLoss_dB = systemParams.sslAtmosphericLoss_dB;
            rainAttenuation_dB = systemParams.sslRainAttenuation_dB;
        } else {
            // Use grid of pre-calculated values to determine atmospheric
            // loss depending on the terrestrial user coordinates. 
            const losses = getPropagationLosses(linkParams.propagationLosses, state.parameters.longitude, state.parameters.latitude);
            linkBudget['atmosphericLoss_dB'] = losses.atmosphericLoss_dB;
            linkBudget['rainAttenuation_dB'] = losses.rainAttenuation_dB;
            atmosphericLoss_dB = losses.atmosphericLoss_dB;
            rainAttenuation_dB = losses.rainAttenuation_dB;
        }

        linkBudget['miscellaneousLosses_dB'] = state.commsSpecs.commsPayloadSpecs.otherLoss ?? miscellaneousLosses_dB ?? 0;

        const precAtRelay_dBW = eirp_dBW - sslFreeSpaceLoss_dB - 
            systemParams.sslMultipathLoss_dB - systemParams.polarizationLoss_dB - 
            atmosphericLoss_dB - rainAttenuation_dB - miscellaneousLosses_dB;
        linkBudget['precAtRelay_dBW'] = precAtRelay_dBW;

        linkBudget['relayGainToNoiseTemperatureRatio_dB_K'] = systemParams.gOverT;

        const cOverNoAtRelay_dB_K = precAtRelay_dBW + 
            systemParams.gOverT - boltzmann_dBW_HzK;
        linkBudget['cOverNoAtRelay_dB_K'] = cOverNoAtRelay_dB_K;

        linkBudget['bandwidth_dBHz'] = systemParams.sslBandwidth_dBHz;

        const cOverNAtRelay_dB = cOverNoAtRelay_dB_K - systemParams.sslBandwidth_dBHz;
        linkBudget['cOverNAtRelay_dB'] = cOverNAtRelay_dB;

        // Space-Ground Link 
        linkBudget['Space-Ground Link'] = 'HEADER';
        linkBudget['sglFrequency_MHz'] = systemParams.sglFrequency_MHz;
        linkBudget['relayEirp_dBW'] = systemParams.sglRelayEirp_dBW;
        linkBudget['sglDistance_km'] = systemParams.relayToGroundDistance_km;

        const sglFreeSpaceLoss_dB = 32.45 + 20 * Math.log10(systemParams.sglFrequency_MHz) + 
            20 * Math.log10(systemParams.relayToGroundDistance_km);
        linkBudget['sglFreeSpaceLoss_dB'] = sglFreeSpaceLoss_dB;

        linkBudget['sglAtmosphericLoss_dB'] = systemParams.sglAtmosphericLoss_dB;
        linkBudget['sglRainAttenuation_dB'] = systemParams.sglRainAttenuation_dB;
        linkBudget['sglPolarizationLoss_dB'] = systemParams.sglPolarizationLoss_dB;

        const precAtGround_dBW = systemParams.sglRelayEirp_dBW - sglFreeSpaceLoss_dB - 
            systemParams.sglAtmosphericLoss_dB - systemParams.sglPolarizationLoss_dB - 
            systemParams.sglRainAttenuation_dB;
        linkBudget['precAtGround_dBW'] = precAtGround_dBW;

        linkBudget['gatewayGainToNoiseTemperatureRatio_dB_K'] = systemParams.gatewayGOverT_dB_K;
        
        const sglCOverNo_dBHz = precAtGround_dBW + systemParams.gatewayGOverT_dB_K - 
            boltzmann_dBW_HzK;
        linkBudget['sglCOverNo_dB_Hz'] = sglCOverNo_dBHz;

        linkBudget['imDegradation_dB'] = systemParams.imDegradation_dB;
        linkBudget['sglBandwidth_dBHz'] = systemParams.sglBandwidth_dBHz;

        let sglCOverN_dB: number;
        if (isNaN(systemParams.imDegradation_dB)) {
            sglCOverN_dB = sglCOverNo_dBHz - systemParams.sglBandwidth_dBHz;
        } else {
            sglCOverN_dB = sglCOverNo_dBHz - systemParams.sglBandwidth_dBHz -
                systemParams.imDegradation_dB;
        }
        
        linkBudget['sglCOverN_dB'] = sglCOverN_dB;

        // Comms Link Performance 
        linkBudget['Comms Link Performance'] = 'HEADER';
        const carrierToInterferenceRatio_dB = systemParams.carrierToInterferenceRatio_dB;
        linkBudget['carrierToInterferenceRatio_dB'] = carrierToInterferenceRatio_dB;

        let cOverNAtGround_dB: number;
        if (isNaN(systemParams.carrierToInterferenceRatio_dB) || systemParams.carrierToInterferenceRatio_dB === null) {
            cOverNAtGround_dB = 10 * Math.log10(1 / (
                1 / Math.pow(10, cOverNAtRelay_dB / 10) + 
                1 / Math.pow(10, sglCOverN_dB / 10)
            ));
        } else {
            cOverNAtGround_dB = 10 * Math.log10(1 / (
                1 / Math.pow(10, cOverNAtRelay_dB / 10) + 
                1 / Math.pow(10, sglCOverN_dB / 10) + 
                1 / Math.pow(10, carrierToInterferenceRatio_dB / 10)
            ));
        }
        
        linkBudget['cOverNAtGround_dB'] = cOverNAtGround_dB;

        const cOverNoAtGround_dBHz = cOverNAtGround_dB + systemParams.sslBandwidth_dBHz;
        linkBudget['cOverNoAtGround_dBHz'] = cOverNoAtGround_dBHz;
        
        let dateRate_dBbps: number;
        if (systemParams.systemName.includes('TDRS') && precAtRelay_dBW <= -184.1) {
            dateRate_dBbps = cOverNoAtGround_dBHz - (ebNo_dB + systemParams.implementationLoss + systemParams.rfInterferenceLoss_dB);
        } else {
            dateRate_dBbps = 10 * Math.log10(1000 * dataRate_kbps);
        }
        linkBudget['dataRate_dBbps'] = dateRate_dBbps;

        const ebNoIntoDemod = cOverNoAtGround_dBHz - dateRate_dBbps;
        linkBudget['ebNoIntoDemod_dB'] = ebNoIntoDemod;

        linkBudget['rfInterferenceLoss_dB'] = systemParams.rfInterferenceLoss_dB;
        linkBudget['implementationLoss_dB'] = systemParams.implementationLoss;
        
        const netEbNo_dB = ebNoIntoDemod - systemParams.implementationLoss - systemParams.rfInterferenceLoss_dB;
        linkBudget['netEbNo_dB'] = netEbNo_dB;

        linkBudget['requiredEbNo_dB'] = ebNo_dB;
        linkBudget['margin_dB'] = netEbNo_dB - ebNo_dB;
    } else {
        linkBudget['Space-Space Link'] = 'HEADER';
        linkBudget['userEirp_dBW'] = eirp_dBW;

        // Space-Space Link 
        linkBudget['sslFrequency_MHz'] = systemParams.rtnLinkFreqMHz;

        const sslPathDistance = computePathDistance(
            systemParams.theta, state.parameters.isOrbital ? state.parameters.altitude : 0, 
            systemParams.A_r, NaN, 'relay'
        );
        linkBudget['sslDistance_km'] = sslPathDistance;

        const sslFreeSpaceLoss_dB = 32.45 + 
            20 * Math.log10(systemParams.rtnLinkFreqMHz) + 
            20 * Math.log10(sslPathDistance);
        linkBudget['freeSpaceLoss_dB'] = sslFreeSpaceLoss_dB;

        linkBudget['multipathLoss_dB'] = systemParams.sslMultipathLoss_dB;
        linkBudget['polarizationLoss_dB'] = state.commsSpecs.commsPayloadSpecs.polarizationLoss ?? systemParams.polarizationLoss_dB;
        linkBudget['pointingLosses_dB'] = state.commsSpecs.commsPayloadSpecs.pointingLoss ?? 0;
        if (state.parameters.isOrbital) {
            // No atmospheric losses for orbital users in 
            // space-to-space link. 
            linkBudget['atmosphericLoss_dB'] = 0;
            linkBudget['rainAttenuation_dB'] = 0;
        } else {
            // Use grid of pre-calculated values to determine atmospheric
            // loss depending on the terrestrial user coordinates. 
            const losses = getPropagationLosses(linkParams.propagationLosses, state.parameters.longitude, state.parameters.latitude);
            linkBudget['atmosphericLoss_dB'] = losses.atmosphericLoss_dB;
            linkBudget['rainAttenuation_dB'] = losses.rainAttenuation_dB;
        }

        linkBudget['miscellaneousLosses_dB'] = state.commsSpecs.commsPayloadSpecs.otherLoss ?? miscellaneousLosses_dB ?? 0;

        const precAtRelay_dBW = eirp_dBW - sslFreeSpaceLoss_dB - 
            systemParams.sslMultipathLoss_dB - systemParams.polarizationLoss_dB - 
            systemParams.sslAtmosphericLoss_dB - systemParams.sslRainAttenuation_dB -
            miscellaneousLosses_dB;
        linkBudget['precAtRelay_dBW'] = precAtRelay_dBW;

        linkBudget['relayGainToNoiseTemperatureRatio_dB_K'] = systemParams.gOverT;

        const cOverNoAtRelay_dB_K = precAtRelay_dBW + 
            systemParams.gOverT - boltzmann_dBW_HzK;
        linkBudget['cOverNoAtRelay_dB_K'] = cOverNoAtRelay_dB_K;

        linkBudget['bandwidth_dBHz'] = systemParams.sslBandwidth_dBHz;

        const cOverNAtRelay_dB = cOverNoAtRelay_dB_K - systemParams.sslBandwidth_dBHz;
        linkBudget['cOverNAtRelay_dB'] = cOverNAtRelay_dB;

        // Comms Link Performance 
        linkBudget['Comms Link Performance'] = 'HEADER';
        const carrierToInterferenceRatio_dB = systemParams.carrierToInterferenceRatio_dB;
        linkBudget['carrierToInterferenceRatio_dB'] = carrierToInterferenceRatio_dB;

        let cOverNAtGround_dB: number;
        if (isNaN(systemParams.carrierToInterferenceRatio_dB) || systemParams.carrierToInterferenceRatio_dB === null) {
            cOverNAtGround_dB = 10 * Math.log10(1 / (
                1 / Math.pow(10, cOverNAtRelay_dB / 10)
            ));
        } else {
            cOverNAtGround_dB = 10 * Math.log10(1 / (
                1 / Math.pow(10, cOverNAtRelay_dB / 10) + 
                1 / Math.pow(10, carrierToInterferenceRatio_dB / 10)
            ));
        }
        linkBudget['cOverNAtGround_dB'] = cOverNAtGround_dB;

        const cOverNoAtGround_dBHz = cOverNAtGround_dB + systemParams.sslBandwidth_dBHz;
        linkBudget['cOverNoAtGround_dBHz'] = cOverNoAtGround_dBHz;
        
        const dateRate_dBbps = 10 * Math.log10(1000 * dataRate_kbps);
        linkBudget['dataRate_dBbps'] = dateRate_dBbps;

        const ebNoIntoDemod = cOverNoAtGround_dBHz - dateRate_dBbps;
        linkBudget['ebNoIntoDemod_dB'] = ebNoIntoDemod;

        linkBudget['implementationLoss_dB'] = systemParams.implementationLoss;
        
        const netEbNo_dB = ebNoIntoDemod - systemParams.implementationLoss;
        linkBudget['netEbNo_dB'] = netEbNo_dB;

        linkBudget['requiredEbNo_dB'] = ebNo_dB;
        linkBudget['margin_dB'] = netEbNo_dB - ebNo_dB;
    }

    return linkBudget;
};


/**
 * Apply updates to Link Budget - this is the function that is called by various components throughout the application
 * @param {PerformancePanel} data
 * @param {State} state
 * @param {{[key:string]:LinkBudgetRow[]}} linkBudget
 * @return {Promise<{ [key: string]: LinkBudgetRow[] }> =>}
 */
export const setLinkBudgets = async (data: PerformancePanel, state: State, linkBudget: { [key: string]: LinkBudgetRow[] }): Promise<{ [key: string]: LinkBudgetRow[] }> => {
    const newSystemParams = data.systemParams;
    const newLinkParams = data.linkParams;
    const linkBudgets: { [key: string]: LinkBudgetRow[] } = {};

    state.selectedItems.forEach(selectedItem => {
        const itemParams = Object.keys(newSystemParams).includes('networkType') ? newSystemParams : newSystemParams[selectedItem.id];
        if (!itemParams) return;
        
        const linkBudgetParameters: LinkBudgetRow[] = linkBudget[selectedItem.id];
        const linkBudgetValues = computeLinkBudget(itemParams, newLinkParams, state, selectedItem.id, linkBudgetParameters) as DteLinkBudget | RelayRegenerativeLinkBudget | RelayBentPipeLinkBudget;

        const newLinkBudget: LinkBudgetRow[] = linkBudgetParameters.map(item => {
          return {
            id: item.id,
            key: item.key,
            parameter: item.parameter,
            location: item.location,
            value: linkBudgetValues[item.key],
            noteId: item.noteId,
            notes: item.notes
          }
        });

        linkBudgets[selectedItem.id] = newLinkBudget;
    });

    return linkBudgets;
};