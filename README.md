# unsplash-clone


### 설치
1. `yarn install / yarn`
2. `yarn start`


### 기술 스택

- [React (CRA)](https://create-react-app.dev/docs/getting-started)
- [SASS](https://sass-lang.com/)
- [Mobx](https://mobx.js.org/README.html)
- ESlint, Prettier, Stylelint

### 기능
- 이미지 리스트를 보여줌(pathname - /, /look-list)
  - 이미지 리스트에서 카테고리 검색이 가능함
- 리스트에서 이미지 선택 시 모달로 상세페이지를 띄움(pathname - /photos/:photoId)
  - 상세페이지에서 사진의 정보, 관련된 이미지와 콜랙션을 확인 가능
  - 리스트에서 이미지 선택시 상세페이지가 모달로 띄워지는데 새로고침 시 페이지로 보여줌
  - 상세 페이지와 모달에서 뒤로가기시 이전 페이지(이전 이미지 상세)로 이동

### 앞으로 구현하고자 하는 것
- 이미지 검색시 콜랙션이나 색상 등 선택의 폭을 넓히기
- 리스트나 상세페이지에서 작가 선택시 작가 소개 자체페이지 제작
- 상세페이지 관련 콜랙션이나 태그 선택시 콜랙션/태그 자체페이지 제작

### 참고
- [unsplash document](https://unsplash.com/documentation)
- [페이지 위에 route를 포함한 모달 띄우기](https://blog.logrocket.com/building-a-modal-module-for-react-with-react-router/)
  - 모달로 띄울 시 router 위에 하나의 router를 추가하는 방식으로 기존 페이지 위에 새로운 페이지를 띄움
  - 모달에서 라우터 객체(ex.photoId)등을 사용하기 위해 withRouter를 지정해야함
