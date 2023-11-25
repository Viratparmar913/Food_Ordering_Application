
import React from 'react';
import homepageimg from '../assets/wallpaper.png';
import logo from '../assets/logo.png';
import breakfast from '../assets/breakfast.png'
import axios from  'axios';
import { withRouter } from 'react-router-dom';
import '../styles/header.css';
import 'bootstrap/dist/css/bootstrap.css';
import Modal from 'react-modal';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        border: 'solid 2px tomato'
    }
};

class Wallpaper extends React.Component {
    constructor() {
        super();
        this.state = {
            suggestions: [],
            text: '',
            restaurants: [],
            isModalOpen: false,
            isSigninModalOpen: false,
            email: '',
            password: '',
            firstname: '',
            lastname: '',
            isLoggedIn: false
        };
    }

    componentDidMount() {

    }

    handleChange = (event) => {
        const cityId = event.target.selectedOptions[0].value;
        sessionStorage.setItem("city", cityId);
        axios({
            method: 'GET',
            url: `http://localhost:5000/api/getRestaurantsByCity/${cityId}`,
            headers: { 'Content-Type': 'application/json' }
        }).then(result => {
            this.setState({
                restaurants: result.data.restaurants
            });
        }).catch(error => {
            console.log(error)
        });
    }

    onTextChanged = (event) => {

        const searchInput = event.target.value;

        const { restaurants } = this.state;

        let suggestions = [];

        if (searchInput.length > 0) {
            suggestions = restaurants.filter(
                item => item.name.toLowerCase().includes(searchInput.toLowerCase())
            );
        }

        this.setState({
            suggestions,
            text: searchInput
        });
    }

    renderSuggestions = () => {
        const { suggestions } = this.state;
        if (suggestions.length == 0) {
            return null;
        }
        return (
            <ul className="suggestionsBox">
                {
                    suggestions.map((item, index) => {
                        return (
                            <li key={index} onClick={() => this.selectRestaurant(item)} value={item}>{  `${item.name}, ${item.city}`  }</li>
                        )
                    })
                }
            </ul>
        )
    }

    selectRestaurant = (item) => {
      
        this.props.history.push(`/restaurant?id=${item._id}`)
    }
    handleChangeheader = (event, stateVariable) => {
        this.setState({
            [stateVariable]: event.target.value
        });
    }

    signUpHandler = (event) => {
        const { 
            email,
            password,
            firstname,
            lastname
        } = this.state;

        const signUpRequestObj = {
            email: email,
            password: password,
            firstname: firstname,
            lastname: lastname
        }
        axios({
            method: 'POST',
            url: 'http://localhost:5000/api/signup',
            headers: {'Content-Type': 'application/json'},
            data: signUpRequestObj
        }).then(
            response => {
                if (response.data.message == 'User signed up successfully !') {
                    this.setState({
                        isModalOpen: false,
                        email: '',
                        password: '',
                        firstname: '',
                        lastname: ''
                    });
                    alert(response.data.message);
                }
            }
        ).catch(
            error => {
                console.log(error);
                alert(error);
            }
        )
    }

    loginHandler = (event) => {
        const { 
            email,
            password
        } = this.state;

        const loginRequestObj = {
            email: email,
            password: password
        }
        axios({
            method: 'POST',
            url: 'http://localhost:5000/api/login',
            headers: {'Content-Type': 'application/json'},
            data: loginRequestObj
        }).then(
            response => {
                if (response.data.user.length >= 1) {
                    this.setState({
                        isSigninModalOpen: false,
                        email: '',
                        password: '',
                        isLoggedIn: response.data.isAuthenticated,
                        firstname: response.data.user[0].firstname
                    });
                    sessionStorage.setItem('isLoggedIn', response.data.isAuthenticated);
                }
            }
        ).catch(
            error => {
                console.log(error);
                alert(error);
            }
        )
    }

    cancelHandler = (event) => {
        this.setState({
            isModalOpen: false,
        });
    }

