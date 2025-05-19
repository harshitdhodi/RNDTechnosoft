import Hexagon from "react-hexagon"
import PropTypes from "prop-types"
import { useState, useEffect } from "react"
import isFunction from "lodash/isFunction"
import isEmpty from "lodash/isEmpty"
import times from "lodash/times"

// Helper function to get grid dimensions
const getGridDimensions = (gridWidth, gridHeight, N) => {
  console.log("Grid Width:", N);
  const a = (5 * gridHeight) / (gridWidth * Math.sqrt(2))
  const b = gridHeight / (2 * gridWidth) - 2

  const columns = Math.ceil((-b + Math.sqrt(b * b + 4 * N * a)) / (2 * a))

  const hexSize = Math.floor(gridWidth / (3 * columns + 0.5))
  const rows = Math.ceil(N / columns)

  return {
    columns,
    hexSize,
    hexWidth: hexSize * 2,
    hexHeight: Math.ceil(hexSize * Math.sqrt(3)),
    rows,
  }
}

const tryInvoke = (func, params = [], defaultValue = null) => {
  return isFunction(func) ? func(...params) : defaultValue
}

// Gradient definitions for the hexagon borders
const GradientDefs = () => (
  <defs>
    <linearGradient id="redToOrangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#e60f0a" /> {/* Red */}
      <stop offset="100%" stopColor="#ed8045" /> {/* Orange */}
    </linearGradient>
    <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#f56a20" /> {/* Orange */}
      <stop offset="100%" stopColor="#ed8045" /> {/* Orange */}
    </linearGradient>
    <linearGradient id="lightOrangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#FF8A33" /> {/* Light Orange */}
      <stop offset="100%" stopColor="#FFB733" /> {/* Light Yellow-Orange */}
    </linearGradient>
    <linearGradient id="tealToGreenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#20a591" /> {/* Teal */}
      <stop offset="100%" stopColor="#4ba178" /> {/* Green */}
    </linearGradient>
    <linearGradient id="oliveToGreenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#879d59" /> {/* Olive Green */}
      <stop offset="100%" stopColor="#459c6f" /> {/* Green */}
    </linearGradient>
    <linearGradient id="yellowToOliveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#f0a23a" /> {/* Yellow-Orange */}
      <stop offset="100%" stopColor="#a9a056" /> {/* Olive */}
    </linearGradient>
  </defs>
);

const HexagonGrid = (props) => {
  const { hexagons, gridHeight, gridWidth, renderHexagonContent, hexProps, x, y } = props;

  const [state, setState] = useState({
    columns: 1,
    hexSize: 1,
    hexWidth: 1,
    hexHeight: 1,
    rows: 0,
  });

  const [device, setDevice] = useState("large");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setDevice("small");
      else if (window.innerWidth < 1024) setDevice("md");
      else setDevice("large");
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isEmpty(hexagons) && gridWidth > 0 && gridHeight > 0) {
      setState(getGridDimensions(gridWidth, gridHeight, hexagons.length));
    }
  }, [hexagons, gridWidth, gridHeight]);

  const getHexDimensions = (row, col, columnsInRow) => {
    const gap = 10;
    const dimensions = {
      width: `${state.hexWidth}px`,
      height: `${state.hexHeight}px`,
      x: col * (state.hexSize * 3 + gap),
    };
    if (
      ((device === "large" && row % 2 === 1 && columnsInRow === 3) ||
        (device === "md" && row % 2 === 1 && columnsInRow === 2) ||
        (device === "small" && row % 2 === 1 && columnsInRow === 1))
    ) {
      dimensions.x += state.hexSize * (3 / 2) + gap / 2;
    }
    return dimensions;
  };

  const getRowDimensions = (row) => {
    const gap = 4;
    const dimensions = {
      y: `${row * (state.hexSize * (Math.sqrt(3) / 2) + gap)}px`,
      height: `${state.hexHeight}px`,
      width: gridWidth,
    };
    return dimensions;
  };

  const getGradientId = (row, col, index) => {
    const gradients = [
      "redToOrangeGradient",
      "orangeGradient",
      "lightOrangeGradient",
      "tealToGreenGradient",
      "oliveToGreenGradient",
      "yellowToOliveGradient",
    ];
    return gradients[index % gradients.length];
  };

  // Responsive columns logic
  const getColumnsInRow = (row) => {
    if (device === "large") {
      return row % 2 === 0 ? 4 : 3;
    }
    if (device === "md") {
      return row % 2 === 0 ? 3 : 2;
    }
    // small
    return row % 2 === 0 ? 1 : 1;
  };

  // Responsive rows calculation
  const getRowsCount = () => {
    let total = 0;
    let count = 0;
    while (total < hexagons.length) {
      const columns = getColumnsInRow(count);
      total += columns;
      count++;
    }
    return count;
  };

  return (
    <svg width={gridWidth} height={gridHeight} x={x} y={y}>
      <GradientDefs />
      {(() => {
        let rendered = 0;
        const rows = [];
        for (let row = 0; rendered < hexagons.length; row++) {
          const columnsInRow = getColumnsInRow(row);
          const rowDim = getRowDimensions(row);
          const hexesInThisRow = Math.min(columnsInRow, hexagons.length - rendered);

          rows.push(
            <svg key={row} width={rowDim.width} height={rowDim.height} y={rowDim.y}>
              {Array.from({ length: hexesInThisRow }).map((_, col) => {
                const index = rendered + col;
                const hexagon = hexagons[index];
                const hexDim = getHexDimensions(row, col, columnsInRow);
                const gradientId = getGradientId(row, col, index);

                const _hexProps = {
                  ...tryInvoke(hexProps, [hexagon], {}),
                  style: {
                    fill: "white",
                    stroke: `url(#${gradientId})`,
                    strokeWidth: 10,
                    filter: "drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.15))",
                  },
                };

                return (
                  <svg key={index} height={hexDim.height} width={hexDim.width} x={`${hexDim.x}px`}>
                    <Hexagon {..._hexProps} flatTop>
                      {tryInvoke(renderHexagonContent, [hexagon], <tspan />)}
                    </Hexagon>
                  </svg>
                );
              })}
            </svg>
          );
          rendered += columnsInRow;
        }
        return rows;
      })()}
    </svg>
  );
};

HexagonGrid.propTypes = {
  gridWidth: PropTypes.number.isRequired,
  gridHeight: PropTypes.number.isRequired,
  hexagons: PropTypes.arrayOf(PropTypes.any).isRequired,
  hexProps: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  renderHexagonContent: PropTypes.func,
  x: PropTypes.number,
  y: PropTypes.number,
}

HexagonGrid.defaultProps = {
  hexProps: {},
  renderHexagonContent: null,
  x: 0,
  y: 0,
}

export default HexagonGrid