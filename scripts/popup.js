const handleQualityChange = (event) => {
  const value = parseInt(event.target.value, 10);
  const quality = value / 100;

  browser.storage.local.set({ quality });
};

const initQuality = async () => {
  try {
    let { quality } = await browser.storage.local.get("quality");

    if (!quality) {
      quality = 1;

      browser.storage.local.set({ quality });
    }

    document.getElementById("quality").value = quality * 100;
  } catch (err) {
    console.warn(err);
  }
};

initQuality();

document.getElementById("quality").onchange = handleQualityChange;
