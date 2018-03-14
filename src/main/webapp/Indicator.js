import React from "react";

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

export default Indicator;