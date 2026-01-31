// backend/tests/01_happy_flow.test.js
import request from "supertest";
import { db } from "./db.js";
import { assertDeepMatch } from "./assertDeepMatch.js";

const api = request("http://localhost:3001");

let tenantId;
let workspaceId;
let assistantId;
let documentId;

describe("Happy Flow — API + DB + Encryption + Deep Validation", () => {

  test("Create Tenant (encrypted at rest)", async () => {
    const res = await api.post("/api/tenants").send({ name: "Acme Corp" });
    expect(res.status).toBe(201);

    tenantId = res.body.id;

    assertDeepMatch(
      { name: "Acme Corp" },
      { name: res.body.name }
    );

    const dbRes = await db.query(
      "SELECT name FROM tenants WHERE id = $1",
      [tenantId]
    );

    assertDeepMatch(
      { encrypted: true },
      { encrypted: dbRes.rows[0].name !== "Acme Corp" }
    );
  });

  test("Create Workspace", async () => {
    const res = await api.post("/api/workspaces").send({
      tenant_id: tenantId,
      name: "Engineering"
    });
    expect(res.status).toBe(201);

    workspaceId = res.body.id;

    assertDeepMatch(
      {
        tenant_id: tenantId,
        name: "Engineering"
      },
      {
        tenant_id: res.body.tenant_id,
        name: res.body.name
      }
    );

    const dbRes = await db.query(
      "SELECT tenant_id, name FROM workspaces WHERE id = $1",
      [workspaceId]
    );

    assertDeepMatch(
      {
        tenant_id: tenantId,
        name: "Engineering"
      },
      dbRes.rows[0]
    );
  });

  test("Create Assistant", async () => {
    const res = await api.post("/api/assistants").send({
      tenant_id: tenantId,
      workspace_id: workspaceId,
      name: "SupportBot",
      model: "gpt-4.1-mini"
    });
    expect(res.status).toBe(201);

    assistantId = res.body.id;

    assertDeepMatch(
      {
        tenant_id: tenantId,
        workspace_id: workspaceId,
        name: "SupportBot"
      },
      {
        tenant_id: res.body.tenant_id,
        workspace_id: res.body.workspace_id,
        name: res.body.name
      }
    );

    const dbRes = await db.query(
      "SELECT tenant_id, workspace_id, name FROM assistants WHERE id = $1",
      [assistantId]
    );

    assertDeepMatch(
      {
        tenant_id: tenantId,
        workspace_id: workspaceId,
        name: "SupportBot"
      },
      dbRes.rows[0]
    );
  });

  test("Upload Document", async () => {
    const res = await api.post("/api/documents").send({
      tenant_id: tenantId,
      workspace_id: workspaceId,
      name: "FAQ",
      content: "Refunds are processed within 7 days."
    });
    expect(res.status).toBe(201);

    documentId = res.body.id;

    assertDeepMatch(
      {
        name: "FAQ"
      },
      {
        name: res.body.name
      }
    );

    const dbRes = await db.query(
      "SELECT name FROM documents WHERE id = $1",
      [documentId]
    );

    assertDeepMatch(
      { name: "FAQ" },
      dbRes.rows[0]
    );
  });

  test("Chunk Document", async () => {
    const res = await api.post(`/api/documents/${documentId}/chunk`);
    expect(res.status).toBe(200);

    const dbRes = await db.query(
      "SELECT COUNT(*)::int AS count FROM document_chunks WHERE document_id = $1",
      [documentId]
    );

    assertDeepMatch(
      { hasChunks: true },
      { hasChunks: dbRes.rows[0].count > 0 }
    );
  });

  test("Embed Document", async () => {
    const res = await api.post(`/api/documents/${documentId}/embed`);
    expect(res.status).toBe(200);

    const dbRes = await db.query(
      "SELECT embedding FROM document_chunks WHERE document_id = $1",
      [documentId]
    );

    assertDeepMatch(
      { allEmbedded: true },
      { allEmbedded: dbRes.rows.every(r => r.embedding !== null) }
    );
  });

  test("RAG Query", async () => {
    const res = await api
      .post(`/api/assistants/${assistantId}/query`)
      .send({
        tenant_id: tenantId,
        workspace_id: workspaceId,
        query: "What is the refund policy?"
      });

    expect(res.status).toBe(200);

    assertDeepMatch(
      { answerExists: true },
      { answerExists: !!res.body.answer }
    );

    const dbRes = await db.query(
      "SELECT COUNT(*)::int AS count FROM usage WHERE assistant_id = $1",
      [assistantId]
    );

    assertDeepMatch(
      { usageLogged: true },
      { usageLogged: dbRes.rows[0].count > 0 }
    );
  });

});
