const PostThreadUseCase = require('../../../../Applications/use_case/PostThreadUseCase');
const GetThreadUseCase = require('../../../../Applications/use_case/GetThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadHandler = this.getThreadHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const date = new Date().toISOString();
    const { title, body } = request.payload;

    const payload = {
      owner, date, title, body,
    };

    const postThreadUseCase = this._container.getInstance(PostThreadUseCase.name);
    const postThread = await postThreadUseCase.execute(payload);

    const response = h.response({
      status: 'success',
      data: {
        addedThread: postThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadHandler(request, h) {
    const { threadId } = request.params;

    const payload = threadId;

    const getThreadUseCase = this._container.getInstance(GetThreadUseCase.name);
    const thread = await getThreadUseCase.execute(payload);

    return {
      status: 'success',
      data: {
        thread,
      },
    };
  }
}

module.exports = ThreadsHandler;
