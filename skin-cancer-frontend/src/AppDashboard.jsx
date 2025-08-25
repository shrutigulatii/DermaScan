import React, { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import { getAdvice } from "./utils/gemini";


function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState("");
  const [llmAdvice, setLLMAdvice] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [model, setModel] = useState(null);
  const [history] = useState([
    { id: 1, date: "2025-06-24", result: "Benign", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTz3o6tOnFOX7MdyVRwMadxHDjft2w3L3xSFw&s" },
    { id: 2, date: "2025-06-23", result: "Malignant", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9BZFfrn28tt6ZjKqCux1O5nJXX_Ccjxv2wg&s" },
    { id: 3, date: "2025-06-22", result: "Benign", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2DqO-WYvl6q9jU0q2eVzXGz5rS59l7MT96g&s" },
  ]);

  useEffect(() => {
    tf.ready().then(() => {
      console.log("✅ TensorFlow.js backend ready");
      loadModel();
    });

    async function loadModel() {
      try {
        const loaded = await tf.loadGraphModel("/models/model.json");
        setModel(loaded);
        console.log("✅ Model loaded");
      } catch (err) {
        console.error("❌ Model load failed:", err);
      }
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult("");
  };
  const getAdvice = async (prompt) => {
  try {
    const res = await fetch("https://dermascan-o2je.onrender.com/api/advice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    return data.advice || "No advice received.";
  } catch (err) {
    console.error("LLM error:", err);
    return "Could not fetch advice at this time.";
  }
};

 const handleAnalyze = async () => {
  if (!image || !model) return;
  setLoading(true);
  setResult("");      
  setLLMAdvice("");

  const reader = new FileReader();
  reader.onloadend = () => {
    const img = new Image();
    img.src = reader.result;

    img.onload = async () => {
      const tensor = tf.tidy(() =>
        tf.browser
          .fromPixels(img)
          .resizeNearestNeighbor([224, 224])
          .toFloat()
          .expandDims() 
      );

  try {
  const data = model.execute(tensor); 
  const prediction = await data.data(); 
  const label = prediction[0] > 0.5 ? "Malignant" : "Benign";
  const confidence = (prediction[0] * 100).toFixed(2);
  setResult(`${label} (${confidence}%)`);
  
  let prompt = label === "Malignant"
    ? "Give medical advice or next steps for a user whose skin lesion appears malignant."
    : "Give daily skincare and sunscreen precautions for benign skin issues.";

  const llmResponse = await getAdvice(prompt); 
  setLLMAdvice(llmResponse); 

  data.dispose();
  tensor.dispose();
} catch (err) {
  console.error("❌ Prediction error:", err);
  setResult("Prediction failed.");
}

      setLoading(false);
    };
  };

  reader.readAsDataURL(image);
};

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "history", label: "Analysis History", icon: "🕒" },
    { id: "patients", label: "Patient Records", icon: "👨‍⚕️" },
    { id: "settings", label: "Settings", icon: "⚙️" }
  ];

  
  const styles = {
    container: {
      display: "flex",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 100%)",
      fontFamily: "'Inter', sans-serif",
    },
    sidebar: {
      width: "250px",
      background: "white",
      boxShadow: "5px 0 15px rgba(0, 0, 0, 0.05)",
      padding: "1.5rem 1rem",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    },
    logoContainer: {
      padding: "1rem 0 2rem",
      borderBottom: "1px solid #eee",
      marginBottom: "1rem",
    },
    logo: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      fontSize: "1.5rem",
      fontWeight: "700",
      color: "#0d4a8e",
    },
    navList: {
      listStyle: "none",
      padding: 0,
      margin: 0,
    },
    navItem: {
      padding: "0.75rem 1rem",
      marginBottom: "0.5rem",
      borderRadius: "8px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      transition: "all 0.2s ease",
      color: "#4a5568",
    },
    navItemActive: {
      background: "#e6f7ff",
      color: "#0d4a8e",
      fontWeight: "600",
      borderLeft: "4px solid #1890ff",
    },
    navItemHover: {
      background: "#f0f9ff",
    },
    userInfo: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "1rem",
      background: "#f0f9ff",
      borderRadius: "12px",
      marginBottom: "1rem",
    },
    userAvatar: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      background: "#1890ff",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "600",
    },
    mainContent: {
      flex: 1,
      padding: "2rem",
      overflowY: "auto",
      background: "#fafcff",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "2rem",
    },
    title: {
      fontSize: "1.8rem",
      fontWeight: "700",
      color: "#0d4a8e",
      margin: 0,
    },
    card: {
      background: "white",
      borderRadius: "16px",
      boxShadow: "0 5px 20px rgba(0, 0, 0, 0.03)",
      padding: "2rem",
      marginBottom: "2rem",
      border: "1px solid #e6f7ff",
    },
    uploadLabel: {
      display: "block",
      fontSize: "1rem",
      color: "#4a5568",
      marginBottom: "1rem",
      fontWeight: "500",
    },
    fileInput: {
      display: "block",
      width: "100%",
      padding: "0.75rem",
      border: "2px dashed #cbd5e0",
      borderRadius: "12px",
      backgroundColor: "#f8fcff",
      color: "#4a5568",
      cursor: "pointer",
      marginBottom: "1.5rem",
      transition: "all 0.2s ease",
    },
    preview: {
      display: "flex",
      justifyContent: "center",
      marginBottom: "1.5rem",
    },
    previewImg: {
      maxWidth: "300px",
      maxHeight: "300px",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)",
      border: "1px solid #e6f7ff",
    },
    button: {
      background: "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
      color: "white",
      border: "none",
      borderRadius: "12px",
      padding: "0.75rem 1.5rem",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s ease",
      width: "100%",
      marginBottom: "1rem",
      boxShadow: "0 4px 8px rgba(24, 144, 255, 0.2)",
    },
    buttonHover: {
      transform: "translateY(-2px)",
      boxShadow: "0 6px 12px rgba(24, 144, 255, 0.3)",
    },
    buttonDisabled: {
      opacity: "0.7",
      cursor: "not-allowed",
      background: "#adc6ff",
    },
    result: {
      background: "#e6f7ff",
      borderRadius: "12px",
      padding: "1.5rem",
      color: "#096dd9",
      fontWeight: "600",
      fontSize: "1.1rem",
      textAlign: "center",
      marginBottom: "1rem",
      border: "1px solid #91d5ff",
    },
    sectionTitle: {
      fontSize: "1.5rem",
      fontWeight: "600",
      color: "#0d4a8e",
      marginTop: 0,
      marginBottom: "1.5rem",
    },
    historyItem: {
      display: "flex",
      alignItems: "center",
      padding: "1rem",
      background: "#f0f9ff",
      borderRadius: "12px",
      marginBottom: "1rem",
      boxShadow: "0 2px 6px rgba(0, 0, 0, 0.03)",
      border: "1px solid #e6f7ff",
    },
    historyImage: {
      width: "60px",
      height: "60px",
      borderRadius: "8px",
      objectFit: "cover",
      marginRight: "1.5rem",
      border: "1px solid #e6f7ff",
    },
    historyText: {
      flex: 1,
    },
    historyDate: {
      color: "#718096",
      fontSize: "0.9rem",
    },
    historyResult: {
      color: "#0d4a8e",
      fontWeight: "600",
      fontSize: "1.1rem",
    },
    logoutButton: {
      background: "transparent",
      color: "#f5222d",
      border: "1px solid #ffccc7",
      borderRadius: "12px",
      padding: "0.5rem 1rem",
      width: "100%",
      cursor: "pointer",
      fontWeight: "500",
      transition: "all 0.2s ease",
    }
  };

  return (
    <div className="w-screen h-screen" style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.logoContainer}>
          <div style={styles.logo}>🧬 DermaScan-AI</div>
        </div>
        <ul style={styles.navList}>
          {navItems.map((item) => (
            <li
              key={item.id}
              style={{
                ...styles.navItem,
                ...(activeTab === item.id ? styles.navItemActive : {}),
              }}
              onClick={() => setActiveTab(item.id)}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
        <div>
          <div style={styles.userInfo}>
            <div style={styles.userAvatar}>IG</div>
            <div>
              <div style={{ fontWeight: "600", color: "black" }}>Admin</div>
              <div style={{ fontSize: "0.85rem", color: "#718096" }}>Engineer</div>
            </div>
          </div>
          <button 
            style={styles.logoutButton}
            onClick={() => {
              localStorage.removeItem("loggedIn");
              localStorage.removeItem("token");
              window.location.reload();
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.header}>
          <h1 style={styles.title}>
            {activeTab === "dashboard" 
              ? "Dashboard" 
              : activeTab === "history" 
                ? "Analysis History" 
                : activeTab === "patients" 
                  ? "Patient Records" 
                  : "Settings"}
          </h1>
        </div>

        {/* Dashboard Content */}
        {activeTab === "dashboard"  && (
          <div className="bg-slate-950">
          <div style={styles.card} >
            <label style={styles.uploadLabel}>Upload Skin Lesion Image:</label>
            <input
              type="file"
              accept="image/*"
              style={styles.fileInput}
              onChange={handleImageChange}
            />

            {preview && (
              <div style={styles.preview}>
                <img src={preview} alt="Preview" style={styles.previewImg} />
              </div>
            )}

            <button
              style={{
                ...styles.button,
                ...(loading || !image ? styles.buttonDisabled : {}),
              }}
              onClick={handleAnalyze}
              disabled={loading || !image}
            >
              {loading ? "Analyzing..." : "Analyze Image"}
            </button>

            {result && <div style={styles.result}>{result}</div>}
            {llmAdvice && (
  <div style={{ 
    marginTop: "1rem", 
    background: "#e0f2ff", 
    color: "#1e3a8a", 
    padding: "1rem", 
    borderRadius: "8px", 
    fontWeight: "500",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
  }}>
    <strong>AI Advice:</strong> {llmAdvice}
  </div>
)}

          </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>Previous Analyses</h2>
            {history.map((entry) => (
              <div key={entry.id} style={styles.historyItem}>
                <img src={entry.image} alt="History" style={styles.historyImage} />
                <div  style={styles.historyText}>
                  <div style={styles.historyDate}>{entry.date}</div>
                  <div style={styles.historyResult}>{entry.result}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Placeholder for other tabs */}
        {activeTab === "patients" && (
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>Patient Records</h2>
            <p className="text-blue-950">Patient management features coming soon...</p>
          </div>
        )}

        {activeTab === "settings" && (
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>Application Settings</h2>
            <p className="text-violet-600">Customization options coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
