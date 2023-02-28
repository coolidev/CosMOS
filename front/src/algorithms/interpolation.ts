export interface InterpolationInputs {
  x: number; // The x value to perform the interpolation at.
  y: number; // The y value to perform the interpolation at.
  data: number[][]; // The model data points, formatted as a 2D array.
  metricType: string;
}

// 
/**
 * Performs a linear interpolation on two-dimensional data and returns
 * the expected value at the input point, (x, y).
 * @param {InterpolationInputs} inputs
 * @return {number =>}
 */
export const PerformInterpolation = (inputs: InterpolationInputs): number => {
  const { 
    x, 
    y, 
    data,
    metricType
  } = inputs;

  // Z Values Range
  let X0Y0 = 0;
  let X0Y1 = 0;
  let X1Y0 = 0;
  let X1Y1 = 0;

  // X and Y Ranges
  let X0 = 0;
  let X1 = 0;
  let Y0 = 0;
  let Y1 = 0;

  // Indices
  let X0i = 0;
  let X1i = 0;
  let Y0i = 0;
  let Y1i = 0;
  let Xmax = data.length;
  let Ymax = data[0].length;

  let result = { result: 0, error: '' };

  // Interpolated values
  let XMY0 = 0; // Interpolated Z from X at Y0
  let XMY1 = 0; // Interpolated Z from X at Y1
  let XMYM = 0; // Interpolated Z from X and Y (result)

  let extrapolate = false;
  const xIndices = data.slice(1).map((row: number[]) => {
    return row[0];
  });
  const yIndices = data[0].slice(1);
  const xIndex = xIndices.indexOf(x) + 1;
  const yIndex = yIndices.indexOf(y) + 1;
  if (xIndex > 0 && yIndex > 0) {
    if (data[xIndex][yIndex] === null) {
      extrapolate = true;
    }
  }

  const gapMetrics = ['average_gap', 'max_gap', 'mean_response_time'];

  extrapolate = false;
  // Extrapolate
  if (
    ((x > data[Xmax - 1][0] || x < data[1][0]) ||
      (y < data[0][1] || y > data[0][Ymax - 1])) ||
    extrapolate
  ) {
    if (gapMetrics.includes(metricType)) {
      return 1440;
    } else {
      return 0;
    }
    ////////////////////// UNREACHABLE
    // if (y < data[0][1]) {
    //   Y0i = 1;
    //   Y1i = 2;
    // } else {
    //   Y0i = Ymax - 2;
    //   Y1i = Ymax - 1;
    // }

    // // if (extrapolate)

    // if (x < data[1][0]) {
    //   X0i = 1;
    //   X1i = 2;
    // } else {
    //   X0i = Xmax - 2;
    //   X1i = Xmax - 1;
    // }

    // // If y is less than the lowest Y value...
    // if (y < data[0][1]) {
    //   // The two lowest Y values.
    //   Y0 = data[0][1];
    //   Y1 = data[0][2];

    //   // If x is less than the lowest X value...
    //   if (x < data[1][0]) {
    //     // The two lowest X values.
    //     X0 = data[1][0];
    //     X1 = data[2][0];
    //     //XMYM = XMY0 + (x - X0) * (XMY0 - XMY1) / (X1 - X0);
    //   }

    //   // If x is greater than the highest X value...
    //   else {
    //     // The two highest X values.
    //     X0 = data[Xmax - 2][0];
    //     X1 = data[Xmax - 1][0];

    //     XMY0 =
    //       data[X0i][Y0i] +
    //       ((x - X0) * (data[X1i][Y0i] - data[X0i][Y0i])) / (X1 - X0);
    //     XMY1 =
    //       data[X0i][Y1i] +
    //       ((x - X0) * (data[X1i][Y1i] - data[X0i][Y1i])) / (X1 - X0);

    //     XMYM = XMY0 + ((y - Y0) * (XMY1 - XMY0)) / (Y1 - Y0);
    //   }
    // }

    // // If y is greater than the highest Y value...
    // else {
    //   // The two highest Y values.
    //   Y0 = data[0][Ymax - 2];
    //   Y1 = data[0][Ymax - 1];

    //   // If x is less than the lowest X value...
    //   if (x < data[1][0]) {
    //     // The two lowest X values.
    //     X0 = data[1][0];
    //     X1 = data[2][0];
    //     //XMYM = XMY0 + (x - X0) * (XMY0 - XMY1) / (X1 - X0);
    //   }

    //   // If x is greater than the highest X value...
    //   else {
    //     // The two highest X values.
    //     X0 = data[Xmax - 2][0];
    //     X1 = data[Xmax - 1][0];

    //     XMY0 =
    //       data[X0i][Y0i] +
    //       ((x - X0) * (data[X1i][Y0i] - data[X0i][Y0i])) / (X1 - X0);
    //     XMY1 =
    //       data[X0i][Y1i] +
    //       ((x - X0) * (data[X1i][Y1i] - data[X0i][Y1i])) / (X1 - X0);

    //     XMYM = XMY0 + ((y - Y0) * (XMY1 - XMY0)) / (Y1 - Y0);
    //   }
    // }

    // if (y < data[0][1]) {
    //   Y0 = data[0][1];
    //   Y1 = data[0][2];
    //   XMYM = XMY0 + ((y - Y0) * (XMY1 - XMY0)) / (Y1 - Y0);
    // } else {
    //   Y0 = data[0][Ymax - 2];
    //   Y1 = data[0][Ymax - 1];
    //   XMYM = XMY0 + ((y - Y0) * (XMY1 - XMY0)) / (Y1 - Y0);
    // }
  } else if (y < data[0][1] || y > data[0][Ymax - 1] || extrapolate) {
    // Iterate over the x index of the data.
    for (let i = 1; i < Xmax - 1; i++) {
      // Check if the input x value equals one of the
      // x values in the index of the input data.
      if (data[i][0] === x) {
        X0i = i;
      } else if (data[i + 1][0] === x) {
        X1i = i + 1;
      }

      // If the input x value is in between the current
      // x index and the next x index, mark these two indices
      // as delimiters.
      else if (x >= data[i][0] && x <= data[i + 1][0]) {
        X0i = i;
        X1i = i + 1;
      }
    }

    if (y < data[0][1]) {
      Y0i = 1;
      Y1i = 2;
    } else {
      Y0i = Ymax - 2;
      Y1i = Ymax - 1;
    }

    X0 = data[X0i][0];
    X1 = data[X1i][0];

    X0Y0 = data[X0i][Y0i];
    X0Y1 = data[X0i][Y1i];
    X1Y0 = data[X1i][Y0i];
    X1Y1 = data[X1i][Y1i];

    // The input x value is included in the data indices,
    // so no interpolation in the x direction is needed.
    if (x === X0) {
      XMY0 = X0Y0;
      XMY1 = X0Y1;
    }

    // The input x value is included in the data indices,
    // so no interpolation in the x direction is needed.
    else if (x === X1) {
      XMY0 = X1Y0;
      XMY1 = X1Y1;
    }

    // The input x value is between x indices in the data,
    // so we need to interpolate.
    else {
      XMY0 = X0Y0 + ((x - X0) * (X1Y0 - X0Y0)) / (X1 - X0);
      XMY1 = X0Y1 + ((x - X0) * (X1Y1 - X0Y1)) / (X1 - X0);
    }

    if (y < data[0][1]) {
      Y0 = data[0][1];
      Y1 = data[0][2];
      XMYM = XMY0 + ((y - Y0) * (XMY1 - XMY0)) / (Y1 - Y0);
    } else {
      Y0 = data[0][Ymax - 2];
      Y1 = data[0][Ymax - 1];
      XMYM = XMY0 + ((y - Y0) * (XMY1 - XMY0)) / (Y1 - Y0);
    }
  } else if (x > data[Xmax - 1][0] || x < data[1][0] || extrapolate) {
    // Iterate over the y index of the data.
    for (let i = 1; i <= Ymax - 1; i++) {
      // Check if the input y value equals one of the
      // y values in the index of the input data.
      if (data[0][i] === y) {
        Y0i = i;
      } else if (data[0][i + 1] === y) {
        Y1i = i + 1;
      }

      // If the input y value is in between the current
      // y index and the next y index, mark these two indices
      // as delimiters.
      else if (y >= data[0][i] && y <= data[0][i + 1]) {
        Y0i = i;
        Y1i = i + 1;
      }
    }

    if (x < data[1][0]) {
      X0i = 1;
      X1i = 2;
    } else {
      X0i = Xmax - 2;
      X1i = Xmax - 1;
    }

    Y0 = data[0][Y0i];
    Y1 = data[0][Y1i];

    X0Y0 = data[X0i][Y0i];
    X0Y1 = data[X0i][Y1i];
    X1Y0 = data[X1i][Y0i];
    X1Y1 = data[X1i][Y1i];

    if (y === Y0) {
      XMY0 = X0Y0;
      XMY1 = X1Y0;
    } else if (y === Y1) {
      XMY0 = X0Y1;
      XMY1 = X1Y1;
    } else {
      XMY0 = X0Y0 + ((y - Y0) * (X0Y1 - X0Y0)) / (Y1 - Y0);
      XMY1 = X1Y0 + ((y - Y0) * (X1Y1 - X1Y0)) / (Y1 - Y0);
    }

    if (x < data[1][0]) {
      X0 = data[1][0];
      X1 = data[2][0];
      XMYM = XMY0 + ((x - X0) * (XMY1 - XMY0)) / (X1 - X0);
    } else {
      X0 = data[Xmax - 2][0];
      X1 = data[Xmax - 1][0];
      XMYM = XMY0 + ((x - X0) * (XMY1 - XMY0)) / (X1 - X0);
    }
  }

  // Interpolate
  else {
    // Iterate over the x index of the data.
    for (let i = 1; i < Xmax - 1; i++) {
      // Check if the input x value equals one of the
      // x values in the index of the input data.
      if (data[i][0] === x) {
        X0i = i;
      } else if (data[i + 1][0] === x) {
        X1i = i + 1;
      }

      // If the input x value is in between the current
      // x index and the next x index, mark these two indices
      // as delimiters.
      else if (x >= data[i][0] && x <= data[i + 1][0]) {
        X0i = i;
        X1i = i + 1;
      }
    }

    // Iterate over the y index of the data.
    for (let i = 1; i <= Ymax - 1; i++) {
      // Check if the input y value equals one of the
      // y values in the index of the input data.
      if (data[0][i] === y) {
        Y0i = i;
      } else if (data[0][i + 1] === y) {
        Y1i = i + 1;
      }

      // If the input y value is in between the current
      // y index and the next y index, mark these two indices
      // as delimiters.
      else if (y >= data[0][i] && y <= data[0][i + 1]) {
        Y0i = i;
        Y1i = i + 1;
      }
    }

    // These are the actual x and y values at the
    // indices surrounding the input x and y values.
    X0 = data[X0i][0];
    X1 = data[X1i][0];
    Y0 = data[0][Y0i];
    Y1 = data[0][Y1i];

    // These are the z values surrounding the point whose
    // value we're trying to estimate.
    X0Y0 = data[X0i][Y0i];
    X0Y1 = data[X0i][Y1i];
    X1Y0 = data[X1i][Y0i];
    X1Y1 = data[X1i][Y1i];

    // The input x value is included in the data indices,
    // so no interpolation in the x direction is needed.
    if (x === X0) {
      XMY0 = X0Y0;
      XMY1 = X0Y1;
    }

    // The input x value is included in the data indices,
    // so no interpolation in the x direction is needed.
    else if (x === X1) {
      XMY0 = X1Y0;
      XMY1 = X1Y1;
    }

    // The input x value is between x indices in the data,
    // so we need to interpolate.
    else {
      XMY0 = X0Y0 + ((x - X0) * (X1Y0 - X0Y0)) / (X1 - X0);
      XMY1 = X0Y1 + ((x - X0) * (X1Y1 - X0Y1)) / (X1 - X0);
    }

    // The input y value is included in the data indices,
    // so no interpolation in the y direction is needed.
    if (y === Y0) {
      XMYM = XMY0;
    }

    // The input y value is included in the data indices,
    // so no interpolation in the y direction is needed.
    else if (y === Y1) {
      XMYM = XMY1;
    }

    // The input y value is between y indices in the data,
    // so we need to interpolate.
    else {
      XMYM = XMY0 + ((y - Y0) * (XMY1 - XMY0)) / (Y1 - Y0);
    }

    if (isNaN(XMYM)) {
    } else {
      result.result = XMYM;
    }
  }

  return XMYM;
};

export const interpolate = (
  x: number,
  y: number,
  metric: string,
  data: number[][]
): number => {
  const interpolationInputs: InterpolationInputs = {
    x: x,
    y: y,
    data: data,
    metricType: metric
  };

  return PerformInterpolation(interpolationInputs);
};
