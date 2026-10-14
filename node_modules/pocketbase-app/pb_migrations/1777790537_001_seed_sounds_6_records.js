/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("sounds");

  const record0 = new Record(collection);
    record0.set("title", "Cyber Drums Loop");
    record0.set("description", "Heavy EDM drum loop with punchy kicks and crisp hi-hats");
    record0.set("category", "Drums");
    record0.set("duration", 15);
    record0.set("audioUrl", "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
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
    record1.set("title", "Synth Pad Ambient");
    record1.set("description", "Atmospheric synthesizer pad with lush reverb and warm tones");
    record1.set("category", "Synths");
    record1.set("duration", 20);
    record1.set("audioUrl", "https://assets.mixkit.co/active_storage/sfx/2870/2870-preview.mp3");
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
    record2.set("title", "Bass Drop 808");
    record2.set("description", "Deep 808 bass sound with powerful sub frequencies");
    record2.set("category", "Bass");
    record2.set("duration", 12);
    record2.set("audioUrl", "https://assets.mixkit.co/active_storage/sfx/2871/2871-preview.mp3");
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
    record3.set("title", "Vocal Chop Sample");
    record3.set("description", "Chopped vocal sample perfect for electronic music production");
    record3.set("category", "Vocals");
    record3.set("duration", 8);
    record3.set("audioUrl", "https://assets.mixkit.co/active_storage/sfx/2872/2872-preview.mp3");
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
    record4.set("title", "Arpeggio Synth");
    record4.set("description", "Fast arpeggiating synthesizer with bright, energetic character");
    record4.set("category", "Synths");
    record4.set("duration", 18);
    record4.set("audioUrl", "https://assets.mixkit.co/active_storage/sfx/2873/2873-preview.mp3");
  try {
    app.save(record4);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record5 = new Record(collection);
    record5.set("title", "Kick Drum Pattern");
    record5.set("description", "Punchy kick drum pattern with tight timing and presence");
    record5.set("category", "Drums");
    record5.set("duration", 16);
    record5.set("audioUrl", "https://assets.mixkit.co/active_storage/sfx/2874/2874-preview.mp3");
  try {
    app.save(record5);
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
