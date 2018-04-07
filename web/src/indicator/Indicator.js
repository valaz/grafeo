import React, {Component} from 'react';
import './Indicator.css';
import {withRouter} from "react-router-dom";
import {ContentCopy, EventNote} from '@material-ui/icons';
import StatsCard from "../components/Cards/StatsCard";
import {Grid} from "material-ui";
import moment from "moment";


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

    render() {
        if (this.state.isDeleted) {
            return null;
        }

        let {records} = this.state;
        let lastRecord = records[records.length - 1];
        moment(lastRecord.date, 'YYYY-MM-DD');
        let dateDescription = moment(lastRecord.date, 'YYYY-MM-DD').fromNow();
        return (
            <Grid item xs={12} sm={6} md={4}>
                <span onClick={this.handleView}>
                <StatsCard item
                           icon={ContentCopy}
                           iconColor="green"
                           title={this.props.indicator.name}
                           description={lastRecord.value}
                           small="GB"
                           statIcon={EventNote}
                           statIconColor="gray"
                           statText={dateDescription}
                />
                    </span>
            </Grid>
        )
    }
}

export default withRouter(Indicator);