/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommmetsTableTestHelper = {
  async postComment({
    id = 'comment-123',
    owner = 'user-123',
    threadId = 'thread-123',
    date = '01 November 2023',
    content = 'Sebuah Comment Thread',
    isDelete = false,
  }) {
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, owner, threadId, date, content, isDelete],
    };

    await pool.query(query);
  },

  async findComment(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommmetsTableTestHelper;
