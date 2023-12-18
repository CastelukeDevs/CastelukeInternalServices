export default (obj: Object) =>
  Object.values(obj).some((x) => x == null || x == undefined || x == "");
