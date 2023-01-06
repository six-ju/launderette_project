// 1. 제2계층 서비스 담당('Service'에 맞는)을 불러오기
const ServicesService = require('../services/services.service');

// 2. ServicesController 클래스 작성하기
class ServicesController {
  servicesService = new ServicesService();

  // 빨래 서비스 신청
  request = async (req, res, next) => {
    const { userId } = res.locals.user;
    const { image, customerRequest } = req.body;

    // 400 Bad Request
    // body 데이터가 안 들어왔을 시
    if (!image) {
      // customerRequest는 없을 수 있다.
      return res.status(400).json({
        errorMessage: '데이터 형식이 올바르지 않습니다.',
      });
    }
    try {
      const requsested = await this.servicesService.createService(
        image,
        customerRequest,
        userId
      );
      return res.status(200).json({
        message: '세탁 서비스 신청이 등록되었습니다. 10,000P가 차감됩니다.',
      });
    } catch (error) {
      console.log(error.message);
      return res.status(400).json({
        errorMessage: '서비스 등록이 정상적으로 처리되지 않았습니다.',
      });
    }
  };

  // 내 서비스 신청목록 조회
  customerInfo = async (req, res, next) => {
    const { userId } = res.locals.user;
    try {
      const service = await this.servicesService.findServicesByCustomerId(
        userId
      );
      if (service.length == 0) {
        return res.status(404).json({
          errorMessage: '현재까지 신청하신 서비스가 하나도 없습니다.',
        });
      }
      return res.status(200).json({
        data: service,
      });
    } catch (error) {
      console.log(error.message);
      res.status(400).send({
        errorMessage: '서비스 목록 조회에 실패하였습니다.',
      });
    }
  };

  // 대기 중인 신청목록 조회
  getPendingService = async (req, res, next) => {
    try {
      const service = await this.servicesService.findServicesByStatus(
        '대기 중'
      );
      if (service.length == 0) {
        return res.status(404).json({
          errorMessage: '현재까지 신청하신 서비스가 하나도 없습니다.',
        });
      }
      return res.status(200).json({
        data: service,
      });
    } catch (error) {
      console.log(error.message);
      res.status(400).send({
        errorMessage: '서비스 목록 조회에 실패하였습니다.',
      });
    }
  };

  // 사장님 마이페이지에서 현재 진행중인 세탁 서비스 조회
  getOwnerService = async (req, res, next) => {
    const { userId } = res.locals.user;
    const myService = await this.servicesService.findOngoingServiceByOwnerId(
      userId
    );

    // 404 Not Found
    // 현재 진행중인 서비스가 없는 경우
    if (!myService) {
      console.log('현재 진행중 서비스 없음 탈출.');
      return res.status(404).json({
        errorMessage: '현재 진행중인 세탁 서비스가 없습니다.',
      });
    }

    // 현재 진행중인 서비스가 있는 경우
    const { serviceId } = myService.dataValues;
    try {
      const data = await this.servicesService.findServiceByPkJoined(serviceId);
      return res.status(200).json({ data });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        errorMessage: '서비스 조회에 실패하였습니다.',
      });
    }
  };

  // 서비스 목록에서 서비스 픽
  pickupService = async (req, res, next) => {
    const { serviceId } = req.params;
    const { userId, userType } = res.locals.user;
    console.log(serviceId, userId, userType)
    // 유저 타입이 '사장님(1)'이 아닌 경우 (혹시 모르니)
    if (!userType) {
      return res.status(401).json({
        errorMessage: '"사장님"만 서비스를 픽업할 수 있습니다.',
      });
    }

    // 세탁 서비스 목록에서 픽업하려는데 이미 진행 중인 세탁물이 있는 경우
    try {
      const alreadyHasOne =
        await this.servicesService.findOngoingServiceByOwnerId(userId);
      console.log(alreadyHasOne);
      if (alreadyHasOne) {
        return res.status(400).json({
          errorMessage: '이미 진행중인 세탁 서비스가 있습니다.',
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        errorMessage:
          '(진행중 서비스 조회중)입력한 데이터가 올바르지 않습니다.',
      });
    }

    // 서비스 상태 업데이트하기(ownerId 추가, status='수거 중'으로 수정)
    try {
      const updatedService = await this.servicesService.updateServiceByPk(
        serviceId,
        '수거 중',
        userId
      );
      console.log(updatedService);
      return res.status(200).json({
        message: `${serviceId}번 세탁물을 픽업하셨습니다.`,
      });
    } catch (error) {
      console.log(error.message);
      return res.status(400).json({
        errorMessage: '(서비스 업데이트중)세탁물 픽업에 실패하였습니다.',
      });
    }
  };

  // 서비스 상태 업데이트 진행("수거 중 -> 수거 완료 → 배송 중 → 배송 완료" 순서로)
  updateServiceStatus = async (req, res, next) => {
    const { serviceId } = req.params;
    const { status } = req.body;
    const { userId } = res.locals.user;

    // 400 Bad Request
    // status가 안 들어왔을 시
    if (!status) {
      return res.status(400).json({
        errorMessage: '데이터 형식이 올바르지 않습니다.',
      });
    }

    // 세탁 상태 업데이트하기
    try {
      const service = await this.servicesService.findServiceByPk(serviceId);

      // 401
      // 해당 사용자가 '수정 권한이 있는 사용자인지'도 검사해야할까?

      // 400 Bad Request
      // 수거 완료 → 배송 중 → 배송 완료 의 순서로 업데이트 하지 않은 경우
      if (service.status === '대기 중' && status !== '수거 중') {
        return res.status(400).json({
          errorMessage:
            '세탁 상태는 "수거 중 -> 수거 완료 → 배송 중 → 배송 완료"의 순서로 업데이트 가능합니다',
        });
      }
      if (service.status === '수거 중' && status !== '수거 완료') {
        return res.status(400).json({
          errorMessage:
            '세탁 상태는 "수거 중 -> 수거 완료 → 배송 중 → 배송 완료"의 순서로 업데이트 가능합니다',
        });
      }
      if (service.status === '수거 완료' && status !== '배송 중') {
        return res.status(400).json({
          errorMessage:
            '세탁 상태는 "수거 중 -> 수거 완료 → 배송 중 → 배송 완료"의 순서로 업데이트 가능합니다',
        });
      }
      if (service.status === '배송 중' && status !== '배송 완료') {
        return res.status(400).json({
          errorMessage:
            '세탁 상태는 "수거 중 -> 수거 완료 → 배송 중 → 배송 완료"의 순서로 업데이트 가능합니다',
        });
      }

      // 서비스 상태 업데이트 진행
      const updatedService = await this.servicesService.updateServiceByPk(
        serviceId,
        status,
        userId
      );
      return res.status(200).json({
        message: '세탁 상태를 업데이트 하였습니다.',
      });
    } catch (error) {
      console.log(error.message);
      return res.status(400).json({
        errorMessage:
          '(서비스 조회와 업데이트중)세탁 상태 업데이트에 실패하였습니다.',
      });
    }
  };
}

// 3. ServicesController 클래스 내보내기
module.exports = ServicesController;
