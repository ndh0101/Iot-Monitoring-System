const Connection = require('../util/mysql.common');
const Action = {
    insertData: (action, result) => {
        Connection.insertData("action", action, (data) => {
            result(data);
        });
    },
    getAll: (result) => {
        Connection.getAll("action", (data) => {
            result(data);
        });
    },
    getActionInfo: (size, device, status, result) => {
        Connection.getActionInfo("action", size, device, status, (data) => {
            result(data);
        });
    },
    getActionPage: (page, size, sortBy, order, device, status, result) => {
        Connection.getActionPage("action", page, size, sortBy, order, device, status, (data1) => {
            Connection.getActionInfo("action", size, device, status, (data2) => {
                result({getActionInfo: data2, getActionPage: data1});
            });
        });
    },
    getActionSearch: (type, search, page, size, sortBy, order, device, status, result) => {
        Connection.getActionSearch("action", type, search, page, size, sortBy, order, device, status, (data1) => {
            Connection.getActionSearchInfo("action", type, search, size, device, status, (data2) => {
                result({getActionSearchInfo: data2, getActionSearch: data1});
            });
        });
    },
}
module.exports = Action;