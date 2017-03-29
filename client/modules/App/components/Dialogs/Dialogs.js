import React, { Component, PropTypes as T } from 'react';
import { connect } from 'react-redux';
import ToolboxDialog from 'react-toolbox/lib/dialog/Dialog';
import { closeDialog } from '../../AppActions';
import { getDialogs } from '../../AppReducer';

class Dialogs extends Component {
  handleClose = (id) => {
    this.props.closeDialog(id);
  }

  render () {
    return (
      <div>
        {this.props.dialogs.map(d => (
          <ToolboxDialog
            active
            actions={[{ label: 'Close', onClick: () => { this.handleClose(d.id) } }]}
            onEscKeyDown={() => { this.handleClose(d.id) }}
            onOverlayClick={() => { this.handleClose(d.id) }}
            title={d.title}
            key={d.id}
          >
            <p>{d.message}</p>
          </ToolboxDialog>
        ))}
      </div>
    );
  }
}

Dialogs.propTypes = {
  dialogs: T.array.isRequired,
  closeDialog: T.func.isRequired,
};

export default connect(
  state => ({ dialogs: getDialogs(state) }),
  { closeDialog }
)(Dialogs);
