import React, { useEffect, useState } from "react";
import { Card, Input, Radio, Tooltip, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { deepCopyData, swapData } from "../utils/service";
import Footer from "./Footer";
const deepCopy1 = (data) => {
  const copy = JSON.stringify(data);
  return JSON.parse(copy);
};

// this component will recive data from Todo
function TodoList(props) {
  // todo list data
  const [data, setData] = useState(props.data);
  // Deep copy data for filter and other operation
  const [deepCopy, setDeepCopy] = useState([]);
  // Set filter value 1: All, 2: completed, 3: Pending
  const [filterValue, setFilterValue] = useState(1);
  const [currentTarget, setCurrentTarget] = useState("");
  const [dragOverValue, setDragoverValue] = useState("");
  const [updatedTitle, setUpdatedTitle] = useState("");

  //Update Deep copy
  const updateDeepCopy = async (key, id, data = []) => {
    const deepCopyResult = deepCopyData(key, [...deepCopy], id, data);
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

  const dragOver = async (e) => {
    e.preventDefault();
    await setState(e.target.innerText, setDragoverValue);
  };

  const findIndexOf = (data, index) => {
    return data.findIndex(
      (item) => item.title.toLowerCase() === index.toLowerCase()
    );
  };

  const dragEnd = async (e, index) => {
    let copyData = [...data];
    const result = swapData(
      copyData,
      findIndexOf(copyData, currentTarget),
      findIndexOf(copyData, dragOverValue)
    );
    updateDeepCopy("updateRecord", "", result);
    await setState(result, setData);
  };

  //
  const dragStart = async (e) => {
    if (e.currentTarget && e.currentTarget.innerText) {
      await setState(e.currentTarget.innerText, setCurrentTarget);
    }
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.currentTarget);
  };

  const markEdit = async (index) => {
    const copy = [...data];
    copy[index].isEdit = true;
    await setState(copy[index].title, setUpdatedTitle);
    await setState(copy, setData);
  };

  const onEnter = async (index) => {
    const copy = [...data];
    copy[index].title = updatedTitle;
    copy[index].isEdit = false;
    updateDeepCopy("updateRecord", "", copy);
    await setState(copy, setData);
  };

  const updateRecord = async (event, index) => {
    await setState(event.target.value, setUpdatedTitle);
  };

  useEffect(() => {
    if (props.todoList && props.todoList.length > 0) {
      // Set default data to the list
      setState(props.todoList, setData);
      const copiedData = deepCopy1(props.todoList);
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
                    onChange={(e) => updateRecord(e, index)}
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
