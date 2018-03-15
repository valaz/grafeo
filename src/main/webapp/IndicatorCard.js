import React from "react";

class IndicatorCard extends React.Component {
    constructor(props) {
        super(props);
        this.deleteIndicator = this.deleteIndicator.bind(this);
    }

    deleteIndicator() {
        this.props.deleteIndicator(this.props.indicator);
    }

    render() {
        return (
            <div className="col-md-4">
                <div className="card mb-4 box-shadow">
                    <img className="card-img-top" src={"https://loremflickr.com/320/240?random="+(Math.random() * 100)} alt="Card image cap"/>
                        <div className="card-body">
                            <p className="card-text">{this.props.indicator.name}</p>
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="btn-group">
                                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={this.deleteIndicator}>Delete</button>
                                    <button type="button" className="btn btn-sm btn-outline-info">View</button>
                                </div>
                                <small className="text-muted">{Math.round(Math.random() * 10)} mins</small>
                            </div>
                        </div>
                </div>
            </div>
        );
    }
}

export default IndicatorCard;