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

    // límite recomendado
    const maxSize = 300 * 1024 * 1024;

    if (file.size > maxSize) {
        alert(
            "El video supera los 300 MB. FFmpeg.wasm puede quedarse sin memoria en un Chromebook."
        );
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

        status.innerText = "Subiendo video...";

        await ffmpeg.writeFile(
            "input.mp4",
            await fetchFile(file)
        );

        status.innerText = "Reduciendo ruido...";

        await ffmpeg.exec([
      
