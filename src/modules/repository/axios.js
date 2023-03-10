import Axios from 'axios';

class Ajax {
  static baseURL = 'https://api.unsplash.com/';
  static axios(options = {}) {
    let instance = Axios.create({
      baseURL: Ajax.baseURL,
      timeout: 50000,
      headers: (() => {
        const headers = {
          Accept: '*/*',
          'Content-Type': 'application/json',
          'Accept-Version': 'v1',
          Authorization: 'Client-ID bGmUdAMMc05mriv99JKqT0Vx2N8HnBcVq4mHATrCKrQ',
        };

        // if (localStorage.getItem('accessToken')) {
        //   headers['accessToken'] = localStorage.getItem('accessToken');
        // }
        // 관련 accesstoken은 localStorage를 통해 관리됩니다.
        return headers;
      })(),
      ...options,
    });

    instance.interceptors.response.use(
      function (response) {
        return response;
      },
      function (error) {
        console.error({ error });
        if (error.message.includes('timeout') || error?.response?.status === 504) {
          window.alert('시간이 초과되었습니다.');
        }
        // if (error?.response?.status === 403) {
        //   alert('로그인 정보가 변경되었습니다. 로그인 페이지로 이동합니다.');
        //   localStorage.setItem('accessToken', '');
        //   window.location.href = '/login';
        // }
        return Promise.reject(error);
      },
    );
    return instance;
  }
}
export default Ajax.axios;
