/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
  async postThread({
    id = 'thread-123',
    owner = 'user-123',
    date = '01 November 2023',
    title = 'Sebuah Title Thread',
    body = 'Sebuah Body Thread',
  }) {
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5)',
      values: [id, owner, date, title, body],
    };

    await pool.query(query);
  },

  async findThread(id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM threads WHERE 1=1');
  },
};

module.exports = ThreadsTableTestHelper;
