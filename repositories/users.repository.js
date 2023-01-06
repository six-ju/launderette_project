
class UserRepository {
  constructor(UserModel) {
    this.userModel = UserModel;
  }

  findUserByNickname = async (nickname) => {
    const user = await this.userModel.findOne({ raw: true, where: { nickname } });
    if (user === null) {
      return {};
    }
    return user;
  };

  createUser = async (nickname, password, phoneNumber, address, userType) => {
    const createUserData = await this.userModel.create({
      nickname,
      password,
      phoneNumber,
      address,
      userType,
    });

    return createUserData;
  };

  updateUserPointByNickname = async (point, nickname) => {
    const updateUserPoint = await this.userModel.update(
      { point },
      { where: { nickname } }
    );
    console.log(updateUserPoint);

    return updateUserPoint;
  };

  findUserByPk = async (userId) => {
    const user = await this.userModel.findByPk(userId);
    return user;
  };

  updateUserInfoByPk = async (userId, phoneNumber, address) => {
    const updatedUserData = await this.userModel.update(
      { phoneNumber, address },
      { where: { userId } }
      // { where: { userId, password } }
    );
    return updatedUserData;
  };

  deleteUserByPk = async (userId) => {
    const deletedUserData = await this.userModel.destroy({
      where: { userId },
      // where: { userId, password }
    });
    return deletedUserData;
  };
}

module.exports = UserRepository;
