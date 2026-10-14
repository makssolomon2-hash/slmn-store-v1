/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("products");

  const record0 = new Record(collection);
    record0.set("name", "Cyber Drums Vol 1");
    record0.set("category", "Sample Packs");
    record0.set("price", 29.99);
    record0.set("description", "Professional EDM drum kit with 200+ one-shots and loops");
    record0.set("fileFormat", "WAV");
  try {
    app.save(record0);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record1 = new Record(collection);
    record1.set("name", "Serum Synth Pack");
    record1.set("category", "Serum Presets");
    record1.set("price", 19.99);
    record1.set("description", "50 custom Serum presets for EDM production");
    record1.set("fileFormat", ".fxp");
  try {
    app.save(record1);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record2 = new Record(collection);
    record2.set("name", "Phase Plant Essentials");
    record2.set("category", "Phase Plant Presets");
    record2.set("price", 24.99);
    record2.set("description", "75 Phase Plant presets for modern EDM");
    record2.set("fileFormat", ".phaseplant");
  try {
    app.save(record2);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record3 = new Record(collection);
    record3.set("name", "Melodic Loops Collection");
    record3.set("category", "Sample Packs");
    record3.set("price", 34.99);
    record3.set("description", "500+ melodic loops and stems");
    record3.set("fileFormat", "WAV");
  try {
    app.save(record3);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record4 = new Record(collection);
    record4.set("name", "Techno Essentials");
    record4.set("category", "Serum Presets");
    record4.set("price", 22.99);
    record4.set("description", "100 Serum presets for techno production");
    record4.set("fileFormat", ".fxp");
  try {
    app.save(record4);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }
}, (app) => {
  // Rollback: record IDs not known, manual cleanup needed
})
