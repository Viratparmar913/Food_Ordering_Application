import React from 'react';
import '../styles/Home.css';
import Wallpaper from './Wallpaper';
import QuickSearches from './QuickSearches';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

class Home extends React.Component {
   constructor(){
       super();
       this.state = {
                      cities: [],
                      mealtypes: []
       };
   }
    componentDidMount(){

axios.get('http://localhost:5000/api/CityList').then(result => {
    this.setState({
        cities: result.data.cities
    })
   }).catch(error => {
    console.log(error);
});

axios.get('http://localhost:5000/api/mealList').then(result => {
    this.setState({
        mealtypes: result.data.meals
    })
   }).catch(error => {
    console.log(error);
      });
    }


    render(){
          const {cities, mealtypes} = this.state;
        return(
            <React.Fragment>
             <Wallpaper cities={cities} />
           <QuickSearches mealtypes={mealtypes} />
        </React.Fragment>
        );
    }
}

export default Home;