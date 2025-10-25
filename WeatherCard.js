// This file intentionally re-exports the JSX implementation to keep
// the original import path working while avoiding JSX parsing errors
// during Vite's dependency scan.
export { default } from './WeatherCard.jsx';
