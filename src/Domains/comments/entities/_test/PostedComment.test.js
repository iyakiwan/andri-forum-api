const PostedComment = require('../PostedComment');

describe('a PostedComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      owner: 'user-123',
      content: 'Sebuah Comment Thread',
    };

    // Action and Assert
    expect(() => new PostedComment(payload)).toThrowError('POSTED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      owner: 'user-123',
      content: 'Sebuah Comment Thread',
    };

    // Action and Assert
    expect(() => new PostedComment(payload)).toThrowError('POSTED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create PostedComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      owner: 'user-123',
      content: 'Sebuah Comment Thread',
    };

    // Action
    const {
      id, title, content,
    } = new PostedComment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(content).toEqual(payload.content);
  });
});
