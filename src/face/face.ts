import { Application, Graphics, Renderer } from "pixi.js";
import Eye from "./eye";

let leftEye: Eye;
let rightEye: Eye;

export async function createFaceTexture({
  width = 512,
  height = 512,
}: {
  width?: number;
  height?: number;
}): Promise<{ app: Application<Renderer> }> {
  const app = new Application();

  await app.init({
    width,
    height,
    background: "#db2777",
  });

  rightEye = new Eye({
    x: width * 0.5 + 75,
    y: height * 0.5,
    size: 50,
  });

  leftEye = new Eye({
    x: width * 0.5 - 75,
    y: height * 0.5,
    size: 50,
  });

  app.stage.addChild(rightEye.container);
  app.stage.addChild(leftEye.container);

  // draw mouth
  const mouth = new Graphics();
  mouth.rect(0, 0, 50, 10).fill(0x0);
  mouth.position.set(width * 0.5 - 25, height * 0.5 - 75);
  app.stage.addChild(mouth);

  return {
    app,
  };
}

export function updateFace(dt: number, x: number, y: number) {
  leftEye.lookAt(x, y);
  rightEye.lookAt(x, y);

  leftEye.update(dt);
  rightEye.update(dt);
}
