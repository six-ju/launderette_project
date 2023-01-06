// 1. sequelize의 적절한 '모델'을 불러오기 => 생성자 주입으로 빠짐.
const { Op } = require('sequelize');

// 2. ServicesRepository 클래스 만들기
class ServicesRepository {
  constructor(ServicesModel) {
    this.servicesModel = ServicesModel;
  }

  // 서비스 데이터 생성
  createService = async (image, customerRequest, customerId) => {
    const createdService = await this.servicesModel.create({
      image,
      customerRequest,
      customerId,
    });
    return createdService;
  };

  // 손님 id로 해당 손님의 서비스 조회 - 사장님과 손님 데이터 붙여서
  findServicesByCustomerIdJoined = async (customerId) => {
    const services = await this.servicesModel.findAll({
      include: ['owner', 'customer'],
      where: { customerId },
      order: [['serviceId', 'DESC']],
    });
    return services;
  };

    // 대기중인 서비스 조회
    findServicesByStatus = async (status) => {
      const services = await this.servicesModel.findAll({
        include: ['owner', 'customer'],
        where: { status },
        order: [['serviceId', 'DESC']],
      });
      return services;
    };
    

  // '사장님이' '진행중인' 세탁 서비스 하나 조회
  findOngoingServiceByOwnerId = async (ownerId) => {
    const service = await this.servicesModel.findOne({
      where: {
        ownerId: ownerId,
        status: { [Op.ne]: '배송 완료' },
      },
    });
    // console.log("myService: ", myService)
    // myService 자체가 null일 수 있으므로 myService.dataValues를 반환하면 안 됨.
    return service;
  };

  // 서비스id로 서비스 조회 - 사장님과 손님 데이터 붙여서
  findServiceByPkJoined = async (serviceId) => {
    const service = await this.servicesModel.findOne({
      include: ['owner', 'customer'],
      where: { serviceId },
    });
    return service;
  };

  // 서비스 id로 서비스 조회 - 조인문으로 가져온 데이터
  // 그대로 다시 save()하면 어떻게 될지 몰라서 순수 service 데이터 조회용으로.
  findServiceByPk = async (serviceId) => {
    const service = await this.servicesModel.findByPk(serviceId);
    return service;
  };

  // 서비스 상태와 맡은 사장님 업데이트
  updateServiceByPk = async (serviceId, status, ownerId) => {
    const updateServiceData = await this.servicesModel.update(
      { status, ownerId },
      { where: { serviceId } }
    );
    return updateServiceData;
  };

  // // 서비스 상태 업데이트 => 굳이 필요 없는 듯...
  // updateServiceStatusByPk = async (serviceId, status) => {
  //   const updateServiceData = await this.servicesModel.update(
  //       { status },
  //       { where: { serviceId }}
  //   )
  //   return updateServiceData;
  // }
}

// 3. ServiceRepository 내보내기.
module.exports = ServicesRepository;
