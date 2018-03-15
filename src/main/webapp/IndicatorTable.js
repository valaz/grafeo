import React from "react";
import IndicatorCard from './IndicatorCard'


class IndicatorTable extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const indicators = this.props.indicators.map(indicator =>
            <IndicatorCard key={indicator._links.self.href} indicator={indicator}
                           deleteIndicator={this.props.deleteIndicator}/>
        );
        return (
            <div className="row">
                {indicators}
            </div>
        );
    }
}

export default IndicatorTable;