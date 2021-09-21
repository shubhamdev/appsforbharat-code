import React, { useEffect, useState } from "react";
import { Card, Input, Radio, Tooltip } from "antd";
import {
  deepCopyData,
  updateDeepCopyData,
  swapData,
  findIndexOf,
} from "../utils/service";
import Footer from "./Footer";

function TodoList(props) {
  const [data, setData] = useState(props.data);
  const [deepCopy, setDeepCopy] = useState([]);
  const [filterValue, setFilterValue] = useState(1);
  const [currentTarget, setCurrentTarget] = useState("");
  const [dragOverValue, setDragoverValue] = useState("");
  const [updatedTitle, setUpdatedTitle] = useState("");

  //Update Deep copy
  const updateDeepCopy = async (key, id, data = []) => {
    const deepCopyResult = updateDeepCopyData(key, [...deepCopy], id, data);
    await setState(deepCopyResult, setDeepCopy);
  };

  // Mark item as completed (used async because set state is synchronous)
  const markCompleted = async (e) => {
    const copyData = [...data].map((item) => {
      if (item.id === parseInt(e.target.value, 10)) {
        item.isCompleted = !item.isCompleted;
      }
      return item;
    });
    updateDeepCopy("completed", e.target.value);
    await setState(copyData, setData);
  };

  // Set all the state (it's a generic function that will update the state)
  const setState = async (value, callback) => {
    await callback(value);
  };

  // Filter data bases on user selection (All/Completed/Pending)
  const todoFilter = async (e) => {
    setState(e.target.value, setFilterValue);
    filterList(e.target.value);
  };

  // Set filtered data in actual state
  const filterList = (id) => {
    let filterData = deepCopy ? deepCopy : [];
    switch (id) {
      case 1:
        setState(filterData, setData);
        break;
      case 2:
        filterData = deepCopy.filter((item) => item.isCompleted === true);
        setState(filterData, setData);
        break;
      case 3:
        filterData = deepCopy.filter((item) => item.isCompleted !== true);
        setState(filterData, setData);
        break;
      default:
        setState(filterData, setData);
        break;
    }
  };

  // Gives element where the drag recently get passes
  const dragOver = async (e) => {
    e.preventDefault();
    await setState(e.target.innerText, setDragoverValue);
  };

  // Fir up event when drag ends (Will update the state data as well)
  const dragEnd = async () => {
    let copyData = [...data];
    let deepCopyData = [...deepCopy];
    const result = swapData(
      copyData,
      findIndexOf(copyData, currentTarget),
      findIndexOf(copyData, dragOverValue)
    );
    const result1 = swapData(
      deepCopyData,
      findIndexOf(deepCopyData, currentTarget),
      findIndexOf(deepCopyData, dragOverValue)
    );
    updateDeepCopy("swap", "", result1);
    await setState(result, setData);
  };

  // Capture the start element from where the drag started
  const dragStart = async (e) => {
    if (e.currentTarget && e.currentTarget.innerText) {
      await setState(e.currentTarget.innerText, setCurrentTarget);
    }
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.currentTarget);
  };

  // Enable edit inside todo list item
  const markEdit = async (index) => {
    const copy = [...data];
    copy[index].isEdit = true;
    await setState(copy[index].title, setUpdatedTitle);
    await setState(copy, setData);
  };

  // Update the title value and close the edit feature
  const onEnter = async (index) => {
    const copy = [...data];
    copy[index].title = updatedTitle;
    copy[index].isEdit = false;
    updateDeepCopy("updateRecord", "", copy);
    await setState(copy, setData);
  };

  // Fire up this function onchange value of title
  const onTitleChange = async (event) => {
    await setState(event.target.value, setUpdatedTitle);
  };

  // Will update initial state value for todo list and deep copy of the given list
  useEffect(() => {
    if (props.todoList && props.todoList.length > 0) {
      setState(props.todoList, setData);
      const copiedData = deepCopyData(props.todoList);
      if (copiedData && copiedData.length) {
        setState(copiedData, setDeepCopy);
      }
    }
  }, [props.todoList]);

  return (
    <div className="site-card-border-less-wrapper">
      <Card title="Todo Items" bordered={false} onDragOver={dragOver}>
        <Radio.Group onChange={todoFilter} value={filterValue}>
          <Radio value={1}>All</Radio>
          <Radio value={2}>Completed</Radio>
          <Radio value={3}>Pending</Radio>
        </Radio.Group>
        {data?.map((item, index) => {
          return (
            <span
              draggable="true"
              onDragEnd={(e) => dragEnd(e, index)}
              onDragStart={dragStart}
              className="displayItem"
              key={item.id}
            >
              <input
                type="checkbox"
                value={item.id}
                className={
                  item?.isCompleted ? "completed itemText" : " itemText"
                }
                checked={item?.isCompleted}
                onChange={markCompleted}
              />{" "}
              <Tooltip title={item.title}>
                {item.isEdit ? (
                  <Input
                    placeholder="Enter todo title"
                    maxLength={160}
                    value={updatedTitle}
                    onChange={(e) => onTitleChange(e, index)}
                    onPressEnter={() => onEnter(index)}
                  />
                ) : (
                  <span
                    onDoubleClick={() => markEdit(index)}
                    className={item?.isCompleted ? "wrap completed" : "wrap"}
                  >
                    {" "}
                    {item.title}
                  </span>
                )}
              </Tooltip>
            </span>
          );
        })}
        <Footer data={data} />
      </Card>
    </div>
  );
}

export default TodoList;
