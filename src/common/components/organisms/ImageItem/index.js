import { Link, useHistory } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import classNames from 'classnames/bind';
import styles from './styles.module.scss';

const cx = classNames.bind(styles);
function ImageItem(props) {
  return (
    <Link
      to={{
        pathname: `/photos/${props?.id}`,
        state: { modal: true },
      }}
      className={cx('item-container')}
    >
      <img src={props?.image} className={cx('cover-image')} />
      <div className={cx('user-info-container')}>
        <img src={props?.userProfileImage} onClick={() => window.open(props?.userLink)} />
        <div className={cx('headLine2', 'user-name')} onClick={() => window.open(props?.userLink)}>
          {props?.userName}
        </div>
      </div>
    </Link>
  );
}
export default ImageItem;
