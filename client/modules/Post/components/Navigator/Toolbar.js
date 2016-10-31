import React, { PropTypes } from 'react';

const Toolbar = (props) => {
  let items;
  const {
    isOpen,
    isEditMode,
    open,
    toggleEditMode,
    nextPath,
    close,
  } = props;

  if (isOpen) {
    if (isEditMode) {
      items = [
        <input
          type='button'
          value='Exit'
          onClick={toggleEditMode}
          key={0}
        />,
      ];
    } else {
      items = [
        <input
          type='button'
          value='Edit Mode'
          onClick={toggleEditMode}
          key={0}
        />,
        <input
          type='button'
          value='Next path'
          onClick={nextPath}
          key={1}
        />,
        <input
          type='button'
          value='Close Toolbar'
          onClick={close}
          key={2}
        />,
      ];
    }
  } else {
    items = [
      <input
        type='button'
        value='Open Nav'
        onClick={open}
        key={0}
      />,
    ];
  }

  return (
    <div className='navigator-toolbar'>
      {items}
    </div>
  );
};

Toolbar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isEditMode: PropTypes.bool.isRequired,
  open: PropTypes.func.isRequired,
  toggleEditMode: PropTypes.func.isRequired,
  nextPath: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
};

export default Toolbar;
