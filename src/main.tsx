try {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <App />
  )
} catch (e) {
  console.error("APP CRASH:", e)
}
