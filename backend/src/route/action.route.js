module.exports = function(router) {
  var ActionController = require('../controller/action.controller');

  /**
   * @swagger
   * tags:
   *   name: Action
   *   description: API quản lý log hành động thiết bị
   */

  /**
   * @swagger
   * /api/action/getinfo:
   *   get:
   *     summary: Lấy thông tin số lượng action (đếm, số trang,...)
   *     tags: [Action]
   *     parameters:
   *       - in: query
   *         name: size
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Thông tin action
   */
  router.get('/api/action/getinfo', ActionController.get_action_info);

  /**
   * @swagger
   * /api/action/all:
   *   get:
   *     summary: Lấy toàn bộ dữ liệu action
   *     tags: [Action]
   *     responses:
   *       200:
   *         description: Danh sách action
   */
  router.get('/api/action/all', ActionController.get_all);

  /**
   * @swagger
   * /api/action/data:
   *   get:
   *     summary: Lấy dữ liệu action theo trang
   *     tags: [Action]
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
   *           enum: [id, time]
   *       - in: query
   *         name: order
   *         schema:
   *           type: string
   *           enum: [ASC, DESC]
   *       - in: query
   *         name: device
   *         schema:
   *           type: string
   *           enum: [all, fan, air, lamp]
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [all, on, off]
   *     responses:
   *       200:
   *         description: Dữ liệu action theo trang
   */
  router.get('/api/action/data', ActionController.get_action_page);

  /**
   * @swagger
   * /api/action/search:
   *   get:
   *     summary: Tìm kiếm dữ liệu action
   *     tags: [Action]
   *     parameters:
   *       - in: query
   *         name: type
   *         schema:
   *           type: string
   *           enum: [id, time]
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
   *           enum: [id, time]
   *       - in: query
   *         name: order
   *         schema:
   *           type: string
   *           enum: [ASC, DESC]
   *       - in: query
   *         name: device
   *         schema:
   *           type: string
   *           enum: [all, fan, air, lamp]
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [all, on, off]
   *     responses:
   *       200:
   *         description: Kết quả tìm kiếm action
   */
  router.get('/api/action/search', ActionController.get_action_search);
}
