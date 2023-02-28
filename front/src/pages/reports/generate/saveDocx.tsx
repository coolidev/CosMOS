import { asBlob } from 'html-docx-js-typescript'
import { saveAs } from 'file-saver'
import insertReportVariables, { createReport } from "../utils/insertReportVariables";
import { reportImages } from '.';
import { Project } from 'src/types/preference';
import { reportInfo } from '..';
import { State } from 'src/pages/home';
import { ResultsState } from 'src/slices/results';

function saveDocx(html: string, title: string, images: reportImages[], project: Project, state: State, results: ResultsState, reportData: reportInfo) {
    asBlob(html).then(data => {
        saveAs(data as Blob, insertReportVariables(createReport(`${title}-$$MISSIONNAME$$.docx`,title), images, project, state, results, reportData).replaceAll(' ',''));
    })
}

export default saveDocx;