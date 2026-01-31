// backend/tests/03_known_errors.test.js
import request from "supertest";
import { assertDeepMatch } from "./assertDeepMatch.js";

const api = request("http://localhost:3001");

describe("Known Error Flow — Predictable Failures + Deep Validation", () => {

  test("Duplicate tenant name", async () => {
    const res1 = await api.post("/api/tenants").send({ name: "DupTenant" });
    const res2 = await api.post("/api/tenants").send({ name: "DupTenant" });

    assertDeepMatch(
      { duplicateRejected: true },
      { duplicateRejected: [400, 409].includes(res2.status) }
    );
  });

  test("Embed before chunking", async () => {
    const tenant = await api.post("/api/tenants").send({ name: "TenantEmbedErr" });
    const ws = await api.post("/api/workspaces").send({
      tenant_id: tenant.body.id,
      name: "WSEmbedErr"
    });
    const doc = await api.post("/api/documents").send({
      tenant_id: tenant.body.id,
      workspace_id: ws.body.id,
      name: "DocEmbedErr",
      content: "This doc has not been chunked yet."
    });

    const embedRes = await api.post(`/api/documents/${doc.body.id}/embed`);

    assertDeepMatch(
      { invalidOrder: true },
      { invalidOrder: [400, 422].includes(embedRes.status) }
    );
  });

});
