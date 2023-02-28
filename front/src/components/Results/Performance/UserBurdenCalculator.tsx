/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useState, useEffect } from 'react';
import { TextField } from '@material-ui/core';
import MathJax from 'react-mathjax';
import Plot from 'react-plotly.js';
import useStyles from 'src/utils/styles';
import { addComma } from 'src/utils/util';
import DialogBox from 'src/components/DialogBox';
import CustomNumberFormat from 'src/components/CustomNumberFormat';
import {
    AntennaInputs,
    computeParabolicDiameter,
    computeParabolicMass,
    computeSteerableSize,
    computeHelicalSize,
    computePatchSize,
    computeDipoleSize,
    computePatchWidth,
    computePatchLength
} from 'src/algorithms/antennas';
import { computeEirp } from 'src/algorithms/link';
import type { 
    SystemParams,
    LinkParams
} from 'src/types/evaluation';
import type { State } from 'src/pages/home';

interface UserBurdenCalculatorProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    state: State;
    systemParams: SystemParams;
    linkParams: LinkParams;
    antennaType: string;
};

const USER_BURDEN_FUNCS = {
    parabolicDiameter: computeParabolicDiameter,
    parabolicMass: computeParabolicMass,
    steerableSize: computeSteerableSize,
    helicalHeight: computeHelicalSize,
    patchSize: computePatchSize,
    dipoleSize: computeDipoleSize
};

const INIT_OUTPUTS = {
    N: 0,
    EIRP: 0,
    size_x: 0,
    size_y: 0,
    width: 0,
    length: 0,
    size: 0
};

function row(
    eqn: string,
    val: string,
    inline: boolean,
    input: boolean,
    handleChange: (event: any) => void,
    index: number
) {
    function value(input: boolean) {
        if (input) {
        const name = val.slice(0, val.indexOf(')')).replace('(', '').trim();
        const v = val.slice(val.indexOf(')')).replace(')', '');

        const inputProps = {
            style: {
                textAlign: 'center',
                border: '1px solid #000',
                borderRadius: '2px'
            }
        };

        return (
            <div
            key={`p_${index}`}
            style={{ display: 'inline-block', width: '15%', textAlign: 'right' }}
            >
                <TextField
                    name={name}
                    value={parseFloat(v)}
                    onBlur={handleChange}
                    onKeyPress={(ev) => {
                        if (ev.key === 'Enter') {
                            handleChange(ev);
                        }
                    }}
                    InputProps={{
                        inputComponent: CustomNumberFormat,
                        disableUnderline: true,
                        inputProps: {
                            min: 0,
                            max: 1000,
                            style: {
                                textAlign: 'center',
                                border: '1px solid #000',
                                borderRadius: '2px'
                            }
                        }
                    }}
                    fullWidth
                    inputProps={inputProps as any}
                />
            </div>
        );
        } else {
        return (
            <div
            key={`p_${index}`}
            style={{ display: 'inline-block', width: '15%', textAlign: 'right' }}
            >
            {val}
            </div>
        );
        }
    }

    return (
        <div key={`div_${index}`}>
        <div style={{ display: 'inline-block', width: '84%', textAlign: 'left' }}>
            {inline ? (
            <MathJax.Node inline formula={eqn} />
            ) : (
            <MathJax.Node formula={eqn} />
            )}
        </div>
        {val !== '' ? value(input) : <></>}
        </div>
    );
}

