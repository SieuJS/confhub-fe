

const useSessionStorage = () => {

  // Lưu danh sách vào Storage
  const saveListToStorage = (storageName, list) => {
    sessionStorage.set(storageName, JSON.stringify(list))
  };
  // Thêm một mục mới vào danh sách
  const updateDataListInStorage = (storageName, addedList) => {
    sessionStorage.setItem(storageName, JSON.stringify(addedList));
};


  const getDataListInStorage = (storageName) => {
    const storageData = sessionStorage.getItem(storageName); // Lấy dữ liệu từ sessionStorage dựa trên storageName
    return storageData ? JSON.parse(storageData) : []; 
  }
  return {
    saveListToStorage,
    updateDataListInStorage,
    getDataListInStorage
  }
}

export default useSessionStorage