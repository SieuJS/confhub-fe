import { GET_NOTES } from "./actionTypes";

export const getNotes = (data) => {
    return {
        type: GET_NOTES,
        payload: data,
      };
}