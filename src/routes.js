import React from 'react';
import {Route} from 'react-router-dom';
import IndexPage from './IndexPage';
import SearchResults from './SearchResults';

const Routes = () => {
    return (
        <div>
            <Route exact path='/' component={IndexPage} />
            <Route exact path='/SearchResults' component={SearchResults} />
        </div>
    )
};

export default Routes;