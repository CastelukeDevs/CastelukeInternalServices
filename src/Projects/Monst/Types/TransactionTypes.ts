import { Types } from "mongoose";
import { TagList } from "../Utilities/TagList";
import { CategoryList } from "../Utilities/CategoriesList";

export type ITransactionType = (typeof CategoryList)[number]["type"];
export type ITransactionCategory = (typeof CategoryList)[number]["category"];

export type ICategory = {
  category: string;
  icon: string;
  type?: ITransactionType;
};

// export type ITransactionCategories<T extends ITransactionType> =
//   (typeof TransactionCategoriesList)[T][number]["category"];

export type ITags = {
  _id: Types.ObjectId;
  tags: string;
  definition: string | null;
  index: number;
};

export type ITagsName = (typeof TagList)[number]["tags"];

export type ITransactionItems = {
  _id: Types.ObjectId;
  name: string;
  quantity: number;
  piecePrice: number;
  subTotal: number;
};

export type ITransactionMini = {
  _id: Types.ObjectId;
  type: ITransactionType;
  date: Date;
};

export type ITransactionMain = {
  id: string;
  ownerUID: string;
  walletId: Types.ObjectId;
  type: ITransactionType;
  category: ICategory | string;
  subCategories?: Types.Array<string>;
  amount: number;
  targetWallet?: string | Types.ObjectId;
  date: Date;
  note?: string;
  tags?: Types.Array<string>;
  items?: Types.DocumentArray<ITransactionItems> | string[];
  imageUrl?: string;
};

export type ITransaction = {
  _id: string;
  createdAt: number;
  updatedAt: number;
  id: string;
} & ITransactionMain;

export type ITransactionCreateUpdateRequest = {
  image?: File;
} & ITransactionMain;