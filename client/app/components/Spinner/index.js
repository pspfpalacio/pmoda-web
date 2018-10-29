/**
 * Spinner dependencies
 */
import React from 'react';

import CircularProgress from 'material-ui/CircularProgress';

class Spinner extends React.PureComponent {
  render() {
    const { size, thickness, show, modifier, label, className } = this.props;
    const classes = `spinner__${modifier} ${className}`
    const classesContainer = `spinner__container--${modifier}`
    return (
      show && (
        <div className={classes}>
          <div className={classesContainer}>
            <CircularProgress size={size} thickness={thickness} />
            {label && <span className="spinner__label">{label}</span>}
          </div>
        </div>
        // <div className={classes}>
        //   <div className={classesContainer}>
        //     <div className={classesIcon}>
        //       <div className={`${namespace}__icon-right`}>
        //         <div className={`${namespace}__icon-border`} />
        //       </div>
        //       <div className={`${namespace}__icon-left`}>
        //         <div className={`${namespace}__icon-border`} />
        //       </div>
        //     </div>
        //     <span className={`${namespace}__label`}>{label}</span>
        //   </div>
        //   <div className={classesMask} />
        // </div>
      )
    );
  }
}

/**
 * Export Spinner
 */
export default Spinner;
