import { useState } from "react";
import PropTypes from "prop-types";
import "./styles.scss";

const ToggleButton = ({ mode, onChange, className }) => {
  const [isDark, setIsDark] = useState(mode);

  const handleToggle = () => {
    console.log("isDark:", !isDark);
    setIsDark(!isDark);
    onChange();
  };

  const toggleClassName = isDark ? "toggle--dark" : "";

  return (
    <label className={`switch ${className}`}>
      <input type="checkbox" onClick={handleToggle} />
      <span className={`slider round ${toggleClassName}`}>
        <i className="bi bi-brightness-high icon-light" />
        <i className="bi bi-moon icon-dark" />
      </span>
    </label>
  );
};

ToggleButton.propTypes = {
  mode: PropTypes.bool,
  className: PropTypes.string,
  onChange: PropTypes.func,
};

export default ToggleButton;
