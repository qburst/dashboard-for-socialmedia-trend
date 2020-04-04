import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import throttle from "lodash.throttle";
import Grid from "@material-ui/core/Grid";

import { countries } from "./constants";

const useStyles = makeStyles({
  option: {
    fontSize: 15,
    "& > span": {
      marginRight: 10,
      fontSize: 18
    }
  },
  paper: {},
  textfield: {
    root: {
      padding: "2px"
    }
  }
});

const Filters = ({
  categories,
  setCategory,
  setCountry,
  searchSuggestion,
  searchLoading,
  onSearch,
  setSearch,
  disabled
}) => {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const loading = open && options.length === 0;

  const cleanCaterogy = category => {
    const replace = category._id.replace(/_/g, " ");
    
    return replace[0] + replace.substr(1).toLowerCase();
  };
  const countryToFlag = isoCode =>
    typeof String.fromCodePoint !== "undefined"
      ? isoCode
          .toUpperCase()
          .replace(/./g, char =>
            String.fromCodePoint(char.charCodeAt(0) + 127397)
          )
      : isoCode;

  const onTweetSearch = throttle(value => {
    if (value.length > 2) {
      onSearch(value);
    }
  }, 300);

  return (
    <Grid container direction="row" justify="space-between" alignItems="center">
      <Grid item sm={12} md={6}>
        <Grid container direction="row" justify="space-between" spacing={2}>
          <Grid item xs={6}>
            <Autocomplete
              id="combo-box-demo"
              options={categories}
              getOptionLabel={cleanCaterogy}
              size="small"
              renderInput={params => (
                <TextField
                  {...params}
                  className={classes.textfield}
                  label="Filter by category"
                  variant="outlined"
                />
              )}
              onChange={(e, value, reason) => {
                setCategory(value);
              }}
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={6}>
            <Autocomplete
              id="country-select-demo"
              size="small"
              options={countries}
              classes={{
                option: classes.option
              }}
              autoHighlight
              getOptionLabel={option => option.label}
              renderOption={option => (
                <React.Fragment>
                  <span>{countryToFlag(option.code)}</span>
                  {option.label} ({option.code})
                </React.Fragment>
              )}
              renderInput={params => (
                <TextField
                  {...params}
                  label="Filter by country"
                  variant="outlined"
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: "new-password" // disable autocomplete and autofill
                  }}
                />
              )}
              onChange={(e, value, reason) => {
                setCountry(value);
              }}
              disabled={disabled}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Grid container direction="row" justify="flex-end">
          <Autocomplete
            id="asynchronous-demo"
            style={{ minWidth: "200px" }}
            size="small"
            open={open}
            onOpen={() => {
              setOpen(true);
            }}
            onClose={() => {
              setOpen(false);
            }}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={option => option.name}
            options={searchSuggestion}
            loading={searchLoading}
            renderInput={params => (
              <TextField
                {...params}
                label="Search tweets"
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {loading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  )
                }}
                onChange={e => {
                  onTweetSearch(e.target.value);
                }}
              />
            )}
            onChange={(e, value, reason) => {
              setSearch(value);
            }}
            disabled={disabled}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Filters;
