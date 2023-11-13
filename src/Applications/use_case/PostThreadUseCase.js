const PostThread = require('../../Domains/threads/entities/PostThread');

class PostThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(payload) {
    const thread = new PostThread(payload);

    return this._threadRepository.postThread(thread);
  }
}

module.exports = PostThreadUseCase;
