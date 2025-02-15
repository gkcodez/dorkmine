const saveToLocalStorage = (key: string, value: any) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(value));
    }
  };

  
  const getFromLocalStorage = (key: string) => {
    if (typeof window !== "undefined") {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : null;
    }
    return null;
  };
  
  export {getFromLocalStorage, saveToLocalStorage}