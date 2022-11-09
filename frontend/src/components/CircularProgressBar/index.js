import PropTypes from "prop-types";
import "./styles.scss";

const CircularProgressBar = ({ sqSize = 250, strokeWidth = 8, count = 30, start = false }) => {
  const percentage = (count / 30) * 100;
  // Size of the enclosing square = sqSize
  // SVG centers the stroke width on the radius, subtract out so circle fits in square
  const radius = (sqSize - strokeWidth) / 2;
  // Enclose cicle in a circumscribing square
  const viewBox = `0 0 ${sqSize} ${sqSize}`;
  // Arc length at 100% coverage is the circle circumference
  const dashArray = radius * Math.PI * 2;
  // Scale 100% coverage overlay with the actual percent
  const dashOffset = dashArray - (dashArray * percentage) / 100;

  return (
    <svg width={sqSize} height={sqSize} viewBox={viewBox}>
      <circle
        className="circle-background"
        cx={sqSize / 2}
        cy={sqSize / 2}
        r={radius}
        strokeWidth={`${strokeWidth}px`}
      />
      <circle
        className="circle-progress"
        cx={sqSize / 2}
        cy={sqSize / 2}
        r={radius}
        strokeWidth={`${strokeWidth}px`}
        transform={`rotate(-90 ${sqSize / 2} ${sqSize / 2})`}
        style={{
          strokeDasharray: dashArray,
          strokeDashoffset: dashOffset,
        }}
      />
      <text className="circle-text" x="50%" y="50%" dy=".3em" textAnchor="middle">
        {count}
      </text>
      <text
        className="circle-text-sm fw-semibold text-center"
        x="50%"
        y="68%"
        dy=".3em"
        textAnchor="middle"
      >
        {start ? "Matching..." : "Find Match"}
      </text>
    </svg>
  );
};

CircularProgressBar.propTypes = {
  sqSize: PropTypes.any,
  strokeWidth: PropTypes.any,
  count: PropTypes.any,
  start: PropTypes.bool,
};

export default CircularProgressBar;
