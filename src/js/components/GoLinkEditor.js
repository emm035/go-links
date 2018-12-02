'use es6';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import { withStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import TextField from '@material-ui/core/TextField/TextField';
import Chip from '@material-ui/core/Chip/Chip';
import Button from '@material-ui/core/Button/Button';
import Drawer from '@material-ui/core/Drawer';
import DeleteIcon from '@material-ui/icons/Delete';

import {
  getLinkWithEdits,
  getPendingChangesExist,
} from '../selectors/GoLinkSelectors';
import { getEditorIsOpen } from '../selectors/EditorSelectors';
import {
  updateGoLinkProperty,
  deleteGoLink,
  saveGoLink,
} from '../actions/GoLinkActions';
import { closeEditor } from '../actions/EditorActions';
import { IconButton } from '@material-ui/core';
import GoLinkEditorStyles from '../styles/GoLinkEditorStyles';

const variants = {
  button: 'raised',
  textField: 'standard',
  chip: 'default',
};

var urlPattern = /^(https?:\/\/)?((([a-zd]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((d{1,3}\.){3}d{1,3}))(:d+)?(\/[-a-z\d%_.~+]*)*(?:[;&a-zd%_.~+=-]*)?(#[-a-zd_]*)?$/i;

class GoLinkEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newAlias: '',
    };
    this.onAliasTextFieldKeyPress = this.onAliasTextFieldKeyPress.bind(this);
    this.onAliasTextFieldKeyDown = this.onAliasTextFieldKeyDown.bind(this);
    this.urlIsValid = this.urlIsValid.bind(this);
    this.hasValidationErrors = this.hasValidationErrors.bind(this);
  }

  urlIsValid(url = this.props.goLink.link) {
    console.clog('editor.validation.urlValid', {
      url,
      valid: !!urlPattern.test(url),
    });
    return !!urlPattern.test(url);
  }

  hasValidationErrors() {
    const {
      goLink: { link: url },
    } = this.props;
    const errors = !this.urlIsValid(url);
    console.clog('editor.validation.hasErrors', errors);
    return errors;
  }

  renderChips(aliases) {
    const { classes } = this.props;
    return aliases.map((alias, idx) => (
      <Chip
        variant={variants.chip}
        key={idx}
        clickable={false}
        label={alias}
        onDelete={aliases.length > 1 && (() => this.removeAlias(alias))}
        className={classes.chip}
      />
    ));
  }

  onAliasTextFieldKeyPress(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.addAlias(this.state.newAlias.trim());
      return;
    }
  }

  onAliasTextFieldKeyDown(event) {
    const {
      goLink: { aliases },
    } = this.props;
    if (
      event.key === 'Backspace' &&
      aliases.length > 1 &&
      !event.target.value
    ) {
      event.preventDefault();
      this.removeAlias(aliases[aliases.length - 1]);
    }
  }

  removeAlias(alias) {
    const {
      goLink: { aliases },
    } = this.props;
    this.props.updateGoLinkProperty({ aliases: _.without(aliases, alias) });
  }

  addAlias(alias) {
    const {
      goLink: { aliases },
    } = this.props;
    this.props.updateGoLinkProperty({ aliases: _.concat(aliases, alias) });
    this.setState({ newAlias: '' });
  }

  render() {
    const { newAlias } = this.state;
    const {
      classes,
      open,
      closeEditor,
      goLink,
      goLink: { link, aliases, description, id },
    } = this.props;
    return (
      <Drawer
        classes={{ paper: classes.drawer }}
        anchor="right"
        open={open}
        onClose={closeEditor}>
        <div className={classes.titleRow}>
          <DialogTitle>Edit Go Link</DialogTitle>
          <IconButton
            className={classes.button}
            onClick={() => this.props.deleteGoLink(id)}>
            <DeleteIcon />
          </IconButton>
        </div>
        <DialogContent>
          <TextField
            id="name"
            label="URL"
            fullWidth
            value={link || ''}
            variant={variants.textField}
            margin="normal"
            error={!this.urlIsValid()}
            onChange={({ target: { value: link } }) =>
              this.props.updateGoLinkProperty({ link })
            }
          />
          <div className={classes.flexContainer}>
            <TextField
              autoFocus
              label="Shortcuts"
              type="text"
              variant={variants.textField}
              margin="normal"
              onChange={({ target: { value } }) =>
                this.setState({ newAlias: value })
              }
              InputProps={{
                startAdornment: this.renderChips(aliases || []),
              }}
              value={newAlias}
              className={classes.aliasInput}
              onKeyDown={this.onAliasTextFieldKeyDown}
              onKeyPress={this.onAliasTextFieldKeyPress}
              helperText="Enter new shortcuts, separated by spaces"
            />
          </div>
          <TextField
            id="name"
            label="Description"
            fullWidth
            variant={variants.textField}
            margin="normal"
            value={description || ''}
            onChange={({ target: { value: description } }) =>
              this.props.updateGoLinkProperty({ description })
            }
          />
          <span>
            <Button
              className={classes.button}
              variant={variants.button}
              disabled={
                !this.props.pendingChanges || this.hasValidationErrors()
              }
              color="secondary"
              onClick={() => this.props.saveGoLink(goLink)}>
              Save
            </Button>

            <Button
              className={classes.button}
              variant={variants.button}
              onClick={() => this.props.closeEditor()}>
              Discard
            </Button>
          </span>
        </DialogContent>
      </Drawer>
    );
  }
}

GoLinkEditor.propTypes = {
  open: PropTypes.bool.isRequired,
  goLink: PropTypes.object.isRequired,
  closeEditor: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  goLink: getLinkWithEdits(state).toJS(),
  pendingChanges: getPendingChangesExist(state),
  open: getEditorIsOpen(state),
});

const mapDispatchToProps = {
  updateGoLinkProperty,
  closeEditor,
  deleteGoLink,
  saveGoLink,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(GoLinkEditorStyles)(GoLinkEditor));
