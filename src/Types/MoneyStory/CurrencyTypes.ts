import { CurrencyList } from "../../Utilities/MoneyStory/CurrencyList";

export type ICurrencyTypes = (typeof CurrencyList)[number]["abbreviation"];
