class GetThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(payload) {
    const threadId = payload;

    const thread = await this._threadRepository.getThread(threadId);
    const comments = await this._commentRepository.getComments(threadId);

    thread.comments = comments;

    return thread;
  }
}

module.exports = GetThreadUseCase;
