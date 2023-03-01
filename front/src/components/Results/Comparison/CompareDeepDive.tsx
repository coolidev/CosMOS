/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-new-func */
import { FC, useState, useEffect } from 'react';
import { Input } from '@material-ui/core';
import MathJax from 'react-mathjax';
import Plot from 'react-plotly.js';
import useStyles from 'src/utils/styles';
import { addComma } from 'src/utils/util';
import DialogBox from 'src/components/DialogBox';
import { ANTENNA_TYPES } from 'src/utils/constants/analysis';
import type { SystemParams, LinkParams } from 'src/types/evaluation';
import type { State } from 'src/pages/home';
import {
  computeEirp,
  computePrec,
  computeGain,
  computeFreeSpaceLoss
} from 'src/algorithms/link';
import {
  AntennaInputs,
  computeParabolicDiameter,
  computeParabolicMass,
  computeHelicalSize,
  computeNumElements,
  computeSteerableSize,
  computeSteerableMass,
  computePatchSize,
  computeDipoleSize
} from 'src/algorithms/antennas';

interface UserBurdenModalProps {
  isOpen: boolean;
  onClose: () => void;
  parameterKey: string;
  systemParams: SystemParams;
  linkParams: LinkParams;
  state: State;
  calculatedData: any;
};

const INIT_OUTPUTS = {
  N: 0,
  EIRP: 0,
  size_x: 0,
  size_y: 0
};

function row(
  eqn: string,
  val: string,
  inline: boolean,
  input: boolean,
  handleChange
) {
  function value(input) {
    if (input) {
      const name = val.slice(0, val.indexOf(')')).replace('(', '').trim();
      const v = val.slice(val.indexOf(')')).replace(')', '');

      const inputProps = {
        style: {
          textAlign: 'right',
          border: '1px solid #000',
          borderRadius: '2px'
        }
      };

      return (
        <p
          style={{ display: 'inline-block', width: '15%', textAlign: 'right' }}
        >
          <Input
            name={name}
            type="number"
            inputProps={inputProps as any}
            value={parseFloat(v)}
            onInput={handleChange}
            disableUnderline
            fullWidth
          />
        </p>
      );
    } else {
      return (
        <p
          style={{ display: 'inline-block', width: '15%', textAlign: 'right' }}
        >
          {val}
        </p>
      );
    }
  }

  return (
    <div>
      <p style={{ display: 'inline-block', width: '84%', textAlign: 'left' }}>
        {inline ? (
          <MathJax.Node inline formula={eqn} />
        ) : (
          <MathJax.Node formula={eqn} />
        )}
      </p>
      {val !== '' ? value(input) : <></>}
    </div>
  );
}

const r = 6378;
const K = 0.6;

