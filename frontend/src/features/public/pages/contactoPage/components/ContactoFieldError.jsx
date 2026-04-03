import { AlertTriangle } from "lucide-react";

const ContactoFieldError = ({ id, message }) => {
  if (!message) {
    return null;
  }

  return (
    <p
      id={id}
      className="mt-1.5 flex items-center gap-1 text-xs text-red-600"
      role="alert"
    >
      <AlertTriangle className="h-3.5 w-3.5" />
      {message}
    </p>
  );
};

export default ContactoFieldError;
