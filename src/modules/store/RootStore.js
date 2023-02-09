import { action, computed, observable } from 'mobx';

const MIN_AJAX_DURATION = 200;
class RootStore {
  @observable
  _pageLoading = false;

  constructor() {}

  @action.bound
  setStore(storeName, store) {
    this[storeName] = store;
  }

  @action.bound
  setPageLoading(value) {
    if (!this._pageLoading && value) {
      this._pageLoading = true;
      this._loadingStartTime = Date.now();
    } else if (this._pageLoading && !value) {
      if (this._waitingForLoadingDuration) {
        return;
      }
      if (Date.now() - this._loadingStartTime < MIN_AJAX_DURATION) {
        this._waitingForLoadingDuration = true;
        setTimeout(() => {
          this._pageLoading = false;
          this._waitingForLoadingDuration = false;
        }, MIN_AJAX_DURATION - (Date.now() - this._loadingStartTime));
      } else {
        this._pageLoading = false;
      }
    }
  }

  @computed
  get pageLoading() {
    return this._pageLoading;
  }
}

export default RootStore;
