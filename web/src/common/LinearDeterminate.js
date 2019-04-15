import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

const styles = {};
const interval = 500;

class LinearDeterminate extends React.Component {
    state = {
        completed: 0
    };

    componentDidMount() {
        this.timer = setInterval(this.progress, interval);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    progress = () => {
        const {completed} = this.state;
        if (completed === 99) {
            this.setState({completed: 99});
        } else {
            const diff = 100 * interval / (this.props.timeout);
            this.setState({completed: Math.min(completed + diff, 99)});
        }
    };

    render() {
        return (
            <LinearProgress color="secondary" variant="determinate" value={this.state.completed}/>
        );
    }
}

export default withStyles(styles)(LinearDeterminate);
