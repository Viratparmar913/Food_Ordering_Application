import React from 'react';
import '../styles/Restaurant.css';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import queryString from 'query-string';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Modal from 'react-modal';
import Header from './Header';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'lightslategrey',
        border: 'solid 2px tomato'
    }
};
class Restaurant extends React.Component {
    constructor() {
        super();
        this.state = {
            restaurant: {},
            menu: [],
            isModalOpen: false,
            order: []
        };
    }

    componentDidMount() {
        const queryParams = queryString.parse(this.props.location.search);
        const restaurantId = queryParams.id;

        axios({
            method: 'GET',
            url: `http://localhost:5000/api/getRestaurantById/${restaurantId}`,
            headers: { 'Content-Type': 'application/json' }
        }).then(result => {
            this.setState({
                restaurant: result.data.restaurant
            });
        }).catch(error => {
            console.log(error);
        });

        axios({
            method: 'GET',
            url: `http://localhost:5000/api/getMenuForRestaurant/${restaurantId}`,
            headers: { 'Content-Type': 'application/json' }
        }).then(result => {
            this.setState({
                menu: result.data.menu
            });
        }).catch(error => {
            console.log(error);
        });
    }

    handlePlaceOrder = (e) => {
       
        this.setState({
            isModalOpen: true
        });
    }

    cancelPayment = () => {
        this.setState({
            isModalOpen: false
        });
    }

    getData = (data) => {
        return fetch(`http://localhost:5000/api/payment`, {
            method: 'POST',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }).then(response => {
            return response.json();
        }).catch(error => {
            console.log(error);
        });
    }

    obj = (val) => {
        return typeof val === 'object';
    }

    isDate = (val) => {
        return Object.prototype.toString.call(val) === '[object Date]';
    }

    stringifyMyParam = (paramValue) => {
   
        if (this.obj(paramValue) && !this.isDate(paramValue)) {
            return JSON.stringify(paramValue);
        } else {
            return paramValue;
        }
    }

    buildForm = (details) => {
        const { action, params } = details;
    
        const form = document.createElement('form'); 
        form.setAttribute('method', 'post'); 
        form.setAttribute('action', action);

        Object.keys(params).forEach(key => {
            const input = document.createElement('input'); 
            input.setAttribute('type', 'hidden'); 
            input.setAttribute('name', key);
            input.setAttribute('value', this.stringifyMyParam(params[key]));
            form.appendChild(input);
        });

        return form;
    }

    takeMeToPaymentGateway = (details) => {
       
       const form = this.buildForm(details);
       document.body.appendChild(form);
       form.submit();
       form.remove();
    }

    makePayment = (rc) => {
       
        this.getData({
            amount: rc,
            email: '123@gmail.com',
            mobileNo: '9986851333'
        }).then(response => {
            var information = {
                action: "https://securegw-stage.paytm.in/order/process",
                params: response.checkSumResponse
            };
            this.takeMeToPaymentGateway(information);
        }).catch(error => {
            console.log(error);
        });
    }

    render() {
        const { restaurant, isModalOpen, menu } = this.state;
        return (
            <React.Fragment>
                <Header />
                <div className="container mb-5">
                    <img src={restaurant.thumb} alt="restaurant" width="100%" height="500px" className="mt-5"/>
                    <h2 className="mt-3">{restaurant.name}</h2>
                    <div style={{'position': 'absolute', 'right': '160px'}}><button type="button " class="btn btn-danger" onClick={this.handlePlaceOrder}>Place online order</button></div>
                    <div className="mt-3">
                        <Tabs>
                            <TabList>
                                <Tab>Overview</Tab>
                                <Tab>Contact</Tab>
                            </TabList>
                            <TabPanel>
                                <h3>About this place</h3>
                                <h4>Cuisine</h4>
                                <div>
                                    {
                                        restaurant.Cuisine && restaurant.Cuisine.length > 0 
                                        ? 
                                        restaurant.Cuisine.map(item => {
                                            return <span>{ item.name }, </span>
                                        }) 
                                        : 
                                        null
                                    }
                                </div>
                                <h4 className="mt-3">Average Cost</h4>
                                <div>{restaurant.cost}</div>
                            </TabPanel>
                            <TabPanel>
                                <h4>Phone Number</h4>
                                <div>(+91) 14004566 </div>
                                <h4 className="mt-3">Address</h4>
                                <h5>{restaurant.name}</h5>
                                <div>{restaurant.address}</div>
                            </TabPanel>
                        </Tabs>
                        <Modal 
                            isOpen={isModalOpen}
                            style={customStyles}>
                            <div>
                                {
                                    menu.map((item, index) => {
                                        return (
                                            <div className="row">
                                                <div className="col-6" style={{'color': 'white'}}>{item.item}</div>
                                                <div className="col-2" style={{'color': 'white'}}>{item.cost}</div>
                                                <div className="col-4"><button class="btn btn-info" >Add</button></div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className="row mt-3">
                                <div className="float-left">
                                    <h4 className="total">Sub total: {restaurant.cost}</h4>
                                </div>
                                <div className="float-right">
                                    <button onClick={this.cancelPayment} class="btn btn-danger">Cancel</button>
                                    <button onClick={() => this.makePayment(restaurant.cost)}class="btn btn-success">Pay Now</button>
                                </div>
                            </div>
                        </Modal>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default Restaurant;