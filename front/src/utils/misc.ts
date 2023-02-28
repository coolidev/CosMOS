import { State } from "src/pages/home";
import { ModCodOption, SPAOrbitalPoint, SPATerrestrialPoint } from "src/types/evaluation";

export function getModCodForStation(modCodOptions : ModCodOption[], commsMod, commsCod) {
    let finMod = commsMod;
    let finCod = commsCod;
    let optimized = false;
    if(finMod !== -1 && modCodOptions.find(e => e.modulationId === finMod) == null) {
        finMod = -1;
    }
    if(finCod !== -1 && modCodOptions.find(e => e.codingId === finCod) == null) {
        finCod = -1;
    }
    if (finMod === -1 && finCod === -1) {
        optimized = true;
    } else {
        if(finMod === -1) {
        //select mod to first avail
        finMod = modCodOptions.find(e => e.codingId === finCod)?.modulationId ?? 0;
        } else if (finCod === -1) {
        finCod = modCodOptions.find(e => e.modulationId===finMod)?.codingId ?? 0;
        }
    }
    return {finMod,finCod,optimized};
}

export function toRunningAverage(acc,cv) {
    if(acc == null) acc = [];
    let lastAvg = acc.length > 0 ? acc[acc.length-1] : 0;
    acc.push((cv + lastAvg*acc.length) / (acc.length+1));
    return acc;
}

export function toOrbitalPoint(point : SPAOrbitalPoint | SPATerrestrialPoint) : SPAOrbitalPoint {
    if(Object.hasOwn(point, 'eccentricity')) {
        return point as SPAOrbitalPoint;
    } else {
        const tPoint = point as SPATerrestrialPoint;
        return {altitude:tPoint.latitude, inclination:tPoint.longitude, eccentricity:tPoint.altitude};
    }
}

export function stateToOrbitalPoint(state : State) {
    if(state.parameters.isOrbital) {
        return {altitude:state.parameters.altitude, inclination:state.parameters.inclination, eccentricity:state.parameters.eccentricity};
    } else {
        return {altitude:state.parameters.latitude, inclination:state.parameters.longitude, eccentricity:state.parameters.altitude};
    }
}