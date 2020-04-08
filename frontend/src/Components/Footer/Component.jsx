import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Link from "@material-ui/core/Link";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  footer: {
    marginTop: theme.spacing(10),
    paddingTop: theme.spacing(5),
    paddingBottom: theme.spacing(5),
    borderTop: "1px solid rgba(0, 0, 0, 0.12)",
    textAlign: "center"
  },
}));

export default () => {
  const classes = useStyles();
  return (
    <footer className={classes.footer}>
      <Typography variant="body1">
        Copyright &copy; 2020{" "}
        <Link
          href="https://www.qburst.com/"
          rel="noopener noreferrer"
          target="_blank"
        >
          QBurst
        </Link>{". "}
        All rights reserved.
      </Typography>
    </footer>
  );
};
