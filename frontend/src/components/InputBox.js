import PropTypes from "prop-types";

function InputBox(props) {
  return <input type={props.type} className="form-control mt-1" placeholder={props.placeholder} />;
}

InputBox.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
};

export default InputBox;
