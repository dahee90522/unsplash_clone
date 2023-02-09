import { Link } from 'react-router-dom';
import React from 'react';
import classNames from 'classnames/bind';
import firstLetterUpper from 'Utils/firstLetterUpper';
import styles from './styles.module.scss';

const cx = classNames.bind(styles);
function TagItem(props) {
  return (
    <a
      target={'_blank'}
      href={`https://unsplash.com/s/photos/${props?.tag}`}
      className={cx('body1', 'tag-wrapper')}
    >
      {firstLetterUpper(props?.tag)}
    </a>
  );
}
export default TagItem;
