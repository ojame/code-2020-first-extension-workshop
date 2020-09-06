const sendMessage = (message) => {
  browser.runtime.sendMessage(message);
};

const getFilename = () => {
  const title = document.querySelector("h1.ytd-video-primary-info-renderer")
    .innerText;
  const timeElapsed = document.querySelector(".ytp-time-current").innerText;

  return `${title}_${timeElapsed}`.replace(/[^a-z0-9]/gi, "_").toLowerCase();
};

const init = () => {
  sendMessage({
    state: "init",
    dimensions: document.querySelector(".video-stream").getBoundingClientRect(),
    filename: getFilename(),
  });
};

const injectScreenshotButton = () => {
  const menu = document.querySelector(".ytp-right-controls");
  const button = document.createElement("button");
  button.className = "ytp-button ytp-settings-button";

  button.innerHTML =
    '<svg style="padding: 8px" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-camera"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>';

  button.onclick = init;

  menu.insertBefore(button, menu.firstChild);
};

injectScreenshotButton();
