const PostThread = require('../../../Domains/threads/entities/PostThread');
const PostedThread = require('../../../Domains/threads/entities/PostedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const PostThreadUseCase = require('../PostThreadUseCase');

describe('PostThreadUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the post thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      owner: 'user-123',
      date: '01 November 2023',
      title: 'Sebuah Title Thread',
      body: 'Sebuah Body Thread',
    };

    const expectedPostedThread = new PostedThread({
      id: 'thread-123',
      owner: 'user-123',
      title: 'Sebuah Title Thread',
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.postThread = jest.fn()
      .mockImplementation(() => Promise.resolve(new PostedThread({
        id: 'thread-123',
        owner: 'user-123',
        title: 'Sebuah Title Thread',
      })));

    /** creating use case instance */
    const postThreadUseCase = new PostThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const postedThread = await postThreadUseCase.execute(useCasePayload);

    // Assert
    expect(postedThread).toStrictEqual(expectedPostedThread);

    expect(mockThreadRepository.postThread).toBeCalledWith(new PostThread({
      owner: 'user-123',
      date: '01 November 2023',
      title: 'Sebuah Title Thread',
      body: 'Sebuah Body Thread',
    }));
  });
});
