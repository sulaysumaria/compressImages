const Jimp = require("jimp");
const fs = require("fs");
const path = require("path");

const FILES_TO_IGNORE = [".DS_Store", ".gitkeep"];

function bytesToSize(bytes) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  if (bytes == 0) return "0 Byte";

  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));

  return (Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i]).padStart(
    10,
    " "
  );
}

async function init() {
  let images = fs.readdirSync(path.join(".", "input"));
  let totalBytesSaved = 0;

  for (const image of images) {
    try {
      if (FILES_TO_IGNORE.includes(image)) {
        continue;
      }

      const stats = fs.statSync(`input/${image}`);

      let jimpImage = await Jimp.read(`input/${image}`);

      jimpImage = await jimpImage.quality(80);

      await jimpImage.writeAsync(`output/${image}`);

      const compressedStats = fs.statSync(`output/${image}`);

      totalBytesSaved += stats.size - compressedStats.size;

      console.log(
        `Before: ${bytesToSize(stats.size)}   After: ${bytesToSize(
          compressedStats.size
        )}   Total Saved: ${bytesToSize(totalBytesSaved)}`
      );
    } catch (e) {
      console.log(image);
      console.log(e);
    }
  }
}

init();
