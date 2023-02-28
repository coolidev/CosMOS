
import { State } from "src/pages/home";
import type { PerformancePanel } from "src/types/evaluation";

const labels = {
    dataRate_kbps: "Data Rate (Mbps)",
    eirp_dBW: "Required EIRP (dBW)",
    maxThroughput_GB_Day: "Max Throughput (GB/Day)",
    throughput_GB_Day: "Throughput (GB/Day)"
}

export function antennaOptionsSummary(performance: PerformancePanel, showGraph: boolean, state: State): string {

    let tableContents = '';
    Object.keys(state.results).forEach((key: string) => {
        if(!labels[key]){
            return '';
        }
        const value = state.results[key] ?? '-';
        if (isNaN(value)) return '';
        let rowTitle = '';
        // let plot = '';
        rowTitle = labels[key];   
        let val = value;
        if(key === 'maxThroughput_GB_Day' || key === 'throughput_GB_Day'){
            val = value/8;
        }

        tableContents = tableContents.concat(`
            <tr style='mso-yfti-irow:1;height:.2in'>
            <td width=270 style='width:202.25pt;border:solid windowtext 1.0pt;border-top:
            none;mso-border-top-alt:solid windowtext .5pt;mso-border-alt:solid windowtext .5pt;
            padding:0in 5.4pt 0in 5.4pt;height:.2in'>
            <p class=MsoNormal align=right style='margin-bottom:0in;text-align:right;
            line-height:normal'><b>${rowTitle}<o:p></o:p></b></p>
            </td>
            <td width=156 style='width:117.0pt;border-top:none;border-left:none;
            border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
            mso-border-top-alt:solid windowtext .5pt;mso-border-left-alt:solid windowtext .5pt;
            mso-border-alt:solid windowtext .5pt;padding:0in 5.4pt 0in 5.4pt;height:.2in'>
            <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
            style='font-family:"Courier New"'>${val.toFixed(2)?.toString()}<o:p></o:p></span></p>
            </td>
            </tr>
        `);
    });
 

    return `
        <div align=center>
        <table class=MsoTableGrid border=1 cellspacing=0 cellpadding=0
        style='border-collapse:collapse;border:none;mso-border-alt:solid windowtext .5pt;
        mso-yfti-tbllook:1184;mso-padding-alt:0in 5.4pt 0in 5.4pt'>
        <tr style='mso-yfti-irow:0;mso-yfti-firstrow:yes;height:.2in'>
            <td width=270 valign=top style='width:202.25pt;border:solid windowtext 1.5pt;
            border-right:solid windowtext 1.0pt;background:#BFBFBF;mso-background-themecolor:
            background1;mso-background-themeshade:191;padding:0in 5.4pt 0in 5.4pt;
            height:.2in'>
            <p class=MsoNormal align=center style='margin-bottom:0in;text-align:center;
            line-height:normal'><b><span style='mso-fareast-font-family:Times New Roman;
            mso-fareast-theme-font:minor-latin'>Characteristic<o:p></o:p></span></b></p>
            </td>
            <td width=156 valign=top style='width:117.0pt;border:solid windowtext 1.5pt;
            border-left:none;mso-border-left-alt:solid windowtext 1.0pt;background:#BFBFBF;
            mso-background-themecolor:background1;mso-background-themeshade:191;
            padding:0in 5.4pt 0in 5.4pt;height:.2in'>
            <p class=MsoNormal align=center style='margin-bottom:0in;text-align:center;
            line-height:normal'><b><span style='mso-fareast-font-family:Times New Roman;
            mso-fareast-theme-font:minor-latin;color:black;mso-color-alt:windowtext'>Value</span></b><span
            style='font-family:"Courier New";mso-fareast-font-family:Times New Roman;mso-fareast-theme-font:
            minor-latin'><o:p></o:p></span></p>
            </td>
        </tr>
        ${tableContents}
        </table>
        </div>
    `;
}
