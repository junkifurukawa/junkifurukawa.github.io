/// <reference types="vite/client" />

declare module "*.css" {
  const classes: { [key: string]: string };
  export default classes;
} 