import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  inet: any;
  time: any;
  timestamptz: any;
  uuid: any;
};


/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export type Boolean_Comparison_Exp = {
  _eq: Maybe<Scalars['Boolean']>;
  _gt: Maybe<Scalars['Boolean']>;
  _gte: Maybe<Scalars['Boolean']>;
  _in: Maybe<Array<Scalars['Boolean']>>;
  _is_null: Maybe<Scalars['Boolean']>;
  _lt: Maybe<Scalars['Boolean']>;
  _lte: Maybe<Scalars['Boolean']>;
  _neq: Maybe<Scalars['Boolean']>;
  _nin: Maybe<Array<Scalars['Boolean']>>;
};

export type LoginOutput = {
  __typename?: 'LoginOutput';
  created_at: Scalars['timestamptz'];
  /** An object relationship */
  customer: Customers;
  customer_id: Maybe<Scalars['uuid']>;
  id: Scalars['uuid'];
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq: Maybe<Scalars['String']>;
  _gt: Maybe<Scalars['String']>;
  _gte: Maybe<Scalars['String']>;
  /** does the column match the given case-insensitive pattern */
  _ilike: Maybe<Scalars['String']>;
  _in: Maybe<Array<Scalars['String']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex: Maybe<Scalars['String']>;
  _is_null: Maybe<Scalars['Boolean']>;
  /** does the column match the given pattern */
  _like: Maybe<Scalars['String']>;
  _lt: Maybe<Scalars['String']>;
  _lte: Maybe<Scalars['String']>;
  _neq: Maybe<Scalars['String']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike: Maybe<Scalars['String']>;
  _nin: Maybe<Array<Scalars['String']>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex: Maybe<Scalars['String']>;
  /** does the column NOT match the given pattern */
  _nlike: Maybe<Scalars['String']>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex: Maybe<Scalars['String']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar: Maybe<Scalars['String']>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex: Maybe<Scalars['String']>;
  /** does the column match the given SQL regular expression */
  _similar: Maybe<Scalars['String']>;
};

/** columns and relationships of "customers" */
export type Customers = {
  __typename?: 'customers';
  contact_name: Scalars['String'];
  created_at: Scalars['timestamptz'];
  /** An array relationship */
  firebase_tokens: Array<Firebase_Tokens>;
  /** An aggregate relationship */
  firebase_tokens_aggregate: Firebase_Tokens_Aggregate;
  firebase_uid: Scalars['String'];
  id: Scalars['uuid'];
  /** An object relationship */
  membership: Maybe<Memberships>;
  /** fetch data from the table: "personas" */
  personas: Array<Personas>;
  /** An aggregate relationship */
  personas_aggregate: Personas_Aggregate;
  stripe_customer_id: Maybe<Scalars['String']>;
  unverified_email: Scalars['String'];
  verified_email: Maybe<Scalars['String']>;
};


/** columns and relationships of "customers" */
export type CustomersFirebase_TokensArgs = {
  distinct_on: Maybe<Array<Firebase_Tokens_Select_Column>>;
  limit: Maybe<Scalars['Int']>;
  offset: Maybe<Scalars['Int']>;
  order_by: Maybe<Array<Firebase_Tokens_Order_By>>;
  where: Maybe<Firebase_Tokens_Bool_Exp>;
};


/** columns and relationships of "customers" */
export type CustomersFirebase_Tokens_AggregateArgs = {
  distinct_on: Maybe<Array<Firebase_Tokens_Select_Column>>;
  limit: Maybe<Scalars['Int']>;
  offset: Maybe<Scalars['Int']>;
  order_by: Maybe<Array<Firebase_Tokens_Order_By>>;
  where: Maybe<Firebase_Tokens_Bool_Exp>;
};


/** columns and relationships of "customers" */
export type CustomersPersonasArgs = {
  distinct_on: Maybe<Array<Personas_Select_Column>>;
  limit: Maybe<Scalars['Int']>;
  offset: Maybe<Scalars['Int']>;
  order_by: Maybe<Array<Personas_Order_By>>;
  where: Maybe<Personas_Bool_Exp>;
};


/** columns and relationships of "customers" */
export type CustomersPersonas_AggregateArgs = {
  distinct_on: Maybe<Array<Personas_Select_Column>>;
  limit: Maybe<Scalars['Int']>;
  offset: Maybe<Scalars['Int']>;
  order_by: Maybe<Array<Personas_Order_By>>;
  where: Maybe<Personas_Bool_Exp>;
};

/** aggregated selection of "customers" */
export type Customers_Aggregate = {
  __typename?: 'customers_aggregate';
  aggregate: Maybe<Customers_Aggregate_Fields>;
  nodes: Array<Customers>;
};

/** aggregate fields of "customers" */
export type Customers_Aggregate_Fields = {
  __typename?: 'customers_aggregate_fields';
  count: Scalars['Int'];
  max: Maybe<Customers_Max_Fields>;
  min: Maybe<Customers_Min_Fields>;
};


