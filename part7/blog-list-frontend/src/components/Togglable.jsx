import { useState, useImperativeHandle, forwardRef } from 'react';
import PropTypes from 'prop-types';

const Togglable = forwardRef((props, refs, style) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? 'none' : '' };
  const showWhenVisible = { display: visible ? '' : 'none' };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility,
    };
  });
  return (
    <div>
      <div style={hideWhenVisible} className={style}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility} className="button-contrast">
          cancel
        </button>
      </div>
    </div>
  );
});

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
};
Togglable.displayName = 'Togglable';

export default Togglable;
