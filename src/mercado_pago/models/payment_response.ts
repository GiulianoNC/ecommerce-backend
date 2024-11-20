import { Cardholder, Identification } from "./card_holder";

export interface PaymentResponse {
    id:                          number;
    date_created:                Date;
    date_approved:               null;
    date_last_updated:           Date;
    date_of_expiration:          null;
    money_release_date:          null;
    money_release_status:        string;
    operation_type:              string;
    issuer_id:                   string;
    payment_method_id:           string;
    payment_type_id:             string;
    payment_method:              PaymentMethod;
    status:                      string;
    status_detail:               string;
    currency_id:                 string;
    description:                 null;
    live_mode:                   boolean;
    sponsor_id:                  null;
    authorization_code:          string;
    money_release_schema:        null;
    taxes_amount:                number;
    counter_currency:            null;
    brand_id:                    null;
    shipping_amount:             number;
    build_version:               string;
    pos_id:                      null;
    store_id:                    null;
    integrator_id:               null;
    platform_id:                 null;
    corporation_id:              null;
    charges_execution_info:      ChargesExecutionInfo;
    payer:                       Payer;
    collector_id:                number;
    marketplace_owner:           null;
    metadata:                    OrderClass;
    additional_info:             AdditionalInfo;
    order:                       OrderClass;
    external_reference:          null;
    transaction_amount:          number;
    transaction_amount_refunded: number;
    coupon_amount:               number;
    differential_pricing_id:     null;
    financing_group:             null;
    deduction_schema:            null;
    installments:                number;
    transaction_details:         TransactionDetails;
    fee_details:                 any[];
    charges_details:             ChargesDetail[];
    captured:                    boolean;
    binary_mode:                 boolean;
    call_for_authorize_id:       null;
    statement_descriptor:        string;
    card:                        Card;
    notification_url:            null;
    refunds:                     any[];
    processing_mode:             string;
    merchant_account_id:         null;
    merchant_number:             null;
    acquirer_reconciliation:     any[];
    point_of_interaction:        PointOfInteraction;
    accounts_info:               null;
    release_info:                null;
    tags:                        null;
}

export interface AdditionalInfo {
    available_balance:   null;
    nsu_processadora:    string;
    authentication_code: null;
}

export interface Card {
    id:                null;
    first_six_digits:  null;
    last_four_digits:  string;
    expiration_month:  null;
    expiration_year:   null;
    date_created:      null;
    date_last_updated: null;
    country:           null;
    tags:              null;
    cardholder:        Cardholder;
}

export interface ChargesDetail {
    id:             string;
    name:           string;
    type:           string;
    accounts:       Accounts;
    client_id:      number;
    date_created:   Date;
    last_updated:   Date;
    amounts:        Amounts;
    metadata:       ChargesDetailMetadata;
    reserve_id:     null;
    refund_charges: any[];
}

export interface Accounts {
    from: string;
    to:   string;
}

export interface Amounts {
    original: number;
    refunded: number;
}

export interface ChargesDetailMetadata {
    source: string;
}

export interface ChargesExecutionInfo {
    internal_execution: InternalExecution;
}

export interface InternalExecution {
    date:         Date;
    execution_id: string;
}

export interface OrderClass {
}

export interface Payer {
    identification: Identification;
    entity_type:    null;
    phone:          Phone;
    last_name:      null;
    id:             string;
    type:           null;
    first_name:     null;
    email:          null;
}

export interface Phone {
    number:    null;
    extension: null;
    area_code: null;
}

export interface PaymentMethod {
    id:        string;
    type:      string;
    issuer_id: string;
    data:      Data;
}

export interface Data {
    routing_data: RoutingData;
}

export interface RoutingData {
    merchant_account_id: string;
}

export interface PointOfInteraction {
    type:          string;
    business_info: BusinessInfo;
}

export interface BusinessInfo {
    unit:     string;
    sub_unit: string;
    branch:   string;
}

export interface TransactionDetails {
    payment_method_reference_id: null;
    acquirer_reference:          null;
    net_received_amount:         number;
    total_paid_amount:           number;
    overpaid_amount:             number;
    external_resource_url:       null;
    installment_amount:          number;
    financial_institution:       null;
    payable_deferral_period:     null;
}
