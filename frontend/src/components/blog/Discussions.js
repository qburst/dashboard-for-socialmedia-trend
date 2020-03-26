import React from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  ButtonGroup,
  Button,
  Row,
  Col
} from "shards-react";
import Pagination from "../pagination/pagination";
import { connect } from 'react-redux';
import { REPORT_SPAM, FETCH_TWEET_DATA, FETCH_TWEET_DATA_CATEGORY_WISE } from '../../Actions/Actions';
import { NotificationManager} from 'react-notifications';


class Discussions extends React.Component {
  constructor(props) {
    super(props);
    props.fetchTweets(1);
    this.state = {
      tweets: this.props.tweets,
      pageOfItems: []
  };

  // bind function in constructor instead of render (https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-bind.md)
  this.onChangePage = this.onChangePage.bind(this);
  this.fetchDataFromAPI = this.fetchDataFromAPI.bind(this);
  }
  componentDidUpdate(prevProps, prevState) {
    if(prevProps.tweets!==this.props.tweets){
      this.setState({tweets: this.props.tweets});
    }
  };
  onChangePage(pageOfItems) {
    // update state with new page of items
    this.setState({ pageOfItems: pageOfItems });
  };
  fetchDataFromAPI(page) {
    if(this.props.category === 'DASHBOARD'){
      this.props.fetchTweets(page);
    }else{
      this.props.fetchTweetsCategoryWise(this.props.category, page);
    }
  }
  reportSpam(id){
    this.props.reportSpam(id);
    if(!this.props.spinner && this.props.isSpamReportSuccess){
      NotificationManager.success('Spam count is updated', 'Reported Spam Successfully');
    }
    else if(!this.props.spinner && !this.props.isSpamReportSuccess){
      NotificationManager.error('You have already mark this as spam', 'Reported Spam Error');
    }
    const removedList = this.state.pageOfItems.filter((item) => item.id !== id);
    this.setState({tweets: removedList});
  }
  toggleExpand(id){   
    var selectedTweet = this.state.pageOfItems[id];
    selectedTweet.expanded = !selectedTweet.expanded;
    this.setState({pageOfItems: this.state.pageOfItems});
  }

  render() {
    return (
      <Card small className="blog-comments">
    <CardHeader className="border-bottom">
      <h6 className="m-0">{this.props.title}</h6>
    </CardHeader>

    <CardBody className="p-0">
      {this.state.pageOfItems.map((tweet, idx) => (
        <div key={idx} className="blog-comments__item d-flex p-3 ${discussion.expanded ? 'expand' : ''}" >
          {/* Avatar
          <div className="blog-comments__avatar mr-3">
            <img src={discussion.author.image} alt={discussion.author.name} />
          </div> */}

          {/* Content */}
          <div className="blog-comments__content">
            {/* Content :: Title */}
            <div className="blog-comments__meta text-mutes">
              <a className="text-secondary" href={tweet.url}>
                {tweet.url}
              </a>{" "}
              <div style={{display: "inline",position:"absolute", right: "25px"}}>Posted on{" "}
              {/* <a className="text-secondary" href={discussion.post.url}>
                {discussion.post.title}
              </a> */}
              <span className="text-mutes">- {new Date(tweet.created_at).toLocaleDateString()}</span></div>
            </div>

            {/* Content :: Body */}
            <p className="m-0 my-1 mb-2 text-muted"  onClick={() =>this.toggleExpand(idx)}>{tweet.text}</p>

            {/* Content :: Actions */}
            <div className="blog-comments__actions">
              <ButtonGroup size="sm">
                <Button theme="white" onClick={()=>this.reportSpam(tweet.id)}>
                  <span className="text-danger">
                    <i className="material-icons">clear</i>
                  </span>{" "}
                  Report Spam
                </Button>
              </ButtonGroup>
            </div>
          </div>
        </div>
      ))}
    </CardBody>

    <CardFooter className="border-top">
      <Row>
        <Col className="text-center view-report">
        {this.state.tweets && <Pagination items={this.state.tweets} onChangePage={this.onChangePage} count={this.props.tweetCount}
          fetchFromAPI={this.fetchDataFromAPI} category={this.props.category}/>}
        </Col>
      </Row>
    </CardFooter>
  </Card>
    )}
}

Discussions.propTypes = {
  /**
   * The component's title.
   */
  title: PropTypes.string,
  /**
   * The discussions dataset.
   */
  tweets: PropTypes.array
};

Discussions.defaultProps = {
  title: "Tweets",
}

export const mapStateToProps = (state)=>{
  console.log(state,'state')
  return{
    isSpamCountUpdated: state.isSpamCountUpdated,
    tweets: state.tweetData.results,
    category: state.category,
    spamMessage: state.spamMessage,
    tweetCount: state.tweetData.count
  }
}
export const mapDispatchToProps = (dispatch)=>{
  return{
      reportSpam:(id)=>{
        console.log('dis')
        dispatch({
          type:REPORT_SPAM,
          id})
      },
      fetchTweets:(page)=>{
          console.log('fetchTweets')
      dispatch({type:FETCH_TWEET_DATA,page })
      },
      fetchTweetsCategoryWise: (category,page) => {
        console.log('fetchTweetsCategoryWise')
        dispatch({
          type: FETCH_TWEET_DATA_CATEGORY_WISE,
          category,
          page
        })
      },
  }
      
}

export default connect( mapStateToProps, mapDispatchToProps )(Discussions);

