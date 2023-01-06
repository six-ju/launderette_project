const UserRepository = require('../repositories/users.repository');
const { User } = require('../models');

class UserService {
  userRepository = new UserRepository(User);

  findUserByNickname = async (nickname) => {
    const findUser = await this.userRepository.findUserByNickname(nickname);
    return {
      userId: findUser.userId,
      nickname: findUser.nickname,
      password: findUser.password,
      phoneNumber: findUser.phoneNumber,
      address: findUser.address,
      userType: findUser.userType,
      point: findUser.point,
      createdAt: findUser.createdAt,
      updatedAt: findUser.updatedAt,
    };
  };

  createUser = async (nickname, password, phoneNumber, address, userType) => {
    const createUserData = await this.userRepository.createUser(
      nickname,
      password,
      phoneNumber,
      address,
      userType
    );

    return {
      nickname: createUserData.nickname,
      password: createUserData.password,
      phoneNumber: createUserData.phoneNumber,
      address: createUserData.address,
      userType: createUserData.userType,
    };
  };

  updateUserPointByNickname = async (point, nickname) => {
    const findUser = await this.userRepository.findUserByNickname(nickname);

    await this.userRepository.updateUserPointByNickname(findUser.point + point, nickname);

    const updateUser = await this.userRepository.findUserByNickname(nickname);

    return {
      userId: updateUser.userId,
      nickname: updateUser.nickname,
      password: updateUser.password,
      phoneNumber: updateUser.phoneNumber,
      address: updateUser.address,
      userType: updateUser.userType,
      point: updateUser.point,
      createdAt: updateUser.createdAt,
      updatedAt: updateUser.updatedAt,
    };
  };

  findUserByPk = async (userId) => {
    const user = await this.userRepository.findUserByPk(userId);
    return {
      nickname: user.nickname,
      phoneNumber: user.phoneNumber,
      address: user.address,
      point: user.point,
    };
  };

  updateUserInfoByPk = async (userId, phoneNumber, address) => {
    const updatedUserData = await this.userRepository.updateUserInfoByPk(
      userId,
      phoneNumber,
      address
    );
    return {
      nickname: updatedUserData.nickname,
      phoneNumber: updatedUserData.phoneNumber,
      address: updatedUserData.address,
      point: updatedUserData.point,
      createdAt: updatedUserData.createdAt,
      updatedAt: updatedUserData.updatedAt,
    };
  };

  deleteUserByPk = async (userId) => {
    const deletedUserData = await this.userRepository.deleteUserByPk(userId);
    return {
      nickname: deletedUserData.nickname,
      phoneNumber: deletedUserData.phoneNumber,
      address: deletedUserData.address,
      point: deletedUserData.point,
      createdAt: deletedUserData.createdAt,
      updatedAt: deletedUserData.updatedAt,
    };
  };
}

module.exports = UserService;
