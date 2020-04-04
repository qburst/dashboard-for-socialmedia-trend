import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import moment from "moment";

const useStyles = makeStyles({
  root: {
    minWidth: 275
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  }
});

export default ({ id, text, created_at, hashtags, url }) => {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;

  return (
    <div style={{ flex: "0 1 33.33%", padding: "10px", textAlign: 'left', display: 'flex' }}>
      <Card className={classes.root} variant="outlined">
        <CardContent>
          <Typography variant="body2" component="p" gutterBottom>
            {text}{' '}
            {hashtags.map(h => <><a href="/" key={h}>{`#${h}`}</a>{' '}</>)}
          </Typography>
          <Typography
            className={classes.title}
            color="textSecondary"niu
            
          >
            {moment(created_at).format("h:mm A - MMMM Do, YYYY")}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Learn More</Button>
        </CardActions>
      </Card>
    </div>
  );
};
