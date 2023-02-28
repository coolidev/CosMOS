import { reportImages } from ".";
import {  Project } from "src/types/preference";
import { reportInfo } from "..";
import { State } from "src/pages/home";
import { ResultsState } from "src/slices/results";

function createPDF(html: string, title: string, images: reportImages[], project: Project, state: State, results: ResultsState, reportData: reportInfo) {
    alert("This feature is still under development.");
}

export default createPDF;