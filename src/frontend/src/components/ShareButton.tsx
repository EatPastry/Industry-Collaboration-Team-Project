import React from "react";
import { ShareProblem } from "./ShareProblem";
import { base64toFile } from "../utils/base64toImage";

/**
 * Generates the image to be shared
 * @returns A base64 URL of the generated image
 */
  function genImage() {
    //Use pre-made canvas which is hidden
    const canvas = document.getElementById("img-container") as HTMLCanvasElement;
    //Change how the image will look below
    const ctx = canvas.getContext('2d');
    ctx!.strokeStyle = "red";
    ctx!.fillStyle = "blue";
    ctx!.lineWidth = 5;
    ctx!.font = "48px serif";
    ctx!.fillText("You saved:" + canvas.innerText, 10, 50);
    ctx!.fillRect(10, 120, 10, 10);
    ctx!.save();

    const dataURL = canvas.toDataURL();
    return dataURL;
}

/**
 * Creates a button which when clicked,
 * it generates an image and prompts the user to share
 * @returns A button which is used to share the image
 */
export function ShareFileButton() {
    
  const onClick = async () => {

    let file = base64toFile(genImage(), `recapped.png`, "image/png");

    const shareData = {
        files: [file]
    };

    try {
      await navigator.share(shareData);
    } catch (error) {
      console.log("Something has failed", error);
    }
  };

  const isShareable = navigator.canShare;

  if (!isShareable) {
    return <ShareProblem />;
  }

  return (
    <>
      <button className="share-button" onClick={onClick}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" border-radius="80px" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg></button>
    </>
  );
}