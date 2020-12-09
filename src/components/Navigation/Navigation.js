import React from 'react';
import './Navigation.css';

const Navigation = ({ onRoutechange,isSignedIn }) => {
		if (isSignedIn) {
			return(
				<nav style={{display: 'flex' , justifyContent: 'flex-end'}}>
					<p onClick={() => onRoutechange('signout')} className='auth'>Sign Out</p>
				</nav>
			)
		}else{
			return(
				<nav style={{display: 'flex' , justifyContent: 'flex-end'}}>
					<p onClick={() => onRoutechange('signin')} className='auth'>Sign In</p>
					<p onClick={() => onRoutechange('register')} className='auth'>Register</p>
				</nav>
			)
		}
	
}
export default Navigation;

// f2 i link dim black fw5 underline pa3 mt1 mh4 pointer