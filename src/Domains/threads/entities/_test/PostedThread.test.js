const PostedThread = require('../PostedThread');

describe('a PostedThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      owner: 'user-123',
      title: 'Sebuah Title Thread',
    };

    // Action and Assert
    expect(() => new PostedThread(payload)).toThrowError('POSTED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      owner: 'user-123',
      title: 'Sebuah Title Thread',
    };

    // Action and Assert
    expect(() => new PostedThread(payload)).toThrowError('POSTED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create PostedThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      owner: 'user-123',
      title: 'Sebuah Title Thread',
    };

    // Action
    const {
      id, owner, title,
    } = new PostedThread(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(owner).toEqual(payload.owner);
    expect(title).toEqual(payload.title);
  });
});
