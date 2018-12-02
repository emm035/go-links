'use es6';

import React, { Component } from 'react';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import CircularProgress from '@material-ui/core/CircularProgress';

import GoLinkCreator from '../components/GoLinkCreator';
import GoLink from '../components/GoLink';
import SearchBar from '../components/SearchBar';
import GoLinkEditor from '../components/GoLinkEditor';

import { getSearchText } from '../selectors/SearchSelectors';
import { getFilteredLinks } from '../selectors/GoLinkSelectors';
import { updateSearchText } from '../actions/SearchActions';
import { fetchGoLinks } from '../actions/GoLinkActions';
import AppStyles from '../styles/AppStyles';

import '../../css/App.css';

class App extends Component {
  componentWillMount() {
    this.props.fetchGoLinks();
  }

  renderLinks() {
    const { classes, goLinks } = this.props;
    return (
      <List className={classes.linkList}>
        {goLinks.length > 0 ? (
          goLinks.map(goLink => <GoLink key={goLink.id} goLink={goLink} />)
        ) : (
          <GoLinkCreator />
        )}
      </List>
    );
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <div className={classes.header}>
          <SearchBar />
        </div>
        <div className={classes.linkListContainer}>
          {this.props.fetchStatus.pending && (
            <CircularProgress className={classes.progress} />
          )}
          {!this.props.fetchStatus.pending && this.renderLinks()}
        </div>
        <GoLinkEditor />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  filter: getSearchText(state),
  goLinks: getFilteredLinks(state).map(link => link.toJS()),
  fetchStatus: state.get('fetchStatus'),
});

const mapDispatchToProps = {
  updateSearchText,
  fetchGoLinks,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(AppStyles)(App));
