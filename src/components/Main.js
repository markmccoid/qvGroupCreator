import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch, withRouter } from 'react-router-dom';


//Import Components
import Navbar from './Navbar';
import MainDisplay from './MainDisplay';
import ExportContainer from './export/ExportContainer';
import SettingsContainer from './settings/SettingsContainer';
//import the clearApplicationState action creator
import { clearApplicationState } from '../actions';

//Higher Order Component that will clear application state
//whenever WrappedComp is mounted.  This ensures that when switching
//to different routes we clear out appstate and group state.
const ClearAppStateHOC = (WrappedComp, dispatch) => {
	return class  extends React.Component{
			componentWillMount() {
				//Dispatch Clear Application action creator
				dispatch(clearApplicationState());
			}
			render() {
				return <WrappedComp {...this.props} />;
			}
	}
};


const Main = (props) => {
	return (
		<div>
			<Navbar user={props.user}/>
			<Switch>
				<Route path="/settings" component={ClearAppStateHOC(SettingsContainer, props.dispatch)} />
				<Route path="/export" component={ClearAppStateHOC(ExportContainer, props.dispatch)} />
				<Route path="/" component={ClearAppStateHOC(MainDisplay, props.dispatch)} />
			</Switch>
		</div>
	);
};

export default withRouter(connect(state => ({user: state.applications.user}))(Main));
