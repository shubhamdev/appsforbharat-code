import logo from "./logo.svg";
import "./App.css";
import { Row, Col } from "antd";
import Todo from "./components/Todo";

function App() {
  return (
    <div className="App">
      <h1>Todo app</h1>
      <Row>
        <Col span={12} offset={6}>
          <Todo />
        </Col>
      </Row>
    </div>
  );
}

export default App;