/** aggregate fields of "customers" */
export type Customers_Aggregate_FieldsCountArgs = {
  columns: Maybe<Array<Customers_Select_Column>>;
  distinct: Maybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "customers". All fields are combined with a logical 'AND'. */
export type Customers_Bool_Exp = {
  _and: Maybe<Array<Customers_Bool_Exp>>;
  _not: Maybe<Customers_Bool_Exp>;
  _or: Maybe<Array<Customers_Bool_Exp>>;
  contact_name: Maybe<String_Comparison_Exp>;
  created_at: Maybe<Timestamptz_Comparison_Exp>;
  firebase_tokens: Maybe<Firebase_Tokens_Bool_Exp>;
  firebase_uid: Maybe<String_Comparison_Exp>;
  id: Maybe<Uuid_Comparison_Exp>;
  membership: Maybe<Memberships_Bool_Exp>;
  personas: Maybe<Personas_Bool_Exp>;
  stripe_customer_id: Maybe<String_Comparison_Exp>;
  unverified_email: Maybe<String_Comparison_Exp>;
  verified_email: Maybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "customers" */
export enum Customers_Constraint {
  /** unique or primary key constraint */
  CustomersFirebaseUidKey = 'customers_firebase_uid_key',
  /** unique or primary key constraint */
  CustomersPkey = 'customers_pkey',
  /** unique or primary key constraint */
  CustomersVerifiedEmailKey = 'customers_verified_email_key'
}

/** input type for inserting data into table "customers" */
export type Customers_Insert_Input = {
  contact_name: Maybe<Scalars['String']>;
  created_at: Maybe<Scalars['timestamptz']>;
  firebase_tokens: Maybe<Firebase_Tokens_Arr_Rel_Insert_Input>;
  firebase_uid: Maybe<Scalars['String']>;
  id: Maybe<Scalars['uuid']>;
  membership: Maybe<Memberships_Obj_Rel_Insert_Input>;
  personas: Maybe<Personas_Arr_Rel_Insert_Input>;
  stripe_customer_id: Maybe<Scalars['String']>;
  unverified_email: Maybe<Scalars['String']>;
  verified_email: Maybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Customers_Max_Fields = {
  __typename?: 'customers_max_fields';
  contact_name: Maybe<Scalars['String']>;
  created_at: Maybe<Scalars['timestamptz']>;
  firebase_uid: Maybe<Scalars['String']>;
  id: Maybe<Scalars['uuid']>;
  stripe_customer_id: Maybe<Scalars['String']>;
  unverified_email: Maybe<Scalars['String']>;
  verified_email: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Customers_Min_Fields = {
  __typename?: 'customers_min_fields';
  contact_name: Maybe<Scalars['String']>;
  created_at: Maybe<Scalars['timestamptz']>;
  firebase_uid: Maybe<Scalars['String']>;
  id: Maybe<Scalars['uuid']>;
  stripe_customer_id: Maybe<Scalars['String']>;
  unverified_email: Maybe<Scalars['String']>;
  verified_email: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "customers" */
export type Customers_Mutation_Response = {
  __typename?: 'customers_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Customers>;
};

/** input type for inserting object relation for remote table "customers" */
export type Customers_Obj_Rel_Insert_Input = {
  data: Customers_Insert_Input;
  /** on conflict condition */
  on_conflict: Maybe<Customers_On_Conflict>;
};

/** on conflict condition type for table "customers" */
export type Customers_On_Conflict = {
  constraint: Customers_Constraint;
  update_columns: Array<Customers_Update_Column>;
  where: Maybe<Customers_Bool_Exp>;
};

/** Ordering options when selecting data from "customers". */
export type Customers_Order_By = {
  contact_name: Maybe<Order_By>;
  created_at: Maybe<Order_By>;
  firebase_tokens_aggregate: Maybe<Firebase_Tokens_Aggregate_Order_By>;
  firebase_uid: Maybe<Order_By>;
  id: Maybe<Order_By>;
  membership: Maybe<Memberships_Order_By>;
  personas_aggregate: Maybe<Personas_Aggregate_Order_By>;
  stripe_customer_id: Maybe<Order_By>;
  unverified_email: Maybe<Order_By>;
  verified_email: Maybe<Order_By>;
};

/** primary key columns input for table: customers */
export type Customers_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "customers" */
export enum Customers_Select_Column {
  /** column name */
  ContactName = 'contact_name',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  FirebaseUid = 'firebase_uid',
  /** column name */
  Id = 'id',
  /** column name */
  StripeCustomerId = 'stripe_customer_id',
  /** column name */
  UnverifiedEmail = 'unverified_email',
  /** column name */
  VerifiedEmail = 'verified_email'
}

/** input type for updating data in table "customers" */
export type Customers_Set_Input = {
  contact_name: Maybe<Scalars['String']>;
  created_at: Maybe<Scalars['timestamptz']>;
  firebase_uid: Maybe<Scalars['String']>;
  id: Maybe<Scalars['uuid']>;
  stripe_customer_id: Maybe<Scalars['String']>;
  unverified_email: Maybe<Scalars['String']>;
  verified_email: Maybe<Scalars['String']>;
};

/** update columns of table "customers" */
export enum Customers_Update_Column {
  /** column name */
  ContactName = 'contact_name',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  FirebaseUid = 'firebase_uid',
  /** column name */
  Id = 'id',
  /** column name */
  StripeCustomerId = 'stripe_customer_id',
  /** column name */
  UnverifiedEmail = 'unverified_email',
  /** column name */
  VerifiedEmail = 'verified_email'
}

/** columns and relationships of "firebase_tokens" */
export type Firebase_Tokens = {
  __typename?: 'firebase_tokens';
  auth_time: Scalars['timestamptz'];
  created_at: Scalars['timestamptz'];
  /** An object relationship */
  customer: Customers;
  customer_id: Scalars['uuid'];
  id: Scalars['uuid'];
  /** An array relationship */
  logins: Array<Logins>;
  /** An aggregate relationship */
  logins_aggregate: Logins_Aggregate;
  revoked_at: Maybe<Scalars['timestamptz']>;
};


/** columns and relationships of "firebase_tokens" */
export type Firebase_TokensLoginsArgs = {
  distinct_on: Maybe<Array<Logins_Select_Column>>;
  limit: Maybe<Scalars['Int']>;
  offset: Maybe<Scalars['Int']>;
  order_by: Maybe<Array<Logins_Order_By>>;
  where: Maybe<Logins_Bool_Exp>;
};


/** columns and relationships of "firebase_tokens" */
export type Firebase_TokensLogins_AggregateArgs = {
  distinct_on: Maybe<Array<Logins_Select_Column>>;
  limit: Maybe<Scalars['Int']>;
  offset: Maybe<Scalars['Int']>;
  order_by: Maybe<Array<Logins_Order_By>>;
  where: Maybe<Logins_Bool_Exp>;
};

/** aggregated selection of "firebase_tokens" */
export type Firebase_Tokens_Aggregate = {
  __typename?: 'firebase_tokens_aggregate';
  aggregate: Maybe<Firebase_Tokens_Aggregate_Fields>;
  nodes: Array<Firebase_Tokens>;
};

/** aggregate fields of "firebase_tokens" */
export type Firebase_Tokens_Aggregate_Fields = {
  __typename?: 'firebase_tokens_aggregate_fields';
  count: Scalars['Int'];
  max: Maybe<Firebase_Tokens_Max_Fields>;
  min: Maybe<Firebase_Tokens_Min_Fields>;
};


/** aggregate fields of "firebase_tokens" */
export type Firebase_Tokens_Aggregate_FieldsCountArgs = {
  columns: Maybe<Array<Firebase_Tokens_Select_Column>>;
  distinct: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "firebase_tokens" */
export type Firebase_Tokens_Aggregate_Order_By = {
  count: Maybe<Order_By>;
  max: Maybe<Firebase_Tokens_Max_Order_By>;
  min: Maybe<Firebase_Tokens_Min_Order_By>;
};

/** input type for inserting array relation for remote table "firebase_tokens" */
export type Firebase_Tokens_Arr_Rel_Insert_Input = {
  data: Array<Firebase_Tokens_Insert_Input>;
  /** on conflict condition */
  on_conflict: Maybe<Firebase_Tokens_On_Conflict>;
};

/** Boolean expression to filter rows from the table "firebase_tokens". All fields are combined with a logical 'AND'. */
export type Firebase_Tokens_Bool_Exp = {
  _and: Maybe<Array<Firebase_Tokens_Bool_Exp>>;
  _not: Maybe<Firebase_Tokens_Bool_Exp>;
  _or: Maybe<Array<Firebase_Tokens_Bool_Exp>>;
  auth_time: Maybe<Timestamptz_Comparison_Exp>;
  created_at: Maybe<Timestamptz_Comparison_Exp>;
  customer: Maybe<Customers_Bool_Exp>;
  customer_id: Maybe<Uuid_Comparison_Exp>;
  id: Maybe<Uuid_Comparison_Exp>;
  logins: Maybe<Logins_Bool_Exp>;
  revoked_at: Maybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "firebase_tokens" */
export enum Firebase_Tokens_Constraint {
  /** unique or primary key constraint */
  FirebaseTokensCustomerIdAuthTimeKey = 'firebase_tokens_customer_id_auth_time_key',
  /** unique or primary key constraint */
  FirebaseTokensPkey = 'firebase_tokens_pkey'
}

/** input type for inserting data into table "firebase_tokens" */
export type Firebase_Tokens_Insert_Input = {
  auth_time: Maybe<Scalars['timestamptz']>;
  created_at: Maybe<Scalars['timestamptz']>;
  customer: Maybe<Customers_Obj_Rel_Insert_Input>;
  customer_id: Maybe<Scalars['uuid']>;
  id: Maybe<Scalars['uuid']>;
  logins: Maybe<Logins_Arr_Rel_Insert_Input>;
  revoked_at: Maybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Firebase_Tokens_Max_Fields = {
  __typename?: 'firebase_tokens_max_fields';
  auth_time: Maybe<Scalars['timestamptz']>;
  created_at: Maybe<Scalars['timestamptz']>;
  customer_id: Maybe<Scalars['uuid']>;
  id: Maybe<Scalars['uuid']>;
  revoked_at: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "firebase_tokens" */
export type Firebase_Tokens_Max_Order_By = {
  auth_time: Maybe<Order_By>;
  created_at: Maybe<Order_By>;
  customer_id: Maybe<Order_By>;
  id: Maybe<Order_By>;
  revoked_at: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Firebase_Tokens_Min_Fields = {
  __typename?: 'firebase_tokens_min_fields';
  auth_time: Maybe<Scalars['timestamptz']>;
  created_at: Maybe<Scalars['timestamptz']>;
  customer_id: Maybe<Scalars['uuid']>;
  id: Maybe<Scalars['uuid']>;
  revoked_at: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "firebase_tokens" */
export type Firebase_Tokens_Min_Order_By = {
  auth_time: Maybe<Order_By>;
  created_at: Maybe<Order_By>;
  customer_id: Maybe<Order_By>;
  id: Maybe<Order_By>;
  revoked_at: Maybe<Order_By>;
};

/** response of any mutation on the table "firebase_tokens" */
export type Firebase_Tokens_Mutation_Response = {
  __typename?: 'firebase_tokens_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Firebase_Tokens>;
};

/** input type for inserting object relation for remote table "firebase_tokens" */
export type Firebase_Tokens_Obj_Rel_Insert_Input = {
  data: Firebase_Tokens_Insert_Input;
  /** on conflict condition */
  on_conflict: Maybe<Firebase_Tokens_On_Conflict>;
};

/** on conflict condition type for table "firebase_tokens" */
export type Firebase_Tokens_On_Conflict = {
  constraint: Firebase_Tokens_Constraint;
  update_columns: Array<Firebase_Tokens_Update_Column>;
  where: Maybe<Firebase_Tokens_Bool_Exp>;
};

/** Ordering options when selecting data from "firebase_tokens". */
export type Firebase_Tokens_Order_By = {
  auth_time: Maybe<Order_By>;
  created_at: Maybe<Order_By>;
  customer: Maybe<Customers_Order_By>;
  customer_id: Maybe<Order_By>;
  id: Maybe<Order_By>;
  logins_aggregate: Maybe<Logins_Aggregate_Order_By>;
  revoked_at: Maybe<Order_By>;
};

/** primary key columns input for table: firebase_tokens */
export type Firebase_Tokens_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "firebase_tokens" */
export enum Firebase_Tokens_Select_Column {
  /** column name */
  AuthTime = 'auth_time',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  CustomerId = 'customer_id',
  /** column name */
  Id = 'id',
  /** column name */
  RevokedAt = 'revoked_at'
}

/** input type for updating data in table "firebase_tokens" */
export type Firebase_Tokens_Set_Input = {
  auth_time: Maybe<Scalars['timestamptz']>;
  created_at: Maybe<Scalars['timestamptz']>;
  customer_id: Maybe<Scalars['uuid']>;
  id: Maybe<Scalars['uuid']>;
  revoked_at: Maybe<Scalars['timestamptz']>;
};

/** update columns of table "firebase_tokens" */
export enum Firebase_Tokens_Update_Column {
  /** column name */
  AuthTime = 'auth_time',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  CustomerId = 'customer_id',
  /** column name */
  Id = 'id',
  /** column name */
  RevokedAt = 'revoked_at'
}


/** Boolean expression to compare columns of type "inet". All fields are combined with logical 'AND'. */
export type Inet_Comparison_Exp = {
  _eq: Maybe<Scalars['inet']>;
  _gt: Maybe<Scalars['inet']>;
  _gte: Maybe<Scalars['inet']>;
  _in: Maybe<Array<Scalars['inet']>>;
  _is_null: Maybe<Scalars['Boolean']>;
  _lt: Maybe<Scalars['inet']>;
  _lte: Maybe<Scalars['inet']>;
  _neq: Maybe<Scalars['inet']>;
  _nin: Maybe<Array<Scalars['inet']>>;
};

/** columns and relationships of "logins" */
export type Logins = {
  __typename?: 'logins';
  agent_id: Scalars['uuid'];
  created_at: Scalars['timestamptz'];
  /** An object relationship */
  firebase_token: Maybe<Firebase_Tokens>;
  firebase_token_id: Maybe<Scalars['uuid']>;
  id: Scalars['uuid'];
  ip_address: Scalars['inet'];
  referrer_code: Maybe<Scalars['String']>;
  referrer_source: Maybe<Scalars['String']>;
  url: Maybe<Scalars['String']>;
  /** An object relationship */
  user_agent: User_Agents;
  user_agent_id: Scalars['uuid'];
};

/** aggregated selection of "logins" */
export type Logins_Aggregate = {
  __typename?: 'logins_aggregate';
  aggregate: Maybe<Logins_Aggregate_Fields>;
  nodes: Array<Logins>;
};

/** aggregate fields of "logins" */
export type Logins_Aggregate_Fields = {
  __typename?: 'logins_aggregate_fields';
  count: Scalars['Int'];
  max: Maybe<Logins_Max_Fields>;
  min: Maybe<Logins_Min_Fields>;
};


/** aggregate fields of "logins" */
export type Logins_Aggregate_FieldsCountArgs = {
  columns: Maybe<Array<Logins_Select_Column>>;
  distinct: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "logins" */
export type Logins_Aggregate_Order_By = {
  count: Maybe<Order_By>;
  max: Maybe<Logins_Max_Order_By>;
  min: Maybe<Logins_Min_Order_By>;
};

/** input type for inserting array relation for remote table "logins" */
export type Logins_Arr_Rel_Insert_Input = {
  data: Array<Logins_Insert_Input>;
  /** on conflict condition */
  on_conflict: Maybe<Logins_On_Conflict>;
};

/** Boolean expression to filter rows from the table "logins". All fields are combined with a logical 'AND'. */
export type Logins_Bool_Exp = {
  _and: Maybe<Array<Logins_Bool_Exp>>;
  _not: Maybe<Logins_Bool_Exp>;
  _or: Maybe<Array<Logins_Bool_Exp>>;
  agent_id: Maybe<Uuid_Comparison_Exp>;
  created_at: Maybe<Timestamptz_Comparison_Exp>;
  firebase_token: Maybe<Firebase_Tokens_Bool_Exp>;
  firebase_token_id: Maybe<Uuid_Comparison_Exp>;
  id: Maybe<Uuid_Comparison_Exp>;
  ip_address: Maybe<Inet_Comparison_Exp>;
  referrer_code: Maybe<String_Comparison_Exp>;
  referrer_source: Maybe<String_Comparison_Exp>;
  url: Maybe<String_Comparison_Exp>;
  user_agent: Maybe<User_Agents_Bool_Exp>;
  user_agent_id: Maybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "logins" */
export enum Logins_Constraint {
  /** unique or primary key constraint */
  LoginsPkey = 'logins_pkey'
}

/** input type for inserting data into table "logins" */
export type Logins_Insert_Input = {
  agent_id: Maybe<Scalars['uuid']>;
  created_at: Maybe<Scalars['timestamptz']>;
  firebase_token: Maybe<Firebase_Tokens_Obj_Rel_Insert_Input>;
  firebase_token_id: Maybe<Scalars['uuid']>;
  id: Maybe<Scalars['uuid']>;
  ip_address: Maybe<Scalars['inet']>;
  referrer_code: Maybe<Scalars['String']>;
  referrer_source: Maybe<Scalars['String']>;
  url: Maybe<Scalars['String']>;
  user_agent: Maybe<User_Agents_Obj_Rel_Insert_Input>;
  user_agent_id: Maybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type Logins_Max_Fields = {
  __typename?: 'logins_max_fields';
  agent_id: Maybe<Scalars['uuid']>;
  created_at: Maybe<Scalars['timestamptz']>;
  firebase_token_id: Maybe<Scalars['uuid']>;
  id: Maybe<Scalars['uuid']>;
  referrer_code: Maybe<Scalars['String']>;
  referrer_source: Maybe<Scalars['String']>;
  url: Maybe<Scalars['String']>;
  user_agent_id: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "logins" */
export type Logins_Max_Order_By = {
  agent_id: Maybe<Order_By>;
  created_at: Maybe<Order_By>;
  firebase_token_id: Maybe<Order_By>;
  id: Maybe<Order_By>;
  referrer_code: Maybe<Order_By>;
  referrer_source: Maybe<Order_By>;
  url: Maybe<Order_By>;
  user_agent_id: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Logins_Min_Fields = {
  __typename?: 'logins_min_fields';
  agent_id: Maybe<Scalars['uuid']>;
  created_at: Maybe<Scalars['timestamptz']>;
  firebase_token_id: Maybe<Scalars['uuid']>;
  id: Maybe<Scalars['uuid']>;
  referrer_code: Maybe<Scalars['String']>;
  referrer_source: Maybe<Scalars['String']>;
  url: Maybe<Scalars['String']>;
  user_agent_id: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "logins" */
export type Logins_Min_Order_By = {
  agent_id: Maybe<Order_By>;
  created_at: Maybe<Order_By>;
  firebase_token_id: Maybe<Order_By>;
  id: Maybe<Order_By>;
  referrer_code: Maybe<Order_By>;
  referrer_source: Maybe<Order_By>;
  url: Maybe<Order_By>;
  user_agent_id: Maybe<Order_By>;
};

/** response of any mutation on the table "logins" */
export type Logins_Mutation_Response = {
  __typename?: 'logins_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Logins>;
};

/** on conflict condition type for table "logins" */
export type Logins_On_Conflict = {
  constraint: Logins_Constraint;
  update_columns: Array<Logins_Update_Column>;
  where: Maybe<Logins_Bool_Exp>;
};

/** Ordering options when selecting data from "logins". */
export type Logins_Order_By = {
  agent_id: Maybe<Order_By>;
  created_at: Maybe<Order_By>;
  firebase_token: Maybe<Firebase_Tokens_Order_By>;
  firebase_token_id: Maybe<Order_By>;
  id: Maybe<Order_By>;
  ip_address: Maybe<Order_By>;
  referrer_code: Maybe<Order_By>;
  referrer_source: Maybe<Order_By>;
  url: Maybe<Order_By>;
  user_agent: Maybe<User_Agents_Order_By>;
  user_agent_id: Maybe<Order_By>;
};

/** primary key columns input for table: logins */
export type Logins_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "logins" */
export enum Logins_Select_Column {
  /** column name */
  AgentId = 'agent_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  FirebaseTokenId = 'firebase_token_id',
  /** column name */
  Id = 'id',
  /** column name */
  IpAddress = 'ip_address',
  /** column name */
  ReferrerCode = 'referrer_code',
  /** column name */
  ReferrerSource = 'referrer_source',
  /** column name */
  Url = 'url',
  /** column name */
  UserAgentId = 'user_agent_id'
}

/** input type for updating data in table "logins" */
export type Logins_Set_Input = {
  agent_id: Maybe<Scalars['uuid']>;
  created_at: Maybe<Scalars['timestamptz']>;
  firebase_token_id: Maybe<Scalars['uuid']>;
  id: Maybe<Scalars['uuid']>;
  ip_address: Maybe<Scalars['inet']>;
  referrer_code: Maybe<Scalars['String']>;
  referrer_source: Maybe<Scalars['String']>;
  url: Maybe<Scalars['String']>;
  user_agent_id: Maybe<Scalars['uuid']>;
};

/** update columns of table "logins" */
export enum Logins_Update_Column {
  /** column name */
  AgentId = 'agent_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  FirebaseTokenId = 'firebase_token_id',
  /** column name */
  Id = 'id',
  /** column name */
  IpAddress = 'ip_address',
  /** column name */
  ReferrerCode = 'referrer_code',
  /** column name */
  ReferrerSource = 'referrer_source',
  /** column name */
  Url = 'url',
  /** column name */
  UserAgentId = 'user_agent_id'
}

/** columns and relationships of "membership_levels" */
export type Membership_Levels = {
  __typename?: 'membership_levels';
  value: Scalars['String'];
};

/** aggregated selection of "membership_levels" */
export type Membership_Levels_Aggregate = {
  __typename?: 'membership_levels_aggregate';
  aggregate: Maybe<Membership_Levels_Aggregate_Fields>;
  nodes: Array<Membership_Levels>;
};

/** aggregate fields of "membership_levels" */
export type Membership_Levels_Aggregate_Fields = {
  __typename?: 'membership_levels_aggregate_fields';
  count: Scalars['Int'];
  max: Maybe<Membership_Levels_Max_Fields>;
  min: Maybe<Membership_Levels_Min_Fields>;
};


/** aggregate fields of "membership_levels" */
export type Membership_Levels_Aggregate_FieldsCountArgs = {
  columns: Maybe<Array<Membership_Levels_Select_Column>>;
  distinct: Maybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "membership_levels". All fields are combined with a logical 'AND'. */
export type Membership_Levels_Bool_Exp = {
  _and: Maybe<Array<Membership_Levels_Bool_Exp>>;
  _not: Maybe<Membership_Levels_Bool_Exp>;
  _or: Maybe<Array<Membership_Levels_Bool_Exp>>;
  value: Maybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "membership_levels" */
export enum Membership_Levels_Constraint {
  /** unique or primary key constraint */
  MembershipLevelsPkey = 'membership_levels_pkey'
}

export enum Membership_Levels_Enum {
  Basic = 'basic',
  Patron = 'patron',
  Supporter = 'supporter'
}

/** Boolean expression to compare columns of type "membership_levels_enum". All fields are combined with logical 'AND'. */
export type Membership_Levels_Enum_Comparison_Exp = {
  _eq: Maybe<Membership_Levels_Enum>;
  _in: Maybe<Array<Membership_Levels_Enum>>;
  _is_null: Maybe<Scalars['Boolean']>;
  _neq: Maybe<Membership_Levels_Enum>;
  _nin: Maybe<Array<Membership_Levels_Enum>>;
};

/** input type for inserting data into table "membership_levels" */
export type Membership_Levels_Insert_Input = {
  value: Maybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Membership_Levels_Max_Fields = {
  __typename?: 'membership_levels_max_fields';
  value: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Membership_Levels_Min_Fields = {
  __typename?: 'membership_levels_min_fields';
  value: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "membership_levels" */
export type Membership_Levels_Mutation_Response = {
  __typename?: 'membership_levels_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Membership_Levels>;
};

/** input type for inserting object relation for remote table "membership_levels" */
export type Membership_Levels_Obj_Rel_Insert_Input = {
  data: Membership_Levels_Insert_Input;
  /** on conflict condition */
  on_conflict: Maybe<Membership_Levels_On_Conflict>;
};

/** on conflict condition type for table "membership_levels" */
export type Membership_Levels_On_Conflict = {
  constraint: Membership_Levels_Constraint;
  update_columns: Array<Membership_Levels_Update_Column>;
  where: Maybe<Membership_Levels_Bool_Exp>;
};

/** Ordering options when selecting data from "membership_levels". */
export type Membership_Levels_Order_By = {
  value: Maybe<Order_By>;
};

/** primary key columns input for table: membership_levels */
export type Membership_Levels_Pk_Columns_Input = {
  value: Scalars['String'];
};

/** select columns of table "membership_levels" */
export enum Membership_Levels_Select_Column {
  /** column name */
  Value = 'value'
}

/** input type for updating data in table "membership_levels" */
export type Membership_Levels_Set_Input = {
  value: Maybe<Scalars['String']>;
};

/** update columns of table "membership_levels" */
export enum Membership_Levels_Update_Column {
  /** column name */
  Value = 'value'
}

/** columns and relationships of "memberships" */
export type Memberships = {
  __typename?: 'memberships';
  active_until: Maybe<Scalars['timestamptz']>;
  created_at: Scalars['timestamptz'];
  /** An object relationship */
  customer: Customers;
  id: Scalars['uuid'];
  level: Membership_Levels_Enum;
  lifetime: Scalars['Boolean'];
  /** An object relationship */
  membership_level: Membership_Levels;
  sabbatical_available_until: Maybe<Scalars['timestamptz']>;
  stripe_subscription_id: Maybe<Scalars['String']>;
  stripe_subscription_status: Maybe<Scalars['String']>;
  updated_at: Maybe<Scalars['timestamptz']>;
};

/** aggregated selection of "memberships" */
export type Memberships_Aggregate = {
  __typename?: 'memberships_aggregate';
  aggregate: Maybe<Memberships_Aggregate_Fields>;
  nodes: Array<Memberships>;
};

/** aggregate fields of "memberships" */
export type Memberships_Aggregate_Fields = {
  __typename?: 'memberships_aggregate_fields';
  count: Scalars['Int'];
  max: Maybe<Memberships_Max_Fields>;
  min: Maybe<Memberships_Min_Fields>;
};


/** aggregate fields of "memberships" */
export type Memberships_Aggregate_FieldsCountArgs = {
  columns: Maybe<Array<Memberships_Select_Column>>;
  distinct: Maybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "memberships". All fields are combined with a logical 'AND'. */
export type Memberships_Bool_Exp = {
  _and: Maybe<Array<Memberships_Bool_Exp>>;
  _not: Maybe<Memberships_Bool_Exp>;
  _or: Maybe<Array<Memberships_Bool_Exp>>;
  active_until: Maybe<Timestamptz_Comparison_Exp>;
  created_at: Maybe<Timestamptz_Comparison_Exp>;
  customer: Maybe<Customers_Bool_Exp>;
  id: Maybe<Uuid_Comparison_Exp>;
  level: Maybe<Membership_Levels_Enum_Comparison_Exp>;
  lifetime: Maybe<Boolean_Comparison_Exp>;
  membership_level: Maybe<Membership_Levels_Bool_Exp>;
  sabbatical_available_until: Maybe<Timestamptz_Comparison_Exp>;
  stripe_subscription_id: Maybe<String_Comparison_Exp>;
  stripe_subscription_status: Maybe<String_Comparison_Exp>;
  updated_at: Maybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "memberships" */
export enum Memberships_Constraint {
  /** unique or primary key constraint */
  MembershipsPkey = 'memberships_pkey',
  /** unique or primary key constraint */
  MembershipsStripeSubscriptionIdKey = 'memberships_stripe_subscription_id_key'
}

/** input type for inserting data into table "memberships" */
export type Memberships_Insert_Input = {
  active_until: Maybe<Scalars['timestamptz']>;
  created_at: Maybe<Scalars['timestamptz']>;
  customer: Maybe<Customers_Obj_Rel_Insert_Input>;
  id: Maybe<Scalars['uuid']>;
  level: Maybe<Membership_Levels_Enum>;
  lifetime: Maybe<Scalars['Boolean']>;
  membership_level: Maybe<Membership_Levels_Obj_Rel_Insert_Input>;
  sabbatical_available_until: Maybe<Scalars['timestamptz']>;
  stripe_subscription_id: Maybe<Scalars['String']>;
  stripe_subscription_status: Maybe<Scalars['String']>;
  updated_at: Maybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Memberships_Max_Fields = {
  __typename?: 'memberships_max_fields';
  active_until: Maybe<Scalars['timestamptz']>;
  created_at: Maybe<Scalars['timestamptz']>;
  id: Maybe<Scalars['uuid']>;
  sabbatical_available_until: Maybe<Scalars['timestamptz']>;
  stripe_subscription_id: Maybe<Scalars['String']>;
  stripe_subscription_status: Maybe<Scalars['String']>;
  updated_at: Maybe<Scalars['timestamptz']>;
};

/** aggregate min on columns */
export type Memberships_Min_Fields = {
  __typename?: 'memberships_min_fields';
  active_until: Maybe<Scalars['timestamptz']>;
  created_at: Maybe<Scalars['timestamptz']>;
  id: Maybe<Scalars['uuid']>;
  sabbatical_available_until: Maybe<Scalars['timestamptz']>;
  stripe_subscription_id: Maybe<Scalars['String']>;
  stripe_subscription_status: Maybe<Scalars['String']>;
  updated_at: Maybe<Scalars['timestamptz']>;
};

/** response of any mutation on the table "memberships" */
export type Memberships_Mutation_Response = {
  __typename?: 'memberships_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Memberships>;
};

/** input type for inserting object relation for remote table "memberships" */
export type Memberships_Obj_Rel_Insert_Input = {
  data: Memberships_Insert_Input;
  /** on conflict condition */
  on_conflict: Maybe<Memberships_On_Conflict>;
};

/** on conflict condition type for table "memberships" */
export type Memberships_On_Conflict = {
  constraint: Memberships_Constraint;
  update_columns: Array<Memberships_Update_Column>;
  where: Maybe<Memberships_Bool_Exp>;
};

/** Ordering options when selecting data from "memberships". */
export type Memberships_Order_By = {
  active_until: Maybe<Order_By>;
  created_at: Maybe<Order_By>;
  customer: Maybe<Customers_Order_By>;
  id: Maybe<Order_By>;
  level: Maybe<Order_By>;
  lifetime: Maybe<Order_By>;
  membership_level: Maybe<Membership_Levels_Order_By>;
  sabbatical_available_until: Maybe<Order_By>;
  stripe_subscription_id: Maybe<Order_By>;
  stripe_subscription_status: Maybe<Order_By>;
  updated_at: Maybe<Order_By>;
};

/** primary key columns input for table: memberships */
export type Memberships_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "memberships" */
export enum Memberships_Select_Column {
  /** column name */
  ActiveUntil = 'active_until',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  Level = 'level',
  /** column name */
  Lifetime = 'lifetime',
  /** column name */
  SabbaticalAvailableUntil = 'sabbatical_available_until',
  /** column name */
  StripeSubscriptionId = 'stripe_subscription_id',
  /** column name */
  StripeSubscriptionStatus = 'stripe_subscription_status',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "memberships" */
export type Memberships_Set_Input = {
  active_until: Maybe<Scalars['timestamptz']>;
  created_at: Maybe<Scalars['timestamptz']>;
  id: Maybe<Scalars['uuid']>;
  level: Maybe<Membership_Levels_Enum>;
  lifetime: Maybe<Scalars['Boolean']>;
  sabbatical_available_until: Maybe<Scalars['timestamptz']>;
  stripe_subscription_id: Maybe<Scalars['String']>;
  stripe_subscription_status: Maybe<Scalars['String']>;
  updated_at: Maybe<Scalars['timestamptz']>;
};

/** update columns of table "memberships" */
export enum Memberships_Update_Column {
  /** column name */
  ActiveUntil = 'active_until',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  Level = 'level',
  /** column name */
  Lifetime = 'lifetime',
  /** column name */
  SabbaticalAvailableUntil = 'sabbatical_available_until',
  /** column name */
  StripeSubscriptionId = 'stripe_subscription_id',
  /** column name */
  StripeSubscriptionStatus = 'stripe_subscription_status',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root';
  /** delete data from the table: "customers" */
  delete_customers: Maybe<Customers_Mutation_Response>;
  /** delete single row from the table: "customers" */
  delete_customers_by_pk: Maybe<Customers>;
  /** delete data from the table: "firebase_tokens" */
  delete_firebase_tokens: Maybe<Firebase_Tokens_Mutation_Response>;
  /** delete single row from the table: "firebase_tokens" */
  delete_firebase_tokens_by_pk: Maybe<Firebase_Tokens>;
  /** delete data from the table: "logins" */
  delete_logins: Maybe<Logins_Mutation_Response>;
  /** delete single row from the table: "logins" */
  delete_logins_by_pk: Maybe<Logins>;
  /** delete data from the table: "membership_levels" */
  delete_membership_levels: Maybe<Membership_Levels_Mutation_Response>;
  /** delete single row from the table: "membership_levels" */
  delete_membership_levels_by_pk: Maybe<Membership_Levels>;
  /** delete data from the table: "memberships" */
  delete_memberships: Maybe<Memberships_Mutation_Response>;
  /** delete single row from the table: "memberships" */
  delete_memberships_by_pk: Maybe<Memberships>;
  /** delete data from the table: "personas" */
  delete_personas: Maybe<Personas_Mutation_Response>;
  /** delete single row from the table: "personas" */
  delete_personas_by_pk: Maybe<Personas>;
  /** delete data from the table: "user_agents" */
  delete_user_agents: Maybe<User_Agents_Mutation_Response>;
  /** delete single row from the table: "user_agents" */
  delete_user_agents_by_pk: Maybe<User_Agents>;
  /** insert data into the table: "customers" */
  insert_customers: Maybe<Customers_Mutation_Response>;
  /** insert a single row into the table: "customers" */
  insert_customers_one: Maybe<Customers>;
  /** insert data into the table: "firebase_tokens" */
  insert_firebase_tokens: Maybe<Firebase_Tokens_Mutation_Response>;
  /** insert a single row into the table: "firebase_tokens" */
  insert_firebase_tokens_one: Maybe<Firebase_Tokens>;
  /** insert data into the table: "logins" */
  insert_logins: Maybe<Logins_Mutation_Response>;
  /** insert a single row into the table: "logins" */
  insert_logins_one: Maybe<Logins>;
  /** insert data into the table: "membership_levels" */
  insert_membership_levels: Maybe<Membership_Levels_Mutation_Response>;
  /** insert a single row into the table: "membership_levels" */
  insert_membership_levels_one: Maybe<Membership_Levels>;
  /** insert data into the table: "memberships" */
  insert_memberships: Maybe<Memberships_Mutation_Response>;
  /** insert a single row into the table: "memberships" */
  insert_memberships_one: Maybe<Memberships>;
  /** insert data into the table: "personas" */
  insert_personas: Maybe<Personas_Mutation_Response>;
  /** insert a single row into the table: "personas" */
  insert_personas_one: Maybe<Personas>;
  /** insert data into the table: "user_agents" */
  insert_user_agents: Maybe<User_Agents_Mutation_Response>;
  /** insert a single row into the table: "user_agents" */
  insert_user_agents_one: Maybe<User_Agents>;
  login: Maybe<LoginOutput>;
  /** update data of the table: "customers" */
  update_customers: Maybe<Customers_Mutation_Response>;
  /** update single row of the table: "customers" */
  update_customers_by_pk: Maybe<Customers>;
  /** update data of the table: "firebase_tokens" */
  update_firebase_tokens: Maybe<Firebase_Tokens_Mutation_Response>;
  /** update single row of the table: "firebase_tokens" */
  update_firebase_tokens_by_pk: Maybe<Firebase_Tokens>;
  /** update data of the table: "logins" */
  update_logins: Maybe<Logins_Mutation_Response>;
  /** update single row of the table: "logins" */
  update_logins_by_pk: Maybe<Logins>;
  /** update data of the table: "membership_levels" */
  update_membership_levels: Maybe<Membership_Levels_Mutation_Response>;
  /** update single row of the table: "membership_levels" */
  update_membership_levels_by_pk: Maybe<Membership_Levels>;
  /** update data of the table: "memberships" */
  update_memberships: Maybe<Memberships_Mutation_Response>;
  /** update single row of the table: "memberships" */
  update_memberships_by_pk: Maybe<Memberships>;
  /** update data of the table: "personas" */
  update_personas: Maybe<Personas_Mutation_Response>;
  /** update single row of the table: "personas" */
  update_personas_by_pk: Maybe<Personas>;
  /** update data of the table: "user_agents" */
  update_user_agents: Maybe<User_Agents_Mutation_Response>;
  /** update single row of the table: "user_agents" */
  update_user_agents_by_pk: Maybe<User_Agents>;
};


/** mutation root */
export type Mutation_RootDelete_CustomersArgs = {
  where: Customers_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Customers_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Firebase_TokensArgs = {
  where: Firebase_Tokens_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Firebase_Tokens_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_LoginsArgs = {
  where: Logins_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Logins_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Membership_LevelsArgs = {
  where: Membership_Levels_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Membership_Levels_By_PkArgs = {
  value: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_MembershipsArgs = {
  where: Memberships_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Memberships_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_PersonasArgs = {
  where: Personas_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Personas_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_User_AgentsArgs = {
  where: User_Agents_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_User_Agents_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootInsert_CustomersArgs = {
  objects: Array<Customers_Insert_Input>;
  on_conflict: Maybe<Customers_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Customers_OneArgs = {
  object: Customers_Insert_Input;
  on_conflict: Maybe<Customers_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Firebase_TokensArgs = {
  objects: Array<Firebase_Tokens_Insert_Input>;
  on_conflict: Maybe<Firebase_Tokens_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Firebase_Tokens_OneArgs = {
  object: Firebase_Tokens_Insert_Input;
  on_conflict: Maybe<Firebase_Tokens_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_LoginsArgs = {
  objects: Array<Logins_Insert_Input>;
  on_conflict: Maybe<Logins_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Logins_OneArgs = {
  object: Logins_Insert_Input;
  on_conflict: Maybe<Logins_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Membership_LevelsArgs = {
  objects: Array<Membership_Levels_Insert_Input>;
  on_conflict: Maybe<Membership_Levels_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Membership_Levels_OneArgs = {
  object: Membership_Levels_Insert_Input;
  on_conflict: Maybe<Membership_Levels_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_MembershipsArgs = {
  objects: Array<Memberships_Insert_Input>;
  on_conflict: Maybe<Memberships_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Memberships_OneArgs = {
  object: Memberships_Insert_Input;
  on_conflict: Maybe<Memberships_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_PersonasArgs = {
  objects: Array<Personas_Insert_Input>;
  on_conflict: Maybe<Personas_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Personas_OneArgs = {
  object: Personas_Insert_Input;
  on_conflict: Maybe<Personas_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_User_AgentsArgs = {
  objects: Array<User_Agents_Insert_Input>;
  on_conflict: Maybe<User_Agents_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_User_Agents_OneArgs = {
  object: User_Agents_Insert_Input;
  on_conflict: Maybe<User_Agents_On_Conflict>;
};


/** mutation root */
export type Mutation_RootLoginArgs = {
  referrer_code: Maybe<Scalars['String']>;
  referrer_source: Maybe<Scalars['String']>;
};


/** mutation root */
export type Mutation_RootUpdate_CustomersArgs = {
  _set: Maybe<Customers_Set_Input>;
  where: Customers_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Customers_By_PkArgs = {
  _set: Maybe<Customers_Set_Input>;
  pk_columns: Customers_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Firebase_TokensArgs = {
  _set: Maybe<Firebase_Tokens_Set_Input>;
  where: Firebase_Tokens_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Firebase_Tokens_By_PkArgs = {
  _set: Maybe<Firebase_Tokens_Set_Input>;
  pk_columns: Firebase_Tokens_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_LoginsArgs = {
  _set: Maybe<Logins_Set_Input>;
  where: Logins_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Logins_By_PkArgs = {
  _set: Maybe<Logins_Set_Input>;
  pk_columns: Logins_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Membership_LevelsArgs = {
  _set: Maybe<Membership_Levels_Set_Input>;
  where: Membership_Levels_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Membership_Levels_By_PkArgs = {
  _set: Maybe<Membership_Levels_Set_Input>;
  pk_columns: Membership_Levels_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_MembershipsArgs = {
  _set: Maybe<Memberships_Set_Input>;
  where: Memberships_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Memberships_By_PkArgs = {
  _set: Maybe<Memberships_Set_Input>;
  pk_columns: Memberships_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_PersonasArgs = {
  _set: Maybe<Personas_Set_Input>;
  where: Personas_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Personas_By_PkArgs = {
  _set: Maybe<Personas_Set_Input>;
  pk_columns: Personas_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_User_AgentsArgs = {
  _set: Maybe<User_Agents_Set_Input>;
  where: User_Agents_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_User_Agents_By_PkArgs = {
  _set: Maybe<User_Agents_Set_Input>;
  pk_columns: User_Agents_Pk_Columns_Input;
};

/** column ordering options */
export enum Order_By {
  /** in ascending order, nulls last */
  Asc = 'asc',
  /** in ascending order, nulls first */
  AscNullsFirst = 'asc_nulls_first',
  /** in ascending order, nulls last */
  AscNullsLast = 'asc_nulls_last',
  /** in descending order, nulls first */
  Desc = 'desc',
  /** in descending order, nulls first */
  DescNullsFirst = 'desc_nulls_first',
  /** in descending order, nulls last */
  DescNullsLast = 'desc_nulls_last'
}

/** columns and relationships of "personas" */
export type Personas = {
  __typename?: 'personas';
  created_at: Scalars['timestamptz'];
  /** An object relationship */
  customer: Customers;
  customer_id: Scalars['uuid'];
  id: Scalars['uuid'];
  list_address_with_byline: Scalars['Boolean'];
  name: Scalars['String'];
  photo_url: Maybe<Scalars['String']>;
  preferred_broadcast_time: Scalars['time'];
  updated_at: Maybe<Scalars['timestamptz']>;
};

/** aggregated selection of "personas" */
export type Personas_Aggregate = {
  __typename?: 'personas_aggregate';
  aggregate: Maybe<Personas_Aggregate_Fields>;
  nodes: Array<Personas>;
};

/** aggregate fields of "personas" */
export type Personas_Aggregate_Fields = {
  __typename?: 'personas_aggregate_fields';
  count: Scalars['Int'];
  max: Maybe<Personas_Max_Fields>;
  min: Maybe<Personas_Min_Fields>;
};


/** aggregate fields of "personas" */
export type Personas_Aggregate_FieldsCountArgs = {
  columns: Maybe<Array<Personas_Select_Column>>;
  distinct: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "personas" */
export type Personas_Aggregate_Order_By = {
  count: Maybe<Order_By>;
  max: Maybe<Personas_Max_Order_By>;
  min: Maybe<Personas_Min_Order_By>;
};

/** input type for inserting array relation for remote table "personas" */
export type Personas_Arr_Rel_Insert_Input = {
  data: Array<Personas_Insert_Input>;
  /** on conflict condition */
  on_conflict: Maybe<Personas_On_Conflict>;
};

/** Boolean expression to filter rows from the table "personas". All fields are combined with a logical 'AND'. */
export type Personas_Bool_Exp = {
  _and: Maybe<Array<Personas_Bool_Exp>>;
  _not: Maybe<Personas_Bool_Exp>;
  _or: Maybe<Array<Personas_Bool_Exp>>;
  created_at: Maybe<Timestamptz_Comparison_Exp>;
  customer: Maybe<Customers_Bool_Exp>;
  customer_id: Maybe<Uuid_Comparison_Exp>;
  id: Maybe<Uuid_Comparison_Exp>;
  list_address_with_byline: Maybe<Boolean_Comparison_Exp>;
  name: Maybe<String_Comparison_Exp>;
  photo_url: Maybe<String_Comparison_Exp>;
  preferred_broadcast_time: Maybe<Time_Comparison_Exp>;
  updated_at: Maybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "personas" */
export enum Personas_Constraint {
  /** unique or primary key constraint */
  PersonasPkey = 'personas_pkey'
}

/** input type for inserting data into table "personas" */
export type Personas_Insert_Input = {
  created_at: Maybe<Scalars['timestamptz']>;
  customer: Maybe<Customers_Obj_Rel_Insert_Input>;
  customer_id: Maybe<Scalars['uuid']>;
  id: Maybe<Scalars['uuid']>;
  list_address_with_byline: Maybe<Scalars['Boolean']>;
  name: Maybe<Scalars['String']>;
  photo_url: Maybe<Scalars['String']>;
  preferred_broadcast_time: Maybe<Scalars['time']>;
  updated_at: Maybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Personas_Max_Fields = {
  __typename?: 'personas_max_fields';
  created_at: Maybe<Scalars['timestamptz']>;
  customer_id: Maybe<Scalars['uuid']>;
  id: Maybe<Scalars['uuid']>;
  name: Maybe<Scalars['String']>;
  photo_url: Maybe<Scalars['String']>;
  updated_at: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "personas" */
export type Personas_Max_Order_By = {
  created_at: Maybe<Order_By>;
  customer_id: Maybe<Order_By>;
  id: Maybe<Order_By>;
  name: Maybe<Order_By>;
  photo_url: Maybe<Order_By>;
  updated_at: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Personas_Min_Fields = {
  __typename?: 'personas_min_fields';
  created_at: Maybe<Scalars['timestamptz']>;
  customer_id: Maybe<Scalars['uuid']>;
  id: Maybe<Scalars['uuid']>;
  name: Maybe<Scalars['String']>;
  photo_url: Maybe<Scalars['String']>;
  updated_at: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "personas" */
export type Personas_Min_Order_By = {
  created_at: Maybe<Order_By>;
  customer_id: Maybe<Order_By>;
  id: Maybe<Order_By>;
  name: Maybe<Order_By>;
  photo_url: Maybe<Order_By>;
  updated_at: Maybe<Order_By>;
};

/** response of any mutation on the table "personas" */
export type Personas_Mutation_Response = {
  __typename?: 'personas_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Personas>;
};

/** on conflict condition type for table "personas" */
export type Personas_On_Conflict = {
  constraint: Personas_Constraint;
  update_columns: Array<Personas_Update_Column>;
  where: Maybe<Personas_Bool_Exp>;
};

/** Ordering options when selecting data from "personas". */
export type Personas_Order_By = {
  created_at: Maybe<Order_By>;
  customer: Maybe<Customers_Order_By>;
  customer_id: Maybe<Order_By>;
  id: Maybe<Order_By>;
  list_address_with_byline: Maybe<Order_By>;
  name: Maybe<Order_By>;
  photo_url: Maybe<Order_By>;
  preferred_broadcast_time: Maybe<Order_By>;
  updated_at: Maybe<Order_By>;
};

/** primary key columns input for table: personas */
export type Personas_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "personas" */
export enum Personas_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  CustomerId = 'customer_id',
  /** column name */
  Id = 'id',
  /** column name */
  ListAddressWithByline = 'list_address_with_byline',
  /** column name */
  Name = 'name',
  /** column name */
  PhotoUrl = 'photo_url',
  /** column name */
  PreferredBroadcastTime = 'preferred_broadcast_time',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "personas" */
export type Personas_Set_Input = {
  created_at: Maybe<Scalars['timestamptz']>;
  customer_id: Maybe<Scalars['uuid']>;
  id: Maybe<Scalars['uuid']>;
  list_address_with_byline: Maybe<Scalars['Boolean']>;
  name: Maybe<Scalars['String']>;
  photo_url: Maybe<Scalars['String']>;
  preferred_broadcast_time: Maybe<Scalars['time']>;
  updated_at: Maybe<Scalars['timestamptz']>;
};

/** update columns of table "personas" */
export enum Personas_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  CustomerId = 'customer_id',
  /** column name */
  Id = 'id',
  /** column name */
  ListAddressWithByline = 'list_address_with_byline',
  /** column name */
  Name = 'name',
  /** column name */
  PhotoUrl = 'photo_url',
  /** column name */
  PreferredBroadcastTime = 'preferred_broadcast_time',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Query_Root = {
  __typename?: 'query_root';
  /** fetch data from the table: "customers" */
  customers: Array<Customers>;
  /** fetch aggregated fields from the table: "customers" */
  customers_aggregate: Customers_Aggregate;
  /** fetch data from the table: "customers" using primary key columns */
  customers_by_pk: Maybe<Customers>;
  /** An array relationship */
  firebase_tokens: Array<Firebase_Tokens>;
  /** An aggregate relationship */
  firebase_tokens_aggregate: Firebase_Tokens_Aggregate;
  /** fetch data from the table: "firebase_tokens" using primary key columns */
  firebase_tokens_by_pk: Maybe<Firebase_Tokens>;
  /** An array relationship */
  logins: Array<Logins>;
  /** An aggregate relationship */
  logins_aggregate: Logins_Aggregate;
  /** fetch data from the table: "logins" using primary key columns */
  logins_by_pk: Maybe<Logins>;
  /** fetch data from the table: "membership_levels" */
  membership_levels: Array<Membership_Levels>;
  /** fetch aggregated fields from the table: "membership_levels" */
  membership_levels_aggregate: Membership_Levels_Aggregate;
  /** fetch data from the table: "membership_levels" using primary key columns */
  membership_levels_by_pk: Maybe<Membership_Levels>;
  /** fetch data from the table: "memberships" */
  memberships: Array<Memberships>;
  /** fetch aggregated fields from the table: "memberships" */
  memberships_aggregate: Memberships_Aggregate;
  /** fetch data from the table: "memberships" using primary key columns */
  memberships_by_pk: Maybe<Memberships>;
  /** fetch data from the table: "personas" */
  personas: Array<Personas>;
  /** An aggregate relationship */
  personas_aggregate: Personas_Aggregate;
  /** fetch data from the table: "personas" using primary key columns */
  personas_by_pk: Maybe<Personas>;
  /** fetch data from the table: "user_agents" */
  user_agents: Array<User_Agents>;
  /** fetch aggregated fields from the table: "user_agents" */
  user_agents_aggregate: User_Agents_Aggregate;
  /** fetch data from the table: "user_agents" using primary key columns */
  user_agents_by_pk: Maybe<User_Agents>;
};


export type Query_RootCustomersArgs = {
  distinct_on: Maybe<Array<Customers_Select_Column>>;
  limit: Maybe<Scalars['Int']>;
  offset: Maybe<Scalars['Int']>;
  order_by: Maybe<Array<Customers_Order_By>>;
  where: Maybe<Customers_Bool_Exp>;
};


export type Query_RootCustomers_AggregateArgs = {
  distinct_on: Maybe<Array<Customers_Select_Column>>;
  limit: Maybe<Scalars['Int']>;
  offset: Maybe<Scalars['Int']>;
  order_by: Maybe<Array<Customers_Order_By>>;
  where: Maybe<Customers_Bool_Exp>;
};


export type Query_RootCustomers_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootFirebase_TokensArgs = {
  distinct_on: Maybe<Array<Firebase_Tokens_Select_Column>>;
  limit: Maybe<Scalars['Int']>;
  offset: Maybe<Scalars['Int']>;
  order_by: Maybe<Array<Firebase_Tokens_Order_By>>;
  where: Maybe<Firebase_Tokens_Bool_Exp>;
};


export type Query_RootFirebase_Tokens_AggregateArgs = {
  distinct_on: Maybe<Array<Firebase_Tokens_Select_Column>>;
  limit: Maybe<Scalars['Int']>;
  offset: Maybe<Scalars['Int']>;
  order_by: Maybe<Array<Firebase_Tokens_Order_By>>;
  where: Maybe<Firebase_Tokens_Bool_Exp>;
};


export type Query_RootFirebase_Tokens_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootLoginsArgs = {
  distinct_on: Maybe<Array<Logins_Select_Column>>;
  limit: Maybe<Scalars['Int']>;
  offset: Maybe<Scalars['Int']>;
  order_by: Maybe<Array<Logins_Order_By>>;
  where: Maybe<Logins_Bool_Exp>;
};


export type Query_RootLogins_AggregateArgs = {
  distinct_on: Maybe<Array<Logins_Select_Column>>;
  limit: Maybe<Scalars['Int']>;
  offset: Maybe<Scalars['Int']>;
  order_by: Maybe<Array<Logins_Order_By>>;
  where: Maybe<Logins_Bool_Exp>;
};


export type Query_RootLogins_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootMembership_LevelsArgs = {
  distinct_on: Maybe<Array<Membership_Levels_Select_Column>>;
  limit: Maybe<Scalars['Int']>;
  offset: Maybe<Scalars['Int']>;
  order_by: Maybe<Array<Membership_Levels_Order_By>>;
  where: Maybe<Membership_Levels_Bool_Exp>;
};


export type Query_RootMembership_Levels_AggregateArgs = {
  distinct_on: Maybe<Array<Membership_Levels_Select_Column>>;
  limit: Maybe<Scalars['Int']>;
  offset: Maybe<Scalars['Int']>;
  order_by: Maybe<Array<Membership_Levels_Order_By>>;
  where: Maybe<Membership_Levels_Bool_Exp>;
};


export type Query_RootMembership_Levels_By_PkArgs = {
  value: Scalars['String'];
};


export type Query_RootMembershipsArgs = {
  distinct_on: Maybe<Array<Memberships_Select_Column>>;
  limit: Maybe<Scalars['Int']>;
  offset: Maybe<Scalars['Int']>;
  order_by: Maybe<Array<Memberships_Order_By>>;
  where: Maybe<Memberships_Bool_Exp>;
};


export type Query_RootMemberships_AggregateArgs = {
  distinct_on: Maybe<Array<Memberships_Select_Column>>;
  limit: Maybe<Scalars['Int']>;
  offset: Maybe<Scalars['Int']>;
  order_by: Maybe<Array<Memberships_Order_By>>;
  where: Maybe<Memberships_Bool_Exp>;
};


export type Query_RootMemberships_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootPersonasArgs = {
  distinct_on: Maybe<Array<Personas_Select_Column>>;
  limit: Maybe<Scalars['Int']>;
  offset: Maybe<Scalars['Int']>;
  order_by: Maybe<Array<Personas_Order_By>>;
  where: Maybe<Personas_Bool_Exp>;
};


export type Query_RootPersonas_AggregateArgs = {
  distinct_on: Maybe<Array<Personas_Select_Column>>;
  limit: Maybe<Scalars['Int']>;
  offset: Maybe<Scalars['Int']>;
  order_by: Maybe<Array<Personas_Order_By>>;
  where: Maybe<Personas_Bool_Exp>;
};


export type Query_RootPersonas_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootUser_AgentsArgs = {
  distinct_on: Maybe<Array<User_Agents_Select_Column>>;
  limit: Maybe<Scalars['Int']>;
  offset: Maybe<Scalars['Int']>;
  order_by: Maybe<Array<User_Agents_Order_By>>;
  where: Maybe<User_Agents_Bool_Exp>;
};


export type Query_RootUser_Agents_AggregateArgs = {
  distinct_on: Maybe<Array<User_Agents_Select_Column>>;
  limit: Maybe<Scalars['Int']>;
  offset: Maybe<Scalars['Int']>;
  order_by: Maybe<Array<User_Agents_Order_By>>;
  where: Maybe<User_Agents_Bool_Exp>;
};


export type Query_RootUser_Agents_By_PkArgs = {
  id: Scalars['uuid'];
};

export type Subscription_Root = {
  __typename?: 'subscription_root';
  /** fetch data from the table: "customers" */
  customers: Array<Customers>;
  /** fetch aggregated fields from the table: "customers" */
  customers_aggregate: Customers_Aggregate;
  /** fetch data from the table: "customers" using primary key columns */
  customers_by_pk: Maybe<Customers>;
  /** An array relationship */
  firebase_tokens: Array<Firebase_Tokens>;
  /** An aggregate relationship */
  firebase_tokens_aggregate: Firebase_Tokens_Aggregate;
  /** fetch data from the table: "firebase_tokens" using primary key columns */
  firebase_tokens_by_pk: Maybe<Firebase_Tokens>;
  /** An array relationship */
  logins: Array<Logins>;
  /** An aggregate relationship */
  logins_aggregate: Logins_Aggregate;
  /** fetch data from the table: "logins" using primary key columns */
  logins_by_pk: Maybe<Logins>;
  /** fetch data from the table: "membership_levels" */
  membership_levels: Array<Membership_Levels>;
  /** fetch aggregated fields from the table: "membership_levels" */
  membership_levels_aggregate: Membership_Levels_Aggregate;
  /** fetch data from the table: "membership_levels" using primary key columns */
  membership_levels_by_pk: Maybe<Membership_Levels>;
  /** fetch data from the table: "memberships" */
  memberships: Array<Memberships>;
  /** fetch aggregated fields from the table: "memberships" */
  memberships_aggregate: Memberships_Aggregate;
  /** fetch data from the table: "memberships" using primary key columns */
  memberships_by_pk: Maybe<Memberships>;
  /** fetch data from the table: "personas" */
  personas: Array<Personas>;
  /** An aggregate relationship */
  personas_aggregate: Personas_Aggregate;
  /** fetch data from the table: "personas" using primary key columns */
  personas_by_pk: Maybe<Personas>;
  /** fetch data from the table: "user_agents" */
  user_agents: Array<User_Agents>;
  /** fetch aggregated fields from the table: "user_agents" */
  user_agents_aggregate: User_Agents_Aggregate;
  /** fetch data from the table: "user_agents" using primary key columns */
  user_agents_by_pk: Maybe<User_Agents>;
};


export type Subscription_RootCustomersArgs = {
  distinct_on: Maybe<Array<Customers_Select_Column>>;
  limit: Maybe<Scalars['Int']>;
  offset: Maybe<Scalars['Int']>;
  order_by: Maybe<Array<Customers_Order_By>>;
  where: Maybe<Customers_Bool_Exp>;
};


export type Subscription_RootCustomers_AggregateArgs = {
  distinct_on: Maybe<Array<Customers_Select_Column>>;
  limit: Maybe<Scalars['Int']>;
  offset: Maybe<Scalars['Int']>;
  order_by: Maybe<Array<Customers_Order_By>>;
  where: Maybe<Customers_Bool_Exp>;
};


export type Subscription_RootCustomers_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootFirebase_TokensArgs = {
  distinct_on: Maybe<Array<Firebase_Tokens_Select_Column>>;
  limit: Maybe<Scalars['Int']>;
  offset: Maybe<Scalars['Int']>;
  order_by: Maybe<Array<Firebase_Tokens_Order_By>>;
  where: Maybe<Firebase_Tokens_Bool_Exp>;
};


export type Subscription_RootFirebase_Tokens_AggregateArgs = {
  distinct_on: Maybe<Array<Firebase_Tokens_Select_Column>>;
  limit: Maybe<Scalars['Int']>;
  offset: Maybe<Scalars['Int']>;
  order_by: Maybe<Array<Firebase_Tokens_Order_By>>;
  where: Maybe<Firebase_Tokens_Bool_Exp>;
};


export type Subscription_RootFirebase_Tokens_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootLoginsArgs = {
  distinct_on: Maybe<Array<Logins_Select_Column>>;
  limit: Maybe<Scalars['Int']>;
  offset: Maybe<Scalars['Int']>;
  order_by: Maybe<Array<Logins_Order_By>>;
  where: Maybe<Logins_Bool_Exp>;
};


export type Subscription_RootLogins_AggregateArgs = {
  distinct_on: Maybe<Array<Logins_Select_Column>>;
  limit: Maybe<Scalars['Int']>;
  offset: Maybe<Scalars['Int']>;
  order_by: Maybe<Array<Logins_Order_By>>;
  where: Maybe<Logins_Bool_Exp>;
};


export type Subscription_RootLogins_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootMembership_LevelsArgs = {
  distinct_on: Maybe<Array<Membership_Levels_Select_Column>>;
  limit: Maybe<Scalars['Int']>;
  offset: Maybe<Scalars['Int']>;
  order_by: Maybe<Array<Membership_Levels_Order_By>>;
  where: Maybe<Membership_Levels_Bool_Exp>;
};


export type Subscription_RootMembership_Levels_AggregateArgs = {
  distinct_on: Maybe<Array<Membership_Levels_Select_Column>>;
  limit: Maybe<Scalars['Int']>;
  offset: Maybe<Scalars['Int']>;
  order_by: Maybe<Array<Membership_Levels_Order_By>>;
  where: Maybe<Membership_Levels_Bool_Exp>;
};


export type Subscription_RootMembership_Levels_By_PkArgs = {
  value: Scalars['String'];
};


export type Subscription_RootMembershipsArgs = {
  distinct_on: Maybe<Array<Memberships_Select_Column>>;
  limit: Maybe<Scalars['Int']>;
  offset: Maybe<Scalars['Int']>;
  order_by: Maybe<Array<Memberships_Order_By>>;
  where: Maybe<Memberships_Bool_Exp>;
};


export type Subscription_RootMemberships_AggregateArgs = {
  distinct_on: Maybe<Array<Memberships_Select_Column>>;
  limit: Maybe<Scalars['Int']>;
  offset: Maybe<Scalars['Int']>;
  order_by: Maybe<Array<Memberships_Order_By>>;
  where: Maybe<Memberships_Bool_Exp>;
};


export type Subscription_RootMemberships_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootPersonasArgs = {
  distinct_on: Maybe<Array<Personas_Select_Column>>;
  limit: Maybe<Scalars['Int']>;
  offset: Maybe<Scalars['Int']>;
  order_by: Maybe<Array<Personas_Order_By>>;
  where: Maybe<Personas_Bool_Exp>;
};


export type Subscription_RootPersonas_AggregateArgs = {
  distinct_on: Maybe<Array<Personas_Select_Column>>;
  limit: Maybe<Scalars['Int']>;
  offset: Maybe<Scalars['Int']>;
  order_by: Maybe<Array<Personas_Order_By>>;
  where: Maybe<Personas_Bool_Exp>;
};


export type Subscription_RootPersonas_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootUser_AgentsArgs = {
  distinct_on: Maybe<Array<User_Agents_Select_Column>>;
  limit: Maybe<Scalars['Int']>;
  offset: Maybe<Scalars['Int']>;
  order_by: Maybe<Array<User_Agents_Order_By>>;
  where: Maybe<User_Agents_Bool_Exp>;
};


export type Subscription_RootUser_Agents_AggregateArgs = {
  distinct_on: Maybe<Array<User_Agents_Select_Column>>;
  limit: Maybe<Scalars['Int']>;
  offset: Maybe<Scalars['Int']>;
  order_by: Maybe<Array<User_Agents_Order_By>>;
  where: Maybe<User_Agents_Bool_Exp>;
};


export type Subscription_RootUser_Agents_By_PkArgs = {
  id: Scalars['uuid'];
};


/** Boolean expression to compare columns of type "time". All fields are combined with logical 'AND'. */
export type Time_Comparison_Exp = {
  _eq: Maybe<Scalars['time']>;
  _gt: Maybe<Scalars['time']>;
  _gte: Maybe<Scalars['time']>;
  _in: Maybe<Array<Scalars['time']>>;
  _is_null: Maybe<Scalars['Boolean']>;
  _lt: Maybe<Scalars['time']>;
  _lte: Maybe<Scalars['time']>;
  _neq: Maybe<Scalars['time']>;
  _nin: Maybe<Array<Scalars['time']>>;
};


/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type Timestamptz_Comparison_Exp = {
  _eq: Maybe<Scalars['timestamptz']>;
  _gt: Maybe<Scalars['timestamptz']>;
  _gte: Maybe<Scalars['timestamptz']>;
  _in: Maybe<Array<Scalars['timestamptz']>>;
  _is_null: Maybe<Scalars['Boolean']>;
  _lt: Maybe<Scalars['timestamptz']>;
  _lte: Maybe<Scalars['timestamptz']>;
  _neq: Maybe<Scalars['timestamptz']>;
  _nin: Maybe<Array<Scalars['timestamptz']>>;
};

/** columns and relationships of "user_agents" */
export type User_Agents = {
  __typename?: 'user_agents';
  id: Scalars['uuid'];
  user_agent: Scalars['String'];
};

/** aggregated selection of "user_agents" */
export type User_Agents_Aggregate = {
  __typename?: 'user_agents_aggregate';
  aggregate: Maybe<User_Agents_Aggregate_Fields>;
  nodes: Array<User_Agents>;
};

/** aggregate fields of "user_agents" */
export type User_Agents_Aggregate_Fields = {
  __typename?: 'user_agents_aggregate_fields';
  count: Scalars['Int'];
  max: Maybe<User_Agents_Max_Fields>;
  min: Maybe<User_Agents_Min_Fields>;
};


/** aggregate fields of "user_agents" */
export type User_Agents_Aggregate_FieldsCountArgs = {
  columns: Maybe<Array<User_Agents_Select_Column>>;
  distinct: Maybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "user_agents". All fields are combined with a logical 'AND'. */
export type User_Agents_Bool_Exp = {
  _and: Maybe<Array<User_Agents_Bool_Exp>>;
  _not: Maybe<User_Agents_Bool_Exp>;
  _or: Maybe<Array<User_Agents_Bool_Exp>>;
  id: Maybe<Uuid_Comparison_Exp>;
  user_agent: Maybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "user_agents" */
export enum User_Agents_Constraint {
  /** unique or primary key constraint */
  UserAgentsPkey = 'user_agents_pkey',
  /** unique or primary key constraint */
  UserAgentsUserAgentKey = 'user_agents_user_agent_key'
}

/** input type for inserting data into table "user_agents" */
export type User_Agents_Insert_Input = {
  id: Maybe<Scalars['uuid']>;
  user_agent: Maybe<Scalars['String']>;
};

/** aggregate max on columns */
export type User_Agents_Max_Fields = {
  __typename?: 'user_agents_max_fields';
  id: Maybe<Scalars['uuid']>;
  user_agent: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type User_Agents_Min_Fields = {
  __typename?: 'user_agents_min_fields';
  id: Maybe<Scalars['uuid']>;
  user_agent: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "user_agents" */
export type User_Agents_Mutation_Response = {
  __typename?: 'user_agents_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<User_Agents>;
};

/** input type for inserting object relation for remote table "user_agents" */
export type User_Agents_Obj_Rel_Insert_Input = {
  data: User_Agents_Insert_Input;
  /** on conflict condition */
  on_conflict: Maybe<User_Agents_On_Conflict>;
};

/** on conflict condition type for table "user_agents" */
export type User_Agents_On_Conflict = {
  constraint: User_Agents_Constraint;
  update_columns: Array<User_Agents_Update_Column>;
  where: Maybe<User_Agents_Bool_Exp>;
};

/** Ordering options when selecting data from "user_agents". */
export type User_Agents_Order_By = {
  id: Maybe<Order_By>;
  user_agent: Maybe<Order_By>;
};

/** primary key columns input for table: user_agents */
export type User_Agents_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "user_agents" */
export enum User_Agents_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  UserAgent = 'user_agent'
}

/** input type for updating data in table "user_agents" */
export type User_Agents_Set_Input = {
  id: Maybe<Scalars['uuid']>;
  user_agent: Maybe<Scalars['String']>;
};

/** update columns of table "user_agents" */
export enum User_Agents_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  UserAgent = 'user_agent'
}


/** Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'. */
export type Uuid_Comparison_Exp = {
  _eq: Maybe<Scalars['uuid']>;
  _gt: Maybe<Scalars['uuid']>;
  _gte: Maybe<Scalars['uuid']>;
  _in: Maybe<Array<Scalars['uuid']>>;
  _is_null: Maybe<Scalars['Boolean']>;
  _lt: Maybe<Scalars['uuid']>;
  _lte: Maybe<Scalars['uuid']>;
  _neq: Maybe<Scalars['uuid']>;
  _nin: Maybe<Array<Scalars['uuid']>>;
};

export type CustomerLoginMutationVariables = Exact<{ [key: string]: never; }>;


export type CustomerLoginMutation = (
  { __typename?: 'mutation_root' }
  & { login: Maybe<(
    { __typename?: 'LoginOutput' }
    & Pick<LoginOutput, 'id'>
    & { customer: (
      { __typename?: 'customers' }
      & CustomerDetailsFragment
    ) }
  )> }
);

export type CustomerDetailsQueryVariables = Exact<{
  customerId: Scalars['uuid'];
}>;


export type CustomerDetailsQuery = (
  { __typename?: 'query_root' }
  & { customer: Maybe<(
    { __typename?: 'customers' }
    & CustomerDetailsFragment
  )> }
);

export type CustomerDetailsFragment = (
  { __typename?: 'customers' }
  & Pick<Customers, 'id' | 'contact_name' | 'unverified_email' | 'verified_email'>
  & { membership: Maybe<(
    { __typename?: 'memberships' }
    & Pick<Memberships, 'id' | 'active_until' | 'level' | 'lifetime' | 'sabbatical_available_until'>
  )>, personas: Array<(
    { __typename?: 'personas' }
    & Pick<Personas, 'id' | 'list_address_with_byline' | 'name' | 'photo_url' | 'preferred_broadcast_time'>
  )> }
);

export const CustomerDetailsFragmentDoc: DocumentNode<CustomerDetailsFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"customerDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"customers"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"contact_name"}},{"kind":"Field","name":{"kind":"Name","value":"membership"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"active_until"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"lifetime"}},{"kind":"Field","name":{"kind":"Name","value":"sabbatical_available_until"}}]}},{"kind":"Field","name":{"kind":"Name","value":"personas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"list_address_with_byline"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"photo_url"}},{"kind":"Field","name":{"kind":"Name","value":"preferred_broadcast_time"}}]}},{"kind":"Field","name":{"kind":"Name","value":"unverified_email"}},{"kind":"Field","name":{"kind":"Name","value":"verified_email"}}]}}]};
export const CustomerLoginDocument: DocumentNode<CustomerLoginMutation, CustomerLoginMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CustomerLogin"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"customerDetails"}}]}}]}}]}},...CustomerDetailsFragmentDoc.definitions]};
export const CustomerDetailsDocument: DocumentNode<CustomerDetailsQuery, CustomerDetailsQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CustomerDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"customerId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"customer"},"name":{"kind":"Name","value":"customers_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"customerId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"customerDetails"}}]}}]}},...CustomerDetailsFragmentDoc.definitions]};