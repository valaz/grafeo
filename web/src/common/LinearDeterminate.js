import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

const styles = {
    root: {
        flexGrow: 1,
    },
    placeholder: {
        height: 40,
    },
};

class LinearDeterminate extends React.Component {
    state = {
        completed: 0
    };

    componentDidMount() {
        this.timer = setInterval(this.progress, 400);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    progress = () => {
        const {completed} = this.state;
        if (completed === 99) {
            this.setState({completed: 99});
        } else {
            const diff = 100*400/(this.props.timeout);
            this.setState({completed: Math.min(completed + diff, 99)});
        }
    };

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <div className={classes.placeholder}>
                    <LinearProgress color="secondary" variant="determinate" value={this.state.completed}/>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(LinearDeterminate);
