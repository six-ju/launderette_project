// 1. 제3계층 레파지토리 담당('Service'에 맞는)을 불러오기
const ServicesRepository = require('../repositories/services.repository');
const { Service } = require('../models');

// 2. ServicesService 클래스 작성하기
class ServicesService {
  servicesRepository = new ServicesRepository(Service);

  // 1.
  createService = async (image, customerRequest, customerId) => {
    const createdService = await this.servicesRepository.createService(
      image,
      customerRequest,
      customerId
    );
    return createdService;
  };

  // 2.
  findServicesByCustomerId = async (customerId) => {
    const services =
      await this.servicesRepository.findServicesByCustomerIdJoined(customerId);
    return services.map((service) => {
      return {
        serviceId: service.serviceId,
        customerNickname: service.customer.nickname,
        image: service.image,
        customerRequest: service.customerRequest,
        customerAddress: service.customer.address,
        customerPhoneNumber: service.customer.phoneNumber,
        status: service.status,
        createdAt: service.createdAt,
        updatedAt: service.updatedAt,
        ownerId: service.owner ? service.owner.userId : '',
        ownerNickname: service.owner ? service.owner.nickname : '',
        ownerPhoneNumber: service.owner ? service.owner.phoneNumber : '',
        ownerAddress: service.owner ? service.owner.address : '',
      };
    });
  };

  findServicesByStatus = async (status) => {
    const services =
      await this.servicesRepository.findServicesByStatus(status);
    return services.map((service) => {
      return {
        serviceId: service.serviceId,
        customerNickname: service.customer.nickname,
        image: service.image,
        customerRequest: service.customerRequest,
        customerAddress: service.customer.address,
        customerPhoneNumber: service.customer.phoneNumber,
        status: service.status,
        createdAt: service.createdAt,
        updatedAt: service.updatedAt,
        ownerId: service.owner ? service.owner.userId : '',
        ownerNickname: service.owner ? service.owner.nickname : '',
        ownerPhoneNumber: service.owner ? service.owner.phoneNumber : '',
        ownerAddress: service.owner ? service.owner.address : '',
      };
    });
  };

  // 3.
  findOngoingServiceByOwnerId = async (ownerId) => {
    const serviceDetail =
      await this.servicesRepository.findOngoingServiceByOwnerId(ownerId);
    return serviceDetail;
  };

  // 4.
  findServiceByPkJoined = async (serviceId) => {
    // 에러 메세지를 반환하는 것은 controller의 역할
    const serviceDetail = await this.servicesRepository.findServiceByPkJoined(
      serviceId
    );
    return {
      serviceId: serviceDetail.serviceId,
      customerNickname: serviceDetail.customer.nickname,
      image: serviceDetail.image,
      customerRequest: serviceDetail.customerRequest,
      customerAddress: serviceDetail.customer.address,
      customerPhoneNumber: serviceDetail.customer.phoneNumber,
      status: serviceDetail.status,
      createdAt: serviceDetail.createdAt,
      updatedAt: serviceDetail.updatedAt,
      ownerNickname: serviceDetail.owner ? serviceDetail.owner.nickname : '',
    };
  };

  // 5.
  // 그런데 이 순수 service 데이터는 '수정'할 때 필요한 것인데
  // 이미 save() 루트 말고 .update()로 구현해버렸으면
  // 이제 이 메소드는 필요가 없을 것인가..?
  findServiceByPk = async (serviceId) => {
    const serviceDetail = await this.servicesRepository.findServiceByPk(
      serviceId
    );
    console.log(serviceDetail);
    console.log(serviceDetail.dataValues);
    // 뭘 추출하지?
    return serviceDetail;
  };

  // 6.
  updateServiceByPk = async (serviceId, status, ownerId) => {
    const updatedPost = await this.servicesRepository.updateServiceByPk(
      serviceId,
      status,
      ownerId
    );
    return updatedPost;
  };
}

// 3. ServiceService 클래스 내보내기
module.exports = ServicesService;
