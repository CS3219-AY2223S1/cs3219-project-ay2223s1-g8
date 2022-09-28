import Dropdown from "react-bootstrap/Dropdown";
import { languageOptions } from "../../utils/codeEditorUtils/languageOptions";
import PropTypes from "prop-types";
import "./styles.scss";

const LanguagesDropdown = ({ handleLanguageChange, language }) => {
  return (
    <Dropdown className="px-2">
      <Dropdown.Toggle id="dropdown-basic" className="custom-dropdown-toggle text-white">
        {language.name || "Select langugae"}
      </Dropdown.Toggle>

      <Dropdown.Menu className="dropdown-menu custom-dropdown-menu">
        {languageOptions.map((lang) => (
          <Dropdown.Item key={lang.id} onClick={() => handleLanguageChange(lang)}>
            {lang.label}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

LanguagesDropdown.propTypes = {
  handleLanguageChange: PropTypes.func,
  language: PropTypes.object,
};

export default LanguagesDropdown;
