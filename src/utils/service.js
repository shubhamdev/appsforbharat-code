export const deepCopyData = (data) => {
  const copy = JSON.stringify(data);
  return JSON.parse(copy);
};

export const updateDeepCopyData = (key, deepCopy, id, data = []) => {
  switch (key) {
    case "completed":
      deepCopy = deepCopy.map((item) => {
        if (item.id === parseInt(id, 10)) {
          item.isCompleted = true;
        }
        return item;
      });
      return deepCopy;
    case "updateRecord":
      deepCopy = deepCopy.map((item) => {
        data &&
          data.map((j) => {
            if (j.id === item.id) {
              item = j;
            }
          });
        return item;
      });
      return deepCopy;
    case "swap":
      return data;
    default:
      return deepCopy;
  }
};

export const swapData = (arr, from, to) => {
  const aux = arr[from];
  arr[from] = arr[to];
  arr[to] = aux;
  return arr;
};

// Find index of element in given array
export const findIndexOf = (data, index) => {
  return data.findIndex(
    (item) => item.title.toLowerCase() === index.toLowerCase()
  );
};
