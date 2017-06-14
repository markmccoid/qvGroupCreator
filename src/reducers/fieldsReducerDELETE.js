import { LOAD_ANALYTIX_FIELDS } from '../actions';

export const fieldsReducer = (state = [], action) => {
	switch (action.type) {
		case LOAD_ANALYTIX_FIELDS:
			return (action.fieldsArray);

		default:
			return state;
	}
};
