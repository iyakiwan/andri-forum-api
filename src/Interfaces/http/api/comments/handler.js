const PostCommentUseCase = require('../../../../Applications/use_case/PostCommentUseCase');
const RemoveCommentUseCase = require('../../../../Applications/use_case/RemoveCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.removeCommentHandler = this.removeCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { threadId } = request.params;
    const date = new Date().toISOString();
    const { content } = request.payload;

    const payload = {
      owner, threadId, date, content,
    };

    const postCommentUseCase = this._container.getInstance(PostCommentUseCase.name);
    const postComment = await postCommentUseCase.execute(payload);

    const response = h.response({
      status: 'success',
      data: {
        addedComment: postComment,
      },
    });
    response.code(201);
    return response;
  }

  async removeCommentHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { threadId, commentId } = request.params;

    const payload = {
      owner, threadId, commentId,
    };

    const removeCommentUseCase = this._container.getInstance(RemoveCommentUseCase.name);
    await removeCommentUseCase.execute(payload);

    return h.response({
      status: 'success',
    });
  }
}

module.exports = CommentsHandler;
