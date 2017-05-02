import React from 'react';
import PropTypes from 'prop-types';

const AppSidebar = (props) => {

	return (
		<ul>
			{props.applicationList.map(appName => {
				return (
					<li key={appName}>
						<a onClick={() => {
								props.onLoadApplication(appName);
							}}>{appName}</a>
					</li>
				)
			})}
		</ul>
	)
};

AppSidebar.propType = {
	applicationList: PropTypes.array,
	onLoadApplication: PropTypes.func
};

export default AppSidebar;
