'use es6';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Paper from '@material-ui/core/Paper';
import Input from '@material-ui/core/Input';
import Grid from '@material-ui/core/Grid';

import { getSearchText } from '../selectors/SearchSelectors';
import { updateSearchText } from '../actions/SearchActions';
import SearchBarStyles from '../styles/SearchBarStyles';

import { withStyles } from '@material-ui/core/styles';

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.handleSearchEnter = this.handleSearchEnter.bind(this);
    this.updateFilter = this.updateFilter.bind(this);
  }

  updateFilter({ target: { value } }) {
    this.props.updateSearchText(value);
  }

  handleSearchEnter(event) {
    const { goLinks } = this.props;
    if (event.key === 'Enter') {
      event.preventDefault();
      if (goLinks.length > 0) {
        window.location = goLinks[0].link;
      }
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.searchContainer}>
        <Grid container direction="row" justify="center" alignItems="center">
          <Grid item />
          <Grid item xs={12} sm={10} md={8} lg={8} xl={6}>
            <Paper className={classes.searchBar} elevation={1}>
              <Input
                autoFocus
                className={classes.searchInput}
                placeholder="Filter Links"
                disableUnderline={true}
                value={this.props.filter}
                onChange={this.updateFilter}
                onKeyPress={this.handleSearchEnter}
              />
            </Paper>
          </Grid>
          <Grid item />
        </Grid>
      </div>
    );
  }
}

SearchBar.propTypes = {
  classes: PropTypes.object,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onKeyPress: PropTypes.func,
};

const mapStateToProps = state => ({
  filter: getSearchText(state),
});

const mapDispatchToProps = {
  updateSearchText,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(SearchBarStyles)(SearchBar));
