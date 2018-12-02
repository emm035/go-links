'use es6';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography/Typography';
import ListItem from '@material-ui/core/ListItem/ListItem';
import Divider from '@material-ui/core/Divider/Divider';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton/IconButton';
import LaunchIcon from '@material-ui/icons/Launch';
import { selectGoLink } from '../actions/GoLinkActions';
import GoLinkStyles from '../styles/GoLinkStyles';

class GoLink extends Component {
  makeRedirect(link) {
    return () =>
      window.location.search.match(/popup=true/)
        ? window.chrome.tabs.create({ url: link })
        : (window.location = link);
  }

  render() {
    const {
      classes,
      goLink: { id, link, aliases, description },
    } = this.props;
    return (
      <div>
        <ListItem
          button
          className={classes.listItem}
          onClick={() => this.props.editGoLink(id)}>
          <div>
            <Typography variant="display1" className={classes.listTitle}>
              {aliases.map(alias => `go/${alias}`).join(', ')}
            </Typography>
            <Typography variant="subheading">{description}</Typography>
          </div>
          <ListItemSecondaryAction>
            <IconButton
              className={classes.iconButton}
              onClick={this.makeRedirect(link)}>
              <LaunchIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        <Divider />
      </div>
    );
  }
}

GoLink.propTypes = {
  goLink: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  classes: PropTypes.object,
};

GoLink.defaultProps = {
  onClick: () => {},
};

const mapStateToProps = state => ({});

const mapDispatchToProps = {
  editGoLink: selectGoLink,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(GoLinkStyles)(GoLink));
