import {
				 LOAD_APPLICATION_GROUPS } from '../actions';

export const groupsReducer = (state = [], action) => {
	switch (action.type) {
		case LOAD_APPLICATION_GROUPS:
			return (action.groupsArray);

		default:
			return state;
	}
};
