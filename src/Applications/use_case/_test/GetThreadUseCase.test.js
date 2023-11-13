const GetThread = require('../../../Domains/threads/entities/GetThread');
const GetComment = require('../../../Domains/comments/entities/GetComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetThreadUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the get thread without comment action correctly', async () => {
    // Arrange
    const threadId = 'thread-123';

    const thread = new GetThread({
      id: 'thread-123',
      username: 'dicoding',
      date: '01 November 2023',
      title: 'Sebuah Title Thread',
      body: 'Sebuah Body Thread',
      comments: [],
    });

    const comments = [];

    const expectedThread = new GetThread({
      id: 'thread-123',
      username: 'dicoding',
      date: '01 November 2023',
      title: 'Sebuah Title Thread',
      body: 'Sebuah Body Thread',
      comments: [],
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.getThread = jest.fn()
      .mockImplementation(() => Promise.resolve(thread));
    mockCommentRepository.getComments = jest.fn()
      .mockImplementation(() => Promise.resolve(comments));

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const getThreadResult = await getThreadUseCase.execute(threadId);

    // Assert
    expect(getThreadResult).toStrictEqual(expectedThread);

    expect(mockThreadRepository.getThread)
      .toBeCalledWith(threadId);
    expect(mockCommentRepository.getComments)
      .toBeCalledWith(threadId);
  });

  it('should orchestrating the get thread with comment correctly', async () => {
    // Arrange
    const threadId = 'thread-123';

    const thread = new GetThread({
      id: 'thread-123',
      username: 'dicoding',
      date: '01 November 2023',
      title: 'Sebuah Title Thread',
      body: 'Sebuah Body Thread',
      comments: [],
    });

    const comments = [
      new GetComment({
        id: 'comment-123',
        username: 'dicoding',
        date: '01 November 2023',
        content: 'Sebuah Comment Thread',
        isDelete: false,
      }),
    ];

    const expectedThread = new GetThread({
      id: 'thread-123',
      username: 'dicoding',
      date: '01 November 2023',
      title: 'Sebuah Title Thread',
      body: 'Sebuah Body Thread',
      comments: [
        new GetComment({
          id: 'comment-123',
          username: 'dicoding',
          date: '01 November 2023',
          content: 'Sebuah Comment Thread',
          isDelete: false,
        }),
      ],
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.getThread = jest.fn()
      .mockImplementation(() => Promise.resolve(thread));
    mockCommentRepository.getComments = jest.fn()
      .mockImplementation(() => Promise.resolve(comments));

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const getThreadResult = await getThreadUseCase.execute(threadId);

    // Assert
    expect(getThreadResult).toStrictEqual(expectedThread);

    expect(mockThreadRepository.getThread)
      .toBeCalledWith(threadId);
    expect(mockCommentRepository.getComments)
      .toBeCalledWith(threadId);
  });

  it('should orchestrating the get thread with deleted comment correctly', async () => {
    // Arrange
    const threadId = 'thread-123';

    const thread = new GetThread({
      id: 'thread-123',
      username: 'dicoding',
      date: '01 November 2023',
      title: 'Sebuah Title Thread',
      body: 'Sebuah Body Thread',
      comments: [],
    });

    const comments = [
      new GetComment({
        id: 'comment-123',
        username: 'dicoding',
        date: '01 November 2023',
        content: 'Sebuah Comment Thread',
        isDelete: true,
      }),
    ];

    const expectedThread = new GetThread({
      id: 'thread-123',
      username: 'dicoding',
      date: '01 November 2023',
      title: 'Sebuah Title Thread',
      body: 'Sebuah Body Thread',
      comments: [
        new GetComment({
          id: 'comment-123',
          username: 'dicoding',
          date: '01 November 2023',
          content: 'Sebuah Comment Thread',
          isDelete: true,
        }),
      ],
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.getThread = jest.fn()
      .mockImplementation(() => Promise.resolve(thread));
    mockCommentRepository.getComments = jest.fn()
      .mockImplementation(() => Promise.resolve(comments));

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const getThreadResult = await getThreadUseCase.execute(threadId);

    // Assert
    expect(getThreadResult).toStrictEqual(expectedThread);

    expect(mockThreadRepository.getThread)
      .toBeCalledWith(threadId);
    expect(mockCommentRepository.getComments)
      .toBeCalledWith(threadId);
  });
});
