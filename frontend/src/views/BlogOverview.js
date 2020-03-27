import React from "react";
import { Container, Row, Col } from "shards-react";

import PageTitle from "./../components/common/PageTitle";
import SmallStats from "./../components/common/SmallStats";
import Discussions from "./../components/blog/Discussions";
import { connect } from 'react-redux';
import { FETCH_OVERALL_DATA, FETCH_COUNTRYWISE_DATA, FETCH_TWEET_DATA } from '../Actions/Actions';
import 'react-notifications/lib/notifications.css';
import { NotificationContainer } from 'react-notifications';
import Loader from 'react-loader-spinner';

class BlogOverview extends React.Component {

  constructor(props) {
    super(props);
    props.getData();

    this.state = {
      overAllData: [{ label: "Corona Virus Cases", value: 0, className: "bg-warning" },
      { label: "Death", value: 0, className: "bg-danger" },
      { label: "Recovered", value: 0, className: "bg-success" },]
    }
  };
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.reducer.overAllData !== this.props.reducer.overAllData) {
      //Perform some operation here
      const { total_cases, total_deaths, new_cases } = this.props.reducer.overAllData;
      this.setState({
        overAllData: [{ label: "Total Cases", value: total_cases, className: "bg-warning text-white text-center" },
        { label: "Death", value: total_deaths, className: "bg-danger text-white text-center" },
        { label: "New Cases", value: new_cases, className: "bg-secondary text-white text-center" },
        ]
      })
    }
  };

  render() {
    return (
      <Container fluid className="main-content-container px-4">
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <div>Aggregated dashboard for seeing twitter data for helping everyone fighting COVID-19. The counts shown are sourced from
    ECDC and was updated on {this.props.reducer.createdDate && new Date(this.props.reducer.createdDate).toLocaleDateString()}</div>
        </Row>
        {/* Small Stats Blocks */}
        <Row>
          {this.state.overAllData.map((stats, idx) => (
            <Col className="col-lg mb-4" sm="12" key={idx} {...stats.attrs}>
              <SmallStats
                id={`small-stats-${idx}`}
                variation="1"
                label={stats.label}
                value={stats.value}
                className={stats.className}
              />
            </Col>
          ))}
        </Row>
          <div>{this.props.reducer.category.replace(/_/g, " ")}</div>
        <Row>
          {/* Top Referrals
      <Col lg="3" md="12" sm="12" className="mb-4">
        <TopReferrals />
      </Col> */}
          {/* Discussions */}
          <Col lg="12" md="12" sm="12" className="mb-4">
            {this.props.reducer.spinner && <div
              style={{
                width: "100%",
                height: "100",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Loader type="ThreeDots" color="#2BAD60" height= '100' width='100' />
            </div>}
            <Discussions />
          </Col>

        </Row>
        <NotificationContainer />
      </Container>
    );
  };
}
export const mapStateToProps = (state) => {
  return {
    reducer: state
  }
}


export const mapDispatchToProps = (dispatch) => {
  return {
    getData: () => {
      dispatch({ type: FETCH_COUNTRYWISE_DATA })
      dispatch({ type: FETCH_OVERALL_DATA })
    }
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(BlogOverview);
