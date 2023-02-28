// This file handles replacing all variables specified within each HTML template.

import { Project } from 'src/types/preference';
import { Report, reportInfo } from '..';
import { reportImages } from '../generate';
import { linkSummaryTable } from '../modules/linkSummaryTable';
import { pageBreak } from '../modules/documentFormat';
import { linkBudgetData } from '../modules/linkBudgetData';
import { signaturePage } from '../modules/signaturePage';
import { nasaFormal } from '../modules/titlePages/nasaFormal';
import { performanceData, userBurdenData } from '../modules/performanceData';
import { nasaLogo } from '../resources/nasa-logo';
import { State } from 'src/pages/home';
import { ResultsState } from 'src/slices/results';
import {
  reportDescriptionDTE,
  reportDescriptionRelay
} from '../modules/reportDescription';
import {
  GroundStationCharacteristics,
  RelayCharacteristics
} from 'src/types/evaluation';
import {
  comparisonCharts,
  rankingSelections
} from '../modules/comparisonCharts';
import { version } from 'src/releaseVersion';
import { getOrbitalModelValue, getValue } from 'src/algorithms/regressions';
import _ from 'lodash';
import { antennaOptionsSummary } from '../modules/performanceData/antennaOptionsSummary';

export function createReport(html: string, reportName: string): Report {
  return {
    name: reportName,
    description: '',
    fileType: 'DOCX',
    needsVisualizer: false,
    requiresResults: false,
    html: html
  } as Report;
}

// Pass a string into insertReportVariables to return a complete string containing all populated data.
function insertReportVariables(
  report: Report,
  images: reportImages[],
  project: Project,
  state: State,
  results: ResultsState,
  reportData: reportInfo
): string {
  let finalString = '';

  const tokenizedString: string[] = report.html.split('$$');

  tokenizedString.forEach((token) => {
    finalString = finalString.concat(
      convertVariable(
        token,
        report.name,
        images,
        project,
        state,
        results,
        reportData
      )
    );
  });
  return finalString;
}

