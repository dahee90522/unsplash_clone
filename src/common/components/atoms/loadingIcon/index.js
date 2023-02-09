import Lottie from 'react-lottie-player';
import React from 'react';
import classNames from 'classnames/bind';
import lottieLoading from 'Assets/lottie/loading.json';
import styles from './LoadingIcon.module.scss';
const cx = classNames.bind(styles);

function LoadingIcon({ className, style }) {
  return <Lottie animationData={lottieLoading} play loop style={{ margin: '0 auto' }} />;
}

export default LoadingIcon;
