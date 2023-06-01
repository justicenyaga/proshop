import httpService from "../../utils/httpService";
import * as actions from "../api";

const api =
  ({ dispatch }) =>
  (next) =>
  async (action) => {
    if (action.type !== actions.apiCallBegun.type) return next(action);

    const { url, method, data, headers, onSuccess, onError, onStart } =
      action.payload;

    if (onStart) dispatch({ type: onStart });
    next(action);

    try {
      const response = await httpService.request({
        url,
        method,
        data,
        headers,
      });

      // General Success
      dispatch(actions.apiCallSuccess(response.data));

      // Specific Success
      if (onSuccess) dispatch({ type: onSuccess, payload: response.data });
    } catch (error) {
      let errorMessage =
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message;

      errorMessage =
        error.response && error.response.data.email
          ? error.response.data.email[0]
          : errorMessage;

      errorMessage =
        error.response && error.response.data.token
          ? error.response.data.token[0]
          : errorMessage;

      errorMessage =
        error.response && error.response.data.non_field_errors
          ? error.response.data.non_field_errors[0]
          : errorMessage;

      errorMessage =
        error.response && error.response.data.current_password
          ? error.response.data.current_password[0]
          : errorMessage;

      errorMessage =
        error.response && error.response.data.new_email
          ? error.response.data.new_email[0]
          : errorMessage;

      errorMessage =
        error.response && error.response.data.new_password
          ? error.response.data.new_password[0]
          : errorMessage;

      // General Error
      dispatch(actions.apiCallFailed(errorMessage));

      // Specific Error
      if (onError) dispatch({ type: onError, payload: errorMessage });
    }
  };

export default api;
