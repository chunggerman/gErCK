// backend/tests/02_exception_flow.test.js
import request from "supertest";
import { assertDeepMatch } from "./assertDeepMatch.js";

const api = request("http://localhost:3001");

describe("Exception Flow — Invalid Inputs + Deep Validation", () => {

  test("Create Tenant without name", async () => {
    const res = await api.post("/api/tenants").send({});
    assertDeepMatch(
      { status: true },
      { status: res.status === 400 }
    );
  });

  test("Create Workspace with invalid tenant_id", async () => {
    const res = await api.post("/api/workspaces").send({
      tenant_id: "not-a-uuid",
      name: "BadWorkspace"
    });
    assertDeepMatch(
      { status: true },
      { status: res.status === 400 }
    );
  });

  test("Create Assistant with unsupported model", async () => {
    const res = await api.post("/api/assistants").send({
      tenant_id: "00000000-0000-0000-0000-000000000000",
      workspace_id: "00000000-0000-0000-0000-000000000000",
      name: "BadBot",
      model: "unsupported-model"
    });
    assertDeepMatch(
      { status: true },
      { status: res.status === 400 }
    );
  });

  test("Upload Document with empty content", async () => {
    const res = await api.post("/api/documents").send({
      tenant_id: "00000000-0000-0000-0000-000000000000",
      workspace_id: "00000000-0000-0000-0000-000000000000",
      name: "EmptyDoc",
      content: ""
    });
    assertDeepMatch(
      { status: true },
      { status: res.status === 400 }
    );
  });

});
