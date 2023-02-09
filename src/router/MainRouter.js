import * as Page from 'Pages';

import React, { useEffect, useState } from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';

import LoadingState from './util/LoadingState';
import Modal from 'Pages/Modal';
import { Provider } from 'mobx-react';
import classNames from 'classnames/bind';
import style from './style.module.scss';

const cx = classNames.bind(style);

function MainRouter({ location }) {
  const routes = Object.keys(Page).map((pageName) => Page[pageName]);
  const [previousLocation, setPreviousLocation] = useState(location);
  const [loadingState, setLoadingState] = useState(new LoadingState());
  useEffect(() => {
    if (!(location?.state && location?.state?.modal)) {
      setPreviousLocation(location);
    }
  }, []);
  const isModal = location?.state && location?.state?.modal && previousLocation !== location;
  return (
    <div className={cx('router')}>
      <Provider loading={LoadingState}>
        <Switch location={isModal ? previousLocation : location}>
          {routes.map((route) => {
            return <Route key={route?.path} exact path={route?.path} component={route.default} />;
          })}
          <Route exact path="/photos/:photoId" component={Modal} />
          <Redirect path="*" to="/" />
        </Switch>
        {isModal ? (
          <Route exact path="/photos/:photoId">
            <Modal isModal />
          </Route>
        ) : null}
      </Provider>
    </div>
  );
}

export default withRouter(MainRouter);
