import React, { Component, useEffect, useRef, useState } from 'react';

import ImageItem from 'Components/organisms/ImageItem';
import LoadingIcon from 'Components/atoms/loadingIcon';
import SvgCalendar from 'Assets/svgs/calendar.svg';
import SvgCamera from 'Assets/svgs/camera.svg';
import SvgClose from 'Assets/svgs/close-white.svg';
import SvgLocation from 'Assets/svgs/location.svg';
import SvgProvide from 'Assets/svgs/provide.svg';
import TagItem from 'Components/organisms/TagItem';
import { User } from 'Modules/repository';
import classNames from 'classnames/bind';
import moment from 'moment';
import numberToComma from 'Utils/numberToComma';
import styles from './styles.module.scss';
import { useScroll } from 'Utils/customHooks';
import { withRouter } from 'react-router-dom';

const cx = classNames.bind(styles);

function Modal({ match, history, ...props }) {
  const modalRef = useRef();
  const photoId = match.params?.photoId;
  const [isNoData, setIsNoData] = useState(undefined);
  const [cameraInfoHover, setCameraInfoHover] = useState(false);
  const [isModal, setIsModal] = useState(props?.isModal);
  const [target, setTarget] = useState(undefined);
  const [publish, setPublish] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    async function getDetail() {
      try {
        const list = await User.Info.getImageDetail(photoId);
        if (list === undefined) {
          setIsNoData(true);
        } else {
          setIsNoData(undefined);
          const publishedHour = moment
            .duration(moment().diff(moment(target?.created_at)))
            .asHours();
          const publishedDay = moment.duration(moment().diff(moment(target?.created_at))).asDays();
          setPublish({
            publishedHour,
            publishedDay,
            publishDiffFormat:
              publishedHour <= 24
                ? `${Math.round(publishedHour)} hours`
                : `${Math.round(publishedDay)} days`,
          });
          setTarget(list);
          if (isModal && list !== undefined && document.getElementById('modal-id') !== null)
            document.getElementById('modal-id').scrollTo(0, 0);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    getDetail();
  }, [photoId]);
  if (isNoData !== undefined) {
    return (
      <div className={cx('is-not-load-container')}>
        <div>
          <div className={cx('headLine1')}>PAGE NOT FOUND</div>
          <button className={cx('headLine2')} onClick={() => history.goBack()}>
            GO BACK
          </button>
        </div>
      </div>
    );
  } else if (!isModal && isLoading) {
    return (
      <div className={cx('roading-container')}>
        <LoadingIcon />
      </div>
    );
  } else if (isModal) {
    return (
      <div ref={modalRef} className={cx('modal-wrapper')} onClick={() => history.goBack()}>
        <SvgClose className={cx('close-button')} onClick={() => history.goBack()} />

        <div
          id={'modal-id'}
          className={cx('modal', 'modal-container')}
          onClick={(e) => e.stopPropagation()}
        >
          {isLoading && (
            <div className={cx('roading-container')}>
              <LoadingIcon />
            </div>
          )}
          <div className={cx('cover-image-wrapper')}>
            <img src={target?.urls?.regular} />
          </div>
          <div className={cx('profile-container')}>
            <img
              src={target?.user?.profile_image?.large}
              onClick={() => window.open(target?.user?.links?.html)}
            />
            <div className={cx('headLine2')} onClick={() => window.open(target?.user?.links?.html)}>
              {target?.user?.name}
            </div>
          </div>
          <div className={cx('image-info-container')}>
            <div className={cx('image-info-container-up')}>
              <div>
                <span className={cx('headLine2', 'title')}>views</span>
                <span className={cx('headLine1', 'number')}>{numberToComma(target?.views)}</span>
              </div>
              <div>
                <span className={cx('headLine2', 'title')}>downloads</span>
                <span className={cx('headLine1', 'number')}>
                  {numberToComma(target?.downloads)}
                </span>
              </div>
            </div>
            <div className={cx('image-info-container-down')}>
              <div>
                {target?.location?.name && (
                  <div className={cx('body1')}>
                    <SvgLocation />
                    {target?.location?.name}
                  </div>
                )}
                {publish?.publishedHour > 0 && (
                  <div className={cx('body1')}>
                    <SvgCalendar />
                    published {publish?.publishDiffFormat} ago
                  </div>
                )}
                {target?.exif?.name && (
                  <div
                    className={cx('body1', 'camera-info-wrapper')}
                    onMouseEnter={() => setCameraInfoHover(true)}
                    onMouseLeave={() => setCameraInfoHover(false)}
                  >
                    <SvgCamera />
                    {target?.exif?.name}
                    {cameraInfoHover && (
                      <div className={cx('camera-info')}>
                        <span className={cx('caption1')}>Camera</span>
                        <p className={cx('body2')}>{target?.exif?.name}</p>
                        <span className={cx('caption1')}>Lens</span>
                        <p className={cx('body2')}>
                          {target?.exif?.focal_length} f/{target?.exif?.aperture}
                        </p>
                        <p className={cx('body2')}>{target?.exif?.exposure_time}s</p>
                        <p className={cx('body2')}>ISO {target?.exif?.iso}s</p>
                        <span className={cx('caption1')}>Dimensions</span>
                        <p className={cx('body2')}>
                          {target?.width} x {target?.height}
                        </p>
                      </div>
                    )}
                  </div>
                )}
                <div className={cx('body1')}>
                  <SvgProvide />
                  Free to use under the Unsplash License
                </div>
              </div>
              {target?.description && (
                <div className={cx('image-description')}>{target?.description}</div>
              )}
            </div>
          </div>
          {target?.relateImageList[0]?.length > 0 && (
            <>
              <h1 className={cx('headLine1')}>Related photos</h1>
              <div className={cx('user-images')}>
                {target?.relateImageList?.map((imageList, index) => (
                  <div key={index}>
                    {imageList?.map((imageItem, idx) => {
                      return (
                        <ImageItem
                          key={'relate-img' + idx}
                          image={imageItem?.image?.imageUrl}
                          id={imageItem?.image?.id}
                          userProfileImage={imageItem?.image?.user?.profileImage}
                          userName={imageItem?.image?.user?.userName}
                          userLink={imageItem?.image?.user?.userLink}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </>
          )}
          {target?.related_collections?.results?.length > 0 && (
            <>
              <h1 className={cx('headLine1')}>Related collections</h1>
              <div className={cx('relate-collection-container')}>
                {target?.related_collections?.results?.slice(0, 2)?.map((collection, index) => {
                  let photos = collection?.preview_photos;
                  return (
                    <div className={cx('collection-container')} key={`collection${index}`}>
                      <div className={cx('image-container')}>
                        <div className={cx('image-container-left')}>
                          <img src={photos[0].urls.regular} />
                        </div>
                        <div className={cx('image-container-right')}>
                          <img src={photos[1]?.urls?.regular} />
                          <img src={photos[2]?.urls?.regular} />
                        </div>
                      </div>
                      <div className={cx('collection-info-container')}>
                        <div className={cx('headLine2', 'collection-title')}>
                          {collection?.title}
                        </div>
                        <div className={cx('body1', 'collection-info')}>
                          {numberToComma(collection?.total_photos)} photos · Curated by{' '}
                          {collection?.user?.name}
                        </div>
                        <div className={cx('collection-tag')}>
                          {collection?.tags?.slice(0, 3)?.map((tag, idx) => {
                            return (
                              <TagItem
                                key={`collection-tag-modal-${tag?.title + index}`}
                                tag={tag?.title}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div className={cx('empty-item')}></div>
                <div className={cx('empty-item')}></div>
              </div>
            </>
          )}
          {target?.tags?.length > 0 && (
            <>
              <h1 className={cx('headLine1')}>Related tags</h1>
              <div className={cx('tag-container')}>
                {target?.tags?.map((tag, index) => {
                  return <TagItem key={`tag-modal-${tag?.title + index}`} tag={tag?.title} />;
                })}
              </div>
            </>
          )}
        </div>
      </div>
    );
  } else {
    return (
      <div className={cx('no-modal-wrapper', 'modal-container')}>
        <div className={cx('cover-image-wrapper')}>
          <img src={target?.urls?.regular} />
        </div>
        <div className={cx('profile-container')}>
          <img
            src={target?.user?.profile_image?.large}
            onClick={() => window.open(target?.user?.links?.html)}
          />
          <div className={cx('headLine2')} onClick={() => window.open(target?.user?.links?.html)}>
            {target?.user?.name}
          </div>
        </div>
        <div className={cx('image-info-container')}>
          <div className={cx('image-info-container-up')}>
            <div>
              <span className={cx('headLine2', 'title')}>views</span>
              <span className={cx('headLine1', 'number')}>{numberToComma(target?.views)}</span>
            </div>
            <div>
              <span className={cx('headLine2', 'title')}>downloads</span>
              <span className={cx('headLine1', 'number')}>{numberToComma(target?.downloads)}</span>
            </div>
          </div>
          <div className={cx('image-info-container-down')}>
            <div>
              {target?.location?.name && (
                <div className={cx('body1')}>
                  <SvgLocation />
                  {target?.location?.name}
                </div>
              )}
              {publish?.publishedHour > 0 && (
                <div className={cx('body1')}>
                  <SvgCalendar />
                  published {publish?.publishDiffFormat} ago
                </div>
              )}
              {target?.exif?.name && (
                <div
                  className={cx('body1', 'camera-info-wrapper')}
                  onMouseEnter={() => setCameraInfoHover(true)}
                  onMouseLeave={() => setCameraInfoHover(false)}
                >
                  <SvgCamera />
                  {target?.exif?.name}
                  {cameraInfoHover && (
                    <div className={cx('camera-info')}>
                      <span className={cx('caption1')}>Camera</span>
                      <p className={cx('body2')}>{target?.exif?.name}</p>
                      <span className={cx('caption1')}>Lens</span>
                      <p className={cx('body2')}>
                        {target?.exif?.focal_length} f/{target?.exif?.aperture}
                      </p>
                      <p className={cx('body2')}>{target?.exif?.exposure_time}s</p>
                      <p className={cx('body2')}>ISO {target?.exif?.iso}s</p>
                      <span className={cx('caption1')}>Dimensions</span>
                      <p className={cx('body2')}>
                        {target?.width} x {target?.height}
                      </p>
                    </div>
                  )}
                </div>
              )}
              <div className={cx('body1')}>
                <SvgProvide />
                Free to use under the Unsplash License
              </div>
            </div>
            {target?.description && (
              <div className={cx('image-description')}>{target?.description}</div>
            )}
          </div>
        </div>
        {target?.relateImageList[0]?.length > 0 && (
          <>
            <h1 className={cx('headLine1')}>Related photos</h1>
            <div className={cx('user-images')}>
              {target?.relateImageList?.map((imageList, index) => (
                <div key={index}>
                  {imageList?.map((imageItem, idx) => {
                    return (
                      <ImageItem
                        key={'relate-img' + idx}
                        image={imageItem?.image?.imageUrl}
                        id={imageItem?.image?.id}
                        userProfileImage={imageItem?.image?.user?.profileImage}
                        userName={imageItem?.image?.user?.userName}
                        userLink={imageItem?.image?.user?.userLink}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </>
        )}
        {target?.related_collections?.results?.length > 0 && (
          <>
            <h1 className={cx('headLine1')}>Related collections</h1>
            <div className={cx('relate-collection-container')}>
              {target?.related_collections?.results?.slice(0, 2)?.map((collection, index) => {
                let photos = collection?.preview_photos;
                return (
                  <div className={cx('collection-container')} key={`collection${index}`}>
                    <div className={cx('image-container')}>
                      <div className={cx('image-container-left')}>
                        <img src={photos[0].urls.regular} />
                      </div>
                      <div className={cx('image-container-right')}>
                        <img src={photos[1]?.urls?.regular} />
                        <img src={photos[2]?.urls?.regular} />
                      </div>
                    </div>
                    <div className={cx('collection-info-container')}>
                      <div className={cx('headLine2', 'collection-title')}>{collection?.title}</div>
                      <div className={cx('body1', 'collection-info')}>
                        {numberToComma(collection?.total_photos)} photos · Curated by{' '}
                        {collection?.user?.name}
                      </div>
                      <div className={cx('collection-tag')}>
                        {collection?.tags?.slice(0, 3)?.map((tag, idx) => {
                          return (
                            <TagItem
                              key={`collection-tag-${tag?.title + index}`}
                              tag={tag?.title}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className={cx('empty-item')}></div>
              <div className={cx('empty-item')}></div>
            </div>
          </>
        )}
        {target?.tags?.length > 0 && (
          <>
            <h1 className={cx('headLine1')}>Related tags</h1>
            <div className={cx('tag-container')}>
              {target?.tags?.map((tag, index) => {
                return <TagItem key={`tag-${tag?.title + index}`} tag={tag?.title} />;
              })}
            </div>
          </>
        )}
      </div>
    );
  }
}

export default withRouter(Modal);