const UserBurdenCalculator: FC<UserBurdenCalculatorProps> = ({
    isOpen,
    onClose,
    title,
    antennaType,
    systemParams,
    linkParams,
    state
}) => {
    const parameter = antennaType;
    const [tex, setTex] = useState('');
    const [plotData, setPlotData] = useState([]);
    const { A_r, /*theta,*/ rtnLinkFreqMHz, lambda } = systemParams;
    const [inputs, setInputs] = useState({
        N_x: Math.ceil(Math.sqrt(Math.pow(10, (state.results.eirp_dBW + 15) / 20))),
        N_y: Math.ceil(Math.sqrt(Math.pow(10, (state.results.eirp_dBW + 15) / 20))),
        lambda_x: lambda / 2,
        lambda_y: lambda / 2,
        G_IED: 5,
        OP1dB: 10,
        epsilon_r: 1,
        ant_height: 1
    });
    const classes = useStyles();

    useEffect(() => {
        let points = [];
        const numSteps = 50;
        const maxPlotAltitude = state.networkType === 'relay' ? A_r : 1000;
        for (let i = 0; i < numSteps; i++) {
            const altitude = (maxPlotAltitude / numSteps) * i;

            const antennaInputs: AntennaInputs = {
                wavelength: lambda,
                eirp: computeEirp(systemParams, linkParams, state),
                powerAmplifier: state.constraints.powerAmplifier
            };

            const value: number = USER_BURDEN_FUNCS[parameter](antennaInputs);
            points.push({
                altitude: altitude,
                value: value
            });
        }

        const userAntenna: AntennaInputs = {
            wavelength: lambda,
            eirp: computeEirp(systemParams, linkParams, state),
            powerAmplifier: state.constraints.powerAmplifier
        };
        const userValue = USER_BURDEN_FUNCS[parameter](userAntenna);

        let configData = [
        {
            x: unpack(points, 'altitude'),
            y: unpack(points, 'value'),
            name: 'Data',
            mode: 'markers',
            type: 'scatter',
            marker: {
            color: '#3385ff'
            }
        },
        {
            x: unpack(points, 'altitude'),
            y: unpack(points, 'value'),
            name: 'Line',
            mode: 'lines',
            line: {
            color: '#3385ff'
            }
        },
        {
            x: [state.parameters.altitude],
            y: [userValue],
            name: 'User',
            mode: 'markers',
            type: 'scatter',
            marker: {
            color: 'red',
            size: 10
            }
        }
        ];

        setPlotData(configData);
    }, []);

    const unpack = (rows, key) => {
        return rows.map(function (row) {
            return row[key];
        });
    };

    useEffect(() => {
        const { N_x, N_y, lambda_x, lambda_y, G_IED, OP1dB } = inputs;
        let results = INIT_OUTPUTS;
        results.N = N_x * N_y;
        results.EIRP = 20 * Math.log10(N_x * N_y) + OP1dB + G_IED - 30;
        results.size_x = N_x * lambda_x;
        results.size_y = N_y * lambda_y;

        results.width = computePatchWidth(
            rtnLinkFreqMHz * Math.pow(10, 6),
            inputs.epsilon_r
        );
        results.length = computePatchLength(
            rtnLinkFreqMHz * Math.pow(10, 6),
            inputs.epsilon_r,
            inputs.ant_height
        );
        results.size = results.width * results.length;

        const latex = {
            steerableSize: `
                \\textbf{Array Information:}\n
                \\text{Number of elements in X:} v_tag i_tag (N_x) ${
                    inputs.N_x
                }\n
                \\text{Number of elements in Y:} v_tag i_tag (N_y) ${
                    inputs.N_y
                }\n
                \\text{Element spacing in X } (\\lambda)\\text{:} v_tag i_tag (lambda_x) ${
                    inputs.lambda_x
                }\n
                \\text{Element spacing in Y } (\\lambda)\\text{:} v_tag i_tag (lambda_y) ${
                    inputs.lambda_y
                }\n
                \\text{Ideal Element Directivity (dB):} v_tag i_tag (G_IED) ${
                    inputs.G_IED
                }\n
                \\textbf{IC Information:}\n
                \\text{OP1dB (dBm):} v_tag i_tag (OP1dB) ${inputs.OP1dB}\n
                \\textbf{EIRP Calculation:}\n
                \\text{Number of elements:} v_tag${addComma(results.N)}\n
                \\text{EIRP at OP1dB (dBW):} v_tag${addComma(
                    results.EIRP.toFixed(1)
                )}\n
                \\textbf{Array Size:}\n
                \\text{Size in X (m):} v_tag${addComma(
                    results.size_x.toFixed(2)
                )}\n
                \\text{Size in Y (m):} v_tag${addComma(
                    results.size_y.toFixed(2)
                )}\n
            `,
            patchSize: `
                \\text{Dielectric Constant} (\\epsilon_{r}) v_tag i_tag (epsilon_r) ${
                    inputs.epsilon_r
                }\n
                \\text{Antenna Height (mm)} v_tag i_tag (ant_height) ${
                    inputs.ant_height
                }\n
                \\text{Frequency (GHz)} v_tag${addComma(
                    (rtnLinkFreqMHz / 1000).toFixed(3)
                )}\n
                \\text{c (m/s)} v_tag ${(3e8).toExponential()}\n
                \\text{Width (mm)} v_tag${addComma(results.width.toFixed(2))}\n
                \\text{Length (mm)} v_tag${addComma(
                    results.length.toFixed(2)
                )}\n
                \\text{Size = Length (mm) * Width (mm)} v_tag${addComma(
                    results.size.toFixed(2)
                )}\n
            `
        };

        setTex(latex[parameter]);
    }, [inputs]);

    function handleChange(event) {
        const { name, value } = event.target;
        setInputs((prevState) => ({ ...prevState, [name]: parseFloat(value) }));
    }

    return (
        <DialogBox
            title={title}
            isOpen={isOpen}
            onClose={() => onClose()}
            classes={{ paper: classes.dialog }}
        >
            <MathJax.Provider>
                {tex.split('\n').map((eqn, idx: number) => {
                    if (eqn === '') return;
                    let val = '';
                    const inline = !eqn.includes('b_tag');
                    eqn = eqn.replace('b_tag', '');

                    const input = eqn.includes('i_tag');
                    eqn = eqn.replace('i_tag', '');

                    if (eqn.includes('v_tag')) {
                        const rowData = eqn.split('v_tag');
                        eqn = rowData[0];
                        val = rowData[1];
                    }

                    return row(eqn, val, inline, input, handleChange, idx);
                })}
            </MathJax.Provider>
            <Plot
                data={plotData}
                layout={{
                autosize: true,
                showlegend: false,
                width: 550,
                height: 400,
                margin: {
                    l: 60,
                    r: 15,
                    b: 35,
                    t: 15
                },
                xaxis: {
                    title: 'Altitude (km)',
                    type: 'linear',
                    zeroline: false
                },
                yaxis: {
                    title: title,
                    type: 'linear',
                    zeroline: false
                },
                title: false as any
                }}
            />
        </DialogBox>
    );
}

export default UserBurdenCalculator;