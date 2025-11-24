import FocusedRingSunburst from "./components/FocusedRingSunburst";

function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "#e5e7eb",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: "32px",
        paddingBottom: "32px"
      }}
    >
      <h1 style={{ fontSize: "24px", fontWeight: 600, marginBottom: "8px" }}>
        MA Internet Equalities – System Model
      </h1>
      <p
        style={{
          maxWidth: "720px",
          textAlign: "center",
          fontSize: "14px",
          color: "#9ca3af",
          marginBottom: "24px"
        }}
      >
        ---
      </p>
      <FocusedRingSunburst width={1000} height={1000} />
      <div
        style={{
          marginTop: "24px",
          fontSize: "12px",
          color: "#9ca3af",
          textAlign: "center"
        }}
      >
        Designed by Dr. Ceren Yuksel, Created by Asli Ilhan.
      </div>
    </div>
  );
}

export default App;
