'use es6';

export default class RequestStatus {
  constructor(status = { uninitialized: true }) {
    Object.assign(
      this,
      {
        uninitialized: false,
        pending: false,
        succeeded: false,
        failed: false,
      },
      status,
    );
  }
}
