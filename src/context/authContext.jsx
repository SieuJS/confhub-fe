import { useReducer, useContext, createContext } from "react"
import appReducer from "../reducers/reducer"
import {initialState} from "../reducers/initState"
const AppContext = createContext()
const AppContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(appReducer, initialState)

    return (
        <AppContext.Provider value = {{state, dispatch}}>
            {children}
        </AppContext.Provider>
    )
}

const useAppContext = () => {
    const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
}

export { AppContextProvider, useAppContext };