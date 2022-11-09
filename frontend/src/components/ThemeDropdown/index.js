import Dropdown from "react-bootstrap/Dropdown";
import monacoThemes from "monaco-themes/themes/themelist";
import PropTypes from "prop-types";
import "./styles.scss";

const ThemeDropdown = ({ handleThemeChange, theme }) => {
  return (
    <Dropdown className="px-2">
      <Dropdown.Toggle id="dropdown-basic" className="custom-dropdown-toggle text-white">
        {theme.label || "Select theme"}
      </Dropdown.Toggle>
      <Dropdown.Menu className="dropdown-menu custom-dropdown-menu">
        {Object.entries(monacoThemes).map(([themeId, themeName]) => (
          <Dropdown.Item
            key={themeId}
            onClick={() => handleThemeChange({ value: themeId, label: themeName })}
          >
            {themeName}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

ThemeDropdown.propTypes = {
  handleThemeChange: PropTypes.func,
  theme: PropTypes.object,
};

export default ThemeDropdown;
