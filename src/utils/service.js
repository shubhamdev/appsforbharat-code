export const deepCopyData = (key, deepCopy, id, data = []) => {
  // let copyDeepCopy = [...deepCopy];
  switch (key) {
    case "completed":
      deepCopy = deepCopy.map((item) => {
        if (item.id === parseInt(id, 10)) {
          item.isCompleted = true;
        }
        return item;
      });
      return deepCopy;
      break;

    case "updateRecord":
      deepCopy = deepCopy.map((item) => {
        data.map((j) => {
          if (j.id === item.id) {
            item = j;
          }
        });
        return item;
      });
      return deepCopy;
      break;
    default:
      return deepCopy;
      break;
  }
};

export const swapData = (arr, from, to) => {
  const aux = arr[from];
  arr[from] = arr[to];
  arr[to] = aux;
  return arr;
};
