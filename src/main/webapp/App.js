import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'toastr/build/toastr.min.css';
import toastr from 'toastr';
import IndicatorTable from './IndicatorTable'

class App extends React.Component {

    constructor(props) {
        super();
        this.deleteIndicator = this.deleteIndicator.bind(this);

        this.state = {
            indicators: [],
        }

    }

    loadIndicatorsFromServer() {
        fetch('/api/indicators')
            .then((response) => response.json())
            .then((responseData) => {
                this.setState({
                    indicators: responseData._embedded.indicators,
                });
            });
    }

    componentDidMount() {
        this.loadIndicatorsFromServer();
    }

    deleteIndicator(indicator) {
        fetch(indicator._links.self.href,
            {method: 'DELETE',})
            .then(
                () => {
                    toastr.warning("Deleted");
                    this.loadIndicatorsFromServer();
                }
            )
            .catch(err => console.error(err))
    }

    render() {
        return (<IndicatorTable indicators={this.state.indicators} deleteIndicator={this.deleteIndicator}/>);
    }
}


ReactDOM.render(<App/>, document.getElementById('root'));