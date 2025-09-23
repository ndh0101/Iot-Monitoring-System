const Action = require('../model/action.model');
exports.get_action_info = (req, res) => {
    const size = parseInt(req.query.size, 10) || 10;
    const device = req.query.device || 'all';
    const status = req.query.status || 'all';
        Action.getActionInfo(size, device, status, (data) => {
        res.json(data);
    });
}
exports.get_all = (req, res) => {
    Action.getAll((data) => {
        res.json(data);
    });
}
exports.get_action_page = (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const size = parseInt(req.query.size, 10) || 10;
    const sortBy = req.query.sortBy || "id";
    const order = (req.query.order || "DESC").toUpperCase() === "ASC" ? "ASC" : "DESC";
    const device = req.query.device || 'all';
    const status = req.query.status || 'all';
    Action.getActionPage(page, size, sortBy, order, device, status, (data) => {
        res.json(data);
    });
}
exports.get_action_search = (req, res) => {
    const type = req.query.type || 'all';
    const search = req.query.search || '';
    const page = parseInt(req.query.page, 10) || 1;
    const size = parseInt(req.query.size, 10) || 10;
    const sortBy = req.query.sortBy || "id";
    const order = (req.query.order || "DESC").toUpperCase() === "ASC" ? "ASC" : "DESC";
    const device = req.query.device || 'all';
    const status = req.query.status || 'all';
    Action.getActionSearch(type, search, page, size, sortBy, order, device, status, (data) => {
        res.json(data);
    });
}