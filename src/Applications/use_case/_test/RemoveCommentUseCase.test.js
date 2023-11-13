const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const RemoveCommentUseCase = require('../RemoveCommentUseCase');

describe('RemoveCommentUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the remove comment action correctly', async () => {
    // Arrange
    const owner = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';

    const useCasePayload = {
      owner,
      threadId,
      commentId,
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.checkThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.removeComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const removeCommentUseCase = new RemoveCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await removeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.checkThread)
      .toBeCalledWith(threadId);
    expect(mockCommentRepository.checkComment)
      .toBeCalledWith(owner, commentId);

    expect(mockCommentRepository.removeComment)
      .toBeCalledWith(commentId);
  });
});
