const UserService = require('../services/users.service');
const jwt = require('jsonwebtoken');

class UsersController {
  userService = new UserService();

  signup = async (req, res, next) => {
    try {
      const { nickname, password, confirm, phoneNumber, address, userType } =
        req.body;
      const existsUsers = await this.userService.findUserByNickname(nickname);
      const nicknameCheck = /^[A-Za-z0-9]{3,}$/;
      const phoneNumberCheck = /^[0-9]{11,11}$/;

      if (nickname.length == 0) {
        res.status(412).send({
          errorMessage: '닉네임을 입력해주세요.',
        });
        return;
      } else if (!nicknameCheck.test(nickname)) {
        res.status(412).send({
          errorMessage:
            '닉네임의 형식이 일치하지 않습니다. (영문자와 숫자만 조합가능)',
        });
        return;
      } else if (existsUsers.nickname) {
        res.status(412).send({
          errorMessage: '중복된 닉네임입니다.',
        });
        return;
      }

      if (password.length == 0) {
        res.status(412).send({
          errorMessage: '패스워드를 입력해주세요.',
        });
        return;
      } else if (password.length < 4) {
        res.status(412).send({
          errorMessage:
            '패스워드 형식이 일치하지 않습니다. (4자리 이상만 가능)',
        });
        return;
      } else if (password.includes(nickname) === true) {
        res.status(412).send({
          errorMessage: '패스워드에 닉네임이 포함되어 있습니다.',
        });
        return;
      } else if (password !== confirm) {
        res.status(412).send({
          errorMessage: '패스워드가 일치하지 않습니다.',
        });
        return;
      }

      if (phoneNumber.length == 0) {
        res.status(412).send({
          errorMessage: '전화번호를 입력해주세요.',
        });
        return;
      } else if (!phoneNumberCheck.test(phoneNumber)) {
        res.status(412).send({
          errorMessage:
            '전화번호의 형식이 일치하지 않습니다. ( -없이 11자리만 가능 )',
        });
        return;
      }

      if (address.length == 0) {
        res.status(412).send({
          errorMessage: '주소를 입력해주세요.',
        });
        return;
      }

      if (userType !== 0 && userType !== 1) {
        res.status(412).send({
          errorMessage: '사용자 유형을 선택하지 않았습니다.',
        });
        return;
      }

      await this.userService.createUser(
        nickname,
        password,
        phoneNumber,
        address,
        userType
      );

      if (userType === 0) {
        let point = 1000000;
        await this.userService.updateUserPointByNickname(point, nickname);
      }

      res.status(201).send({
        message: '회원 가입에 성공하였습니다.',
      });
    } catch (err) {
      res.status(400).send({
        errorMessage: '요청한 데이터 형식이 올바르지 않습니다.',
      });
      return;
    }
  };

  login = async (req, res, next) => {
    try {
      const { nickname, password } = req.body;
      const user = await this.userService.findUserByNickname(nickname);
      if (!nickname) {
        res.status(412).send({
          errorMessage: '닉네임을 입력해주세요.',
        });
        return;
      }
      if (!user.nickname) {
        res.status(412).send({
          errorMessage: '존재하지 않는 닉네임 입니다.',
        });
        return;
      }

      if (!password) {
        res.status(412).send({
          errorMessage: '패스워드를 입력해주세요.',
        });
        return;
      } else if (password !== user.password) {
        res.status(412).send({
          errorMessage: '패스워드가 틀렸습니다.',
        });
        return;
      }

      res.send({
        token: jwt.sign({ userId: user.userId }, 'customized-secret-key'),
      });
    } catch (err) {
      res.status(400).send({
        errorMessage: '로그인에 실패하였습니다.',
      });
      return;
    }
  };

  me = async (req, res, next) => {
    const { user } = res.locals;
    res.send({
      user,
    });
  };

  getUser = async (req, res, next) => {
    const { userId } = res.locals.user;
    try {
      const userInfo = await this.userService.findUserByPk(userId);
      return res.status(200).json({ data: userInfo });
    } catch (error) {
      return res.status(400).json({
        errorMessage: '회원 정보 조회에 실패하였습니다.',
      });
    }
  };

  updatePoint = async (req, res, next) => {
    try {
      const { nickname } = res.locals.user;
      const { point } = req.body;
      await this.userService.updateUserPointByNickname(point, nickname);
    } catch (error) {
      return res.status(400).json({
        errorMessage: '포인트 수정에 실패하였습니다.',
      });
    }
    
  }

  updateUser = async (req, res, next) => {
    const { userId } = res.locals.user;
    const { phoneNumber, address, password, confirm } = req.body;

    if (!phoneNumber || !address) {
      return res.status(412).json({
        errorMessage: '데이터 형식이 올바르지 않습니다.',
        // errorMessage: "전화번호와 주소 중 한 곳이 비었습니다."
      });
    }
    // // 비밀 번호 수정이 가능토록 하려면:
    // // '새 비밀번호'란에 아무것도 없이 수정 요청이 들어온다면 vs 새 비밀번호도 같이 들어온다면
    // // 수정 요청을 보낼 때마다 프론트에서 알아서 '수정 요청용 비밀번호'를
    // // 기존 번호로 넣어서 보내게 하는 건 보안에 좀 안 좋겠지..?
    // if (password.length < 4) {
    //   return res.status(412).send({
    //     errorMessage: '패스워드 형식이 일치하지 않습니다.',
    //   });
    // }
    // if (password !== confirm) {
    //   return res.status(412).send({
    //     errorMessage: '패스워드가 일치하지 않습니다.',
    //   });
    // }
    // if (password.includes(nickname) === true) {
    //   return res.status(412).send({
    //     errorMessage: '패스워드에 닉네임이 포함되어 있습니다.',
    //   });
    // }

    try {
      // 404 Not Found
      // -> 로그인 된 상태라면 해당 유저가 존재하지 않을 가능성은 없으므로.. 스킵

      // 410 Unauthorized
      // -> 자기자신의 것이 아닌 마이페이지를 보고 있을 리 없으므로 이 가능성도 스킵

      // 200
      const user = await this.userService.updateUserInfoByPk(
        userId,
        phoneNumber,
        address
      );
      return res.status(200).json({
        message: '회원 정보 수정이 완료되었습니다.',
      });
    } catch (error) {
      console.log(error.message);
      return res.status(400).json({
        errorMessage: '회원 정보 수정에 실패하였습니다.',
      });
    }
  };

  deleteUser = async (req, res, next) => {
    const { userId } = res.locals.user;
    try {
      const deleted = await this.userService.deleteUserByPk(userId);
      return res.status(200).json({
        message: '탈퇴가 완료되었습니다.',
      });
    } catch (error) {
      console.log(error.message);
      return res.status(400).json({
        errorMessage: '예기치 못한 문제로 탈퇴 처리에 실패하였습니다.',
      });
    }
  };
}

module.exports = UsersController;
