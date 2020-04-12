const Jimp = require("jimp");
const fs = require("fs");
const path = require("path");

const FILES_TO_IGNORE = [".DS_Store", ".gitkeep"];

function getSizeInMb(bytes) {
  return (bytes / 1024 / 1024).toFixed(2).toString().padStart(6, " ");
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
        `Before: ${getSizeInMb(stats.size)} MB   After: ${getSizeInMb(
          compressedStats.size
        )} MB   Total Saved: ${getSizeInMb(totalBytesSaved)} MB`
      );
    } catch (e) {
      console.log(image);
      console.log(e);
    }
  }
}

init();
