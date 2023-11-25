import React from 'react';
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

class Details extends React.Component {

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
        // open a modal to show the menu
        this.setState({
            isModalOpen: true
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
                    <div style={{'position': 'absolute', 'right': '160px'}}><button type="button" onClick={this.handlePlaceOrder}>Place online order</button></div>
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
                                <div>(+91) 9986851333</div>
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
                                                <div className="col-4"><button>Add</button></div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className="row mt-3">
                                <div className="float-left">
                                    Sub total: 220
                                </div>
                                <div className="float-right">
                                    <button>Pay Now</button>
                                </div>
                            </div>
                        </Modal>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default Details;

