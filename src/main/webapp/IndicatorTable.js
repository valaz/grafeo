import React from "react";
import Indicator from './Indicator'


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
            <table className="table table-striped">
                <thead>
                <tr>
                    <th>Name!</th>
                    <th>Delete!</th>
                </tr>
                </thead>
                <tbody>{indicators}</tbody>
            </table>
        );
    }
}

export default IndicatorTable;