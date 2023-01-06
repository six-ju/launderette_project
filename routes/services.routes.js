// 1. 필요 모듈 임포트
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');

// 2. 컨트롤러 인스턴스 생성
const ServicesController = require('../controllers/services.controller');
const servicesController = new ServicesController();

// 3. 라우터로 경로 지정
router.get('/owner/mypage', authMiddleware, servicesController.getOwnerService);
router.put('/pickup/:serviceId', authMiddleware, servicesController.pickupService);
router.put(
  '/:serviceId/mypage',
  authMiddleware,
  servicesController.updateServiceStatus
);
router.post('/', authMiddleware, servicesController.request);
router.get('/customer', authMiddleware, servicesController.customerInfo);
router.get('/customer/pending', authMiddleware, servicesController.getPendingService);

const { upload } = require('../middlewares/image-upload-middleware');
router.post('/upload', upload.single('userfile'), async (req, res) => {
  console.log(req.file);
});

module.exports = router;
