import { GET_POSTED_CONFERENCES } from "./actionTypes";

export const getAllPosted = (conference) => {
    return {
      type: GET_POSTED_CONFERENCES,
      payload: conference,
    };
};