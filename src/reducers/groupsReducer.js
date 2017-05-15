import _ from 'lodash';

import { LOAD_APPLICATION_GROUPS,
			 	 UPDATE_GROUP } from '../actions';

export const groupsReducer = (state = [], action) => {
	switch (action.type) {
		case LOAD_APPLICATION_GROUPS:
			return (action.groupsArray);
		case UPDATE_GROUP:
			let objIndex = _.findIndex(state, {'id': action.groupObj.id});
			//slice in the updated group
			return [..._.slice(state, 0, objIndex),
							action.groupObj,
							..._.slice(state, objIndex+1)];
		default:
			return state;
	}
};
