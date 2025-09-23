const Sensor = require('../model/sensor.model');
exports.get_info = (req, res) => {
    const size = parseInt(req.query.size, 10) || 10;
    Sensor.getInfo(size, (data) => {
        res.json(data);
    });
}
exports.get_all = (req, res) => {
    Sensor.getAll((data) => {
        res.json(data);
    });
}
exports.get_page = (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const size = parseInt(req.query.size, 10) || 10;
    const sortBy = req.query.sortBy || "id";
    const order = (req.query.order || "DESC").toUpperCase() === "ASC" ? "ASC" : "DESC";
    Sensor.getPage(page, size, sortBy, order, (data) => {
        res.json(data);
    });
}
exports.get_search = (req, res) => {
    const type = req.query.type || 'all';
    const search = req.query.search || '';
    const page = parseInt(req.query.page, 10) || 1;
    const size = parseInt(req.query.size, 10) || 10;
    const sortBy = req.query.sortBy || "id";
    const order = (req.query.order || "DESC").toUpperCase() === "ASC" ? "ASC" : "DESC";
    Sensor.getSearch(type, search, page, size, sortBy, order, (data) => {
        res.json(data);
    });
}