    signUpOpenHandler = (event) => {
        this.setState({
            isModalOpen: true,
        });
    }

    signInOpenHandler = (event) => {
        this.setState({
            isSigninModalOpen: true,
        })
    }

    cancelLoginHandler = (event) => {
        this.setState({
            isSigninModalOpen: false,
        })
    }

    logoutHandler = (event) => {
        this.setState({
            firstname: '',
            isLoggedIn: false
        });
        sessionStorage.setItem('isLoggedIn', false);
    }
    render() {
        const { cities } = this.props;
        const { text } = this.state;
        const { 
            isModalOpen,
            isSigninModalOpen,
            email,
            password,
            firstname,
            lastname,
            isLoggedIn
         } = this.state;
        return (
            <React.Fragment>
                <img src={homepageimg} alt="" style={{ width: '100%', height: '450px', margin: 'auto' }} />
               <div> 
                <div className="head">
                
               
                    {
                        isLoggedIn 
                        ? 
                        <div>
                            <span>{firstname}</span>
                            <button className="btn btn-sm btn-primary ml-3" onClick={this.logoutHandler}>Logout</button>
                        </div>
                        :
                        <div>
                            <button className="btn btn-sm text-white" onClick={this.signInOpenHandler}>Login</button>
                            <button className="btn default btn-sm text-white" onClick={this.signUpOpenHandler}>Create an account</button>
                        </div>
                    }
                </div>
                <Modal 
                    isOpen={isModalOpen}
                    style={customStyles}>
                    <div>
                        <h3>Signup User</h3>
                        <div>
                            <span>Email : </span>
                            <input type="text" value={email} onChange={(event) => this.handleChangeheader(event, 'email')}></input>
                        </div>
                        <div>
                            <span>Password : </span>
                            <input type="password" value={password} onChange={(event) => this.handleChangeheader(event, 'password')}></input>
                        </div>
                        <div>
                            <span>First Name : </span>
                            <input type="text" value={firstname} onChange={(event) => this.handleChangeheader(event, 'firstname')}></input>
                        </div>
                        <div>
                            <span>Last Name : </span>
                            <input type="text" value={lastname} onChange={(event) => this.handleChangeheader(event, 'lastname')}></input>
                        </div>
                        <button onClick={this.signUpHandler} class="btn btn-sm btn-primary">Signup</button>
                        <button onClick={this.cancelHandler} class="btn btn-sm btn-primary">Cancel</button>
                    </div>
                </Modal>
                <Modal
                    isOpen={isSigninModalOpen}
                    style={customStyles}>
                    <div>
                        <h3>Login User</h3>
                        <div>
                            <span>Email : </span>
                            <input type="text" value={email} onChange={(event) => this.handleChangeheader(event, 'email')}></input>
                        </div>
                        <div>
                            <span>Password : </span>
                            <input type="password" value={password} onChange={(event) => this.handleChangeheader(event, 'password')}></input>
                        </div>
                        <button onClick={this.loginHandler} class="btn btn-sm btn-primary">Login</button>
                        <button onClick={this.cancelLoginHandler} class="btn btn-sm btn-primary">Cancel</button>
                    </div>
                </Modal>
            </div>
                
                <div>
                    <div className="logo">
                    <img src={logo} alt="" className="im" />
                    </div>
                    <div className="headings">
                        Find the best restaurants, cafes, bars
                    </div>
                    <div className="locationSelector">
                        <select className="locationDropdown" onChange={this.handleChange}>
                            <option value="select" selected>Please type a location</option>
                            {
                                cities.map((city, index) => {
                                    return <option key={index} value={city.city_id}>{city.name}</option>
                                })
                            }
                        </select>
                        <div className="suggestions-func">
                           
                            
                            <input className="restaurantsinput" type="text" value={text} placeholder=" Search for restaurants" onChange={this.onTextChanged}/>
                            {
                                this.renderSuggestions()
                            }
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default withRouter(Wallpaper);