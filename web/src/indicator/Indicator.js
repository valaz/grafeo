import React, {Component} from 'react';
import './Indicator.css';
import {NavLink, withRouter} from "react-router-dom";
import {EventNote, Timeline} from '@material-ui/icons';
import StatsCard from "../components/Cards/StatsCard";
import {Grid} from "material-ui";
import moment from "moment";
import {injectIntl} from "react-intl";
import {getRandomColorName} from "../util/Colors";


class Indicator extends Component {
    constructor(props) {
        super(props);
        this.handleView = this.handleView.bind(this);
    }

    componentWillMount() {
        this.setState({
            records: this.props.indicator.records,
            isDeleted: false
        });
    }

    handleView() {
        this.props.history.push("/indicator/" + this.props.indicator.id);
    }

    handleEdit() {
        this.props.history.push("/indicator/edit/" + this.props.indicator.id);
    }

    handleDelete() {
        this.props.handleDelete(this.props.indicator.id);
        this.setState({
            isDeleted: true
        })
    }

    getDateDescription(date) {
        let lastRecordDate = moment(date, 'YYYY-MM-DD');
        const now = moment().startOf('day');
        const daysDiff = lastRecordDate.diff(now, 'days');
        if (daysDiff < 0) {
            if (daysDiff === -1) {
                return this.props.intl.formatMessage({id: 'indicatorList.card.yesterday'});
            }
            return lastRecordDate.from(now);
        } else {
            return this.props.intl.formatMessage({id: 'indicatorList.card.today'});
        }

    }

    render() {
        if (this.state.isDeleted) {
            return null;
        }
        let {indicator} = this.props;
        let {records} = this.state;
        let lastRecord = records[records.length - 1];

        let dateDescription = this.getDateDescription(lastRecord.date);
        return (
            <Grid item xs={12} sm={6} md={4}>
                <NavLink to={"/indicator/" + this.props.indicator.id}
                         style={{textDecoration: 'none'}}>
                    <StatsCard item
                               icon={Timeline}
                               iconColor={getRandomColorName(indicator.name)}
                               title={this.props.indicator.name}
                               description={lastRecord.value}
                               small="GB"
                               statIcon={EventNote}
                               statIconColor="gray"
                               statText={this.props.intl.formatMessage({id: 'indicatorList.card.lastChanged'}) + ': ' + dateDescription}
                    />
                </NavLink>
            </Grid>
        )
    }
}

export default injectIntl(withRouter(Indicator));