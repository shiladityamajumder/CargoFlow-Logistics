import * as THREE from "three";

export function createBrandTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 768;
  canvas.height = 192;
  const context = canvas.getContext("2d");
  if (!context) return null;

  context.fillStyle = "#ffffff";
  context.font = "800 92px Arial, sans-serif";
  context.fillText("CARGOFLOW", 28, 108);
  context.font = "600 28px Arial, sans-serif";
  context.fillText("LOGISTICS", 34, 157);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
