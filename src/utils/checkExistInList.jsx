const isObjectInList = (id, list) => {
  
    const result = list.some(item => item.id === id);
    return result
  };

export {isObjectInList}