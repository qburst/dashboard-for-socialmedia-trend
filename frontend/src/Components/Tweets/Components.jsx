import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { useSelector, useDispatch } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";

import { fetchCategories } from "../../slice/categoriesSlice";
import {
  getReportTweetAdd,
  getReportTweetRemove,
  fetchTweets,
  reportTweet,
} from "../../slice/tweetsSlice";
import { getShowLoginModal } from "../../slice/sessionSlice";
import Filters from "../Filters";
import Tweet, { TweetLoading } from "../Tweet";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  moreTweets: {
    margin: theme.spacing(2),
  },
}));

export default function Tweets(props) {
  const classes = useStyles();
  const [filters, setFilter] = useState({
    page: 1,
    category: "",
    country: "",
    hashtag: "",
  });
  const [openModal, setOpenModal] = useState(false);

  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.session);
  const { data: categories } = useSelector((state) => state.categories);
  const { chosenTweet, data, count, loading } = useSelector((state) => state.tweets);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);
  useEffect(() => {
    dispatch(fetchTweets());
  }, [dispatch]);

  useEffect(() => {
    // after login, if there was a pending report tweet
    if (isLoggedIn && chosenTweet && !openModal) {
      setOpenModal(true);
    }
  }, [isLoggedIn, chosenTweet, openModal, setOpenModal]);

  const onFilterChange = ([category, country, hashtag]) => {
    const fill = { page: 1 };

    if (category) fill.category = category._id;
    if (country) fill.country = country.label;
    if (hashtag) fill.hashtag = hashtag.id;

    setFilter(fill);
    dispatch(fetchTweets({ ...fill }));
  };

  const onHastagClick = ({ id }) => {
    const fill = { ...filters, page: 1, hashtag: id };

    setFilter(fill);
    dispatch(fetchTweets({ ...fill }));
  };

  const onLoadMore = () => {
    const fill = { ...filters, page: filters.page + 1 };

    setFilter(fill);
    dispatch(fetchTweets({ ...fill }));
  };

  const onOpen = (url) => {
    window.open(url, "_blank");
  };

  const onCancelReport = () => {
    setOpenModal(false);
  };

  const onReport = (tweet) => {
    dispatch(getReportTweetAdd({ chosenTweet: tweet }));

    if (isLoggedIn) {
      setOpenModal(true);
    } else {
      dispatch(getShowLoginModal());
    }
  };

  const onReportConfirm = () => {
    setOpenModal(false);
    dispatch(reportTweet({ id: chosenTweet }));
    dispatch(getReportTweetRemove());
  };

  const loadingFiller = Array.from({ length: 6 }, (_, i) => (
    <TweetLoading key={i} />
  ));

  return (
    <Paper className={classes.root} elevation={2}>
      <Filters
        categories={categories}
        searchSuggestion={[]}
        searchSelected={filters.hashtag}
        searchLoading={false}
        onSearch={console.log}
        onFilterChange={onFilterChange}
        disabled={false}
      />
      <div style={{ display: "flex", flexWrap: "wrap", padding: "10px" }}>
        {data.length ? (
          <>
            {data.map((item) => (
              <Tweet
                key={item.id}
                {...item}
                onHastagClick={onHastagClick}
                onOpen={onOpen}
                onReport={onReport}
              />
            ))}
            {loading ? loadingFiller : null}
          </>
        ) : loading ? (
          loadingFiller
        ) : (
          <Typography component="h4" variant="h4" classNAme>
            No matching tweets available
          </Typography>
        )}
      </div>
      {data.length && data.length < count ? (
        <Button
          className={classes.moreTweets}
          onClick={onLoadMore}
          color="primary"
          variant="contained"
        >
          Load more tweets
        </Button>
      ) : null}

      <Dialog
        open={openModal}
        TransitionComponent={Transition}
        onClose={() => {
          setOpenModal(false);
        }}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <DialogTitle id="dialog-title">Report tweet</DialogTitle>
        <DialogContent>
          <DialogContentText id="dialog-description">
            Do you wish to report this tweet as inappropriate?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={onCancelReport} color="primary">
            Cancel
          </Button>
          <Button onClick={onReportConfirm} color="primary" autoFocus>
            Report
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
