import { useAppContext } from "../context/authContext";

const useMessageSocket = () => {
  const { dispatch } = useAppContext()
  
  const handleGetMessageById = (messages, id) => {
    return messages.find(message => message.id === id);
  }

  const handleAddMessageCrawling = (message) => {
    dispatch({ type: 'ADD_MESSAGE', payload: message });
  }
  const handleRemoveCompletedMessage = (id) => {
    dispatch({ type: "REMOVE_MESSAGE", payload: id })
  }
  return {
    handleGetMessageById,
    handleRemoveCompletedMessage,
    handleAddMessageCrawling
  }
}

export default useMessageSocket