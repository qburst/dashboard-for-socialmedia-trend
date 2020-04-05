import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

import {
  REPORT_SPAM,
  FETCH_TWEET_DATA,
  FETCH_TWEET_DATA_CATEGORY_WISE,
  SET_CATEGORY,
  FETCH_CATEGORIES,
} from "../../../../Actions/Actions";
import Filters from "../../../../Components/Filters";
import Tweet from "../../../../Components/Tweet";

const useStyles = makeStyles({
  root: {
    // padding: "10px",
  },
});

function Tweets({
  items,
  tweets,
  getCategories,
  fetchTweets,
  fetchTweetsCategoryWise,
}) {
  console.log(tweets);
  const classes = useStyles();
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("");

  useEffect(() => {
    const p = 1;

    setPage(p);
    getCategories(p);
  }, [setPage, getCategories]);

  useEffect(() => {
    const p = 1;

    setPage(p);
    if (category) {
      fetchTweetsCategoryWise(category, p);
    } else {
      fetchTweets(p);
    }
  }, [category, setPage, fetchTweets, fetchTweetsCategoryWise]);

  return (
    <Paper className={classes.root} elevation={2}>
      <Filters
        categories={items}
        setCategory={setCategory}
        setCountry={() => {}}
        searchSuggestion={[]}
        searchLoading={false}
        onSearch={console.log}
        setSearch={() => {}}
        disabled={false}
        onFilterChange={console.log}
      />
      <div style={{ display: "flex", flexWrap: "wrap", padding: "10px" }}>
        {tweets
          ? tweets.map((item) => <Tweet key={item.id} {...item} />)
          : null}
      </div>
      <Button className={classes.hashLinks}>Load more</Button>
    </Paper>
  );
}

export const mapStateToProps = (state) => {
  return {
    isSpamReportedSuccess: state.isSpamReportedSuccess,
    tweets: state.tweetData.results,
    category: state.category,
    spinner: state.spinner,
    tweetCount: state.tweetData.count,
    items: state.navItems,
  };
};

export const mapDispatchToProps = (dispatch) => {
  return {
    reportSpam: (id) => {
      dispatch({
        type: REPORT_SPAM,
        id,
      });
    },
    getCategories: () => {
      dispatch({ type: FETCH_CATEGORIES });
    },
    fetchTweets: (page) => {
      dispatch({ type: FETCH_TWEET_DATA, page });
    },
    fetchTweetsCategoryWise: (category, page) => {
      dispatch({
        type: FETCH_TWEET_DATA_CATEGORY_WISE,
        category,
        page,
      });
    },
    setCategory: (category) => {
      dispatch({
        type: SET_CATEGORY,
        category,
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Tweets);
