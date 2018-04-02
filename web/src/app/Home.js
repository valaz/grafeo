import React, {Component} from 'react';
import IndicatorList from "../indicator/IndicatorList";
import {withRouter} from "react-router-dom";


class Home extends Component {

    componentDidMount() {
        document.title = "Progressio";
    }

    render() {
        return <IndicatorList {...this.props}/>
    }
}

export default withRouter(Home);
