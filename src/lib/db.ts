import mysql from 'mysql2/promise';

declare global {
  // eslint-disable-next-line no-var
  var _mysqlPool: mysql.Pool | undefined;
}

const pool =
  global._mysqlPool ||
  mysql.createPool({
    host: process.env.DB_HOST || '192.169.147.255',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'MEAZHA',
    password: process.env.DB_PASS || 'dZYRYi(o(0*U',
    database: process.env.DB_NAME || 'le_test',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 15000,
  });

if (process.env.NODE_ENV !== 'production') {
  global._mysqlPool = pool;
}

export default pool;
