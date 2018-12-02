'use es6';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography/Typography';
import ListItem from '@material-ui/core/ListItem/ListItem';
import Divider from '@material-ui/core/Divider/Divider';

import { createGoLink, selectGoLink } from '../actions/GoLinkActions';
import { getSearchText } from '../selectors/SearchSelectors';
import GoLinkCreatorStyles from '../styles/GoLinkCreatorStyles';

class GoLinkCreator extends Component {
  render() {
    const { classes, alias } = this.props;
    return (
      <div>
        <ListItem
          button
          className={classes.listItem}
          onClick={() => this.props.createGoLink(alias)}>
          <div>
            <Typography variant="display1" className={classes.listTitle}>
              Create go/{alias}
            </Typography>
          </div>
        </ListItem>
        <Divider />
      </div>
    );
  }
}

GoLinkCreator.propTypes = {
  alias: PropTypes.string.isRequired,
  classes: PropTypes.object,
};

GoLinkCreator.defaultProps = {
  classes: {},
};

const mapStateToProps = state => ({
  alias: getSearchText(state),
});

const mapDispatchToProps = {
  createGoLink,
  selectGoLink,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(GoLinkCreatorStyles)(GoLinkCreator));
