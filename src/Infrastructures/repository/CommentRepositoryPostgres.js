const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const InvariantError = require('../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const PostedComment = require('../../Domains/comments/entities/PostedComment');
const GetComment = require('../../Domains/comments/entities/GetComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async postComment(comment) {
    const {
      owner, threadId, date, content, isDelete = false,
    } = comment;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, owner, content',
      values: [id, owner, threadId, date, content, isDelete],
    };

    const result = await this._pool.query(query);

    return new PostedComment(result.rows[0]);
  }

  async checkComment(owner, commentId) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [commentId],
    };

    const { rowCount, rows } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Comment Not Found');
    }

    if (rows[0].is_delete) {
      throw new InvariantError('Comment has been deleted');
    }

    if (rows[0].owner !== owner) {
      throw new AuthorizationError('Comment Cant Access');
    }
  }

  async getComments(threadId) {
    const query = {
      text: `SELECT c.id, s.username, c.date, c.content, c.is_delete
      FROM comments c
      JOIN users s ON c.owner = s.id 
      WHERE c.thread_id = $1
      ORDER BY c.date ASC`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows.map((comment) => new GetComment({
      ...comment,
      isDelete: comment.is_delete,
    }));
  }

  async removeComment(commentId) {
    const query = {
      text: 'UPDATE comments SET is_delete = true WHERE id = $1',
      values: [commentId],
    };

    await this._pool.query(query);
  }
}

module.exports = CommentRepositoryPostgres;
