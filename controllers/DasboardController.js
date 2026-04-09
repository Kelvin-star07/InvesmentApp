export function GetIndex(req, res, next) {
  res.render("Dasboard/index", { "page-title": "Dashboard" });
}