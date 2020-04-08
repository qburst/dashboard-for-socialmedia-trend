import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import throttle from "lodash.throttle";
import { useSelector } from "react-redux";

import { countries } from "./constants";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const useStyles = makeStyles((theme) => ({
  root: {
    borderBottom: `1px solid ${theme.palette.grey["300"]}`,
    alignItems: "center",
    padding: theme.spacing(2),
  },
  option: {
    fontSize: 15,
    "& > span": {
      marginRight: 10,
      fontSize: 18,
    },
  },
  paper: {},
  textfield: {
    root: {
      padding: "2px",
    },
  },
  filterChips: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5),
    },
  },
}));

const Filters = ({
  categories,
  searchSuggestion,
  searchSelected,
  searchLoading,
  onSearch,
  onFilterChange,
}) => {
  const classes = useStyles();

  const [openAsyncAuto, setOpenAsyncAuto] = useState(false);

  const [choosenCategory, setChoosenCategory] = useState(null);
  const [choosenCountry, setChoosenCountry] = useState(null);
  const [choosenHash, setChoosenHash] = useState(searchSelected || null);
  const [openModal, setOpenModal] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));

  const { loading } = useSelector((state) => state.tweets);

  const cleanCaterogy = (category) => {
    const replace = category._id.replace(/_/g, " ");

    return replace[0] + replace.substr(1).toLowerCase();
  };
  const countryToFlag = (isoCode) =>
    typeof String.fromCodePoint !== "undefined"
      ? isoCode
          .toUpperCase()
          .replace(/./g, (char) =>
            String.fromCodePoint(char.charCodeAt(0) + 127397)
          )
      : isoCode;

  const onTweetSearch = throttle((value) => {
    if (value.length > 2) {
      onSearch(value);
    }
  }, 300);

  const onApplyChanges = () => {
    onFilterChange([choosenCategory, choosenCountry, choosenHash]);
    setTimeout(() => setOpenModal(false), 300);
  };
  const onClearFilters = () => {
    setChoosenCategory(null);
    setChoosenCountry(null);
    setChoosenHash(null);
    onFilterChange([]);
    setTimeout(() => setOpenModal(false), 300);
  };
  const onRemove = (type) => () => {
    if (type === "category") {
      setChoosenCategory(null);
      onFilterChange([null, choosenCountry, choosenHash]);
    }
    if (type === "country") {
      setChoosenCountry(null);
      onFilterChange([choosenCategory, null, choosenHash]);
    }
    if (type === "hash") {
      onFilterChange(null);
      onFilterChange([choosenCategory, choosenCountry, null]);
    }
  };

  const categoryCountryFilter = (
    <>
      <Grid item xs={12} md={6}>
        <Autocomplete
          id="combo-box-demo"
          options={categories}
          getOptionLabel={cleanCaterogy}
          size="small"
          renderInput={(params) => (
            <TextField
              {...params}
              className={classes.textfield}
              label="Filter by category"
              variant="outlined"
            />
          )}
          value={choosenCategory}
          onChange={(e, value, reason) => {
            setChoosenCategory(value);
            onFilterChange([value, choosenCountry, choosenHash]);
          }}
          disabled={loading}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Autocomplete
          id="country-select-demo"
          size="small"
          options={countries}
          classes={{
            option: classes.option,
          }}
          autoHighlight
          getOptionLabel={(option) => option.label}
          renderOption={(option) => (
            <React.Fragment>
              <span>{countryToFlag(option.code)}</span>
              {option.label} ({option.code})
            </React.Fragment>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Filter by country"
              variant="outlined"
              inputProps={{
                ...params.inputProps,
                autoComplete: "new-password", // disable autocomplete and autofill
              }}
            />
          )}
          value={choosenCountry}
          onChange={(e, value, reason) => {
            setChoosenCountry(value);
            onFilterChange([choosenCategory, value, choosenHash]);
          }}
          disabled={true}
        />
      </Grid>
    </>
  );
  const hashFilter = (
    <>
      <Autocomplete
        freeSolo
        id="hastag-suggestion"
        style={{ minWidth: "300px" }}
        size="small"
        open={openAsyncAuto}
        onOpen={() => {
          setOpenAsyncAuto(true);
        }}
        onClose={() => {
          setOpenAsyncAuto(false);
        }}
        getOptionSelected={(option, value) => option.name === value.name}
        getOptionLabel={(option) => option.name}
        options={searchSuggestion}
        loading={searchLoading}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search tweets"
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {searchLoading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
            onChange={(e) => {
              onTweetSearch(e.target.value);
            }}
          />
        )}
        value={choosenHash}
        onChange={(e, value, reason) => {
          setChoosenHash(value);
          onFilterChange([choosenCategory, choosenCountry, value]);
        }}
        disabled={true}
      />
    </>
  );
  const mobileFilters = (
    <Grid container direction="row" justify="space-between" spacing={2}>
      {categoryCountryFilter}
      <Grid item xs={12}>
        {hashFilter}
      </Grid>
    </Grid>
  );
  const filters = (
    <>
      <Grid item sm={12} md={6}>
        <Grid container direction="row" justify="space-between" spacing={2}>
          {categoryCountryFilter}
        </Grid>
      </Grid>
      <Grid item sm={12} md={6}>
        <Grid container direction="row" justify="flex-end">
          {hashFilter}
        </Grid>
      </Grid>
    </>
  );

  return (
    <Grid
      container
      direction="row"
      justify="space-between"
      alignItems="center"
      className={classes.root}
    >
      <Hidden mdUp implementation="js">
        <Grid item md={6}>
          <div className={classes.filterChips}>
            <div>Filters:</div>
            {choosenCategory ? (
              <Chip
                label={cleanCaterogy(choosenCategory)}
                color="primary"
                size="small"
                onDelete={onRemove("category")}
              />
            ) : null}
            {choosenCountry ? (
              <Chip
                label={choosenCountry.label}
                color="primary"
                size="small"
                onDelete={onRemove("country")}
              />
            ) : null}
            {choosenHash ? (
              <Chip
                label={choosenHash}
                color="primary"
                size="small"
                onDelete={onRemove("hash")}
              />
            ) : null}
            {!choosenCategory && !choosenCountry && !choosenHash ? (
              <Chip label="None" size="small" disabled />
            ) : null}
          </div>
        </Grid>
        <Grid item md={6}>
          <Button
            variant="contained"
            size="small"
            color="primary"
            onClick={setOpenModal}
          >
            Change
          </Button>
        </Grid>
      </Hidden>
      <Hidden smDown implementation="js">
        {filters}
      </Hidden>
      <Dialog
        fullScreen={fullScreen}
        open={openModal}
        TransitionComponent={Transition}
        onClose={() => {
          setOpenModal(false);
        }}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <DialogTitle id="dialog-title">
          {"Change Twitter feed filters"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="dialog-description">
            {mobileFilters}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={onClearFilters} color="primary">
            Clear
          </Button>
          <Button onClick={onApplyChanges} color="primary" autoFocus>
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default Filters;
