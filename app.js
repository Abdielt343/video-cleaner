import { FFmpeg } from "https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.12.10/dist/esm/index.js";
import { fetchFile } from "https://cdn.jsdelivr.net/npm/@ffmpeg/util@0.12.1/dist/esm/index.js";

const button = document.getElementById("processBtn");
const input = document.getElementById("videoFile");
const status = document.getElementById("status");
const preview = document.getElementById("preview");
const downloadLink = document.getElementById("downloadLink");

const ffmpeg = new FFmpeg();

button.addEventListener("click", processVideo);

async function processVideo() {

const file = input.files[0];

if (!file) {
alert("Selecciona un video");
return;
}

button.disabled = true;

try {

status.innerText = "Cargando FFmpeg...";
if (!ffmpeg.loaded) {

  const baseURL =
    "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/umd";

  await ffmpeg.load({
    coreURL: `${baseURL}/ffmpeg-core.js`,
    wasmURL: `${baseURL}/ffmpeg-core.wasm`
  });
}

status.innerText = "Subiendo archivo...";

await ffmpeg.writeFile(
"input.mp4",
await fetchFile(file)
);

status.innerText = "Aplicando reducción de ruido...";

/*
afftdn = reducción de ruido
highpass = elimina ruido grave
lowpass = mejora voz
compand = mejora inteligibilidad
*/

await ffmpeg.exec([
"-i",
"input.mp4",

"-af",
"afftdn=nf=-30,highpass=f=80,lowpass=f=9000,compand",

"-c:v",
"copy",

"-c:a",
"aac",

"output.mp4"
]);

status.innerText = "Generando resultado...";

const data =
await ffmpeg.readFile("output.mp4");

const blob = new Blob(
[data.buffer],
{ type: "video/mp4" }
);

const url =
URL.createObjectURL(blob);

preview.src = url;

downloadLink.href = url;
downloadLink.download = "video_limpio.mp4";
downloadLink.textContent =
"⬇ Descargar video limpio";

status.innerText =
"✅ Video procesado";

} catch(error){

console.error(error);

status.innerText =
"Error procesando video";

}

button.disabled = false;
}
