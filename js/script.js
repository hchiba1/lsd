document.addEventListener("DOMContentLoaded", function () {
  const inputText = document.getElementById("inputText");
  const submitButton = document.getElementById("submitButton");

  submitButton.addEventListener("click", function () {
    submitText(inputText.value);
  });

  inputText.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && event.ctrlKey) {
      event.preventDefault(); // デフォルトのEnterキーの動作をキャンセル
      submitText(inputText.value);
    }
  });

  function submitText(text) {
    const lines = text.split(/\r\n|\r|\n/)
        .map(line => line.trim().replace(/^\s+/, ""))
        .filter(line => line !== "") // remove empty lines
        .map(line => `("${line}"@en)`).join(" ");
    fetchDatabySPARQL(lines).then(data => {
      renderTable(data);
    });
  }
});
