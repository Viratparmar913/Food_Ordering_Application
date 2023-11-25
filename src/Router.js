import{Route, BrowserRouter} from 'react-router-dom';
import Home from './components/Home';
import Restaurant from './components/Restaurant';
import Filter from './components/Filter';

import Transaction from './components/Transaction';

const Router = () => {
    return(
        <BrowserRouter>
    
        <Route exact path="/" component={Home} />
        <Route path="/home" component={Home} /> 
         <Route path="/filter" component={Filter} />
        <Route path="/restaurant" component={Restaurant} />
        <Route path="/transaction" component={Transaction} />
    
</BrowserRouter>
    )
}

export default Router;