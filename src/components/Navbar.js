import React from 'react';



var Navbar = (props) => {
	return (
	  <header className="header-container">
			<div className="head-col1-container">
	        <div className="header-image">
	          <img src="./images/cyclicgroup.png" />
						<h4>Group Creator</h4>
	        </div>

					{
	        // <div className="header-search">
	        //   <input type="text" name="search" id="search" />
	        // </div>
					}
	    </div>

			<div className="head-col2-container">
				<ul className="header-menu header-menu-left">
					<li><a to="/main" >Home</a></li>
		      <li><a to="/" >Login Mock</a></li>
				</ul>

				<ul className="header-menu header-menu-right">
					<li><a href="#" ></a></li>

				</ul>
	    </div>
	  </header>
	);
};

// Navbar.propTypes = {
// 	onLogout: React.PropTypes.func,
// 	isLoggedIn: React.PropTypes.bool
// };

export default Navbar;
