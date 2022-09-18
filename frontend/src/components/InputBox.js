import "bootstrap/dist/css/bootstrap.min.css";

function InputBox(props) {
  return <input type={props.type} className="form-control mt-1" placeholder={props.placeholder} />;
}

export default InputBox;
