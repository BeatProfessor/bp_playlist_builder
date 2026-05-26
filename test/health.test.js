import { describe, it } from "node:test";
import assert from "node:assert/strict";
import handler from "../api/health.js";

function createMockRes() {
  const res = {
    _status: null,
    _body: null,
    status(code) {
      res._status = code;
      return res;
    },
    json(body) {
      res._body = body;
      return res;
    },
  };
  return res;
}

describe("GET /api/health", () => {
  it("returns status ok", () => {
    const res = createMockRes();
    handler({}, res);
    assert.equal(res._status, 200);
    assert.equal(res._body.status, "ok");
    assert.equal(res._body.service, "bp-playlist-builder");
    assert.ok(res._body.timestamp);
  });
});
