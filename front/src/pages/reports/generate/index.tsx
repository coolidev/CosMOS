import { State } from 'src/pages/home';
import { ResultsState } from 'src/slices/results';
import { Project } from 'src/types/preference';
import { reportInfo, Report } from '..';
import insertReportVariables from '../utils/insertReportVariables';
import saveDocx from './saveDocx';
import savePDF from './savePDF';

export interface reportImages {
  varName: string;
  html: string;
}

export function generateReport(
  report: Report,
  requiresResults: boolean,
  reportType: string,
  images: reportImages[],
  project: Project,
  state: State,
  results: ResultsState,
  reportData: reportInfo
) {
  if (
    (!results.analyticsPanel ||
      !results.linkBudget ||
      !results.performancePanel) &&
    requiresResults
  ) {
    let missingResults = '';
    if (!results.analyticsPanel) {
      missingResults += ' Analytics,';
    }
    if (!results.linkBudget) {
      missingResults += ' Link Budget,';
    }
    if (!results.performancePanel) {
      missingResults += ' Performance,';
    }
    missingResults = missingResults.substring(0, missingResults.length - 1);
    alert(
      `CART Reporting has not yet received results for:${missingResults}. Please ensure that your analysis has completed before generating this report.`
    );
    return;
  }

  const html = insertReportVariables(
    report,
    images,
    project,
    state,
    results,
    reportData
  );
  if (reportType === 'docx' || reportType === 'DOCX') {
    saveDocx(html, report.name, images, project, state, results, reportData);
  } else if (reportType === 'pdf' || reportType === 'PDF') {
    savePDF(html, report.name, images, project, state, results, reportData);
  }
}
