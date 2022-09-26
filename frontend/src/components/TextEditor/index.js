import Badge from "react-bootstrap/Badge";
import Form from "react-bootstrap/Form";
import "./styles.scss";

function TextEditor() {
  return (
    <Form>
      <Form.Group className="TextEditor-container" controlId="exampleForm.ControlTextarea1">
        <Form.Label className="form-label">
          <h6 className="px-2">Code Editor</h6>
          <div className="user-pills-container">
            <Badge pill className="user-pill">
              user-1
            </Badge>
            <Badge pill className="user-pill">
              user-2
            </Badge>
          </div>
        </Form.Label>
        <Form.Control as="textarea" rows={10} />
      </Form.Group>
    </Form>
  );
}

export default TextEditor;
