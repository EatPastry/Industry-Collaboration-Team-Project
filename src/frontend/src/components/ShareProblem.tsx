import React from "react";

export function ShareProblem() {
    return (
      <div>
        <p>
          Looks like you cannot share files{" "}
          <span role="img" aria-label="crying-emoji">
            😿
          </span>
        </p>
        <a href="https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share#browser_compatibility">
          Please check your browser compatibility{" "}
        </a>{" "}
      </div>
    );
  }
  