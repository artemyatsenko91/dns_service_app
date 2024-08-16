import { CSSProperties } from "react";

export const styles: { [key: string]: CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    width: "100%",
    maxWidth: 600,
  },
  error: {
    color: "red",
  },
};
