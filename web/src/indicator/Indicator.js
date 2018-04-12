import React, {Component} from 'react';
import './Indicator.css';
import {NavLink, withRouter} from "react-router-dom";
import {EventNote, Timeline} from '@material-ui/icons';
import StatsCard from "../components/Cards/StatsCard";
import {Grid, withStyles} from "material-ui";
import moment from "moment";
import {injectIntl} from "react-intl";
import {getRandomColorName} from "../util/Colors";

const styles = {
    link: {
        textDecoration: 'none'
    }
};

class Indicator extends Component {
    constructor(props) {
        super(props);
        this.handleView = this.handleView.bind(this);
    }

    componentWillMount() {
        this.setState({
            records: this.props.indicator.records,
            isDeleted: false,
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

    getDateDescription(records) {
        if (records.length === 0) {
            return this.props.intl.formatMessage({id: 'indicatorList.card.noData'})
        }

        let lastRecord = records[records.length - 1];
        let date = lastRecord.date;
        let lastRecordDate = moment(date, 'YYYY-MM-DD');
        const now = moment().startOf('day');

        const daysDiff = lastRecordDate.diff(now, 'days');
        let prefix = this.props.intl.formatMessage({id: 'indicatorList.card.lastChanged'}) + ': ';
        if (daysDiff < 0) {
            if (daysDiff === -1) {
                return prefix + this.props.intl.formatMessage({id: 'indicatorList.card.yesterday'});
            }
            return prefix + lastRecordDate.from(now);
        } else {
            return prefix + this.props.intl.formatMessage({id: 'indicatorList.card.today'});
        }

    }

    render() {
        if (this.state.isDeleted) {
            return null;
        }
        let {indicator} = this.props;
        let {records} = this.state;

        let dateDescription = this.getDateDescription(records);

        let valueDescription;
        if (records.length > 0) {
            let lastRecord = records[records.length - 1];
            valueDescription = this.props.intl.formatNumber(lastRecord.value);
        } else {
            valueDescription = '-';
        }

        let unit = '';
        if (indicator.unit) {
            unit = indicator.unit;
        }

        const {classes} = this.props;
        return (
            <Grid item xs={12} sm={6} lg={4}>
                <NavLink to={"/indicator/" + this.props.indicator.id}
                         className={classes.link}>
                    <StatsCard item
                               icon={Timeline}
                               iconColor={getRandomColorName(indicator.name)}
                               title={this.props.indicator.name}
                               description={valueDescription}
                               small={unit}
                               statIcon={EventNote}
                               statIconColor="gray"
                               statText={dateDescription}
                    />
                </NavLink>
            </Grid>
        )
    }
}

export default injectIntl(withRouter(withStyles(styles)(Indicator)));