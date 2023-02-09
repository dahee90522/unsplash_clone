import { computed, observable } from 'mobx';

class UserModel {
  @observable
  id;
  username;
  name;
  bio;
  link;
  profileImage;
  instagramUserName;
  totaCollections;
  totalLikes;
  totalPhotos;
  isHost;

  constructor(value) {
    this.id = value?.id;
    this.name = value?.name;
    this.gender = value?.gender;
    this.birthYear = value?.birthYear ?? value?.birth_year;
    this.email = value?.email;
    this.description = value?.description;
    this.phoneNumber = value?.phoneNumber ?? value?.phone_number;
    this.marketingStatus = value?.marketingStatus ?? value?.marketing_consent;
    this.joinType = value?.joinType ?? value?.join_type;
    this.isHost = value?.is_host;
  }

  @computed
  get isVerified() {
    return !!this.phoneNumber;
  }

  @computed
  get age() {
    return new Date().getFullYear() - this.birthYear + 1;
  }
}

export default UserModel;
