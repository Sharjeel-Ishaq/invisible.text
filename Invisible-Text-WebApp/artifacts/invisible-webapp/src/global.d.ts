/// <reference types="vite/client" />

// Allow importing image assets and other static files in TypeScript
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.webp';
declare module '*.gif';
declare module '*.css';

// Allow importing from custom asset alias used in the project
declare module '@assets/*';
