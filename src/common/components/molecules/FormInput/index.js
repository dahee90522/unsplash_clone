import React, { useEffect, useState } from 'react';

import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import { useHistory } from 'react-router-dom';

const cx = classNames.bind(styles);
function FormInput({ onChange, type = 'text', value = '', placeholder = '', onKeyUp, ...props }) {
  const history = useHistory();
  return (
    <div className={cx('input-container')}>
      <input
        {...props}
        onKeyUp={onKeyUp}
        onChange={onChange}
        type={type}
        value={value}
        placeholder={placeholder}
      />
    </div>
  );
}
export default FormInput;
