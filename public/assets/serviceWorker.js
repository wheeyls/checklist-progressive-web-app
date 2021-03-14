/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!******************************!*\
  !*** ./src/serviceWorker.js ***!
  \******************************/
var staticChecklistSite = 'checklist-v2';
var assets = ['/index.html', '/assets/app.js'];
self.addEventListener('install', function (installEvent) {
  installEvent.waitUntil(caches.open(staticChecklistSite).then(function (cache) {
    cache.addAll(assets);
  }));
});
self.addEventListener('fetch', function (fetchEvent) {
  fetchEvent.respondWith(caches.match("".concat(staticChecklistSite, "-").concat(fetchEvent.request)).then(function (res) {
    return res || fetch(fetchEvent.request);
  }));
});
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jaGVja2xpc3QtcHJvZ3Jlc3NpdmUtd2ViLWFwcC8uL3NyYy9zZXJ2aWNlV29ya2VyLmpzIl0sIm5hbWVzIjpbInN0YXRpY0NoZWNrbGlzdFNpdGUiLCJhc3NldHMiLCJzZWxmIiwiYWRkRXZlbnRMaXN0ZW5lciIsImluc3RhbGxFdmVudCIsIndhaXRVbnRpbCIsImNhY2hlcyIsIm9wZW4iLCJ0aGVuIiwiY2FjaGUiLCJhZGRBbGwiLCJmZXRjaEV2ZW50IiwicmVzcG9uZFdpdGgiLCJtYXRjaCIsInJlcXVlc3QiLCJyZXMiLCJmZXRjaCJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxJQUFNQSxtQkFBbUIsR0FBRyxjQUE1QjtBQUNBLElBQU1DLE1BQU0sR0FBRyxDQUFDLGFBQUQsRUFBZ0IsZ0JBQWhCLENBQWY7QUFFQUMsSUFBSSxDQUFDQyxnQkFBTCxDQUFzQixTQUF0QixFQUFpQyxVQUFDQyxZQUFELEVBQWtCO0FBQ2pEQSxjQUFZLENBQUNDLFNBQWIsQ0FDRUMsTUFBTSxDQUFDQyxJQUFQLENBQVlQLG1CQUFaLEVBQWlDUSxJQUFqQyxDQUFzQyxVQUFDQyxLQUFELEVBQVc7QUFDL0NBLFNBQUssQ0FBQ0MsTUFBTixDQUFhVCxNQUFiO0FBQ0QsR0FGRCxDQURGO0FBS0QsQ0FORDtBQVFBQyxJQUFJLENBQUNDLGdCQUFMLENBQXNCLE9BQXRCLEVBQStCLFVBQUNRLFVBQUQsRUFBZ0I7QUFDN0NBLFlBQVUsQ0FBQ0MsV0FBWCxDQUNFTixNQUFNLENBQUNPLEtBQVAsV0FBZ0JiLG1CQUFoQixjQUF1Q1csVUFBVSxDQUFDRyxPQUFsRCxHQUE2RE4sSUFBN0QsQ0FBa0UsVUFBQ08sR0FBRCxFQUFTO0FBQ3pFLFdBQU9BLEdBQUcsSUFBSUMsS0FBSyxDQUFDTCxVQUFVLENBQUNHLE9BQVosQ0FBbkI7QUFDRCxHQUZELENBREY7QUFLRCxDQU5ELEUiLCJmaWxlIjoic2VydmljZVdvcmtlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHN0YXRpY0NoZWNrbGlzdFNpdGUgPSAnY2hlY2tsaXN0LXYyJztcbmNvbnN0IGFzc2V0cyA9IFsnL2luZGV4Lmh0bWwnLCAnL2Fzc2V0cy9hcHAuanMnXTtcblxuc2VsZi5hZGRFdmVudExpc3RlbmVyKCdpbnN0YWxsJywgKGluc3RhbGxFdmVudCkgPT4ge1xuICBpbnN0YWxsRXZlbnQud2FpdFVudGlsKFxuICAgIGNhY2hlcy5vcGVuKHN0YXRpY0NoZWNrbGlzdFNpdGUpLnRoZW4oKGNhY2hlKSA9PiB7XG4gICAgICBjYWNoZS5hZGRBbGwoYXNzZXRzKTtcbiAgICB9KVxuICApO1xufSk7XG5cbnNlbGYuYWRkRXZlbnRMaXN0ZW5lcignZmV0Y2gnLCAoZmV0Y2hFdmVudCkgPT4ge1xuICBmZXRjaEV2ZW50LnJlc3BvbmRXaXRoKFxuICAgIGNhY2hlcy5tYXRjaChgJHtzdGF0aWNDaGVja2xpc3RTaXRlfS0ke2ZldGNoRXZlbnQucmVxdWVzdH1gKS50aGVuKChyZXMpID0+IHtcbiAgICAgIHJldHVybiByZXMgfHwgZmV0Y2goZmV0Y2hFdmVudC5yZXF1ZXN0KTtcbiAgICB9KVxuICApO1xufSk7XG4iXSwic291cmNlUm9vdCI6IiJ9