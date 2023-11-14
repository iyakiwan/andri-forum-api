const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const PostedThread = require('../../Domains/threads/entities/PostedThread');
const GetThread = require('../../Domains/threads/entities/GetThread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async postThread(thread) {
    const {
      owner, date, title, body,
    } = thread;

    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, owner, title',
      values: [id, owner, date, title, body],
    };

    const result = await this._pool.query(query);

    return new PostedThread(result.rows[0]);
  }

  async checkThread(threadId) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Thread Not Found');
    }
  }

  async getThread(threadId) {
    const query = {
      text: `SELECT t.id, t.title, t.body, t.date, s.username
      FROM threads t
      JOIN users s ON t.owner = s.id
      WHERE t.id = $1`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Thread Not Found');
    }

    const comments = [];

    return new GetThread({ ...result.rows[0], comments });
  }
}

module.exports = ThreadRepositoryPostgres;
