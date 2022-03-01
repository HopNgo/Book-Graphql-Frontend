import "animate.css";
import React from "react";
import { Spinner } from "react-bootstrap";

const Loading = ({
  isCalled,
  isLoading,
}) => {
  if (isLoading && isCalled)
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "black",
          opacity: 0.4,
          zIndex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spinner animation="border" variant="info" />
      </div>
    );

  return <></>;
};

export default Loading;
