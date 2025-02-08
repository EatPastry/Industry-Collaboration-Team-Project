import React from "react";
import { ShareProblem } from "./ShareProblem";

export function ShareFileButton({file}: {file: File;}) {
  const shareData = {
    files: [file]
  };

  const onClick = async () => {
    try {
      await navigator.share(shareData);
    } catch (error) {
      console.log("Something has failed", error);
    }
  };

  const isShareable = navigator.canShare && navigator.canShare(shareData);

  if (!isShareable) {
    return <ShareProblem />;
  }

  return (
    <>
      <button onClick={onClick}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg></button>
    </>
  );
}