import React from 'react';
import Tilt from 'react-tilt';
import brain from './brain.png';
import './Logo.css';

const Logo = () => {
	return(
		<div className='mt0 ma4 '>
			<Tilt className="Tilt br2 shadow-2 " options={{ max : 55 }} 
			style={{ height: 140, width: 140 }} >
 			<div className="Tilt-inner pa3"> 
 			<img alt='logo' src={brain} style={{paddingTop: '6px'}}/> 
 			</div>
			</Tilt>
			
		</div>

	)

}
export default Logo;