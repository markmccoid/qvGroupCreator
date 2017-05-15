import { LOAD_APPLICATION_LIST,
 				 SET_SELECTED_APPLICATION,
				 LOAD_ANALYTIX_FIELDS
			 } from '../actions';

export const appStateReducer = (state = {}, action) => {
	switch (action.type) {
		case LOAD_APPLICATION_LIST:
			return { ...state,
				applicationList: action.appList
			};
		case SET_SELECTED_APPLICATION:
			return {
				...state,
				selectedApplication: action.appName
			};
		case LOAD_ANALYTIX_FIELDS:
			return {
				...state,
				selectedApplicationFields: action.fieldsArray
			}
		default:
			return state;
	}
};
