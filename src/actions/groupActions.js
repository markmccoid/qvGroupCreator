import * as api from '../api';

import { LOAD_APPLICATION_GROUPS,
 				 LOAD_APPLICATION_GROUP_FIELDS,
			 	 UPDATE_GROUP_FIELDS } from './actionTypes';

//-----------------------------------------------
//-LOAD OF GROUPS For an Application
export const loadGroups = groupsArray => {
	return {
		type: LOAD_APPLICATION_GROUPS,
		groupsArray
	};
};

export const startLoadGroups = appName => {
	return dispatch => {
		api.getGroupData(appName)
			.then(data => dispatch(loadGroups(data))
			);
	};
};

//-----------------------------------------------
//-LOAD OF GROUP FIELDS For an Application
export const loadGroupFields = groupFieldsObject => {
	return {
		type: LOAD_APPLICATION_GROUP_FIELDS,
		groupFieldsObject
	};
};

export const startLoadGroupFields = appName => {
	return dispatch => {
		api.getGroupFieldData(appName)
			.then(data => dispatch(loadGroupFields(data))
			);
	};
};

//-----------------------------------------------
//-UPDATE GROUP FIELDS For a single Group
export const updateGroupFields = (groupId, groupFieldObject) => {

	return {
		type: UPDATE_GROUP_FIELDS,
		groupId,
		groupFieldObject
	};
};

export const startUpdateGroupFields = (groupId, groupFieldArray) => {
	return dispatch => {
		api.updateGroupFieldData(groupId, groupFieldArray)
			.then(response => {
				dispatch(updateGroupFields(groupId, groupFieldArray));
			});
	};
};
