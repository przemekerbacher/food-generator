import { Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import Layout from "./components/Layout";
import Foods from "./pages/Foods";
import Ingredients from "./pages/Ingredients";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Index />} />
        <Route path="foods" element={<Foods />} />
        <Route path="ingredients" element={<Ingredients />} />
        <Route path="*" element={<>Czego tu szuka? Nic tu nie ma!</>} />
      </Route>
    </Routes>
  );
}

export default App;
