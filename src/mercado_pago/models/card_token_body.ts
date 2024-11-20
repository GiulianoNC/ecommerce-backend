import { Cardholder } from "./card_holder";

export interface CardTokenBody {
    Card_number:      string;
    expiration_year:  string;
    expiration_month: number;
    security_code:    string;
    cardholder:       Cardholder;
}