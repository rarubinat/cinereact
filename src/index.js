// Entry point of the React application, renders the App component into the root DOM element
import ReactDOM from "react-dom/client";
import App from "./App";

// Create a React root and render the main App component
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
