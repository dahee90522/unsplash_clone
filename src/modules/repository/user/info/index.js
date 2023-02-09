import axios from 'Modules/repository/axios';

async function get(page = 1, per_page = 20, order_by = 'latest') {
  try {
    const result = await axios().get(
      `/photos?page=${page}&per_page=${per_page}&order_by=${order_by}`,
    );
    const imageItems = result.data;

    return imageItems?.map((imageInfo) => {
      return {
        image: {
          id: imageInfo.id,
          imageUrl: imageInfo?.urls?.regular,
          user: {
            userName: imageInfo.user.username,
            userLink: imageInfo.user.links.html,
            profileImage: imageInfo.user.profile_image?.large,
          },
        },
      };
    });
  } catch (e) {
    console.error(e);
  }
}
async function getImageDetail(imageId) {
  try {
    const result = await axios().get(`/photos/${imageId}`);
    const detailResult = result?.data;

    const { data } = await axios().get(`/photos/${imageId}/related?per_page=20`);
    const listArray = [[], []];
    (data?.results ?? []).forEach((item, idx) => {
      listArray[idx % 2].push({
        image: {
          id: item.id,
          imageUrl: item?.urls?.regular,
          user: {
            userName: item.user.username,
            userLink: item.user.links.html,
            profileImage: item.user.profile_image?.large,
          },
        },
      });
    });

    return { ...detailResult, ['relateImageList']: listArray };
  } catch (e) {
    console.error(e);
  }
}
async function searchImage(keyword = '', page = 1) {
  try {
    const { data } = await axios().get(`/search/photos?query=${keyword}&per_page=20&page=${page}`);

    return {
      imageList: data?.results?.map((imageInfo) => {
        return {
          image: {
            id: imageInfo.id,
            imageUrl: imageInfo?.urls?.regular,
            user: {
              userName: imageInfo.user.username,
              userLink: imageInfo.user.links.html,
              profileImage: imageInfo.user.profile_image?.large,
            },
          },
        };
      }),
      totalPage: data?.total_pages,
    };
  } catch (e) {
    console.error(e);
  }
}
async function getRandomImage(keyword = '', page = 1) {
  try {
    const { data } = await axios().get(`/photos/random?count=1`);

    return data;
  } catch (e) {
    console.error(e);
  }
}

export { get, getImageDetail, searchImage, getRandomImage };
