const form = document.getElementById("recommendationForm");
const output = document.getElementById("recommendationOutput");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const skinTone = form.skinTone.value;
  const bodyShape = form.bodyShape.value;

  // Fake logic for demo
  const recommendations = {
    suggestedColors: ["Coral", "Lavender", "Olive"],
    suggestedStyles: ["Bohemian", "Classic", "Chic"],
    suggestedFits: ["Slim Fit", "Relaxed Fit", "Tailored"]
  };

  output.innerHTML = `
    <h3>🎨 Suggested Colors</h3>
    <div class="tags">
      ${recommendations.suggestedColors.map(color => `<span class="tag color">${color}</span>`).join("")}
    </div>

    <h3>✂️ Suggested Styles</h3>
    <div class="tags">
      ${recommendations.suggestedStyles.map(style => `<span class="tag style">${style}</span>`).join("")}
    </div>

    <h3>📏 Suggested Fits</h3>
    <div class="tags">
      ${recommendations.suggestedFits.map(fit => `<span class="tag fit">${fit}</span>`).join("")}
    </div>

    <div class="shop-link">
      <a href="../Homepages/womenHomePage.html">Shop Recommended Styles</a>
    </div>
  `;
});
