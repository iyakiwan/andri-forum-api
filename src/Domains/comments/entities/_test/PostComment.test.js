const PostComment = require('../PostComment');

describe('a PostComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      date: '01 November 2023',
      content: 'Sebuah Comment Thread',
    };

    // Action and Assert
    expect(() => new PostComment(payload)).toThrowError('POST_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      owner: 123,
      threadId: 'thread-123',
      date: '01 November 2023',
      content: 'Sebuah Comment Thread',
    };

    // Action and Assert
    expect(() => new PostComment(payload)).toThrowError('POST_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create PostComment object correctly', () => {
    // Arrange
    const payload = {
      owner: 'user-123',
      threadId: 'thread-123',
      date: '01 November 2023',
      content: 'Sebuah Comment Thread',
    };

    // Action
    const {
      owner, threadId, date, content,
    } = new PostComment(payload);

    // Assert
    expect(owner).toEqual(payload.owner);
    expect(threadId).toEqual(payload.threadId);
    expect(date).toEqual(payload.date);
    expect(content).toEqual(payload.content);
  });
});
