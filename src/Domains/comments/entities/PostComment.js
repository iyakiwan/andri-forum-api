class PostComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      owner, threadId, date, content,
    } = payload;

    this.owner = owner;
    this.threadId = threadId;
    this.date = date;
    this.content = content;
  }

  _verifyPayload({
    owner, threadId, date, content,
  }) {
    if (!owner
    || !threadId
    || !date
    || !content
    ) {
      throw new Error('POST_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof owner !== 'string'
    || typeof threadId !== 'string'
    || typeof date !== 'string'
    || typeof content !== 'string'
    ) {
      throw new Error('POST_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = PostComment;
