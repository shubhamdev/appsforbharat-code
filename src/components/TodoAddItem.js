import React, { useState } from "react";
import { Input } from "antd";

// Add new item in toto list
function TodoAddItem(props) {
  const [todoTitle, setTodoTitle] = useState("");
  const addItemToTodoList = (event) => {
    setTodoTitle(event.target.value);
  };

  const todoItemCallBack = () => {
    props.todoItemCallBack(todoTitle);
  };

  return (
    <>
      <Input
        placeholder="Enter todo title"
        maxLength={160}
        onChange={addItemToTodoList}
        onPressEnter={todoItemCallBack}
      />
    </>
  );
}

export default TodoAddItem;
