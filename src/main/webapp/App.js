import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'toastr/build/toastr.min.css';
import toastr from 'toastr';
import IndicatorTable from './IndicatorTable'
import Navbar from './templates/Navbar';
import Footer from './templates/Footer';

class App extends React.Component {

    constructor(props) {
        super(props);
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
        return (
            <div>
                <Navbar/>
                <div className='container'>
                    <IndicatorTable indicators={this.state.indicators} deleteIndicator={this.deleteIndicator}/>
                    <Footer/>
                </div>
            </div>
        );
    }
}

export default App;