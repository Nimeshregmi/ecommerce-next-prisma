import React from "react";

interface Props {
  content?: string;
}
const notFound = ({ content }: Props) => {
  return (
    <>
      <div>notFound</div>
      <div>{content}</div>
    </>
  );
};

export default notFound;
