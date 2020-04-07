import React, { Component } from 'react'
import Pagination from "react-js-pagination";
import { connect } from 'react-redux';
import Icon from '@material-ui/core/Icon';
import { REPORT_SPAM, FETCH_TWEET_DATA, FETCH_TWEET_DATA_CATEGORY_WISE } from '../../Actions/Actions';
import { NotificationManager } from 'react-notifications';
import '../../Components/Main/Main.css';
import MyVerticallyCenteredModal from '../Popup/Popup';
import  LandingPage  from '../LandingPage/LandingPage';
import './Tweets.css';
import "bootstrap-less";

class Tweets extends Component {
    constructor(props) {
        super(props);
        props.fetchTweets(1);
        this.state = {
            tweets: this.props.tweets,
            activePage: 1,
            mobileView: false,
            showTweet: true,
            reportingSpam: false,
            showLoginModal: false,
            showPopup: false,
            isSignedIn: sessionStorage.getItem('isLoggedIn')
        };

        this.fetchDataFromAPI = this.fetchDataFromAPI.bind(this);
        this.hideLoginModal = this.hideLoginModal.bind(this);
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.category !== this.props.category) {
            this.setState({ activePage: 1 });
        }
        if (prevProps.tweets !== this.props.tweets) {
            this.setState({ tweets: this.props.tweets });
        }
        if (prevProps.isSpamReportedSuccess !== this.props.isSpamReportedSuccess && this.state.reportingSpam
            && !this.props.spinner) {
            this.showNotification();
        }
        if(prevProps.isSignedIn !== this.props.isSignedIn){
            this.setState({isSignedIn: this.props.isSignedIn});
        }
        window.addEventListener("resize", this.resize.bind(this));
        this.resize();
    };

    showNotification() {
        if (this.props.isSpamReportedSuccess) {
            NotificationManager.success('Spam count is updated', 'Reported Spam Successfully');
        }
        else if (!this.props.isSpamReportedSuccess) {
            NotificationManager.error('You have already mark this as spam', 'Reported Spam Error');
        }
        this.setState({ reportingSpam: false });
    }

    resize() {
        let currentMobileView = (window.innerWidth <= 760);
        if (currentMobileView !== this.state.mobileView) {
            this.setState({ mobileView: currentMobileView });
        }
    }

    fetchDataFromAPI(pageNumber) {
        window.scrollTo(0, window.innerHeight/2);
        this.setState({ activePage: pageNumber });
        if (this.props.category) {
            this.props.fetchTweetsCategoryWise(this.props.category, pageNumber);
        } else {
            this.props.fetchTweets(pageNumber);
        }
    }
    reportSpam(id) {
        if (this.state.isSignedIn) {
            this.setState({ reportingSpam: true });
            this.props.reportSpam(id);
            const removedList = this.state.tweets.filter((item) => item.id !== id);
            this.setState({ tweets: removedList });
        }else{
            this.setState({ showPopup: true});
        }
    }
    hideLoginModal () {
        this.setState({isSignedIn: sessionStorage.getItem('isLoggedIn')});
        this.setState({ showPopup: false});
        this.setState({showLoginModal: false})
        this.props.setIsLoggedIn();
    }
    handleClick(event) {
        this.setState({ showTweet: !this.state.showTweet });
    }
    refreshTweets() {
        this.fetchDataFromAPI(1);
    }
    getPopupBody(){
        if(!this.state.showLoginModal){
            return (<div>Inorder to report spam you have to login. To login click 
                <a href="#" onClick={()=>this.setState({showLoginModal: true})}> here</a></div>);
        }
        else{
            return(<LandingPage isLoginModal='true' hideLoginModal={this.hideLoginModal}/>);
        }
    }
    render() {
        return (
            <div class="col-xl-6 col-xxl-7 tweet_data">
                <div class="card flex-fill w-100">
                    <div class="card-header">
                        <h5 class="card-title mb-0">Tweets</h5>
                        <span>{this.props.category && this.props.category.replace(/_/g, " ")}</span>
                        {this.state.showTweet && <Icon class="material-icons expand-icon" onClick={this.handleClick.bind(this)}>expand_less</Icon>}
                        {!this.state.showTweet && <Icon class="material-icons expand-icon" onClick={this.handleClick.bind(this)}>expand_more</Icon>}
                        <Icon class="material-icons refresh-btn" onClick={() => this.refreshTweets()}>sync</Icon>
                    </div>
                    {this.state.showTweet && this.state.tweets && this.state.tweets.map((tweet, idx) => (<div class="card-body py-3" key={idx}>
                        <div class="twitter_tweets d-flex">
                            <div class="twitter_tweets__content">
                                <div class="twitter_tweets__meta text-mutes">
                                    <span class="badge" style={{ float: "left" }}>Posted on{" "}
                                        <span class="text-mutes"> - {new Intl.DateTimeFormat("en-GB", {
                                            year: "numeric",
                                            month: "short",
                                            day: "2-digit"
                                        }).format(new Date(tweet.created_at))}</span>
                                    </span>
                                    <span class="badge" style={{ float: "right" }}>
                                    <span class="text-mutes">{new Date(tweet.created_at).toLocaleTimeString()}</span>
                                    </span>
                                </div>
                                <p class="m-0 my-1 mb-2 text-muted">{tweet.text}</p>
                                <div class="blog-comments__actions">
                                    <div class="btn-group-sm btn-group">
                                        <button type="button" onClick={() => this.reportSpam(tweet.id)} class="btn btn-danger">
                                            <span class="text-white"><i class="fa fa-times-circle icons"></i></span>
                                            Report Spam
                                        </button>
                                        <button type="button" onClick={event => window.open(tweet.url,'_blank')} target="_blank" class="btn btn-primary">
                                            <span class="text-white"><i class="fa fa-twitter icons"></i></span>
                                            Go To
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>))}
                    {this.state.showTweet && this.props.tweetCount && <Pagination
                        className="pagination"
                        activePage={this.state.activePage}
                        itemsCountPerPage={10}
                        totalItemsCount={this.props.tweetCount}
                        pageRangeDisplayed={this.state.mobileView ? 3 : 10}
                        onChange={this.fetchDataFromAPI}
                        itemClass="page-item"
                        linkClass="page-link"
                    />
                    }
                    <MyVerticallyCenteredModal
                        show={this.state.showPopup}
                        onHide={() => this.setState({showPopup: false, showLoginModal: false})}
                        header="Login"
                        bodyClass="popupBody"
                        body={this.getPopupBody()}
                    />
                </div>
            </div>)
    }
}
export const mapStateToProps = (state) => {
    return {
        isSpamReportedSuccess: state.isSpamReportedSuccess,
        tweets: state.tweetData.results,
        category: state.category,
        spinner: state.spinner,
        tweetCount: state.tweetData.count
    }
}


export const mapDispatchToProps = (dispatch) => {
    return {
        reportSpam: (id) => {
            dispatch({
                type: REPORT_SPAM,
                id
            })
        },
        fetchTweets: (page) => {
            dispatch({ type: FETCH_TWEET_DATA, page })
        },
        fetchTweetsCategoryWise: (category, page) => {
            dispatch({
                type: FETCH_TWEET_DATA_CATEGORY_WISE,
                category,
                page
            })
        },
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(Tweets);