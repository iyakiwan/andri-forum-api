const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const PostComment = require('../../../Domains/comments/entities/PostComment');
const PostedComment = require('../../../Domains/comments/entities/PostedComment');
const GetComment = require('../../../Domains/comments/entities/GetComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  it('should be instance of ThreadRepository domain', () => {
    const commentRepositoryPostgres = new CommentRepositoryPostgres({}, {}); // dummy dependency

    expect(commentRepositoryPostgres).toBeInstanceOf(CommentRepository);
  });

  const commentId = 'comment-123';

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('postComment function', () => {
    it('should persist post comment and saved in Database', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.postThread({});

      const postComment = new PostComment({
        owner: 'user-123',
        threadId: 'thread-123',
        date: '01 November 2023',
        content: 'Sebuah Comment Thread',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.postComment(postComment);

      // Assert
      const comment = await CommentsTableTestHelper.findComment(commentId);

      expect(comment).toHaveLength(1);

      const {
        id, owner, thread_id, date, content, is_delete,
      } = comment[0];

      expect(id).toStrictEqual('comment-123');
      expect(owner).toStrictEqual('user-123');
      expect(thread_id).toStrictEqual('thread-123');
      expect(date).toStrictEqual('01 November 2023');
      expect(content).toStrictEqual('Sebuah Comment Thread');
      expect(is_delete).toStrictEqual(false);
    });

    it('should return posted comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.postThread({});

      const postComment = new PostComment({
        owner: 'user-123',
        threadId: 'thread-123',
        date: '01 November 2023',
        content: 'Sebuah Comment Thread',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const postedComment = await commentRepositoryPostgres.postComment(postComment);

      // Assert
      expect(postedComment).toStrictEqual(new PostedComment({
        id: 'comment-123',
        owner: 'user-123',
        content: 'Sebuah Comment Thread',
      }));
    });
  });

  describe('checkComment function', () => {
    it('should throw NotFoundError when comment not available', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.checkComment(commentId))
        .rejects.toThrowError(NotFoundError);
    });

    it('should throw InvariantError when comment is deleted', async () => {
      // Arrange
      const owner = 'user-123';

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.postThread({});
      await CommentsTableTestHelper.postComment({ isDelete: true });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.checkComment(owner, commentId))
        .rejects.toThrowError(InvariantError);
    });

    it('should throw AuthorizationError when owner is not Authorization in Comment', async () => {
      // Arrange
      const owner1 = 'user-123';
      const owner2 = 'user-1234';
      const username2 = 'dicoding-dicoding';

      await UsersTableTestHelper.addUser({});
      await UsersTableTestHelper.addUser({ id: owner2, username: username2 });
      await ThreadsTableTestHelper.postThread({});
      await CommentsTableTestHelper.postComment({ owner: owner2 });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.checkComment(owner1, commentId))
        .rejects.toThrowError(AuthorizationError);
    });

    it('should correcly when comment available', async () => {
      // Arrange
      const owner = 'user-123';

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.postThread({});
      await CommentsTableTestHelper.postComment({});

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.checkComment(owner, commentId))
        .resolves.not.toThrowError(NotFoundError);
      await expect(commentRepositoryPostgres.checkComment(owner, commentId))
        .resolves.not.toThrowError(AuthorizationError);
      await expect(commentRepositoryPostgres.checkComment(owner, commentId))
        .resolves.not.toThrowError(InvariantError);
    });
  });

  describe('getComments function', () => {
    const threadId = 'thread-123';

    it('should throw NotFoundError when comment not available', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      const comments = await commentRepositoryPostgres.getComments(threadId);

      expect(comments).toHaveLength(0);
    });

    it('should persist get deleted Comment when threadId correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.postThread({});
      await CommentsTableTestHelper.postComment({ isDelete: true });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comments = await commentRepositoryPostgres.getComments(threadId);

      // Assert
      expect(comments).toHaveLength(1);

      const comment = comments[0];

      expect(comment).toStrictEqual(
        new GetComment({
          id: 'comment-123',
          username: 'dicoding',
          date: '01 November 2023',
          content: 'Sebuah Comment Thread',
          isDelete: true,
        }),
      );
    });

    it('should persist get Comment when threadId correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.postThread({});
      await CommentsTableTestHelper.postComment({});

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comments = await commentRepositoryPostgres.getComments(threadId);

      // Assert
      expect(comments).toHaveLength(1);

      const comment = comments[0];

      expect(comment).toStrictEqual(
        new GetComment({
          id: 'comment-123',
          username: 'dicoding',
          date: '01 November 2023',
          content: 'Sebuah Comment Thread',
          isDelete: false,
        }),
      );
    });
  });

  describe('removeComment function', () => {
    it('should persist Remove Comment correctly', async () => {
      // Arrange
      const owner = 'user-123';

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.postThread({});
      await CommentsTableTestHelper.postComment({});

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.removeComment(commentId);

      // Assert
      const findComments = await CommentsTableTestHelper.findComment(commentId);

      expect(findComments).toHaveLength(1);

      const comment = findComments[0];

      expect(comment).toHaveProperty('is_delete');

      const { is_delete } = comment;

      expect(is_delete).toStrictEqual(true);
    });
  });
});
