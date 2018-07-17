let cleanPopup = function (callback) {
  window.addEventListener('popstate', function (e) {
    callback();
  }, false);
};

export default cleanPopup