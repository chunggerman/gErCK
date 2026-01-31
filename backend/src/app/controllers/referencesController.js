// backend/src/app/controllers/referencesController.js

import { ReferencesRepositoryPostgres } from "../../repositories/postgres/referencesRepositoryPostgres.js";

const repo = new ReferencesRepositoryPostgres();

export const createReference = async (req, res) => {
  try {
    const { workspaceId, name, description } = req.body;

    const reference = await repo.create({
      workspaceId,
      name,
      description,
    });

    res.json({ reference });
  } catch (err) {
    console.error("createReference error:", err);
    res.status(500).json({ error: "Failed to create reference" });
  }
};

export const listReferences = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const references = await repo.listByWorkspace(workspaceId);
    res.json({ references });
  } catch (err) {
    console.error("listReferences error:", err);
    res.status(500).json({ error: "Failed to list references" });
  }
};

export const getReference = async (req, res) => {
  try {
    const { id } = req.params;
    const reference = await repo.get(id);

    if (!reference) {
      return res.status(404).json({ error: "Reference not found" });
    }

    res.json({ reference });
  } catch (err) {
    console.error("getReference error:", err);
    res.status(500).json({ error: "Failed to fetch reference" });
  }
};

export const updateReference = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const reference = await repo.update(id, { name, description });
    res.json({ reference });
  } catch (err) {
    console.error("updateReference error:", err);
    res.status(500).json({ error: "Failed to update reference" });
  }
};

export const deleteReference = async (req, res) => {
  try {
    const { id } = req.params;
    await repo.delete(id);
    res.json({ success: true });
  } catch (err) {
    console.error("deleteReference error:", err);
    res.status(500).json({ error: "Failed to delete reference" });
  }
};
