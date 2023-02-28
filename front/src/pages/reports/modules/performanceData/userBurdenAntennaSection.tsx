import { PerformancePanel } from "src/types/evaluation";
import { PLOT_LIST, USERBURDEN_ANTENNAOPTIONS } from "src/utils/constants/reporting";
import { METRIC_LABELS } from 'src/utils/constants/analysis';

export function userBurdenAntennaSection(performance: PerformancePanel, showGraph: boolean): string {

    const values: { [key: string]: number } = {};
    
    let tableContents = '';
    Object.keys(values).forEach(attribute => {
        if(USERBURDEN_ANTENNAOPTIONS.includes(attribute)){
            let rowTitle = '';
            let plot = '';
            rowTitle = METRIC_LABELS[attribute];
            plot = (showGraph && PLOT_LIST[attribute])?`<br><br>${PLOT_LIST[attribute]}`:``;        

            tableContents = tableContents.concat(`
                <tr style='mso-yfti-irow:1;height:.2in'>
                <td width=270 style='width:202.25pt;border:solid windowtext 1.0pt;border-top:
                none;mso-border-top-alt:solid windowtext .5pt;mso-border-alt:solid windowtext .5pt;
                padding:0in 5.4pt 0in 5.4pt;height:.2in'>
                <p class=MsoNormal align=right style='margin-bottom:0in;text-align:right;
                line-height:normal'>${plot.length===0?``:`${plot}<br><br>`}<b>${rowTitle}${plot.length===0?``:`<br><br>`}<o:p></o:p></b></p>
                </td>
                <td width=156 style='width:117.0pt;border-top:none;border-left:none;
                border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
                mso-border-top-alt:solid windowtext .5pt;mso-border-left-alt:solid windowtext .5pt;
                mso-border-alt:solid windowtext .5pt;padding:0in 5.4pt 0in 5.4pt;height:.2in'>
                <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
                style='font-family:"Courier New"'>${values[attribute].toFixed(2)?.toString()}<o:p></o:p></span></p>
                </td>
                </tr>
            `);
        }
    })

    return `
        <table class=MsoTableGrid border=1 cellspacing=0 cellpadding=0
        style='border-collapse:collapse;border:none;mso-border-alt:solid windowtext .5pt;
        mso-yfti-tbllook:1184;mso-padding-alt:0in 5.4pt 0in 5.4pt'>
        <tr style='mso-yfti-irow:0;mso-yfti-firstrow:yes;height:.2in'>
        <td width=426 colspan=2 style='width:319.25pt;border:solid windowtext 1.0pt;
        mso-border-alt:solid windowtext .5pt;background:#7F7F7F;mso-background-themecolor:
        text1;mso-background-themetint:128;padding:0in 5.4pt 0in 5.4pt;height:.2in'>
        <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><b><span
        style='font-size:14.0pt;color:white;mso-themecolor:background1'>User Burden: Antenna Options</span></b><span
        style='font-family:"Courier New"'><o:p></o:p></span></p>
        </td>
        </tr>
        ${tableContents}
        </table>
    `;
}
