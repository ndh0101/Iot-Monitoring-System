module.exports = function(router) {
	var SensorController = require('../controller/sensor.controller');

    /**
     * @swagger
     * tags:
     *   name: Sensor
     *   description: API quản lý dữ liệu sensor
     */

    /**
     * @swagger
     * /api/sensor/getinfo:
     *   get:
     *     summary: Lấy thông tin số lượng sensor (đếm, số trang,...)
     *     tags: [Sensor]
     *     parameters:
     *       - in: query
     *         name: size
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Thông tin sensor
     */
	router.get('/api/sensor/getinfo', SensorController.get_info);

    /**
     * @swagger
     * /api/sensor/all:
     *   get:
     *     summary: Lấy toàn bộ dữ liệu sensor
     *     tags: [Sensor]
     *     responses:
     *       200:
     *         description: Danh sách sensor
     */
	router.get('/api/sensor/all', SensorController.get_all);

    /**
     * @swagger
     * /api/sensor/data:
     *   get:
     *     summary: Lấy dữ liệu sensor theo trang
     *     tags: [Sensor]
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *       - in: query
     *         name: size
     *         schema:
     *           type: integer
     *       - in: query
     *         name: sortBy
     *         schema:
     *           type: string
     *           enum: [id, temperature, humidity, light, time]
     *       - in: query
     *         name: order
     *         schema:
     *           type: string
     *           enum: [ASC, DESC]
     *     responses:
     *       200:
     *         description: Dữ liệu sensor theo trang
     */
	router.get('/api/sensor/data', SensorController.get_page);

    /**
     * @swagger
     * /api/sensor/search:
     *   get:
     *     summary: Tìm kiếm dữ liệu sensor
     *     tags: [Sensor]
     *     parameters:
     *       - in: query
     *         name: type
     *         schema:
     *           type: string
     *           enum: [id, temperature, humidity, light, time]
     *       - in: query
     *         name: search
     *         schema:
     *           type: string
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *       - in: query
     *         name: size
     *         schema:
     *           type: integer
     *       - in: query
     *         name: sortBy
     *         schema:
     *           type: string
     *           enum: [id, temperature, humidity, light, time]
     *       - in: query
     *         name: order
     *         schema:
     *           type: string
     *           enum: [ASC, DESC]
     *     responses:
     *       200:
     *         description: Kết quả tìm kiếm sensor
     */
	router.get('/api/sensor/search', SensorController.get_search);
}
