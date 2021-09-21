import React, { useState } from "react";
import TodoList from "./TodoList";
import { message } from "antd";
import TodoAddItem from "./TodoAddItem";

function Todo() {
  const [todoList, setTodoList] = useState([]);

  const duplicateCheck = (title) => {
    return todoList.filter(
      (item) => item.title.toLowerCase() === title.toLowerCase()
    );
  };
  const todoItemCallBack = (data) => {
    if (duplicateCheck(data.trim()).length === 0) {
      const copyPrev = [...todoList];
      copyPrev.push({
        title: data,
        isEdit: false,
        isCompleted: false,
        id: copyPrev.length + 1,
        // isDrag: false,
      });
      setTodoList(copyPrev);
    } else {
      message.error("Duplicate item not allowed.");
    }
  };

  return (
    <div>
      {/* add */}
      <TodoAddItem todoItemCallBack={todoItemCallBack} />
      {/* show List */}
      <TodoList todoList={todoList} />
    </div>
  );
}

export default Todo;
