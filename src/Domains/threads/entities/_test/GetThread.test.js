const GetThread = require('../GetThread');

describe('a GetThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      username: 'dicoding',
      date: '01 November 2023',
      title: 'Sebuah Title Thread',
      body: 'Sebuah Body Thread',
      comments: [],
    };

    // Action and Assert
    expect(() => new GetThread(payload)).toThrowError('GET_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      username: 'dicoding',
      date: '01 November 2023',
      title: 'Sebuah Title Thread',
      body: 'Sebuah Body Thread',
      comments: [],
    };

    // Action and Assert
    expect(() => new GetThread(payload)).toThrowError('GET_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create GetThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      username: 'dicoding',
      date: '01 November 2023',
      title: 'Sebuah Title Thread',
      body: 'Sebuah Body Thread',
      comments: [],
    };

    // Action
    const {
      id, title, body, date, username, comments,
    } = new GetThread(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(comments).toEqual(payload.comments);
  });
});
