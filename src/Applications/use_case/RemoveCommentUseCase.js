class RemoveCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(payload) {
    const { owner, threadId, commentId } = payload;

    await this._threadRepository.checkThread(threadId);
    await this._commentRepository.checkComment(owner, commentId);

    return this._commentRepository.removeComment(commentId);
  }
}

module.exports = RemoveCommentUseCase;
