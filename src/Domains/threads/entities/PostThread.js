class PostThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      owner, date, title, body,
    } = payload;

    this.owner = owner;
    this.date = date;
    this.title = title;
    this.body = body;
  }

  _verifyPayload({
    owner, date, title, body,
  }) {
    if (!owner
    || !date
    || !title
    || !body
    ) {
      throw new Error('POST_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof title !== 'string'
    || typeof body !== 'string'
    || typeof date !== 'string'
    || typeof owner !== 'string'
    ) {
      throw new Error('POST_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = PostThread;
