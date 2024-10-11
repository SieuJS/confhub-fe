import { useState, useCallback, useRef, useEffect } from 'react';

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [stopPending , setStopPending] = useState(false);

  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (url, method = 'GET',  headers = {},body = null) => {
      setIsLoading(true);
      const httpAbortCtrl = new AbortController();
      
      try {
        
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal
        });
        activeHttpRequests.current.push(httpAbortCtrl);
        const responseData = await response.json();
        activeHttpRequests.current = activeHttpRequests.current.filter(
            reqCtrl => reqCtrl !== httpAbortCtrl
          );
        if (!response.ok) {
          throw new Error(responseData.message);
        }

        setIsLoading(false);
        return responseData;
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  const abortAllRequests = () => {
    activeHttpRequests.current.forEach(abortCtrl => {
      try {
          abortCtrl.abort();
      }
      catch (err){
          
      }
  });
  }

  useEffect(() => {
    return  () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      
      activeHttpRequests.current.forEach(abortCtrl => {
        try {
            abortCtrl.abort();
        }
        catch (err){
            
        }
    });
      
    };
  }, []);

  return { isLoading, error, sendRequest, clearError, abortAllRequests };
};
