/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("sounds");

  const existing = collection.fields.getByName("audioFile");
  if (existing) {
    if (existing.type === "file") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("audioFile"); // exists with wrong type, remove first
  }

  collection.fields.add(new FileField({
    name: "audioFile",
    required: false,
    maxSelect: 1,
    maxSize: 104857520
  }));

  return app.save(collection);
}, (app) => {
  try {
    const collection = app.findCollectionByNameOrId("sounds");
    collection.fields.removeByName("audioFile");
    return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})
