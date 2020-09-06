const cropScreenshot = (datURI, dimensions) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.src = datURI;

    img.onload = async () => {
      const canvas = document.createElement("canvas");
      canvas.width = dimensions.width;
      canvas.height = dimensions.height;
      var context = canvas.getContext("2d");
      context.drawImage(
        img,
        dimensions.left,
        dimensions.top,
        dimensions.width,
        dimensions.height,
        0,
        0,
        dimensions.width,
        dimensions.height
      );

      const { quality } = await browser.storage.local.get("quality");

      resolve(canvas.toDataURL("image/jpeg", quality));
    };
  });

const dataURLtoBlob = (dataurl) => {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

const downloadScreenshot = async (dataURI, dimensions, filename) => {
  const croppedDataURI = await cropScreenshot(dataURI, dimensions);

  browser.downloads.download({
    url: URL.createObjectURL(dataURLtoBlob(croppedDataURI)),
    filename,
  });
};

const screenshot = ({ dimensions, filename }) => {
  const onSuccess = (dataURI) => {
    downloadScreenshot(dataURI, dimensions, filename);
  };

  const onError = (error) => {
    console.warn(error);
  };

  browser.tabs.captureVisibleTab({ format: "png" }).then(onSuccess, onError);
};

const handleMessage = (request) => {
  if (request.state === "init") {
    screenshot(request);
  }
};

browser.runtime.onMessage.addListener(handleMessage);
