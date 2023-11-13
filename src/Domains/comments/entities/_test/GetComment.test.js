const GetComment = require('../GetComment');

describe('a GetComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      username: 'dicoding',
      date: '01 November 2023',
      content: 'Sebuah Comment Thread',
      isDelete: false,
    };

    // Action and Assert
    expect(() => new GetComment(payload)).toThrowError('GET_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      username: 'dicoding',
      date: '01 November 2023',
      content: 'Sebuah Comment Thread',
      isDelete: false,
    };

    // Action and Assert
    expect(() => new GetComment(payload)).toThrowError('GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create GetComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '01 November 2023',
      content: 'Sebuah Comment Thread',
      isDelete: false,
    };

    // Action
    const {
      id, username, date, content,
    } = new GetComment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(content).toEqual(payload.content);
  });

  it('should create GetComment Deleted object is correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '01 November 2023',
      content: 'Sebuah Comment Thread',
      isDelete: true,
    };

    // Action
    const {
      id, username, date, content,
    } = new GetComment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(content).toEqual('**komentar telah dihapus**');
  });
});
