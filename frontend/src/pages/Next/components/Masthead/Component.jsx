import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import moment from "moment";

const useStyles = makeStyles((theme) => {
  console.log(theme);
  return {
    root: {
      flexGrow: 1,
      padding: "30px 0 200px 0",
      maxWidth: "initial",
      backgroundImage: "linear-gradient(132deg, #48bb78 0%, #4299e1 100%)",
      clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 5vw), 0 100%)",
    },
    toolbar: theme.mixins.toolbar,
    paper: {
      padding: theme.spacing(2),
      textAlign: "center",
    },
    call: {
      fontSize: "2.8rem",
      fontWeight: 700,
      letterSpacing: "-2px",
      marginTop: theme.spacing(5),
      marginBottom: theme.spacing(1),
      color: theme.palette.grey["900"],
    },
    tagline: {
      fontSize: "1.8rem",
      color: theme.palette.grey["800"],
    },
    source: {
      fontSize: "0.9rem",
      marginTop: theme.spacing(1),
      color: theme.palette.grey["300"],
    },
    stats: {
      backgroundImage: "linear-gradient(132deg,  #e53e3e 0%, #c53030 100%)",
      whiteSpace: "no-wrap",
      color: theme.palette.grey["50"],
    },
  };
});

export default function Masthead({
  data: { total_cases, total_deaths, new_cases },
  date
}) {
  const classes = useStyles();

  const getSpacing = () => {
    const width = window.innerWidth;

    if (width < 600) return 1;
    if (width < 960) return 2;
    if (width < 1280) return 3;

    return 4;
  };
  const [spacing, setSpacing] = useState(getSpacing());
  const setSpacingHandler = () => setSpacing(getSpacing());

  useEffect(() => {
    window.addEventListener("resize", setSpacingHandler, false);

    return () => {
      window.removeEventListener("resize", setSpacingHandler);
    };
  });

  const format = (value) =>
    Intl && Intl.NumberFormat
      ? Intl.NumberFormat("en-US", {
          notation: "compact",
          compactDisplay: "short",
        }).format(value)
      : value;

  return (
    <Container className={classes.root}>
      <Container maxWidth="md">
        <div className={classes.toolbar} />
        <Grid container spacing={spacing}>
          <Grid item xs={4}>
            <Paper
              className={`${classes.paper} ${classes.stats}`}
              elevation="1"
            >
              <Typography component="h4" variant="h4">
                {format(total_cases)}
              </Typography>
              <Typography variant="subtitle1">Total cases</Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper
              className={`${classes.paper} ${classes.stats}`}
              elevation="1"
            >
              <Typography component="h4" variant="h4">
                {format(new_cases)}
              </Typography>
              <Typography variant="subtitle1">New cases</Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper
              className={`${classes.paper} ${classes.stats}`}
              elevation="1"
            >
              <Typography component="h4" variant="h4">
                {format(total_deaths)}
              </Typography>
              <Typography variant="subtitle1">Deceased cases</Typography>
            </Paper>
          </Grid>
        </Grid>
        <Typography
          className={classes.source}
        >{`* Data from ECDC. Last updated on ${moment(date).format("MMMM Do, YYYY")}.`}</Typography>
      </Container>
      <Container maxWidth="md">
        <Typography component="h1" variant="h1" className={classes.call}>
          Analyzed & categorized COVID-19 Twitter feed
        </Typography>
        <Typography
          component="h3"
          variant="h3"
          color="textSecondary"
          className={classes.tagline}
        >
          Get better insights on how the world is fighting COVID-19
        </Typography>
      </Container>
    </Container>
  );
}
