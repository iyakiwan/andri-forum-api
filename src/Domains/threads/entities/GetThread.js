class GetThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, username, date, title, body, comments,
    } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.title = title;
    this.body = body;
    this.comments = comments;
  }

  _verifyPayload({
    id, username, date, title, body, comments,
  }) {
    if (!id
    || !username
    || !date
    || !title
    || !body
    || !comments
    ) {
      throw new Error('GET_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string'
    || typeof username !== 'string'
    || typeof date !== 'string'
    || typeof title !== 'string'
    || typeof body !== 'string'
    || typeof comments !== 'object'
    ) {
      throw new Error('GET_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetThread;
