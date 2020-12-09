import React, { Component } from 'react';
import Clarifai from 'clarifai';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognitionBox from './components/FaceRecognitionBox/FaceRecognitionBox';
import './App.css';

const app = new Clarifai.App({
 apiKey: "d26d7777ff434196a6e23a21277cc1fe",
  // apiKey: "e80301fd2e9743fe9576acb4a154a234"
  // apiKey: "dcb17e67f7554a479980dd50e643b6cd"
});

const particlesOptions = {
  particles: {
    number: {
      value: 70,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

const initialState = {
        input: '',
        imageUrl: '',
        box: {},
        route: 'signin',
        isSignedIn: false,
        user: {
          id: '',
          name: '',
          email: '',
          password: '',
          entries: 0,
          joined: ''
        }
      }

class App extends Component {
  constructor(){
    super()
      this.state = initialState;
    }
/*
    componentDidMount(){
      fetch('http://localhost:3000')
      .then(response => response.json())
      .then(console.log)
    }
  */

    calculateFaceLocation = (data) => {
      const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
      const image = document.getElementById('inputImage');
      const width = Number(image.width);
      const height = Number(image.height);
      return {
        leftCol : clarifaiFace.left_col * width,
        topRow : clarifaiFace.top_row * height,
        rightCol : width - (clarifaiFace.right_col * width),
        bottomRow : height - (clarifaiFace.bottom_row * height)
      }
    }

    loadUser = (data) => {
      this.setState({ user: {
        id: data.id,
        name: data.name,
        email: data.email,
        password: data.password,
        entries: data.entries,
        joined: data.joined
      }})
    }

    displayFaceBox = (box) => {
      this.setState({box : box});
    }

    onInputchange = (event) => {
      this.setState({input: event.target.value})
    }
    onButtonsubmit = () => {
      this.setState({imageUrl: this.state.input})
      app.models.predict(Clarifai.FACE_DETECT_MODEL,     // GENERAL_MODEL
      this.state.input)
      .then((response) => {
        if (response) {
          fetch('https://rocky-garden-97196.herokuapp.com/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
            id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, {entries: count}))
          })
          .catch(console.log);
        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch((err) => {
       console.log(err);
      });
       
    }
    onRoutechange = (route) => {
      if (route === 'signout') {
        this.setState(initialState)
      }else if (route === 'home'){
        this.setState({isSignedIn: true})
      }
      this.setState({route: route})
    }

  render(){
    return (
    <div className="App">
      <Particles className='particles' params = { particlesOptions } />
      <Navigation isSignedIn = {this.state.isSignedIn} onRoutechange = {this.onRoutechange} />
      { this.state.route === 'home'
      ? <div>
        <Logo />
        <Rank name={this.state.user.name} entries={this.state.user.entries}/>
        <ImageLinkForm 
          onInputchange = {this.onInputchange} 
          onButtonsubmit = {this.onButtonsubmit}/>
        <FaceRecognitionBox box = {this.state.box} imageUrl = {this.state.imageUrl}/>
        </div>
        : (
            this.state.route === 'signin'
            ? <Signin loadUser={this.loadUser} onRoutechange = {this.onRoutechange} />
            : <Register loadUser = {this.loadUser} onRoutechange = {this.onRoutechange} />
          )
      }
    </div>
  );
  }
}
export default App;
