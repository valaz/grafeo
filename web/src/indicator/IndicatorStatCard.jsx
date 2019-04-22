import React from "react";
import PropTypes from "prop-types";
import CardIcon from "../custom_components/components/Card/CardIcon";
import CardFooter from "../custom_components/components/Card/CardFooter";
import Card from "../custom_components/components/Card/Card";
import CardHeader from "../custom_components/components/Card/CardHeader";
import DateRange from "@material-ui/icons/DateRange";
import {withStyles} from "@material-ui/core";


import dashboardStyle from "../custom_components/assets/jss/material-dashboard-react/views/dashboardStyle.jsx";

function IndicatorStatCard({...props}) {
    const {
        classes,
        title,
        description,
        small,
        statText,
        iconColor
    } = props;
    return (
        <Card>
            <CardHeader color="warning" stats icon>
                <CardIcon color={iconColor}>
                    <props.icon className={classes.cardIcon}/>
                </CardIcon>
                <p className={classes.cardCategory}>{title}</p>
                <h3 className={classes.cardTitle}>
                    {description}{" "}
                    <small>{small}</small>
                </h3>
            </CardHeader>
            <CardFooter stats>
                <div className={classes.stats}>
                    <DateRange/>
                    {statText}
                </div>
            </CardFooter>
        </Card>
    );
}

IndicatorStatCard.defaultProps = {
    iconColor: "purple",
    statIconColor: "gray"
};

IndicatorStatCard.propTypes = {
    classes: PropTypes.object.isRequired,
    icon: PropTypes.func.isRequired,
    iconColor: PropTypes.oneOf(["orange", "green", "red", "blue", "purple"]),
    title: PropTypes.node,
    description: PropTypes.node,
    small: PropTypes.node,
    statIcon: PropTypes.func.isRequired,
    statIconColor: PropTypes.oneOf([
        "warning",
        "primary",
        "danger",
        "success",
        "info",
        "rose",
        "gray"
    ]),
    statLink: PropTypes.object,
    statText: PropTypes.node
};

export default withStyles(dashboardStyle)(IndicatorStatCard);
