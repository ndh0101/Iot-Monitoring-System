const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'iot_data',
    port: 3306
});
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database: ' + err.stack);
        return;
    }
});
insertData = (table, data, result) => {
    const query = 'INSERT INTO `' + table + '` SET ?';
    connection.query(query, data, (err, res) => {
        if (err) {
            console.log('Error inserting data: ' + err.stack);
            result(null);
        } else result(table + ": " + res.insertId);
    });
}
getAll = (table, result) => {
    const query = `SELECT * FROM \`${table}\``;
    connection.query(query, (err, data) => {
        if (err) {
            console.log('Error fetching data: ' + err.stack);
            result(null);
        } else result(data);
    });
}
getInfo = (table, size, result) => {
    const pageSize = Number(size) > 0 ? Number(size) : 10;
    const query = `SELECT COUNT(*) AS numData FROM \`${table}\``;
    connection.query(query, (err, data) => {
        if (err) {
            console.log('Error fetching data: ' + err.stack);
            result(null);
        } else {
            const info = data[0] || { numData: 0};
            info.numPage = Math.ceil((info.numData) / pageSize);
            result(info);
        }
    });
}
getPage = (table, page, size, sortBy, order, result) => {
    const pageNum = Number(page) > 0 ? Number(page) : 1;
    const pageSize = Number(size) > 0 ? Number(size) : 10;
    const offset = (pageNum - 1) * pageSize;
    const query = `SELECT * FROM \`${table}\` ORDER BY \`${sortBy}\` ${order} LIMIT ${pageSize} OFFSET ${offset}`;
    connection.query(query, (err, data) => {
        if (err) {
            console.log('Error fetching data: ' + err.stack);
            result(null);
        } else result(data);
    });
}
getSearch = (table, type, search, page, size, sortBy, order, result) => {
    const pageNum = Number(page) > 0 ? Number(page) : 1;
    const pageSize = Number(size) > 0 ? Number(size) : 10;
    const offset = (pageNum - 1) * pageSize;
    let condition;
    if (type === "time") {
        condition = `DATE_FORMAT(\`${type}\`, '%Y-%m-%d %H:%i:%s') LIKE '%${search}%'`;
    } else {
        condition = `\`${type}\` LIKE '%${search}%'`;
    }
    const query = `SELECT * FROM \`${table}\` WHERE ${condition} ORDER BY \`${sortBy}\` ${order} LIMIT ${pageSize} OFFSET ${offset}`;
    connection.query(query, (err, data) => {
        if (err) {
            console.log('Error fetching data: ' + err.stack);
            result(null);
        } else result(data);
    });
}
getSearchInfo = (table, type, search, size, result) => {
    const pageSize = Number(size) > 0 ? Number(size) : 10;
    let condition;
    if (type === "time") {
        condition = `DATE_FORMAT(\`${type}\`, '%Y-%m-%d %H:%i:%s') LIKE '%${search}%'`;
    } else {
        condition = `\`${type}\` LIKE '%${search}%'`;
    }
    const query = `SELECT COUNT(*) AS numData FROM \`${table}\` WHERE ${condition}`;
    connection.query(query, (err, data) => {
        if (err) {
            console.log('Error fetching data: ' + err.stack);
            result(null);
        } else {
            const info = data[0] || { numData: 0 };
            info.numPage = Math.ceil((info.numData || 0) / pageSize);
            result(info);
        }
    });
}
getActionInfo = (table, size, device, status, result) => {
    const pageSize = Number(size) > 0 ? Number(size) : 10;
    let condition = "1=1"; //true
    if (device && device !== "all") {
        condition += ` AND device_id='${device}'`;
    }
    if (status && status !== "all") {
        condition += ` AND status='${status}'`;
    }
    const query = `SELECT COUNT(*) AS numData FROM \`${table}\` WHERE ${condition}`;
    connection.query(query, (err, data) => {
        if (err) {
            console.log('Error fetching data: ' + err.stack);
            result(null);
        } else {
            const info = data[0] || { numData: 0};
            info.numPage = Math.ceil((info.numData) / pageSize);
            result(info);
        }
    });
}
getActionPage = (table, page, size, sortBy, order, device, status, result) => {
    const pageNum = Number(page) > 0 ? Number(page) : 1;
    const pageSize = Number(size) > 0 ? Number(size) : 10;
    const offset = (pageNum - 1) * pageSize;
    let condition = "1=1";
    if (device && device !== "all") {
        condition += ` AND device_id='${device}'`;
    }
    if (status && status !== "all") {
        condition += ` AND status='${status}'`;
    }
    const query = `SELECT * FROM \`${table}\` WHERE ${condition} ORDER BY \`${sortBy}\` ${order} LIMIT ${pageSize} OFFSET ${offset}`;
    connection.query(query, (err, data) => {
        if (err) {
            console.log('Error fetching data: ' + err.stack);
            result(null);
        } else result(data);
    });
}
getActionSearch = (table, type, search, page, size, sortBy, order, device, status, result) => {
    const pageNum = Number(page) > 0 ? Number(page) : 1;
    const pageSize = Number(size) > 0 ? Number(size) : 10;
    const offset = (pageNum - 1) * pageSize;
    let condition;
    if (type === "time") {
        condition = `DATE_FORMAT(\`${type}\`, '%Y-%m-%d %H:%i:%s') LIKE '%${search}%'`;
    } else if (type && type !== "all") {
        condition = `\`${type}\` LIKE '%${search}%'`;
    } else {
        condition = "1=1"; // nếu type = all thì bỏ qua search
    }
    if (device && device !== "all") {
        condition += ` AND device_id='${device}'`;
    }
    if (status && status !== "all") {
        condition += ` AND status='${status}'`;
    }
    const query = `SELECT * FROM \`${table}\` WHERE ${condition} ORDER BY \`${sortBy}\` ${order} LIMIT ${pageSize} OFFSET ${offset}`;
    connection.query(query, (err, data) => {
        if (err) {
            console.log('Error fetching data: ' + err.stack);
            result(null);
        } else result(data);
    });
}
getActionSearchInfo = (table, type, search, size, device, status, result) => {
    const pageSize = Number(size) > 0 ? Number(size) : 10;
    let condition;
    if (type === "time") {
        condition = `DATE_FORMAT(\`${type}\`, '%Y-%m-%d %H:%i:%s') LIKE '%${search}%'`;
    } else if (type && type !== "all") {
        condition = `\`${type}\` LIKE '%${search}%'`;
    } else {
        condition = "1=1";
    }
    if (device && device !== "all") {
        condition += ` AND device_id='${device}'`;
    }
    if (status && status !== "all") {
        condition += ` AND status='${status}'`;
    }
    const query = `SELECT COUNT(*) AS numData FROM \`${table}\` WHERE ${condition}`;
    connection.query(query, (err, data) => {
        if (err) {
            console.log('Error fetching data: ' + err.stack);
            result(null);
        } else {
            const info = data[0] || { numData: 0 };
            info.numPage = Math.ceil((info.numData || 0) / pageSize);
            result(info);
        }
    });
}
module.exports = {insertData, getAll, getInfo, getPage, getSearch, getSearchInfo, getActionInfo, getActionPage, getActionSearch, getActionSearchInfo};