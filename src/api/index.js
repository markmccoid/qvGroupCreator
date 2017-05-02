import axios from 'axios';
import _ from 'lodash';

export const getApplicationNames = () => {
	return axios.get('/api/groups/app')
		.then(response => response.data)
};

//Get qvGroups.json information from server
const getGroups = appName => {
	return axios.get(`/api/groups/app/${appName}`)
		.then(response => response.data);
};

//Get the group data from qvGroups.json, but do not return the field information
//for the apps groups.
export const getGroupData = appName => {
	return getGroups(appName)
		.then(groupData => {
			//take group data and extract just the group information that we want
			return groupData.map(group => {
				return {
					id: group.id,
					application: group.application,
					groupName: group.groupName,
					groupType: group.groupType,
					groupNotes: group.groupNotes,
					createUser: group.createUser,
					createDate: group.createDate,
					modifyUser: group.modifyUser,
					modifyDate: group.modifyDate
				}
			});
		});
};

//Get the field information for all the groups for the passed appName.
/*
***data before******************:
	[{
		id: 11-11--111,
		fields: [{...}],
		...
	},
	{
		id: 22-22--222,
		fields: [{...}],
		....
	}
	]
	***data after******************:
	{
		11-11--111: [
			{fieldinfo...}
		],
		22-22--222: [
			{fieldinfo...}
		]
	}
*/
export const getGroupFieldData = appName => {
	return getGroups(appName)
		.then(groupData => {
			return _.transform(groupData, (result, value, key) => {
				value.fields.forEach(field => {
					(result[value.id] || (result[value.id] = [])).push(field);
				});
			}, {});
		});
}

export const updateGroupFieldData = (groupId, fieldsArray) => {
	return axios.put(`/api/groups/${groupId}/fields`, {fields: fieldsArray} )
		.then(response => {
			console.log(response);

		});
};


//returns an object containing the fields for the passed appName
export const getAnalytixFields = appName => {
	return axios.get(`/api/analytixfields/${appName}`)
		.then(response => response.data);
}
