// Farming Tips Route
app.get("/api/tips", async (req, res) => {
  const tips = [
    {
      title: "🌱 Soil Health & Care",
      content: "Rotate crops, add compost, and avoid overusing fertilizers to maintain soil structure and fertility."
    },
    {
      title: "🌾 Crop Nutrition",
      content: "Provide balanced nutrients (NPK) and use organic manure or compost to support long-term soil health."
    },
    {
      title: "💧 Irrigation Management",
      content: "Use drip or sprinkler irrigation. Collect rainwater and water plants early morning to prevent evaporation."
    },
    {
      title: "🐛 Pest & Disease Control",
      content: "Inspect crops weekly, use neem spray or ash, and encourage natural predators like ladybugs and spiders."
    },
    {
      title: "🚜 Mechanisation",
      content: "Use small tools or machinery to reduce labor and time. Keep equipment clean to prevent crop diseases."
    },
    {
      title: "☀️ Drought Resilience",
      content: "Grow drought-resistant crops like sorghum, millet, and cowpeas. Mulch soil to retain moisture."
    },
    {
      title: "📦 Post-Harvest Storage",
      content: "Store grains in dry, pest-free areas. Use sealed containers or bags to avoid moisture and rodents."
    },
  ];
  res.json(tips);
});



