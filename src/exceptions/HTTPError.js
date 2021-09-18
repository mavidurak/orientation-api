class HTTPError extends Error {
  constructor(message, statusCode = 500) {
    super();
    if (statusCode < 400 || statusCode > 599) {
      throw RangeError();
    }
    this.statusCode = statusCode;
    // If message is array add message object for each massage element
    const errors = Array.isArray(message) ? message.map((m) => ({ message: m })) : [{ message }];
    this.message = { errors };
  }
}

export default HTTPError;
