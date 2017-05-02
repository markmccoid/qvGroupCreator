import * as api from '../api';

import { LOAD_APPLICATION_LIST, SET_SELECTED_APPLICATION } from './actionTypes';

//-----------------------------------------------
export const loadApplicationList = (appList) => {
	return {
		type: LOAD_APPLICATION_LIST,
		appList
	}
};

export const startLoadApplicationList = () => {
	return dispatch => {
		//Get list of Applications in the QVVariables.json file on server
		const request = api.getApplicationNames();
			request.then(data => {
				dispatch(loadApplicationList(data));
			});
	};
};

export const setSelectedApplication = (appName) => {
	return {
		type: SET_SELECTED_APPLICATION,
		appName
	};
};
