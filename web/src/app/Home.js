import React, {Component} from 'react';
import IndicatorList from "../indicator/IndicatorList";
import {withRouter} from "react-router-dom";


class Home extends Component {

    componentWillMount() {
        document.title = "Grafeo";
    }

    render() {
        return <IndicatorList {...this.props}/>
    }
}

export default withRouter(Home);
