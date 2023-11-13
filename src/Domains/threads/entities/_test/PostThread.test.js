const PostThread = require('../PostThread');

describe('a PostThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      date: '01 November 2023',
      title: 'Sebuah Title Thread',
      body: 'Sebuah Body Thread',
    };

    // Action and Assert
    expect(() => new PostThread(payload)).toThrowError('POST_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      owner: 'user-123',
      date: 2023,
      title: 'Sebuah Title Thread',
      body: 'Sebuah Body Thread',
    };

    // Action and Assert
    expect(() => new PostThread(payload)).toThrowError('POST_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create PostThread object correctly', () => {
    // Arrange
    const payload = {
      owner: 'user-123',
      date: '01 November 2023',
      title: 'Sebuah Title Thread',
      body: 'Sebuah Body Thread',
    };

    // Action
    const {
      owner, date, title, body,
    } = new PostThread(payload);

    // Assert
    expect(owner).toEqual(payload.owner);
    expect(date).toEqual(payload.date);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
  });
});
