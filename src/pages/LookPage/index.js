import React, { useEffect, useRef, useState } from 'react';

import FormInput from 'Components/molecules/FormInput';
import ImageItem from 'Components/organisms/ImageItem';
import InfiniteScroll from 'react-infinite-scroll-component';
import LoadingIcon from 'Components/atoms/loadingIcon';
import SvgSearch from 'Assets/svgs/search.svg';
import { User } from 'Modules/repository';
import classNames from 'classnames/bind';
import qs from 'query-string';
import queryString from 'querystring';
import styles from './styles.module.scss';
import { useHistory } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

const cx = classNames.bind(styles);
function Lookpage() {
  const history = useHistory();
  const isDesktop = useMediaQuery({ query: '(min-width: 769px)' });
  const query = qs.parse(window.location.search);
  const [imageVerticalList, setImageVerticalList] = useState([[], [], []]);
  const [originalImageList, setOriginalImageList] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState(query?.search);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [noNeedLoad, setNoNeedLoad] = useState(false);
  const [imageListLastArrayIdx, setImageListLastArrayIdx] = useState(0);

  function onEnter(e) {
    if (e.key !== 'Enter') {
      return;
    }
    setNoNeedLoad(false);
    setImageListLastArrayIdx(0);
    setImageVerticalList([[], [], []]);
    setOriginalImageList([]);
    setPage(1);
    setNoNeedLoad(false);
    history.replace({
      search: queryString.stringify({ search: searchKeyword }),
    });
    onSearch(true);
  }

  async function onSearch(isKeywordChange = false) {
    const list = await User.Info.searchImage(searchKeyword, page);
    (list?.imageList?.length === 0 || list?.imageList === undefined) && setNoNeedLoad(true);
    if (list?.imageList?.length > 0) {
      setMaxPage(list?.totalPage);
      isKeywordChange
        ? setOriginalImageList(list?.imageList)
        : setOriginalImageList(originalImageList.concat(list?.imageList));
      let verticalArray = isKeywordChange ? [[], [], []] : imageVerticalList;
      list?.imageList.forEach((item, idx) => {
        let arrayIndex = (idx - imageListLastArrayIdx) % 3;
        if (arrayIndex < 0) arrayIndex = arrayIndex * -1;
        if (list?.length === idx + 1) {
          arrayIndex === 2 ? setImageListLastArrayIdx(0) : setImageListLastArrayIdx(arrayIndex + 1);
        }
        verticalArray[arrayIndex].push(item);
      });
      setImageVerticalList(verticalArray);
    }
  }

  useEffect(() => {
    async function getImage() {
      const list = await User.Info.get(page);
      list === undefined && setNoNeedLoad(true);
      if (list?.length > 0) {
        setOriginalImageList(originalImageList.concat(list));
        let verticalArray = imageVerticalList;
        list.forEach((item, idx) => {
          let arrayIndex = (idx - imageListLastArrayIdx) % 3;
          if (arrayIndex < 0) arrayIndex = arrayIndex * -1;
          if (list?.length === idx + 1) {
            arrayIndex === 2
              ? setImageListLastArrayIdx(0)
              : setImageListLastArrayIdx(arrayIndex + 1);
          }
          verticalArray[arrayIndex].push(item);
        });
        setImageVerticalList(verticalArray);
      }
    }
    query?.search?.length > 0 ? onSearch() : getImage();
  }, [page]);
  return (
    <div className={cx('list-container')}>
      <div className={cx('search-input-wrapper')}>
        <FormInput
          onChange={(keyword) => {
            setSearchKeyword(keyword.target.value);
          }}
          onKeyUp={onEnter}
          value={searchKeyword}
          type="search"
          placeholder="검색어를 입력해주세요"
        />
        <button>
          <SvgSearch />
        </button>
      </div>
      <InfiniteScroll
        dataLength={originalImageList?.length ?? 0}
        next={() => setPage(page + 1)}
        hasMore={!noNeedLoad}
        loader={
          !noNeedLoad && (
            <div className={cx('roading-container')}>
              <LoadingIcon />
            </div>
          )
        }
      >
        <div className={cx('list-container')}>
          {isDesktop
            ? imageVerticalList?.map((imageList, index) => {
                return (
                  <div key={index}>
                    {imageList?.map((imageItem, idx) => {
                      return (
                        <ImageItem
                          key={'desktop' + index + idx}
                          id={imageItem?.image?.id}
                          image={imageItem?.image?.imageUrl}
                          userProfileImage={imageItem?.image?.user?.profileImage}
                          userName={imageItem?.image?.user?.userName}
                          userLink={imageItem?.image?.user?.userLink}
                        />
                      );
                    })}
                  </div>
                );
              })
            : originalImageList?.map((imageItem, idx) => {
                return (
                  <ImageItem
                    key={'mobile' + idx}
                    id={imageItem?.image?.id}
                    image={imageItem?.image?.imageUrl}
                    userProfileImage={imageItem?.image?.user?.profileImage}
                    userName={imageItem?.image?.user?.userName}
                    userLink={imageItem?.image?.user?.userLink}
                  />
                );
              })}
          <div className={cx('empty-item')}></div>
          <div className={cx('empty-item')}></div>
        </div>
      </InfiniteScroll>
    </div>
  );
}
export default Lookpage;

export const path = ['', '/look-list'];
