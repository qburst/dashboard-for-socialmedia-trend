import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import shortid from "shortid";
import { Card, CardBody } from "shards-react";

import Chart from "../../utils/chart";

class SmallStats extends React.Component {


  render() {
    const { variation, label, value, className } = this.props;

    const cardClasses = classNames(
      "stats-small",
      variation && `stats-small--${variation}`
    );

    const cardBodyClasses = classNames(
      variation === "1" ? "p-0 d-flex" : "px-0 pb-0"
    );

    const innerWrapperClasses = classNames(
      "d-flex",
      variation === "1" ? "flex-column m-auto" : "px-3"
    );

    const dataFieldClasses = classNames(
      "stats-small__data",
      variation === "1" && "text-center"
    );

    const labelClasses = classNames(
      "page-title",
      "text-uppercase",
      "px-3",
      variation !== "1" && "mb-1"
    );

    const valueClasses = classNames(
      "stats-small__value",
      "count",
      variation === "1" ? "my-3" : "m-0"
    );
    const iconClasses = classNames(
      "widget-small",
      "primary",
      "card-header",
      className
    );


    return (
      <Card small className={cardClasses}>
        <div className={iconClasses}><i className="icon fa fa-users fa-3x"></i><span className={labelClasses}>{label}</span></div>
        <CardBody className={cardBodyClasses}>
          <div className={innerWrapperClasses}>
            <div className={dataFieldClasses}>
              <h6 className={valueClasses}>{value}</h6>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }
}

SmallStats.propTypes = {
  /**
   * The Small Stats variation.
   */
  variation: PropTypes.string,
  /**
   * The label.
   */
  label: PropTypes.string,
  /**
   * The value.
   */
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

};

SmallStats.defaultProps = {
  value: 0,
  label: "Label"
};

export default SmallStats;
