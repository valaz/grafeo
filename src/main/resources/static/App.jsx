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

class IndicatorTable extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const indicators = this.props.indicators.map(indicator =>
            <Indicator key={indicator._links.self.href} indicator={indicator}
                       deleteIndicator={this.props.deleteIndicator}/>
        );
        return (
            <div className="container">
                <table className="table table-striped">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Delete</th>
                    </tr>
                    </thead>
                    <tbody>{indicators}</tbody>
                </table>
            </div>
        );
    }
}

class Indicator extends React.Component {
    constructor(props) {
        super(props);
        this.deleteIndicator = this.deleteIndicator.bind(this);
    }

    deleteIndicator() {
        this.props.deleteIndicator(this.props.indicator);
    }

    render() {
        return (
            <tr>
                <td>{this.props.indicator.name}</td>
                <td>
                    <button className="btn btn-info" onClick={this.deleteIndicator}>Delete</button>
                </td>
            </tr>
        );
    }
}

ReactDOM.render(<App/>, document.getElementById('root'));