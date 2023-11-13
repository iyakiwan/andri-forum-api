const PostComment = require('../../../Domains/comments/entities/PostComment');
const PostedComment = require('../../../Domains/comments/entities/PostedComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const PostCommentUseCase = require('../PostCommentUseCase');

describe('PostCommentUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the post comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      owner: 'user-123',
      threadId: 'thread-123',
      date: '01 November 2023',
      content: 'Sebuah Comment Thread',
    };

    const expectedPostedComment = new PostedComment({
      id: 'comment-123',
      owner: 'user-123',
      content: 'Sebuah Comment Thread',
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.checkThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.postComment = jest.fn()
      .mockImplementation(() => Promise.resolve(new PostedComment({
        id: 'comment-123',
        owner: 'user-123',
        content: 'Sebuah Comment Thread',
      })));

    /** creating use case instance */
    const postCommentUseCase = new PostCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const postComment = await postCommentUseCase.execute(useCasePayload);

    // Assert
    expect(postComment).toStrictEqual(expectedPostedComment);

    expect(mockThreadRepository.checkThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.postComment).toBeCalledWith(new PostComment({
      owner: 'user-123',
      threadId: 'thread-123',
      date: '01 November 2023',
      content: 'Sebuah Comment Thread',
    }));
  });
});
