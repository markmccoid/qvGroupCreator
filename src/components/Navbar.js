import React from 'react';
import PropTypes from 'prop-types';

import { NavLink } from 'react-router-dom';

var Navbar = (props) => {
	return (
	  <header className="header-container">
			<div className="head-col1-container">
	        <div className="header-image">
	          <img src="./images/cyclicgroup.png" />
						<h4>Group Editor</h4>
						<h4 style={{color: "red", margin: "0 25px"}}> --> {props.user}</h4>
	        </div>
					{
	        // <div className="header-search">
	        //   <input type="text" name="search" id="search" />
	        // </div>
					}
	    </div>

			<div className="head-col2-container">
				<ul className="header-menu header-menu-left">
					<li>
						<NavLink exact to="/" activeClassName="active">Home</NavLink>
					</li>
		      <li>
						<NavLink to="/settings" activeClassName="active">Settings</NavLink>
					</li>
					<li>
						<NavLink to="/export" activeClassName="active">Export</NavLink>
					</li>
				</ul>

				<ul className="header-menu header-menu-right">
					<li><a href="#" ></a></li>

				</ul>
	    </div>
	  </header>
	);
};

Navbar.propTypes = {
	user: PropTypes.string
};

export default Navbar;