// This acts as the library for conversions of each variable. Add to the switch statement below to add a new parameter.
// Note that all variables need '$$' appended to the beginning and the end of them in the HTML code to be recognized.
// This function assumes that all '$$' symbols have been filtered out, allowing for an exact match of the variable name itself.
function convertVariable(
  variable: string,
  reportName: string,
  images: reportImages[],
  project: Project,
  state: State,
  results: ResultsState,
  reportData: reportInfo
): string {
  let antennas: string[] = [];
  if (state.networkType === 'dte') {
    state.selectedItems.forEach((selection) => {
      antennas = antennas.concat(selection.antennaId?.toString());
    });
  }

  var today = new Date();
  var time = today.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
  var date =
    today.getMonth() + 1 + '/' + today.getDate() + '/' + today.getFullYear();

  //First check for any images
  //Images can be found in the convertImage.tsx file under pages/reports/utils
  let returnVal = '';
  images.forEach((image) => {
    if (image.varName === variable) {
      returnVal = image.html;
    }
  });
  if (returnVal) {
    return returnVal;
  }

  //Now lets look for variables that don't require async
  try {
    switch (variable) {
      //Report Details
      case 'REPORTNAME':
        returnVal = reportName;
        break;
      case 'REPORTGENERATIONTIME':
        returnVal = time;
        break;
      case 'REPORTGENERATIONDATE':
        returnVal = date;
        break;

      case 'USERNAME':
        returnVal = localStorage.getItem('name') ?? '';
        break;

      case 'CARTVERSION':
        returnVal = 'v' + version;
        break;

      //Project Details
      case 'MISSIONNAME':
        returnVal =
          project.missionName.length > 0
            ? project.missionName
            : '[Mission Name]';
        break;
      case 'PROJECTNAME':
        returnVal = project.projectName;
        break;
      case 'MISSIONDESCRIPTION':
        returnVal =
          project.missionDescription.length > 0
            ? `${project.missionDescription}`
            : '';
        break;
      case 'NETWORKNAME':
        returnVal =
          state.networkType === 'relay'
            ? state.selectedItems[0]?.system
            : 'DTE Network';
        break;

      //Mission Parameters
      case 'ORBITALORTERR':
        returnVal = state.parameters.isOrbital ? 'Orbital' : 'Terrestrial';
        break;
      case 'ALTORLAT':
        returnVal = state.parameters.isOrbital ? 'Altitude' : 'Latitude';
        break;
      case 'ALTORLATVAL':
        if (state.parameters.isOrbital) {
          returnVal = state.parameters.altitude.toString() + ' km';
        } else {
          returnVal = state.parameters.latitude.toString() + '°';
        }
        break;
      case 'INCORLONG':
        returnVal = returnVal = state.parameters.isOrbital
          ? 'Inclination'
          : 'Longitude';
        break;
      case 'INCORLONGVAL':
        if (state.parameters.isOrbital) {
          returnVal = state.parameters.inclination.toString() + '°';
        } else {
          returnVal = state.parameters.longitude.toString() + '°';
        }
        break;
      case 'ALTITUDE':
        returnVal = state.parameters.altitude.toString() + ' km';
        break;
      case 'INCLINATION':
        returnVal = state.parameters.inclination.toString() + '°';
        break;
      case 'LATITUDE':
        returnVal = state.parameters.latitude.toString() + '°';
        break;
      case 'LONGITUDE':
        returnVal = state.parameters.longitude.toString() + '°';
        break;
      case 'AVAILABILITY':
        returnVal = state.specifications.availability.toString() + '%';
        break;
      case 'THROUGHPUT':
        returnVal =
          state.commsSpecs.dataRateKbps.toFixed(2).toString() + ' Gb/day';
        break;
      case 'TOLERABLEGAP':
        returnVal = state.commsSpecs.coverageMetrics.maxGap.toString() + ' min';
        break;
      case 'TKNGSVCRNGERR':
        returnVal =
          state.specifications.trackingServiceRangeError.toString() + ' m';
        break;
      case 'LAUNCHYEAR':
        returnVal = state.constraints.launchYear.toString();
        break;
      case 'POWERAMPLIFIER':
        returnVal = state.constraints.powerAmplifier.toString() + ' W';
        break;

      //Selections
      case 'SELECTEDSYSTEMS':
        if (state.networkType === 'dte') {
          state.selectedItems.forEach((network) => {
            returnVal += network.name + ', ';
          });
        } else {
          state.selectedItems.forEach((network) => {
            returnVal += network.system + ', ';
          });
        }
        returnVal = returnVal.substring(0, returnVal.length - 2);
        break;
      case 'NETWORKTYPE':
        returnVal = state.networkType === 'dte' ? 'DTE' : 'Relay';
        break;

      //Results Modules
      case 'LINKSUMMARYTABLE':
        returnVal =
          state.networkType === 'relay'
            ? '' /*insertReportVariables(createReport(networkDetails(results, state, reportData),reportName), images, project, state, results, reportData)*/
            : insertReportVariables(
                createReport(
                  linkSummaryTable(results, state, reportData),
                  reportName
                ),
                images,
                project,
                state,
                results,
                reportData
              );
        break;
      case 'REPORTDESCRIPTIONCONTENT':
        returnVal = insertReportVariables(
          createReport(
            state.networkType === 'relay'
              ? reportDescriptionRelay
              : reportDescriptionDTE,
            reportName
          ),
          images,
          project,
          state,
          results,
          reportData
        );
        break;
      case 'LINKBUDGETS':
        //if(state.networkType === 'dte'){
        returnVal = insertReportVariables(
          createReport(linkBudgetData(results, state, reportData), reportName),
          images,
          project,
          state,
          results,
          reportData
        );
        //}else{
        //    returnVal = 'Link Budgets are not currently supported for Relay Networks';
        //}
        break;
      case 'PERFORMANCEDATA':
        returnVal = insertReportVariables(
          createReport(
            performanceData(results.performancePanel, false, state),
            reportName
          ),
          images,
          project,
          state,
          results,
          reportData
        );
        break;
      case 'USERBURDENDATA':
        returnVal = insertReportVariables(
          createReport(
            userBurdenData(results.performancePanel, false, state),
            reportName
          ),
          images,
          project,
          state,
          results,
          reportData
        );
        break;
      case 'ANTENNAOPTIONSSUMMARY':
        returnVal = insertReportVariables(
          createReport(
            antennaOptionsSummary(results.performancePanel, false, state),
            reportName
          ),
          images,
          project,
          state,
          results,
          reportData
        );
        break;
      case 'PERFORMANCEDATAWITHCHARTS':
        returnVal = insertReportVariables(
          createReport(
            performanceData(results.performancePanel, true, state),
            reportName
          ),
          images,
          project,
          state,
          results,
          reportData
        );
        break;
      case 'COVERAGE':
        returnVal = getPredictedVal('coverage', state, results);
        break;
      case 'MEANCONTACTS':
        returnVal = getPredictedVal('mean_contacts', state, results);
        break;
      case 'ELEVATION':
        returnVal = Object.keys(results.performancePanel.systemParams).includes(
          'elevationConstraint_deg'
        )
          ? (
              results.performancePanel
                .systemParams as GroundStationCharacteristics
            ).elevationConstraint_deg?.toString()
          : '';
        //returnVal = results.performancePanel.systemParams.el
        break;
      case 'EIRP':
        returnVal =
          state.results.eirp_dBW === Infinity ||
          state.results.eirp_dBW === -Infinity
            ? '0.00'
            : state.results.eirp_dBW.toFixed(2);
        break;
      case 'INFORATE':
        returnVal =
          state.results.dataRate_kbps === Infinity ||
          state.results.dataRate_kbps === -Infinity
            ? '0.00'
            : state.results.dataRate_kbps.toFixed(2).toString();
        break;
      case 'FREQUENCYBAND':
        returnVal =
          state.selectedItems[0].frequencyBandId === 0
            ? '[Auto-Select]'
            : state.networkType === 'relay'
            ? state.selectedItems[0].supportedFrequencies
            : reportData.freqBandOptions.filter(
                (band) => band.id === state.selectedItems[0].frequencyBandId
              )[0]?.name;
        break;
      case 'MODULATION':
        returnVal = _.uniq(
          state.selectedItems.map((item) => {
            if (item.modulationId <= 0) {
              return item.modulation ?? 'Auto-Select';
            }
            return reportData.modulationOptions.find((mod) => {
              return mod.id === item.modulationId;
            }).name;
          })
        ).join(', ');
        break;
      case 'CODING':
        returnVal = _.uniq(
          state.selectedItems.map((item) => {
            if (item.codingId <= 0) {
              return item.coding ?? 'Auto-Select';
            }
            return reportData.codingOptions.find((cod) => {
              return cod.id === item.codingId;
            }).name;
          })
        ).join(', ');
        break;
      case 'OPTIMIZEDMODCOD':
        returnVal = state.selectedItems[0].optimizedModCod ? 'Yes' : 'No';
        break;

      //Page Templates
      case 'NASAFORMALTITLE':
        returnVal = insertReportVariables(
          createReport(nasaFormal, reportName),
          images,
          project,
          state,
          results,
          reportData
        );
        break;
      case 'SIGNATUREPAGE':
        returnVal = insertReportVariables(
          createReport(signaturePage, reportName),
          images,
          project,
          state,
          results,
          reportData
        );
        break;

      //Pre-compiled images
      case 'NASALOGO':
        returnVal = nasaLogo;
        break;

      //Page Formatting
      case 'PAGEBREAK':
        returnVal = pageBreak;
        break;

      case variable.match(/^COMPARISONCHART_/)?.input:
        returnVal = insertReportVariables(
          createReport(comparisonCharts(variable, results), reportName),
          images,
          project,
          state,
          results,
          reportData
        );
        break;

      case 'RANKING_SELECTIONS':
        returnVal = rankingSelections(results);
        break;

      default:
        returnVal = variable;
    }
  } catch {
    //If one of these values is undefined for some reason, just return an empty string for that value
    returnVal = '[ERROR - ' + variable + ']';
  }
  returnVal = returnVal
    ?.replaceAll('°', '&#176;')
    .replaceAll(' ', '')
    .replaceAll('–', '-')
    .replaceAll('’', "'")
    .replaceAll('“', '"')
    .replaceAll('”', '"');
  return returnVal;
  //.replaceAll(/(?<!\\)\\(?!\\)/,'\\\\')
}

function getPredictedVal(
  key: string,
  state: State,
  results: ResultsState
): string {
  let value = getOrbitalModelValue(
    state.parameters.altitude,
    state.parameters.inclination,
    key,
    results.performancePanel.modelData,
    ''
  );
  if ((isNaN(value) || !state.pointSync) && !state.noRegression) {
    value = getValue(
      state.parameters.altitude,
      state.parameters.inclination,
      key,
      state.regressionTypes[key],
      results.performancePanel.predictedData,
      state.selectedItems.length === 1
        ? (
            results.performancePanel.systemParams as
              | RelayCharacteristics
              | GroundStationCharacteristics
          ).systemName
        : ''
    );
  }
  return value.toFixed(2).toString();
}

export default insertReportVariables;
