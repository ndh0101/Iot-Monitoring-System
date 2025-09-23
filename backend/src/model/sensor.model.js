const Connection = require('../util/mysql.common');
const Sensor = {
    insertData: (sensor, result) => {
        Connection.insertData("sensor", sensor, (data) => {
            result(data);
        });
    },
    getInfo: (size, result) => {
        Connection.getInfo("sensor", size, (data) => {
            result(data);
        });
    },
    getAll: (result) => {
        Connection.getAll("sensor", (data) => {
            result(data);
        });
    },
    getPage: (page, size, sortBy, order, result) => {
        Connection.getPage("sensor", page, size, sortBy, order, (data1) => {
            Connection.getInfo("sensor", size, (data2) => {
                result({getInfo: data2, getPage: data1});
            });
        });
    },
    getSearch: (type, search, page, size, sortBy, order, result) => {
        Connection.getSearch("sensor", type, search, page, size, sortBy, order, (data1) => {
            Connection.getSearchInfo("sensor", type, search, size, (data2) => {
                result({getSearchInfo: data2, getSearch: data1});
            });
        });
    },
}
module.exports = Sensor;