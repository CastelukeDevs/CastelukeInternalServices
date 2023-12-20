const StoragePath = [
  { path: "user/avatar/" },
  { path: "user/wallet/" },
  { path: "app/commons/" },
] as const;

export type IStoragePath = (typeof StoragePath)[number]["path"];

export default StoragePath;
