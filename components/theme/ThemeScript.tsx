export function ThemeScript() {
  const code = `
    (function () {
      try {
        var stored = localStorage.getItem("nutricare-theme") || "light";
        var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        var shouldUseDark = stored === "dark" || (stored === "auto" && prefersDark);
        document.documentElement.classList.toggle("dark", shouldUseDark);
      } catch (_) {}
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
