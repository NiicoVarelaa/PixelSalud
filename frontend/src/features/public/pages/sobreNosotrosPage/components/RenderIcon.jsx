import { createElement } from "react";

const RenderIcon = ({ icon, size = 20, className = "", ariaHidden = true }) =>
  createElement(icon, {
    size,
    className,
    "aria-hidden": ariaHidden,
  });

export default RenderIcon;
