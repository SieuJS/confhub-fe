import { GET_NOTIFICATIONS } from "./actionTypes";

export const getNotifications = (data) => {
    return {
        type: GET_NOTIFICATIONS,
        payload: data,
      };
}