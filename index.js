const exec = require("child_process").execSync;
const path = require("path");
const fs = require("fs");

const script = process.argv[1];
const ffmpeg = path.join( path.parse(script).dir, "ffmpeg-3.1.4-win64-static/bin/ffmpeg" );

// http://stackoverflow.com/questions/26109837/convert-flac-to-mp3-with-ffmpeg-keeping-all-metadata
// ffmpeg -i input.flac -ab 320k -map_metadata 0 -id3v2_version 3 output.mp3
// find . -name "*.flac" -exec ffmpeg -i {} -ab 160k -map_metadata 0 -id3v2_version 3 {}.mp3 \;

// get source path from commandline
// default is current working dir
let [ , ,source ] = process.argv;
if( !source ) source = ".";
source = path.join(process.cwd(), source);

const stats = fs.statSync(source);

if( stats.isDirectory() ) {

  // if source is directory, loop though files and convert all
  // TODO: recursively loop through subdirs
  const files = fs.readdirSync(source);
  files.forEach(file => {
    const fullPath = path.join(source, file);
    convert(fullPath);
  });

} else if( stats.isFile() ) {
  convert(source);
}

function convert(source) {
  const parsed = path.parse(source);

  if( parsed.ext === ".flac" ) {

    const destination = path.join(parsed.dir, parsed.name + ".mp3");

    console.log(`Begin converting ${source} to ${destination}`);
    exec(`${ffmpeg} -i "${source}" -ab 320k -map_metadata 0 -id3v2_version 3 "${destination}"`);
    // TODO: log information about converting on console
  }
}
