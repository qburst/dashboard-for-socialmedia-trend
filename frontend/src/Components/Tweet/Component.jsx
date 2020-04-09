import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import ReportIcon from "@material-ui/icons/Report";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { blue } from "@material-ui/core/colors";
import Skeleton from "@material-ui/lab/Skeleton";
import Link from "@material-ui/core/Link";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  root: {
    flex: "0 1 100%",
    padding: "10px",
    textAlign: "left",
    display: "flex",
    [theme.breakpoints.up("sm")]: {
      flex: "0 1 50%",
    },
    [theme.breakpoints.up("md")]: {
      flex: "0 1 33.33%",
    },
  },
  card: {
    width: "100%",
    display: "flex",
    flexFlow: "column",
    position: "relative",
    paddingBottom: "47px",
  },
  title: {
    fontSize: 14,
    whiteSpace: "pre-wrap",
  },
  contentRoot: {
    paddingTop: 0,
  },
  content: {
    whiteSpace: "pre-wrap",
  },
  hashLinks: {
    color: "#007bff",
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    borderTop: `1px solid ${theme.palette.grey["300"]}`,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  avatar: {
    backgroundColor: blue[500],
  },
}));

const propTypes = {
  id: PropTypes.string.isRequired,
  url: PropTypes.string,
  text: PropTypes.string,
  created_at: PropTypes.string,
  hashtags: PropTypes.arrayOf(PropTypes.string),
  user: PropTypes.shape({}),
  onReport: PropTypes.func.isRequired,
  onHastagClick: PropTypes.func.isRequired,
};
const defaultProps = {
  url: '',
  text: '',
  created_at: '',
  hashtags: [],
  user: {}
};
const Tweet = ({
  id,
  url,
  text,
  created_at,
  hashtags,
  user,
  onReport,
  onHastagClick,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Card variant="outlined" className={classes.card}>
        <CardHeader
          avatar={
            <Avatar
              aria-label={user.name}
              className={classes.avatar}
              src={user.profile_image_url_https}
            >
              {user.name[0].toUpperCase()}
            </Avatar>
          }
          title={user.name}
          subheader={`@${user.name.replace(' ', '')}`}
        />
        <CardContent className={classes.contentRoot}>
          <Typography
            variant="body2"
            component="p"
            gutterBottom
            className={classes.content}
          >
            {text}{" "}
            {hashtags.map((h) => (
              <Button
                size="small"
                key={h}
                className={classes.hashLinks}
                onClick={() => onHastagClick(h)}
              >{`#${h}`}</Button>
            ))}
          </Typography>
          <Typography className={classes.title} color="textSecondary">
            {moment(created_at).format("h:mm A - MMMM Do, YYYY")}
          </Typography>
        </CardContent>
        <CardActions className={classes.actions}>
          <IconButton
            size="small"
            aria-label="report tweet"
            onClick={() => onReport({ id, url, text, created_at, hashtags })}
          >
            <ReportIcon />
          </IconButton>
          <Link href={url} rel="noopener noreferrer" target="_blank">
            <IconButton size="small" aria-label="view tweet">
              <ChevronRightIcon />
            </IconButton>
          </Link>
        </CardActions>
      </Card>
    </div>
  );
};

export const TweetLoading = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Card variant="outlined" className={classes.card}>
        <CardHeader
          avatar={
            <Skeleton
              animation="wave"
              variant="circle"
              width={40}
              height={40}
            />
          }
          title={
            <Skeleton
              animation="wave"
              height={10}
              width="80%"
              style={{ marginBottom: 6 }}
            />
          }
          subheader={<Skeleton animation="wave" height={10} width="40%" />}
        />
        <CardContent className={classes.contentRoot}>
          <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
          <Skeleton
            animation="wave"
            height={10}
            width="80%"
            style={{ marginBottom: 6 }}
          />
          <Skeleton
            animation="wave"
            height={10}
            width="70%"
            style={{ marginBottom: 6 }}
          />
          <Skeleton animation="wave" height={10} width="50%" />
        </CardContent>
        <CardActions className={classes.actions}>
          <Skeleton animation="wave" variant="circle" width={24} height={24} />
          <Skeleton animation="wave" variant="circle" width={24} height={24} />
        </CardActions>
      </Card>
    </div>
  );
};

Tweet.propTypes = propTypes;
Tweet.defaultProps = defaultProps;
export default Tweet;
