import { CurrencyList } from "../Utilities/CurrencyList";

export type ICurrencyTypes = (typeof CurrencyList)[number]["abbreviation"];
