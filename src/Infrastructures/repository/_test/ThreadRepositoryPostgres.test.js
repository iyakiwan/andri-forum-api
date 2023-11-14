const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const PostThread = require('../../../Domains/threads/entities/PostThread');
const PostedThread = require('../../../Domains/threads/entities/PostedThread');
const GetThread = require('../../../Domains/threads/entities/GetThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  it('should be instance of ThreadRepository domain', () => {
    const threadRepositoryPostgres = new ThreadRepositoryPostgres({}, {}); // dummy dependency

    expect(threadRepositoryPostgres).toBeInstanceOf(ThreadRepository);
  });

  const threadId = 'thread-123';

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('postThread function', () => {
    it('should persist post thread correctly and saved in Database', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});

      const thread = new PostThread({
        owner: 'user-123',
        date: '01 November 2023',
        title: 'Sebuah Title Thread',
        body: 'Sebuah Body Thread',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.postThread(thread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThread(threadId);

      expect(threads).toHaveLength(1);

      const {
        id, owner, date, title, body,
      } = threads[0];

      expect(id).toStrictEqual('thread-123');
      expect(owner).toStrictEqual('user-123');
      expect(date).toStrictEqual('01 November 2023');
      expect(title).toStrictEqual('Sebuah Title Thread');
      expect(body).toStrictEqual('Sebuah Body Thread');
    });

    it('should return posted thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});

      const thread = new PostThread({
        owner: 'user-123',
        date: '01 November 2023',
        title: 'Sebuah Title Thread',
        body: 'Sebuah Body Thread',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const postedThread = await threadRepositoryPostgres.postThread(thread);

      // Assert
      expect(postedThread).toStrictEqual(new PostedThread({
        id: 'thread-123',
        owner: 'user-123',
        title: 'Sebuah Title Thread',
      }));
    });
  });

  describe('checkThread function', () => {
    it('should throw NotFoundError when thread not available', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.checkThread(threadId))
        .rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when thread available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.postThread({});

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.checkThread(threadId))
        .resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('getThread function', () => {
    it('should throw NotFoundError when thread not available', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.getThread(threadId))
        .rejects.toThrowError(NotFoundError);
    });

    it('should return get thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.postThread({});

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const getThread = await threadRepositoryPostgres.getThread(threadId);

      // Assert
      expect(getThread).toStrictEqual(new GetThread({
        id: 'thread-123',
        username: 'dicoding',
        date: '01 November 2023',
        title: 'Sebuah Title Thread',
        body: 'Sebuah Body Thread',
        comments: [],
      }));
    });
  });
});
