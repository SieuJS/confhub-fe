const getIdFromPathname = (pathname) => {
  return pathname.split('/').pop();
  };

export {getIdFromPathname}