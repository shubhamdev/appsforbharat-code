import React, { useEffect, useState } from "react";
import { Card, Input, Radio, Tooltip, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

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
    let copyDeepCopy = [...deepCopy];
    switch (key) {
      case "completed":
        copyDeepCopy = copyDeepCopy.map((item) => {
          if (item.id === parseInt(id, 10)) {
            item.isCompleted = true;
          }
          return item;
        });
        await setDeepCopy(copyDeepCopy);
        break;

      case "updateRecord":
        copyDeepCopy = copyDeepCopy.map((item) => {
          data.map((j) => {
            if (j.id === item.id) {
              item = j;
            }
          });
          return item;
        });
        await setDeepCopy(copyDeepCopy);
        break;
      default:
        break;
    }
  };

  // Mark item as completed (used async because set state is synchronous)
  const markCompleted = async (e) => {
    let copyData = [...data];
    copyData = copyData.map((item) => {
      if (item.id === parseInt(e.target.value, 10)) {
        item.isCompleted = true;
      }
      return item;
    });
    updateDeepCopy("completed", e.target.value);
    await setData(copyData);
  };

  // Filter data bases on user selection (All/Completed/Pending)
  const todoFilter = async (e) => {
    await setFilterValue(e.target.value);
    filterList(e.target.value);
  };

  // Set filtered data in actual state
  const filterList = (id) => {
    let filterData = [];
    switch (id) {
      case 1:
        filterData = deepCopy;
        setData(filterData);
        break;
      case 2:
        filterData = deepCopy.filter((item) => item.isCompleted === true);
        setData(filterData);
        break;
      case 3:
        filterData = deepCopy.filter((item) => item.isCompleted !== true);
        setData(filterData);
        break;
      default:
        break;
    }
  };

  const dragOver = async (e) => {
    e.preventDefault();
    await setDragoverValue(e.target.innerText);
  };

  const swapData = (arr, from, to) => {
    const aux = arr[from];
    arr[from] = arr[to];
    arr[to] = aux;
    return arr;
  };

  const dragEnd = async (e, index) => {
    let copyData = [...data];
    const from = copyData.findIndex(
      (item) => item.title.toLowerCase() === currentTarget.toLowerCase()
    );
    const to = copyData.findIndex(
      (item) => item.title.toLowerCase() === dragOverValue.toLowerCase()
    );
    const result = swapData(copyData, from, to);
    updateDeepCopy("updateRecord", "", result);
    await setData(result);
  };

  //
  const dragStart = async (e) => {
    if (e.currentTarget && e.currentTarget.innerText) {
      await setCurrentTarget(e.currentTarget.innerText);
    }
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.currentTarget);
  };

  const markEdit = async (index) => {
    const copy = [...data];
    copy[index].isEdit = true;
    await setUpdatedTitle(copy[index].title);
    await setData(copy);
  };

  const onEnter = async (index) => {
    const copy = [...data];
    copy[index].title = updatedTitle;
    copy[index].isEdit = false;
    updateDeepCopy("updateRecord", "", copy);
    await setData(copy);
  };

  const updateRecord = async (event, index) => {
    await setUpdatedTitle(event.target.value);
  };

  useEffect(() => {
    if (props.todoList && props.todoList.length > 0) {
      // Set default data to the list
      setData(props.todoList);
      const copiedData = deepCopy1(props.todoList);
      if (copiedData && copiedData.length) {
        setDeepCopy(copiedData);
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
                  <span onDoubleClick={() => markEdit(index)} className="wrap">
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