const UserBurdenModal: FC<UserBurdenModalProps> = ({
  isOpen,
  onClose,
  parameterKey,
  systemParams,
  linkParams,
  state,
  calculatedData
}) => {
  const labelsToKeys = { ...ANTENNA_TYPES, eirp_dbw: 'User EIRP (dBW)' };
  const [tex, setTex] = useState('');
  const [plotData, setPlotData] = useState([]);
  const [inputs, setInputs] = useState({
    N_x: 4,
    N_y: 4,
    lambda_x: systemParams.lambda / 2,
    lambda_y: systemParams.lambda / 2,
    G_IED: 5,
    OP1dB: 10
  });

  let maxEirpId = '';
  Object.keys(calculatedData.linkBudget).forEach(groundStationId => {
    const currentEirp = calculatedData.linkBudget[groundStationId].find(parameter => parameter.key === 'userEirp_dBW')?.value;
    if (currentEirp === calculatedData.eirp_dBW) maxEirpId = groundStationId;
  });

  const {
    // P_rec,
    A_r,
    theta,
    rtnLinkFreqMHz,
    lambda,
    gOverT,
    // cOverNo,
    implementationLoss,
    // polarizationLoss_dB,
    // propagationLosses_dB,
    // otherLosses_dB,
    // elevationConstraint_deg
  } = state.selectedItems.length > 1 ? systemParams[maxEirpId] : systemParams;
  const A_u = state.parameters.isOrbital ? state.parameters.altitude : 0;
  const classes = useStyles();

  const eirpUserSat = calculatedData.eirp_dBW;
  const antennaInputsUserSat = {
    wavelength: lambda,
    eirp: eirpUserSat,
    powerAmplifier: state.constraints.powerAmplifier
  };

  useEffect(() => {
    const antennaPlottingFunctions = {
      parabolicDiameter: (inputs: AntennaInputs) =>
        computeParabolicDiameter(inputs),
      parabolicMass: (inputs: AntennaInputs) => computeParabolicMass(inputs),
      steerableSize: (inputs: AntennaInputs) => computeSteerableSize(inputs),
      steerableMass: (inputs: AntennaInputs) => computeSteerableMass(inputs),
      helicalHeight: (inputs: AntennaInputs) => computeHelicalSize(inputs),
      patchSize: (inputs: AntennaInputs) => computePatchSize(inputs),
      dipoleSize: (inputs: AntennaInputs) => computeDipoleSize(inputs)
    };

    const antennaFunctionForPlot =
      antennaPlottingFunctions[parameterKey];
    let points = [];
    const numSteps = 50;
    const maxPlotAltitude = state.networkType === 'relay' ? A_r : 1000;
    for (let i = 0; i < numSteps; i++) {
      const altitude = (maxPlotAltitude / numSteps) * i;

      const eirpForPlot = computeEirp(systemParams, linkParams, state);
      const antennaInputParams = {
        wavelength: lambda,
        eirp: eirpForPlot,
        powerAmplifier: state.constraints.powerAmplifier
      };

      const data =
        parameterKey === 'eirp_dbw'
          ? eirpForPlot
          : antennaFunctionForPlot(antennaInputParams);
      points.push({
        altitude: altitude,
        value: data
      });
    }

    const pointUserSat =
      parameterKey === 'eirp_dbw'
        ? eirpUserSat
        : antennaFunctionForPlot(antennaInputsUserSat);

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
        x: [A_u],
        y: [pointUserSat],
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
  }, [isOpen]);

  const fsl = computeFreeSpaceLoss(rtnLinkFreqMHz, theta, A_u, A_r, null, 'relay');
  const prec = computePrec(
    systemParams.isBentPipe ?? false,
    gOverT, implementationLoss, calculatedData.ebNo_dB,
    state.results.dataRate_kbps, systemParams.systemName,
    systemParams.sglRelayEirp_dBW, systemParams.polarizationLoss_dB,
    systemParams.gatewayGOverT_dB_K, systemParams.sglFrequency_MHz,
    systemParams.relayToGroundDistance_km, systemParams.sslBandwidth_dBHz,
    systemParams.sglBandwidth_dBHz, systemParams.carrierToInterferenceRatio_dB,
    systemParams.rfInterferenceLoss_dB, systemParams.imDegradation_dB,
    systemParams.atmosphericLoss_dB, systemParams.rainAttenuation_dB,
    NaN,NaN,NaN,NaN,null
  );
  const G = computeGain({
    eirp: eirpUserSat,
    powerAmplifier: state.constraints.powerAmplifier,
    isPhasedArray: false
  });
  const p_diameter = computeParabolicDiameter({
    wavelength: lambda,
    eirp: eirpUserSat,
    powerAmplifier: state.constraints.powerAmplifier
  });
  const p_mass = computeParabolicMass({
    wavelength: lambda,
    eirp: eirpUserSat,
    powerAmplifier: state.constraints.powerAmplifier
  });
  const h_size = computeHelicalSize({
    wavelength: lambda,
    eirp: eirpUserSat,
    powerAmplifier: state.constraints.powerAmplifier
  });
  const N = computeNumElements({
    wavelength: lambda,
    eirp: eirpUserSat,
    powerAmplifier: state.constraints.powerAmplifier
  });
  const s_size = computeSteerableSize({
    wavelength: lambda,
    eirp: eirpUserSat,
    powerAmplifier: state.constraints.powerAmplifier
  });

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

    const eirpText = state.networkType === 'relay' ? `
        \\text{Based on the link equation.}\n
        EIRP = P_{rec} + FSL\n
        \\text{Where:}\n
        FSL (\\text{Free Space loss}) = 32.45 + 20 \\times \\log (f_{MHz}) + 20 \\times \\log (d) = v_tag${addComma(
          fsl.toFixed(1)
        )}\n
        P_{rec} (\\text{power}_{\\text{received}}) = -228.6 + 10 \\times \\log (\\text{data rate}) - \\frac{G_{relay}}{T_{sys}} + \\frac{E_b}{N_0} = v_tag${addComma(
          prec.toFixed(1)
        )}\n
        d = \\frac{2(r + A_r) \\cos (\\theta) - \\sqrt{(2(r + A_r) \\cos (\\theta))^2 - 4(r + A_r^2 - r + A_u^2)}}{2}b_tag\n
        d \\text{ is the maximum distance between relay and the user and is calculated from:}\n
        A_r \\text{ (Altitude of the relay)} = v_tag${addComma(A_r)}\n
        A_u \\text{ (Altitude of the user)} = v_tag${addComma(A_u)}\n
        \\theta \\text{ (Half cone angle of the user coverage area)} = v_tag${addComma(
          theta
        )}\n
        r \\text{ (Radius of the earth)} = v_tag${addComma(r)}\n
        G_{relay} / T_{sys} \\text{ (From FCC filing)} = v_tag${addComma(
          gOverT
        )}\n
        f_{MHz} \\text{ (Frequency)} = v_tag${addComma(rtnLinkFreqMHz)}\n
        R \\text{ (Data Rate)} = v_tag${addComma(state.results.dataRate_kbps.toFixed(2))}\n
      ` : '';

    const latex = {
      eirp_dbw: eirpText,
      parabolicDiameter: `
                \\text{Antenna diameter (m)}\n
                D = \\frac{\\lambda}{\\pi} \\times \\sqrt{\\frac{10^{\\frac{G}{10}}}{k}}\\text{; in meters} v_tag${addComma(
                  p_diameter.toFixed(3)
                )}\n
                \\text{Where:}\n
                \\lambda \\text{ (wavelength in meters) } = v_tag${addComma(
                  lambda.toFixed(3)
                )}\n
                K \\text{ (antenna efficiency) } = v_tag${addComma(K)}\n
                G \\text{ (antenna gain) } = v_tag${addComma(G.toFixed(1))}\n
            `,
      parabolicMass: `
                \\text{Antenna weight (kg)}\n
                \\text{If } D > 0.65 m \\text{ then } \\rightarrow M = 6.674D - 3.802 \\text{; in kg} = v_tag${addComma(
                  p_mass.toFixed(3)
                )}\n
                \\text{Else: The mass calculation model is not available }\n
                \\text{Where:}\n
                D \\text{ (antenna size in meters)}\n
            `,
      helicalHeight: `
                \\text{Antenna diameter } (m)\n
                H = \\lambda \\times 10^{(\\frac{G - 10.8}{10})} \\text{; in meters}\n
                \\text{Where:}\n
                H \\text{: Antenna height in meters } = v_tag${addComma(
                  h_size.toFixed(3)
                )}\n
                G \\text{: Gain of the antenna } = v_tag${addComma(
                  G.toFixed(1)
                )}\n
                \\lambda \\text{: wavelength in meters } = v_tag${addComma(
                  lambda.toFixed(3)
                )}\n
            `,
      steerableSize: `
                \\text{Antenna size } (m^2)\n
                N = 10^{(\\frac{G-5}{10})}\n
                A = N (\\frac{\\lambda}{2})^2 \\text{; Antenna size in } (m^2)\n
                \\text{Where:}\n
                N \\text{ (Number of elements) } = v_tag${addComma(N)}\n
                G \\text{ (Antenna gain) } = v_tag${addComma(G.toFixed(3))}\n
                \\lambda \\text{ (Wavelength in meters) } = v_tag${addComma(
                  lambda.toFixed(3)
                )}\n
                A \\text{ (Antenna size in meters) } = v_tag${addComma(
                  s_size.toFixed(3)
                )}\n
                \\text{If } A > 2 m^2 \\text{: ESA not an appropriate solution}\n
            `,
      patchSize: `
                \\text{Size = W * L} = v_tag${addComma(
                  ((lambda * lambda) / 3.28 / 3.28).toFixed(3)
                )}\n
                \\text{W = } 0.49 \\frac{\\lambda_{0}}{\\sqrt{4.4}} = v_tag${addComma(
                  (lambda / 3.28).toFixed(3)
                )}\n
                \\text{L = W} = v_tag${addComma((lambda / 3.28).toFixed(3))}\n
            `,
      dipoleSize: `
                \\text{If gain } G > 5 \\text{dB, then Dipole antenna is not a good solution.}\n
                \\text{Else if } 2 < G < 5 \\text{ then size is equal to } 1.25 * \\lambda = v_tag${addComma(
                  (1.25 * lambda).toFixed(3)
                )}\n
                \\text{Else size is equal to } 0.5 * \\lambda = v_tag${addComma(
                  (0.5 * lambda).toFixed(3)
                )}\n
            `
    };

    setTex(latex[parameterKey]);
  }, [inputs, state.results]);

  function handleChange(event) {
    event.preventDefault();
    const { name, value } = event.target;
    setInputs((prevState) => ({ ...prevState, [name]: parseFloat(value) }));
  }

  return (
    <DialogBox
      title={labelsToKeys[parameterKey]}
      isOpen={isOpen}
      onClose={() => onClose()}
      className={{ paper: classes.dialog }}
    >
      <MathJax.Provider>
        {tex.split('\n').map((eqn) => {
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

          return row(eqn, val, inline, input, handleChange);
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
            title: labelsToKeys[parameterKey],
            type: 'linear',
            zeroline: false
          },
          title: false as any
        }}
      />
    </DialogBox>
  );
}

export default UserBurdenModal;