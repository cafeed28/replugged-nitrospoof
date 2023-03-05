import { config } from "./misc";

const CANVAS_ID = "replugged-nitrospoof-renderer-canvas";

function getContext(width: number, height: number): CanvasRenderingContext2D {
  let canvas = document.getElementById(CANVAS_ID) as HTMLCanvasElement;

  if (!(canvas instanceof HTMLCanvasElement)) {
    canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.id = CANVAS_ID;

    // document.querySelector(".sidebar-1tnWFu")?.appendChild(canvas); // used to debug canvas, but it's funny so you can uncomment it
  }

  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw Error("Canvas)");
  context.clearRect(0, 0, canvas.width, canvas.height);
  return context;
}

function drawImageScaled(image: HTMLImageElement, size: number): void {
  const context = getContext(size, size);

  const scaleWidth = size / image.width;
  const scaleHeight = size / image.height;
  const scale = Math.min(scaleWidth, scaleHeight);

  const offsetX = (size - image.width * scale) / 2;
  const offsetY = (size - image.height * scale) / 2;
  context.clearRect(0, 0, size, size);
  context.drawImage(
    image,
    0,
    0,
    image.width,
    image.height,
    offsetX,
    offsetY,
    image.width * scale,
    image.height * scale,
  );
}

export async function renderPng(data: ArrayBuffer): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const size = config.get("stickerSize")!;

    const context = getContext(size, size);

    const blob = new Blob([data], { type: "image/png" });

    const image = new Image();
    image.src = URL.createObjectURL(blob);
    image.onload = () => {
      drawImageScaled(image, size);

      URL.revokeObjectURL(image.src);

      context.canvas.toBlob((blob) => {
        if (!blob) reject(new Error("Failed to get blob from canvas"));
        resolve(blob!);
      }, "image/png");
    };
  });
}
