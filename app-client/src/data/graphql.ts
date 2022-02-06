import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null | undefined;
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
  date: any;
  inet: any;
  json: any;
  smallint: any;
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
  /** An object relationship */
  customer: Customers;
  customer_id: Maybe<Scalars['uuid']>;
  session_token: Scalars['String'];
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

/** columns and relationships of "address_types" */
export type Address_Types = {
  __typename?: 'address_types';
  value: Scalars['String'];
};

/** aggregated selection of "address_types" */
export type Address_Types_Aggregate = {
  __typename?: 'address_types_aggregate';
  aggregate: Maybe<Address_Types_Aggregate_Fields>;
  nodes: Array<Address_Types>;
};

/** aggregate fields of "address_types" */
export type Address_Types_Aggregate_Fields = {
  __typename?: 'address_types_aggregate_fields';
  count: Scalars['Int'];
  max: Maybe<Address_Types_Max_Fields>;
  min: Maybe<Address_Types_Min_Fields>;
};


/** aggregate fields of "address_types" */
export type Address_Types_Aggregate_FieldsCountArgs = {
  columns: Maybe<Array<Address_Types_Select_Column>>;
  distinct: Maybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "address_types". All fields are combined with a logical 'AND'. */
export type Address_Types_Bool_Exp = {
  _and: Maybe<Array<Address_Types_Bool_Exp>>;
  _not: Maybe<Address_Types_Bool_Exp>;
  _or: Maybe<Array<Address_Types_Bool_Exp>>;
  value: Maybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "address_types" */
export enum Address_Types_Constraint {
  /** unique or primary key constraint */
  AddressTypesPkey = 'address_types_pkey'
}

export enum Address_Types_Enum {
  Email = 'Email',
  Guest = 'Guest',
  Member = 'Member',
  Myself = 'Myself',
  Nobody = 'Nobody',
  PersonaReaders = 'PersonaReaders',
  Public = 'Public',
  QuotedAddressees = 'QuotedAddressees',
  QuotedContributorsAndSignatories = 'QuotedContributorsAndSignatories',
  QuotedParticipants = 'QuotedParticipants',
  Reserved = 'Reserved',
  TheEditor = 'TheEditor',
  UrlHolders = 'URLHolders'
}

/** Boolean expression to compare columns of type "address_types_enum". All fields are combined with logical 'AND'. */
export type Address_Types_Enum_Comparison_Exp = {
  _eq: Maybe<Address_Types_Enum>;
  _in: Maybe<Array<Address_Types_Enum>>;
  _is_null: Maybe<Scalars['Boolean']>;
  _neq: Maybe<Address_Types_Enum>;
  _nin: Maybe<Array<Address_Types_Enum>>;
};

/** input type for inserting data into table "address_types" */
export type Address_Types_Insert_Input = {
  value: Maybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Address_Types_Max_Fields = {
  __typename?: 'address_types_max_fields';
  value: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Address_Types_Min_Fields = {
  __typename?: 'address_types_min_fields';
  value: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "address_types" */
export type Address_Types_Mutation_Response = {
  __typename?: 'address_types_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Address_Types>;
};

/** on conflict condition type for table "address_types" */
export type Address_Types_On_Conflict = {
  constraint: Address_Types_Constraint;
  update_columns: Array<Address_Types_Update_Column>;
  where: Maybe<Address_Types_Bool_Exp>;
};

/** Ordering options when selecting data from "address_types". */
export type Address_Types_Order_By = {
  value: Maybe<Order_By>;
};

/** primary key columns input for table: address_types */
export type Address_Types_Pk_Columns_Input = {
  value: Scalars['String'];
};

/** select columns of table "address_types" */
export enum Address_Types_Select_Column {
  /** column name */
  Value = 'value'
}

/** input type for updating data in table "address_types" */
export type Address_Types_Set_Input = {
  value: Maybe<Scalars['String']>;
};

/** update columns of table "address_types" */
export enum Address_Types_Update_Column {
  /** column name */
  Value = 'value'
}

/** columns and relationships of "addresses" */
export type Addresses = {
  __typename?: 'addresses';
  created_at: Scalars['timestamptz'];
  discovers_linked_persona: Scalars['Boolean'];
  handle: Scalars['String'];
  id: Scalars['uuid'];
  listed_in_search: Scalars['Boolean'];
  listing_priority: Scalars['smallint'];
  persona_id: Maybe<Scalars['uuid']>;
  released_at: Maybe<Scalars['timestamptz']>;
  type: Maybe<Address_Types_Enum>;
  username_flag: Maybe<Scalars['Boolean']>;
};

/** aggregated selection of "addresses" */
export type Addresses_Aggregate = {
  __typename?: 'addresses_aggregate';
  aggregate: Maybe<Addresses_Aggregate_Fields>;
  nodes: Array<Addresses>;
};

/** aggregate fields of "addresses" */
export type Addresses_Aggregate_Fields = {
  __typename?: 'addresses_aggregate_fields';
  avg: Maybe<Addresses_Avg_Fields>;
  count: Scalars['Int'];
  max: Maybe<Addresses_Max_Fields>;
  min: Maybe<Addresses_Min_Fields>;
  stddev: Maybe<Addresses_Stddev_Fields>;
  stddev_pop: Maybe<Addresses_Stddev_Pop_Fields>;
  stddev_samp: Maybe<Addresses_Stddev_Samp_Fields>;
  sum: Maybe<Addresses_Sum_Fields>;
  var_pop: Maybe<Addresses_Var_Pop_Fields>;
  var_samp: Maybe<Addresses_Var_Samp_Fields>;
  variance: Maybe<Addresses_Variance_Fields>;
};


/** aggregate fields of "addresses" */
export type Addresses_Aggregate_FieldsCountArgs = {
  columns: Maybe<Array<Addresses_Select_Column>>;
  distinct: Maybe<Scalars['Boolean']>;
};

/** aggregate avg on columns */
export type Addresses_Avg_Fields = {
  __typename?: 'addresses_avg_fields';
  listing_priority: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "addresses". All fields are combined with a logical 'AND'. */
export type Addresses_Bool_Exp = {
  _and: Maybe<Array<Addresses_Bool_Exp>>;
  _not: Maybe<Addresses_Bool_Exp>;
  _or: Maybe<Array<Addresses_Bool_Exp>>;
  created_at: Maybe<Timestamptz_Comparison_Exp>;
  discovers_linked_persona: Maybe<Boolean_Comparison_Exp>;
  handle: Maybe<String_Comparison_Exp>;
  id: Maybe<Uuid_Comparison_Exp>;
  listed_in_search: Maybe<Boolean_Comparison_Exp>;
  listing_priority: Maybe<Smallint_Comparison_Exp>;
  persona_id: Maybe<Uuid_Comparison_Exp>;
  released_at: Maybe<Timestamptz_Comparison_Exp>;
  type: Maybe<Address_Types_Enum_Comparison_Exp>;
  username_flag: Maybe<Boolean_Comparison_Exp>;
};

/** unique or primary key constraints on table "addresses" */
export enum Addresses_Constraint {
  /** unique or primary key constraint */
  AddressesHandleKey = 'addresses_handle_key',
  /** unique or primary key constraint */
  AddressesPersonaIdTypeUsernameFlagKey = 'addresses_persona_id_type_username_flag_key',
  /** unique or primary key constraint */
  AddressesPkey = 'addresses_pkey'
}

/** input type for incrementing numeric columns in table "addresses" */
export type Addresses_Inc_Input = {
  listing_priority: Maybe<Scalars['smallint']>;
};

/** input type for inserting data into table "addresses" */
export type Addresses_Insert_Input = {
  created_at: Maybe<Scalars['timestamptz']>;
  discovers_linked_persona: Maybe<Scalars['Boolean']>;
  handle: Maybe<Scalars['String']>;
  id: Maybe<Scalars['uuid']>;
  listed_in_search: Maybe<Scalars['Boolean']>;
  listing_priority: Maybe<Scalars['smallint']>;
  persona_id: Maybe<Scalars['uuid']>;
  released_at: Maybe<Scalars['timestamptz']>;
  type: Maybe<Address_Types_Enum>;
  username_flag: Maybe<Scalars['Boolean']>;
};

/** aggregate max on columns */
export type Addresses_Max_Fields = {
  __typename?: 'addresses_max_fields';
  created_at: Maybe<Scalars['timestamptz']>;
  handle: Maybe<Scalars['String']>;
  id: Maybe<Scalars['uuid']>;
  listing_priority: Maybe<Scalars['smallint']>;
  persona_id: Maybe<Scalars['uuid']>;
  released_at: Maybe<Scalars['timestamptz']>;
};

/** aggregate min on columns */
export type Addresses_Min_Fields = {
  __typename?: 'addresses_min_fields';
  created_at: Maybe<Scalars['timestamptz']>;
  handle: Maybe<Scalars['String']>;
  id: Maybe<Scalars['uuid']>;
  listing_priority: Maybe<Scalars['smallint']>;
  persona_id: Maybe<Scalars['uuid']>;
  released_at: Maybe<Scalars['timestamptz']>;
};

/** response of any mutation on the table "addresses" */
export type Addresses_Mutation_Response = {
  __typename?: 'addresses_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Addresses>;
};

/** on conflict condition type for table "addresses" */
export type Addresses_On_Conflict = {
  constraint: Addresses_Constraint;
  update_columns: Array<Addresses_Update_Column>;
  where: Maybe<Addresses_Bool_Exp>;
};

/** Ordering options when selecting data from "addresses". */
export type Addresses_Order_By = {
  created_at: Maybe<Order_By>;
  discovers_linked_persona: Maybe<Order_By>;
  handle: Maybe<Order_By>;
  id: Maybe<Order_By>;
  listed_in_search: Maybe<Order_By>;
  listing_priority: Maybe<Order_By>;
  persona_id: Maybe<Order_By>;
  released_at: Maybe<Order_By>;
  type: Maybe<Order_By>;
  username_flag: Maybe<Order_By>;
};

/** primary key columns input for table: addresses */
export type Addresses_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "addresses" */
export enum Addresses_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DiscoversLinkedPersona = 'discovers_linked_persona',
  /** column name */
  Handle = 'handle',
  /** column name */
  Id = 'id',
  /** column name */
  ListedInSearch = 'listed_in_search',
  /** column name */
  ListingPriority = 'listing_priority',
  /** column name */
  PersonaId = 'persona_id',
  /** column name */
  ReleasedAt = 'released_at',
  /** column name */
  Type = 'type',
  /** column name */
  UsernameFlag = 'username_flag'
}

/** input type for updating data in table "addresses" */
export type Addresses_Set_Input = {
  created_at: Maybe<Scalars['timestamptz']>;
  discovers_linked_persona: Maybe<Scalars['Boolean']>;
  handle: Maybe<Scalars['String']>;
  id: Maybe<Scalars['uuid']>;
  listed_in_search: Maybe<Scalars['Boolean']>;
  listing_priority: Maybe<Scalars['smallint']>;
  persona_id: Maybe<Scalars['uuid']>;
  released_at: Maybe<Scalars['timestamptz']>;
  type: Maybe<Address_Types_Enum>;
  username_flag: Maybe<Scalars['Boolean']>;
};

/** aggregate stddev on columns */
export type Addresses_Stddev_Fields = {
  __typename?: 'addresses_stddev_fields';
  listing_priority: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type Addresses_Stddev_Pop_Fields = {
  __typename?: 'addresses_stddev_pop_fields';
  listing_priority: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type Addresses_Stddev_Samp_Fields = {
  __typename?: 'addresses_stddev_samp_fields';
  listing_priority: Maybe<Scalars['Float']>;
};

/** aggregate sum on columns */
export type Addresses_Sum_Fields = {
  __typename?: 'addresses_sum_fields';
  listing_priority: Maybe<Scalars['smallint']>;
};

/** update columns of table "addresses" */
export enum Addresses_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DiscoversLinkedPersona = 'discovers_linked_persona',
  /** column name */
  Handle = 'handle',
  /** column name */
  Id = 'id',
  /** column name */
  ListedInSearch = 'listed_in_search',
  /** column name */
  ListingPriority = 'listing_priority',
  /** column name */
  PersonaId = 'persona_id',
  /** column name */
  ReleasedAt = 'released_at',
  /** column name */
  Type = 'type',
  /** column name */
  UsernameFlag = 'username_flag'
}

/** aggregate var_pop on columns */
export type Addresses_Var_Pop_Fields = {
  __typename?: 'addresses_var_pop_fields';
  listing_priority: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type Addresses_Var_Samp_Fields = {
  __typename?: 'addresses_var_samp_fields';
  listing_priority: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type Addresses_Variance_Fields = {
  __typename?: 'addresses_variance_fields';
  listing_priority: Maybe<Scalars['Float']>;
};

/** columns and relationships of "customer_onboardings" */
export type Customer_Onboardings = {
  __typename?: 'customer_onboardings';
  address_handle: Maybe<Scalars['String']>;
  address_type: Maybe<Address_Types_Enum>;
  id: Scalars['uuid'];
  introduction_letter_date: Maybe<Scalars['date']>;
  introduction_letter_editor_state: Maybe<Scalars['json']>;
  introduction_letter_extra_recipients: Maybe<Scalars['json']>;
  introduction_letter_time: Maybe<Scalars['time']>;
  introduction_letter_url_slug: Maybe<Scalars['String']>;
  persona_name: Maybe<Scalars['String']>;
  persona_photo_url: Maybe<Scalars['String']>;
  skip_onboarding_redirect_on_login: Maybe<Scalars['Boolean']>;
  updated_at: Scalars['timestamptz'];
};


/** columns and relationships of "customer_onboardings" */
export type Customer_OnboardingsIntroduction_Letter_Editor_StateArgs = {
  path: Maybe<Scalars['String']>;
};


/** columns and relationships of "customer_onboardings" */
export type Customer_OnboardingsIntroduction_Letter_Extra_RecipientsArgs = {
  path: Maybe<Scalars['String']>;
};

/** aggregated selection of "customer_onboardings" */
export type Customer_Onboardings_Aggregate = {
  __typename?: 'customer_onboardings_aggregate';
  aggregate: Maybe<Customer_Onboardings_Aggregate_Fields>;
  nodes: Array<Customer_Onboardings>;
};

/** aggregate fields of "customer_onboardings" */
export type Customer_Onboardings_Aggregate_Fields = {
  __typename?: 'customer_onboardings_aggregate_fields';
  count: Scalars['Int'];
  max: Maybe<Customer_Onboardings_Max_Fields>;
  min: Maybe<Customer_Onboardings_Min_Fields>;
};


/** aggregate fields of "customer_onboardings" */
export type Customer_Onboardings_Aggregate_FieldsCountArgs = {
  columns: Maybe<Array<Customer_Onboardings_Select_Column>>;
  distinct: Maybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "customer_onboardings". All fields are combined with a logical 'AND'. */
export type Customer_Onboardings_Bool_Exp = {
  _and: Maybe<Array<Customer_Onboardings_Bool_Exp>>;
  _not: Maybe<Customer_Onboardings_Bool_Exp>;
  _or: Maybe<Array<Customer_Onboardings_Bool_Exp>>;
  address_handle: Maybe<String_Comparison_Exp>;
  address_type: Maybe<Address_Types_Enum_Comparison_Exp>;
  id: Maybe<Uuid_Comparison_Exp>;
  introduction_letter_date: Maybe<Date_Comparison_Exp>;
  introduction_letter_editor_state: Maybe<Json_Comparison_Exp>;
  introduction_letter_extra_recipients: Maybe<Json_Comparison_Exp>;
  introduction_letter_time: Maybe<Time_Comparison_Exp>;
  introduction_letter_url_slug: Maybe<String_Comparison_Exp>;
  persona_name: Maybe<String_Comparison_Exp>;
  persona_photo_url: Maybe<String_Comparison_Exp>;
  skip_onboarding_redirect_on_login: Maybe<Boolean_Comparison_Exp>;
  updated_at: Maybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "customer_onboardings" */
export enum Customer_Onboardings_Constraint {
  /** unique or primary key constraint */
  CustomerOnboardingsPkey = 'customer_onboardings_pkey'
}

/** input type for inserting data into table "customer_onboardings" */
export type Customer_Onboardings_Insert_Input = {
  address_handle: Maybe<Scalars['String']>;
  address_type: Maybe<Address_Types_Enum>;
  id: Maybe<Scalars['uuid']>;
  introduction_letter_date: Maybe<Scalars['date']>;
  introduction_letter_editor_state: Maybe<Scalars['json']>;
  introduction_letter_extra_recipients: Maybe<Scalars['json']>;
  introduction_letter_time: Maybe<Scalars['time']>;
  introduction_letter_url_slug: Maybe<Scalars['String']>;
  persona_name: Maybe<Scalars['String']>;
  persona_photo_url: Maybe<Scalars['String']>;
  skip_onboarding_redirect_on_login: Maybe<Scalars['Boolean']>;
  updated_at: Maybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Customer_Onboardings_Max_Fields = {
  __typename?: 'customer_onboardings_max_fields';
  address_handle: Maybe<Scalars['String']>;
  id: Maybe<Scalars['uuid']>;
  introduction_letter_date: Maybe<Scalars['date']>;
  introduction_letter_url_slug: Maybe<Scalars['String']>;
  persona_name: Maybe<Scalars['String']>;
  persona_photo_url: Maybe<Scalars['String']>;
  updated_at: Maybe<Scalars['timestamptz']>;
};

/** aggregate min on columns */
export type Customer_Onboardings_Min_Fields = {
  __typename?: 'customer_onboardings_min_fields';
  address_handle: Maybe<Scalars['String']>;
  id: Maybe<Scalars['uuid']>;
  introduction_letter_date: Maybe<Scalars['date']>;
  introduction_letter_url_slug: Maybe<Scalars['String']>;
  persona_name: Maybe<Scalars['String']>;
  persona_photo_url: Maybe<Scalars['String']>;
  updated_at: Maybe<Scalars['timestamptz']>;
};

/** response of any mutation on the table "customer_onboardings" */
export type Customer_Onboardings_Mutation_Response = {
  __typename?: 'customer_onboardings_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Customer_Onboardings>;
};

/** on conflict condition type for table "customer_onboardings" */
export type Customer_Onboardings_On_Conflict = {
  constraint: Customer_Onboardings_Constraint;
  update_columns: Array<Customer_Onboardings_Update_Column>;
  where: Maybe<Customer_Onboardings_Bool_Exp>;
};

/** Ordering options when selecting data from "customer_onboardings". */
export type Customer_Onboardings_Order_By = {
  address_handle: Maybe<Order_By>;
  address_type: Maybe<Order_By>;
  id: Maybe<Order_By>;
  introduction_letter_date: Maybe<Order_By>;
  introduction_letter_editor_state: Maybe<Order_By>;
  introduction_letter_extra_recipients: Maybe<Order_By>;
  introduction_letter_time: Maybe<Order_By>;
  introduction_letter_url_slug: Maybe<Order_By>;
  persona_name: Maybe<Order_By>;
  persona_photo_url: Maybe<Order_By>;
  skip_onboarding_redirect_on_login: Maybe<Order_By>;
  updated_at: Maybe<Order_By>;
};

/** primary key columns input for table: customer_onboardings */
export type Customer_Onboardings_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "customer_onboardings" */
export enum Customer_Onboardings_Select_Column {
  /** column name */
  AddressHandle = 'address_handle',
  /** column name */
  AddressType = 'address_type',
  /** column name */
  Id = 'id',
  /** column name */
  IntroductionLetterDate = 'introduction_letter_date',
  /** column name */
  IntroductionLetterEditorState = 'introduction_letter_editor_state',
  /** column name */
  IntroductionLetterExtraRecipients = 'introduction_letter_extra_recipients',
  /** column name */
  IntroductionLetterTime = 'introduction_letter_time',
  /** column name */
  IntroductionLetterUrlSlug = 'introduction_letter_url_slug',
  /** column name */
  PersonaName = 'persona_name',
  /** column name */
  PersonaPhotoUrl = 'persona_photo_url',
  /** column name */
  SkipOnboardingRedirectOnLogin = 'skip_onboarding_redirect_on_login',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "customer_onboardings" */
export type Customer_Onboardings_Set_Input = {
  address_handle: Maybe<Scalars['String']>;
  address_type: Maybe<Address_Types_Enum>;
  id: Maybe<Scalars['uuid']>;
  introduction_letter_date: Maybe<Scalars['date']>;
  introduction_letter_editor_state: Maybe<Scalars['json']>;
  introduction_letter_extra_recipients: Maybe<Scalars['json']>;
  introduction_letter_time: Maybe<Scalars['time']>;
  introduction_letter_url_slug: Maybe<Scalars['String']>;
  persona_name: Maybe<Scalars['String']>;
  persona_photo_url: Maybe<Scalars['String']>;
  skip_onboarding_redirect_on_login: Maybe<Scalars['Boolean']>;
  updated_at: Maybe<Scalars['timestamptz']>;
};

/** update columns of table "customer_onboardings" */
export enum Customer_Onboardings_Update_Column {
  /** column name */
  AddressHandle = 'address_handle',
  /** column name */
  AddressType = 'address_type',
  /** column name */
  Id = 'id',
  /** column name */
  IntroductionLetterDate = 'introduction_letter_date',
  /** column name */
  IntroductionLetterEditorState = 'introduction_letter_editor_state',
  /** column name */
  IntroductionLetterExtraRecipients = 'introduction_letter_extra_recipients',
  /** column name */
  IntroductionLetterTime = 'introduction_letter_time',
  /** column name */
  IntroductionLetterUrlSlug = 'introduction_letter_url_slug',
  /** column name */
  PersonaName = 'persona_name',
  /** column name */
  PersonaPhotoUrl = 'persona_photo_url',
  /** column name */
  SkipOnboardingRedirectOnLogin = 'skip_onboarding_redirect_on_login',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** columns and relationships of "customers" */
export type Customers = {
  __typename?: 'customers';
  contact_name: Maybe<Scalars['String']>;
  created_at: Scalars['timestamptz'];
  firebase_uid: Scalars['String'];
  id: Scalars['uuid'];
  /** An object relationship */
  membership: Maybe<Memberships>;
  /** An array relationship */
  personas: Array<Personas>;
  /** An aggregate relationship */
  personas_aggregate: Personas_Aggregate;
  stripe_customer_id: Maybe<Scalars['String']>;
  unverified_email: Scalars['String'];
  verified_email: Maybe<Scalars['String']>;
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


/** Boolean expression to compare columns of type "date". All fields are combined with logical 'AND'. */
export type Date_Comparison_Exp = {
  _eq: Maybe<Scalars['date']>;
  _gt: Maybe<Scalars['date']>;
  _gte: Maybe<Scalars['date']>;
  _in: Maybe<Array<Scalars['date']>>;
  _is_null: Maybe<Scalars['Boolean']>;
  _lt: Maybe<Scalars['date']>;
  _lte: Maybe<Scalars['date']>;
  _neq: Maybe<Scalars['date']>;
  _nin: Maybe<Array<Scalars['date']>>;
};

/** columns and relationships of "firebase_tokens" */
export type Firebase_Tokens = {
  __typename?: 'firebase_tokens';
  auth_time: Scalars['timestamptz'];
  created_at: Scalars['timestamptz'];
  /** An object relationship */
  customer: Customers;
  customer_id: Scalars['uuid'];
  id: Scalars['uuid'];
  last_logged_in_at: Scalars['timestamptz'];
  revoked: Scalars['Boolean'];
  /** fetch data from the table: "sessions" */
  sessions: Array<Sessions>;
  /** An aggregate relationship */
  sessions_aggregate: Sessions_Aggregate;
};


/** columns and relationships of "firebase_tokens" */
export type Firebase_TokensSessionsArgs = {
  distinct_on: Maybe<Array<Sessions_Select_Column>>;
  limit: Maybe<Scalars['Int']>;
  offset: Maybe<Scalars['Int']>;
  order_by: Maybe<Array<Sessions_Order_By>>;
  where: Maybe<Sessions_Bool_Exp>;
};


/** columns and relationships of "firebase_tokens" */
export type Firebase_TokensSessions_AggregateArgs = {
  distinct_on: Maybe<Array<Sessions_Select_Column>>;
  limit: Maybe<Scalars['Int']>;
  offset: Maybe<Scalars['Int']>;
  order_by: Maybe<Array<Sessions_Order_By>>;
  where: Maybe<Sessions_Bool_Exp>;
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
  last_logged_in_at: Maybe<Timestamptz_Comparison_Exp>;
  revoked: Maybe<Boolean_Comparison_Exp>;
  sessions: Maybe<Sessions_Bool_Exp>;
};

/** unique or primary key constraints on table "firebase_tokens" */
export enum Firebase_Tokens_Constraint {
  /** unique or primary key constraint */
  FirebaseTokensCustomerIdAuthTimeKey = 'firebase_tokens_customer_id_auth_time_key',
  /** unique or primary key constraint */
  FirebaseTokensIdRevokedKey = 'firebase_tokens_id_revoked_key',
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
  last_logged_in_at: Maybe<Scalars['timestamptz']>;
  revoked: Maybe<Scalars['Boolean']>;
  sessions: Maybe<Sessions_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Firebase_Tokens_Max_Fields = {
  __typename?: 'firebase_tokens_max_fields';
  auth_time: Maybe<Scalars['timestamptz']>;
  created_at: Maybe<Scalars['timestamptz']>;
  customer_id: Maybe<Scalars['uuid']>;
  id: Maybe<Scalars['uuid']>;
  last_logged_in_at: Maybe<Scalars['timestamptz']>;
};

/** aggregate min on columns */
export type Firebase_Tokens_Min_Fields = {
  __typename?: 'firebase_tokens_min_fields';
  auth_time: Maybe<Scalars['timestamptz']>;
  created_at: Maybe<Scalars['timestamptz']>;
  customer_id: Maybe<Scalars['uuid']>;
  id: Maybe<Scalars['uuid']>;
  last_logged_in_at: Maybe<Scalars['timestamptz']>;
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
  last_logged_in_at: Maybe<Order_By>;
  revoked: Maybe<Order_By>;
  sessions_aggregate: Maybe<Sessions_Aggregate_Order_By>;
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
  LastLoggedInAt = 'last_logged_in_at',
  /** column name */
  Revoked = 'revoked'
}

/** input type for updating data in table "firebase_tokens" */
export type Firebase_Tokens_Set_Input = {
  auth_time: Maybe<Scalars['timestamptz']>;
  created_at: Maybe<Scalars['timestamptz']>;
  customer_id: Maybe<Scalars['uuid']>;
  id: Maybe<Scalars['uuid']>;
  last_logged_in_at: Maybe<Scalars['timestamptz']>;
  revoked: Maybe<Scalars['Boolean']>;
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
  LastLoggedInAt = 'last_logged_in_at',
  /** column name */
  Revoked = 'revoked'
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


/** Boolean expression to compare columns of type "json". All fields are combined with logical 'AND'. */
export type Json_Comparison_Exp = {
  _eq: Maybe<Scalars['json']>;
  _gt: Maybe<Scalars['json']>;
  _gte: Maybe<Scalars['json']>;
  _in: Maybe<Array<Scalars['json']>>;
  _is_null: Maybe<Scalars['Boolean']>;
  _lt: Maybe<Scalars['json']>;
  _lte: Maybe<Scalars['json']>;
  _neq: Maybe<Scalars['json']>;
  _nin: Maybe<Array<Scalars['json']>>;
};

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
  /** delete data from the table: "address_types" */
  delete_address_types: Maybe<Address_Types_Mutation_Response>;
  /** delete single row from the table: "address_types" */
  delete_address_types_by_pk: Maybe<Address_Types>;
  /** delete data from the table: "addresses" */
  delete_addresses: Maybe<Addresses_Mutation_Response>;
  /** delete single row from the table: "addresses" */
  delete_addresses_by_pk: Maybe<Addresses>;
  /** delete data from the table: "customer_onboardings" */
  delete_customer_onboardings: Maybe<Customer_Onboardings_Mutation_Response>;
  /** delete single row from the table: "customer_onboardings" */
  delete_customer_onboardings_by_pk: Maybe<Customer_Onboardings>;
  /** delete data from the table: "customers" */
  delete_customers: Maybe<Customers_Mutation_Response>;
  /** delete single row from the table: "customers" */
  delete_customers_by_pk: Maybe<Customers>;
  /** delete data from the table: "firebase_tokens" */
  delete_firebase_tokens: Maybe<Firebase_Tokens_Mutation_Response>;
  /** delete single row from the table: "firebase_tokens" */
  delete_firebase_tokens_by_pk: Maybe<Firebase_Tokens>;
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
  /** delete data from the table: "sessions" */
  delete_sessions: Maybe<Sessions_Mutation_Response>;
  /** delete single row from the table: "sessions" */
  delete_sessions_by_pk: Maybe<Sessions>;
  /** delete data from the table: "user_agents" */
  delete_user_agents: Maybe<User_Agents_Mutation_Response>;
  /** delete single row from the table: "user_agents" */
  delete_user_agents_by_pk: Maybe<User_Agents>;
  /** insert data into the table: "address_types" */
  insert_address_types: Maybe<Address_Types_Mutation_Response>;
  /** insert a single row into the table: "address_types" */
  insert_address_types_one: Maybe<Address_Types>;
  /** insert data into the table: "addresses" */
  insert_addresses: Maybe<Addresses_Mutation_Response>;
  /** insert a single row into the table: "addresses" */
  insert_addresses_one: Maybe<Addresses>;
  /** insert data into the table: "customer_onboardings" */
  insert_customer_onboardings: Maybe<Customer_Onboardings_Mutation_Response>;
  /** insert a single row into the table: "customer_onboardings" */
  insert_customer_onboardings_one: Maybe<Customer_Onboardings>;
  /** insert data into the table: "customers" */
  insert_customers: Maybe<Customers_Mutation_Response>;
  /** insert a single row into the table: "customers" */
  insert_customers_one: Maybe<Customers>;
  /** insert data into the table: "firebase_tokens" */
  insert_firebase_tokens: Maybe<Firebase_Tokens_Mutation_Response>;
  /** insert a single row into the table: "firebase_tokens" */
  insert_firebase_tokens_one: Maybe<Firebase_Tokens>;
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
  /** insert data into the table: "sessions" */
  insert_sessions: Maybe<Sessions_Mutation_Response>;
  /** insert a single row into the table: "sessions" */
  insert_sessions_one: Maybe<Sessions>;
  /** insert data into the table: "user_agents" */
  insert_user_agents: Maybe<User_Agents_Mutation_Response>;
  /** insert a single row into the table: "user_agents" */
  insert_user_agents_one: Maybe<User_Agents>;
  login: Maybe<LoginOutput>;
  /** update data of the table: "address_types" */
  update_address_types: Maybe<Address_Types_Mutation_Response>;
  /** update single row of the table: "address_types" */
  update_address_types_by_pk: Maybe<Address_Types>;
  /** update data of the table: "addresses" */
  update_addresses: Maybe<Addresses_Mutation_Response>;
  /** update single row of the table: "addresses" */
  update_addresses_by_pk: Maybe<Addresses>;
  /** update data of the table: "customer_onboardings" */
  update_customer_onboardings: Maybe<Customer_Onboardings_Mutation_Response>;
  /** update single row of the table: "customer_onboardings" */
  update_customer_onboardings_by_pk: Maybe<Customer_Onboardings>;
  /** update data of the table: "customers" */
  update_customers: Maybe<Customers_Mutation_Response>;
  /** update single row of the table: "customers" */
  update_customers_by_pk: Maybe<Customers>;
  /** update data of the table: "firebase_tokens" */
  update_firebase_tokens: Maybe<Firebase_Tokens_Mutation_Response>;
  /** update single row of the table: "firebase_tokens" */
  update_firebase_tokens_by_pk: Maybe<Firebase_Tokens>;
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
  /** update data of the table: "sessions" */
  update_sessions: Maybe<Sessions_Mutation_Response>;
  /** update single row of the table: "sessions" */
  update_sessions_by_pk: Maybe<Sessions>;
  /** update data of the table: "user_agents" */
  update_user_agents: Maybe<User_Agents_Mutation_Response>;
  /** update single row of the table: "user_agents" */
  update_user_agents_by_pk: Maybe<User_Agents>;
};


/** mutation root */
export type Mutation_RootDelete_Address_TypesArgs = {
  where: Address_Types_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Address_Types_By_PkArgs = {
  value: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_AddressesArgs = {
  where: Addresses_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Addresses_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Customer_OnboardingsArgs = {
  where: Customer_Onboardings_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Customer_Onboardings_By_PkArgs = {
  id: Scalars['uuid'];
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
export type Mutation_RootDelete_SessionsArgs = {
  where: Sessions_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Sessions_By_PkArgs = {
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
export type Mutation_RootInsert_Address_TypesArgs = {
  objects: Array<Address_Types_Insert_Input>;
  on_conflict: Maybe<Address_Types_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Address_Types_OneArgs = {
  object: Address_Types_Insert_Input;
  on_conflict: Maybe<Address_Types_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_AddressesArgs = {
  objects: Array<Addresses_Insert_Input>;
  on_conflict: Maybe<Addresses_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Addresses_OneArgs = {
  object: Addresses_Insert_Input;
  on_conflict: Maybe<Addresses_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Customer_OnboardingsArgs = {
  objects: Array<Customer_Onboardings_Insert_Input>;
  on_conflict: Maybe<Customer_Onboardings_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Customer_Onboardings_OneArgs = {
  object: Customer_Onboardings_Insert_Input;
  on_conflict: Maybe<Customer_Onboardings_On_Conflict>;
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
export type Mutation_RootInsert_SessionsArgs = {
  objects: Array<Sessions_Insert_Input>;
  on_conflict: Maybe<Sessions_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Sessions_OneArgs = {
  object: Sessions_Insert_Input;
  on_conflict: Maybe<Sessions_On_Conflict>;
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
export type Mutation_RootUpdate_Address_TypesArgs = {
  _set: Maybe<Address_Types_Set_Input>;
  where: Address_Types_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Address_Types_By_PkArgs = {
  _set: Maybe<Address_Types_Set_Input>;
  pk_columns: Address_Types_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_AddressesArgs = {
  _inc: Maybe<Addresses_Inc_Input>;
  _set: Maybe<Addresses_Set_Input>;
  where: Addresses_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Addresses_By_PkArgs = {
  _inc: Maybe<Addresses_Inc_Input>;
  _set: Maybe<Addresses_Set_Input>;
  pk_columns: Addresses_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Customer_OnboardingsArgs = {
  _set: Maybe<Customer_Onboardings_Set_Input>;
  where: Customer_Onboardings_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Customer_Onboardings_By_PkArgs = {
  _set: Maybe<Customer_Onboardings_Set_Input>;
  pk_columns: Customer_Onboardings_Pk_Columns_Input;
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
export type Mutation_RootUpdate_SessionsArgs = {
  _set: Maybe<Sessions_Set_Input>;
  where: Sessions_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Sessions_By_PkArgs = {
  _set: Maybe<Sessions_Set_Input>;
  pk_columns: Sessions_Pk_Columns_Input;
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
  /** fetch data from the table: "address_types" */
  address_types: Array<Address_Types>;
  /** fetch aggregated fields from the table: "address_types" */
  address_types_aggregate: Address_Types_Aggregate;
  /** fetch data from the table: "address_types" using primary key columns */
  address_types_by_pk: Maybe<Address_Types>;
  /** fetch data from the table: "addresses" */
  addresses: Array<Addresses>;
  /** fetch aggregated fields from the table: "addresses" */
  addresses_aggregate: Addresses_Aggregate;
  /** fetch data from the table: "addresses" using primary key columns */
  addresses_by_pk: Maybe<Addresses>;
  /** fetch data from the table: "customer_onboardings" */
  customer_onboardings: Array<Customer_Onboardings>;
  /** fetch aggregated fields from the table: "customer_onboardings" */
  customer_onboardings_aggregate: Customer_Onboardings_Aggregate;
  /** fetch data from the table: "customer_onboardings" using primary key columns */
  customer_onboardings_by_pk: Maybe<Customer_Onboardings>;
  /** fetch data from the table: "customers" */
  customers: Array<Customers>;
  /** fetch aggregated fields from the table: "customers" */
  customers_aggregate: Customers_Aggregate;
  /** fetch data from the table: "customers" using primary key columns */
  customers_by_pk: Maybe<Customers>;
  /** fetch data from the table: "firebase_tokens" */
  firebase_tokens: Array<Firebase_Tokens>;
  /** fetch aggregated fields from the table: "firebase_tokens" */
  firebase_tokens_aggregate: Firebase_Tokens_Aggregate;
  /** fetch data from the table: "firebase_tokens" using primary key columns */
  firebase_tokens_by_pk: Maybe<Firebase_Tokens>;
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
  /** An array relationship */
  personas: Array<Personas>;
  /** An aggregate relationship */
  personas_aggregate: Personas_Aggregate;
  /** fetch data from the table: "personas" using primary key columns */
  personas_by_pk: Maybe<Personas>;
  /** fetch data from the table: "sessions" */
  sessions: Array<Sessions>;
  /** An aggregate relationship */
  sessions_aggregate: Sessions_Aggregate;
  /** fetch data from the table: "sessions" using primary key columns */
  sessions_by_pk: Maybe<Sessions>;
  /** fetch data from the table: "user_agents" */
  user_agents: Array<User_Agents>;
  /** fetch aggregated fields from the table: "user_agents" */
  user_agents_aggregate: User_Agents_Aggregate;
  /** fetch data from the table: "user_agents" using primary key columns */
  user_agents_by_pk: Maybe<User_Agents>;
};


export type Query_RootAddress_TypesArgs = {
  distinct_on: Maybe<Array<Address_Types_Select_Column>>;
  limit: Maybe<Scalars['Int']>;
  offset: Maybe<Scalars['Int']>;
  order_by: Maybe<Array<Address_Types_Order_By>>;
  where: Maybe<Address_Types_Bool_Exp>;
};


export type Query_RootAddress_Types_AggregateArgs = {
  distinct_on: Maybe<Array<Address_Types_Select_Column>>;
  limit: Maybe<Scalars['Int']>;
  offset: Maybe<Scalars['Int']>;
  order_by: Maybe<Array<Address_Types_Order_By>>;
  where: Maybe<Address_Types_Bool_Exp>;
};


export type Query_RootAddress_Types_By_PkArgs = {
  value: Scalars['String'];
};


export type Query_RootAddressesArgs = {
  distinct_on: Maybe<Array<Addresses_Select_Column>>;
  limit: Maybe<Scalars['Int']>;
  offset: Maybe<Scalars['Int']>;
  order_by: Maybe<Array<Addresses_Order_By>>;
  where: Maybe<Addresses_Bool_Exp>;
};


export type Query_RootAddresses_AggregateArgs = {
  distinct_on: Maybe<Array<Addresses_Select_Column>>;
  limit: Maybe<Scalars['Int']>;
  offset: Maybe<Scalars['Int']>;
  order_by: Maybe<Array<Addresses_Order_By>>;
  where: Maybe<Addresses_Bool_Exp>;
};


export type Query_RootAddresses_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootCustomer_OnboardingsArgs = {
  distinct_on: Maybe<Array<Customer_Onboardings_Select_Column>>;
  limit: Maybe<Scalars['Int']>;
  offset: Maybe<Scalars['Int']>;
  order_by: Maybe<Array<Customer_Onboardings_Order_By>>;
  where: Maybe<Customer_Onboardings_Bool_Exp>;
};


export type Query_RootCustomer_Onboardings_AggregateArgs = {
  distinct_on: Maybe<Array<Customer_Onboardings_Select_Column>>;
  limit: Maybe<Scalars['Int']>;
  offset: Maybe<Scalars['Int']>;
  order_by: Maybe<Array<Customer_Onboardings_Order_By>>;
  where: Maybe<Customer_Onboardings_Bool_Exp>;
};


export type Query_RootCustomer_Onboardings_By_PkArgs = {
  id: Scalars['uuid'];
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


export type Query_RootSessionsArgs = {
  distinct_on: Maybe<Array<Sessions_Select_Column>>;
  limit: Maybe<Scalars['Int']>;
  offset: Maybe<Scalars['Int']>;
  order_by: Maybe<Array<Sessions_Order_By>>;
  where: Maybe<Sessions_Bool_Exp>;
};


export type Query_RootSessions_AggregateArgs = {
  distinct_on: Maybe<Array<Sessions_Select_Column>>;
  limit: Maybe<Scalars['Int']>;
  offset: Maybe<Scalars['Int']>;
  order_by: Maybe<Array<Sessions_Order_By>>;
  where: Maybe<Sessions_Bool_Exp>;
};


export type Query_RootSessions_By_PkArgs = {
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

/** columns and relationships of "sessions" */
export type Sessions = {
  __typename?: 'sessions';
  browser_or_device_id: Scalars['uuid'];
  created_at: Scalars['timestamptz'];
  customer_id: Maybe<Scalars['uuid']>;
  /** An object relationship */
  firebase_token: Maybe<Firebase_Tokens>;
  firebase_token_id: Maybe<Scalars['uuid']>;
  id: Scalars['uuid'];
  ip_address: Scalars['inet'];
  referrer_code: Maybe<Scalars['String']>;
  referrer_source: Maybe<Scalars['String']>;
  revoked: Scalars['Boolean'];
  token: Scalars['String'];
  url: Maybe<Scalars['String']>;
  /** An object relationship */
  user_agent: User_Agents;
  user_agent_id: Scalars['uuid'];
};

/** aggregated selection of "sessions" */
export type Sessions_Aggregate = {
  __typename?: 'sessions_aggregate';
  aggregate: Maybe<Sessions_Aggregate_Fields>;
  nodes: Array<Sessions>;
};

/** aggregate fields of "sessions" */
export type Sessions_Aggregate_Fields = {
  __typename?: 'sessions_aggregate_fields';
  count: Scalars['Int'];
  max: Maybe<Sessions_Max_Fields>;
  min: Maybe<Sessions_Min_Fields>;
};


/** aggregate fields of "sessions" */
export type Sessions_Aggregate_FieldsCountArgs = {
  columns: Maybe<Array<Sessions_Select_Column>>;
  distinct: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "sessions" */
export type Sessions_Aggregate_Order_By = {
  count: Maybe<Order_By>;
  max: Maybe<Sessions_Max_Order_By>;
  min: Maybe<Sessions_Min_Order_By>;
};

/** input type for inserting array relation for remote table "sessions" */
export type Sessions_Arr_Rel_Insert_Input = {
  data: Array<Sessions_Insert_Input>;
  /** on conflict condition */
  on_conflict: Maybe<Sessions_On_Conflict>;
};

/** Boolean expression to filter rows from the table "sessions". All fields are combined with a logical 'AND'. */
export type Sessions_Bool_Exp = {
  _and: Maybe<Array<Sessions_Bool_Exp>>;
  _not: Maybe<Sessions_Bool_Exp>;
  _or: Maybe<Array<Sessions_Bool_Exp>>;
  browser_or_device_id: Maybe<Uuid_Comparison_Exp>;
  created_at: Maybe<Timestamptz_Comparison_Exp>;
  customer_id: Maybe<Uuid_Comparison_Exp>;
  firebase_token: Maybe<Firebase_Tokens_Bool_Exp>;
  firebase_token_id: Maybe<Uuid_Comparison_Exp>;
  id: Maybe<Uuid_Comparison_Exp>;
  ip_address: Maybe<Inet_Comparison_Exp>;
  referrer_code: Maybe<String_Comparison_Exp>;
  referrer_source: Maybe<String_Comparison_Exp>;
  revoked: Maybe<Boolean_Comparison_Exp>;
  token: Maybe<String_Comparison_Exp>;
  url: Maybe<String_Comparison_Exp>;
  user_agent: Maybe<User_Agents_Bool_Exp>;
  user_agent_id: Maybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "sessions" */
export enum Sessions_Constraint {
  /** unique or primary key constraint */
  SessionsPkey = 'sessions_pkey',
  /** unique or primary key constraint */
  SessionsTokenKey = 'sessions_token_key'
}

/** input type for inserting data into table "sessions" */
export type Sessions_Insert_Input = {
  browser_or_device_id: Maybe<Scalars['uuid']>;
  created_at: Maybe<Scalars['timestamptz']>;
  customer_id: Maybe<Scalars['uuid']>;
  firebase_token: Maybe<Firebase_Tokens_Obj_Rel_Insert_Input>;
  firebase_token_id: Maybe<Scalars['uuid']>;
  id: Maybe<Scalars['uuid']>;
  ip_address: Maybe<Scalars['inet']>;
  referrer_code: Maybe<Scalars['String']>;
  referrer_source: Maybe<Scalars['String']>;
  revoked: Maybe<Scalars['Boolean']>;
  token: Maybe<Scalars['String']>;
  url: Maybe<Scalars['String']>;
  user_agent: Maybe<User_Agents_Obj_Rel_Insert_Input>;
  user_agent_id: Maybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type Sessions_Max_Fields = {
  __typename?: 'sessions_max_fields';
  browser_or_device_id: Maybe<Scalars['uuid']>;
  created_at: Maybe<Scalars['timestamptz']>;
  customer_id: Maybe<Scalars['uuid']>;
  firebase_token_id: Maybe<Scalars['uuid']>;
  id: Maybe<Scalars['uuid']>;
  referrer_code: Maybe<Scalars['String']>;
  referrer_source: Maybe<Scalars['String']>;
  token: Maybe<Scalars['String']>;
  url: Maybe<Scalars['String']>;
  user_agent_id: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "sessions" */
export type Sessions_Max_Order_By = {
  browser_or_device_id: Maybe<Order_By>;
  created_at: Maybe<Order_By>;
  customer_id: Maybe<Order_By>;
  firebase_token_id: Maybe<Order_By>;
  id: Maybe<Order_By>;
  referrer_code: Maybe<Order_By>;
  referrer_source: Maybe<Order_By>;
  token: Maybe<Order_By>;
  url: Maybe<Order_By>;
  user_agent_id: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Sessions_Min_Fields = {
  __typename?: 'sessions_min_fields';
  browser_or_device_id: Maybe<Scalars['uuid']>;
  created_at: Maybe<Scalars['timestamptz']>;
  customer_id: Maybe<Scalars['uuid']>;
  firebase_token_id: Maybe<Scalars['uuid']>;
  id: Maybe<Scalars['uuid']>;
  referrer_code: Maybe<Scalars['String']>;
  referrer_source: Maybe<Scalars['String']>;
  token: Maybe<Scalars['String']>;
  url: Maybe<Scalars['String']>;
  user_agent_id: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "sessions" */
export type Sessions_Min_Order_By = {
  browser_or_device_id: Maybe<Order_By>;
  created_at: Maybe<Order_By>;
  customer_id: Maybe<Order_By>;
  firebase_token_id: Maybe<Order_By>;
  id: Maybe<Order_By>;
  referrer_code: Maybe<Order_By>;
  referrer_source: Maybe<Order_By>;
  token: Maybe<Order_By>;
  url: Maybe<Order_By>;
  user_agent_id: Maybe<Order_By>;
};

/** response of any mutation on the table "sessions" */
export type Sessions_Mutation_Response = {
  __typename?: 'sessions_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Sessions>;
};

/** on conflict condition type for table "sessions" */
export type Sessions_On_Conflict = {
  constraint: Sessions_Constraint;
  update_columns: Array<Sessions_Update_Column>;
  where: Maybe<Sessions_Bool_Exp>;
};

/** Ordering options when selecting data from "sessions". */
export type Sessions_Order_By = {
  browser_or_device_id: Maybe<Order_By>;
  created_at: Maybe<Order_By>;
  customer_id: Maybe<Order_By>;
  firebase_token: Maybe<Firebase_Tokens_Order_By>;
  firebase_token_id: Maybe<Order_By>;
  id: Maybe<Order_By>;
  ip_address: Maybe<Order_By>;
  referrer_code: Maybe<Order_By>;
  referrer_source: Maybe<Order_By>;
  revoked: Maybe<Order_By>;
  token: Maybe<Order_By>;
  url: Maybe<Order_By>;
  user_agent: Maybe<User_Agents_Order_By>;
  user_agent_id: Maybe<Order_By>;
};

/** primary key columns input for table: sessions */
export type Sessions_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "sessions" */
export enum Sessions_Select_Column {
  /** column name */
  BrowserOrDeviceId = 'browser_or_device_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  CustomerId = 'customer_id',
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
  Revoked = 'revoked',
  /** column name */
  Token = 'token',
  /** column name */
  Url = 'url',
  /** column name */
  UserAgentId = 'user_agent_id'
}

/** input type for updating data in table "sessions" */
export type Sessions_Set_Input = {
  browser_or_device_id: Maybe<Scalars['uuid']>;
  created_at: Maybe<Scalars['timestamptz']>;
  customer_id: Maybe<Scalars['uuid']>;
  firebase_token_id: Maybe<Scalars['uuid']>;
  id: Maybe<Scalars['uuid']>;
  ip_address: Maybe<Scalars['inet']>;
  referrer_code: Maybe<Scalars['String']>;
  referrer_source: Maybe<Scalars['String']>;
  revoked: Maybe<Scalars['Boolean']>;
  token: Maybe<Scalars['String']>;
  url: Maybe<Scalars['String']>;
  user_agent_id: Maybe<Scalars['uuid']>;
};

/** update columns of table "sessions" */
export enum Sessions_Update_Column {
  /** column name */
  BrowserOrDeviceId = 'browser_or_device_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  CustomerId = 'customer_id',
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
  Revoked = 'revoked',
  /** column name */
  Token = 'token',
  /** column name */
  Url = 'url',
  /** column name */
  UserAgentId = 'user_agent_id'
}


/** Boolean expression to compare columns of type "smallint". All fields are combined with logical 'AND'. */
export type Smallint_Comparison_Exp = {
  _eq: Maybe<Scalars['smallint']>;
  _gt: Maybe<Scalars['smallint']>;
  _gte: Maybe<Scalars['smallint']>;
  _in: Maybe<Array<Scalars['smallint']>>;
  _is_null: Maybe<Scalars['Boolean']>;
  _lt: Maybe<Scalars['smallint']>;
  _lte: Maybe<Scalars['smallint']>;
  _neq: Maybe<Scalars['smallint']>;
  _nin: Maybe<Array<Scalars['smallint']>>;
};

export type Subscription_Root = {
  __typename?: 'subscription_root';
  /** fetch data from the table: "address_types" */
  address_types: Array<Address_Types>;
  /** fetch aggregated fields from the table: "address_types" */
  address_types_aggregate: Address_Types_Aggregate;
  /** fetch data from the table: "address_types" using primary key columns */
  address_types_by_pk: Maybe<Address_Types>;
  /** fetch data from the table: "addresses" */
  addresses: Array<Addresses>;
  /** fetch aggregated fields from the table: "addresses" */
  addresses_aggregate: Addresses_Aggregate;
  /** fetch data from the table: "addresses" using primary key columns */
  addresses_by_pk: Maybe<Addresses>;
  /** fetch data from the table: "customer_onboardings" */
  customer_onboardings: Array<Customer_Onboardings>;
  /** fetch aggregated fields from the table: "customer_onboardings" */
  customer_onboardings_aggregate: Customer_Onboardings_Aggregate;
  /** fetch data from the table: "customer_onboardings" using primary key columns */
  customer_onboardings_by_pk: Maybe<Customer_Onboardings>;
  /** fetch data from the table: "customers" */
  customers: Array<Customers>;
  /** fetch aggregated fields from the table: "customers" */
  customers_aggregate: Customers_Aggregate;
  /** fetch data from the table: "customers" using primary key columns */
  customers_by_pk: Maybe<Customers>;
  /** fetch data from the table: "firebase_tokens" */
  firebase_tokens: Array<Firebase_Tokens>;
  /** fetch aggregated fields from the table: "firebase_tokens" */
  firebase_tokens_aggregate: Firebase_Tokens_Aggregate;
  /** fetch data from the table: "firebase_tokens" using primary key columns */
  firebase_tokens_by_pk: Maybe<Firebase_Tokens>;
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
  /** An array relationship */
  personas: Array<Personas>;
  /** An aggregate relationship */
  personas_aggregate: Personas_Aggregate;
  /** fetch data from the table: "personas" using primary key columns */
  personas_by_pk: Maybe<Personas>;
  /** fetch data from the table: "sessions" */
  sessions: Array<Sessions>;
  /** An aggregate relationship */
  sessions_aggregate: Sessions_Aggregate;
  /** fetch data from the table: "sessions" using primary key columns */
  sessions_by_pk: Maybe<Sessions>;
  /** fetch data from the table: "user_agents" */
  user_agents: Array<User_Agents>;
  /** fetch aggregated fields from the table: "user_agents" */
  user_agents_aggregate: User_Agents_Aggregate;
  /** fetch data from the table: "user_agents" using primary key columns */
  user_agents_by_pk: Maybe<User_Agents>;
};


export type Subscription_RootAddress_TypesArgs = {
  distinct_on: Maybe<Array<Address_Types_Select_Column>>;
  limit: Maybe<Scalars['Int']>;
  offset: Maybe<Scalars['Int']>;
  order_by: Maybe<Array<Address_Types_Order_By>>;
  where: Maybe<Address_Types_Bool_Exp>;
};


export type Subscription_RootAddress_Types_AggregateArgs = {
  distinct_on: Maybe<Array<Address_Types_Select_Column>>;
  limit: Maybe<Scalars['Int']>;
  offset: Maybe<Scalars['Int']>;
  order_by: Maybe<Array<Address_Types_Order_By>>;
  where: Maybe<Address_Types_Bool_Exp>;
};


export type Subscription_RootAddress_Types_By_PkArgs = {
  value: Scalars['String'];
};


export type Subscription_RootAddressesArgs = {
  distinct_on: Maybe<Array<Addresses_Select_Column>>;
  limit: Maybe<Scalars['Int']>;
  offset: Maybe<Scalars['Int']>;
  order_by: Maybe<Array<Addresses_Order_By>>;
  where: Maybe<Addresses_Bool_Exp>;
};


export type Subscription_RootAddresses_AggregateArgs = {
  distinct_on: Maybe<Array<Addresses_Select_Column>>;
  limit: Maybe<Scalars['Int']>;
  offset: Maybe<Scalars['Int']>;
  order_by: Maybe<Array<Addresses_Order_By>>;
  where: Maybe<Addresses_Bool_Exp>;
};


export type Subscription_RootAddresses_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootCustomer_OnboardingsArgs = {
  distinct_on: Maybe<Array<Customer_Onboardings_Select_Column>>;
  limit: Maybe<Scalars['Int']>;
  offset: Maybe<Scalars['Int']>;
  order_by: Maybe<Array<Customer_Onboardings_Order_By>>;
  where: Maybe<Customer_Onboardings_Bool_Exp>;
};


export type Subscription_RootCustomer_Onboardings_AggregateArgs = {
  distinct_on: Maybe<Array<Customer_Onboardings_Select_Column>>;
  limit: Maybe<Scalars['Int']>;
  offset: Maybe<Scalars['Int']>;
  order_by: Maybe<Array<Customer_Onboardings_Order_By>>;
  where: Maybe<Customer_Onboardings_Bool_Exp>;
};


export type Subscription_RootCustomer_Onboardings_By_PkArgs = {
  id: Scalars['uuid'];
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


export type Subscription_RootSessionsArgs = {
  distinct_on: Maybe<Array<Sessions_Select_Column>>;
  limit: Maybe<Scalars['Int']>;
  offset: Maybe<Scalars['Int']>;
  order_by: Maybe<Array<Sessions_Order_By>>;
  where: Maybe<Sessions_Bool_Exp>;
};


export type Subscription_RootSessions_AggregateArgs = {
  distinct_on: Maybe<Array<Sessions_Select_Column>>;
  limit: Maybe<Scalars['Int']>;
  offset: Maybe<Scalars['Int']>;
  order_by: Maybe<Array<Sessions_Order_By>>;
  where: Maybe<Sessions_Bool_Exp>;
};


export type Subscription_RootSessions_By_PkArgs = {
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
  last_logged_in_at: Scalars['timestamptz'];
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
  last_logged_in_at: Maybe<Timestamptz_Comparison_Exp>;
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
  last_logged_in_at: Maybe<Scalars['timestamptz']>;
  user_agent: Maybe<Scalars['String']>;
};

/** aggregate max on columns */
export type User_Agents_Max_Fields = {
  __typename?: 'user_agents_max_fields';
  id: Maybe<Scalars['uuid']>;
  last_logged_in_at: Maybe<Scalars['timestamptz']>;
  user_agent: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type User_Agents_Min_Fields = {
  __typename?: 'user_agents_min_fields';
  id: Maybe<Scalars['uuid']>;
  last_logged_in_at: Maybe<Scalars['timestamptz']>;
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
  last_logged_in_at: Maybe<Order_By>;
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
  LastLoggedInAt = 'last_logged_in_at',
  /** column name */
  UserAgent = 'user_agent'
}

/** input type for updating data in table "user_agents" */
export type User_Agents_Set_Input = {
  id: Maybe<Scalars['uuid']>;
  last_logged_in_at: Maybe<Scalars['timestamptz']>;
  user_agent: Maybe<Scalars['String']>;
};

/** update columns of table "user_agents" */
export enum User_Agents_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  LastLoggedInAt = 'last_logged_in_at',
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

export type PersistOnboardingDataMutationVariables = Exact<{
  data?: Maybe<Customer_Onboardings_Insert_Input>;
}>;


export type PersistOnboardingDataMutation = (
  { __typename?: 'mutation_root' }
  & { insert_customer_onboardings_one: Maybe<(
    { __typename?: 'customer_onboardings' }
    & Pick<Customer_Onboardings, 'id' | 'address_handle' | 'address_type' | 'introduction_letter_date' | 'introduction_letter_editor_state' | 'introduction_letter_extra_recipients' | 'introduction_letter_time' | 'introduction_letter_url_slug' | 'persona_name' | 'persona_photo_url' | 'skip_onboarding_redirect_on_login' | 'updated_at'>
  )> }
);

export type GetPersistedOnboardingDataQueryVariables = Exact<{
  customer_id: Scalars['uuid'];
}>;


export type GetPersistedOnboardingDataQuery = (
  { __typename?: 'query_root' }
  & { customer_onboardings_by_pk: Maybe<(
    { __typename?: 'customer_onboardings' }
    & Pick<Customer_Onboardings, 'id' | 'address_handle' | 'address_type' | 'introduction_letter_date' | 'introduction_letter_editor_state' | 'introduction_letter_extra_recipients' | 'introduction_letter_time' | 'introduction_letter_url_slug' | 'persona_name' | 'persona_photo_url' | 'skip_onboarding_redirect_on_login' | 'updated_at'>
  )> }
);

export type CustomerIdentityFragment = (
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

export type LoginMutationVariables = Exact<{ [key: string]: never; }>;


export type LoginMutation = (
  { __typename?: 'mutation_root' }
  & { login: Maybe<(
    { __typename?: 'LoginOutput' }
    & Pick<LoginOutput, 'session_token'>
    & { customer: (
      { __typename?: 'customers' }
      & CustomerIdentityFragment
    ) }
  )> }
);

export type CustomerIdentityByIdQueryVariables = Exact<{
  customerId: Scalars['uuid'];
}>;


export type CustomerIdentityByIdQuery = (
  { __typename?: 'query_root' }
  & { customer: Maybe<(
    { __typename?: 'customers' }
    & CustomerIdentityFragment
  )> }
);

export const CustomerIdentityFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"customerIdentity"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"customers"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"contact_name"}},{"kind":"Field","name":{"kind":"Name","value":"membership"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"active_until"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"lifetime"}},{"kind":"Field","name":{"kind":"Name","value":"sabbatical_available_until"}}]}},{"kind":"Field","name":{"kind":"Name","value":"personas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"list_address_with_byline"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"photo_url"}},{"kind":"Field","name":{"kind":"Name","value":"preferred_broadcast_time"}}]}},{"kind":"Field","name":{"kind":"Name","value":"unverified_email"}},{"kind":"Field","name":{"kind":"Name","value":"verified_email"}}]}}]} as unknown as DocumentNode<CustomerIdentityFragment, unknown>;
export const PersistOnboardingDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PersistOnboardingData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"customer_onboardings_insert_input"}},"defaultValue":{"kind":"ObjectValue","fields":[]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insert_customer_onboardings_one"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"object"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}},{"kind":"Argument","name":{"kind":"Name","value":"on_conflict"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"constraint"},"value":{"kind":"EnumValue","value":"customer_onboardings_pkey"}},{"kind":"ObjectField","name":{"kind":"Name","value":"update_columns"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"address_handle"},{"kind":"EnumValue","value":"address_type"},{"kind":"EnumValue","value":"introduction_letter_date"},{"kind":"EnumValue","value":"introduction_letter_editor_state"},{"kind":"EnumValue","value":"introduction_letter_extra_recipients"},{"kind":"EnumValue","value":"introduction_letter_time"},{"kind":"EnumValue","value":"introduction_letter_url_slug"},{"kind":"EnumValue","value":"persona_name"},{"kind":"EnumValue","value":"persona_photo_url"},{"kind":"EnumValue","value":"skip_onboarding_redirect_on_login"},{"kind":"EnumValue","value":"updated_at"}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"address_handle"}},{"kind":"Field","name":{"kind":"Name","value":"address_type"}},{"kind":"Field","name":{"kind":"Name","value":"introduction_letter_date"}},{"kind":"Field","name":{"kind":"Name","value":"introduction_letter_editor_state"}},{"kind":"Field","name":{"kind":"Name","value":"introduction_letter_extra_recipients"}},{"kind":"Field","name":{"kind":"Name","value":"introduction_letter_time"}},{"kind":"Field","name":{"kind":"Name","value":"introduction_letter_url_slug"}},{"kind":"Field","name":{"kind":"Name","value":"persona_name"}},{"kind":"Field","name":{"kind":"Name","value":"persona_photo_url"}},{"kind":"Field","name":{"kind":"Name","value":"skip_onboarding_redirect_on_login"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]}}]} as unknown as DocumentNode<PersistOnboardingDataMutation, PersistOnboardingDataMutationVariables>;
export const GetPersistedOnboardingDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPersistedOnboardingData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"customer_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customer_onboardings_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"customer_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"address_handle"}},{"kind":"Field","name":{"kind":"Name","value":"address_type"}},{"kind":"Field","name":{"kind":"Name","value":"introduction_letter_date"}},{"kind":"Field","name":{"kind":"Name","value":"introduction_letter_editor_state"}},{"kind":"Field","name":{"kind":"Name","value":"introduction_letter_extra_recipients"}},{"kind":"Field","name":{"kind":"Name","value":"introduction_letter_time"}},{"kind":"Field","name":{"kind":"Name","value":"introduction_letter_url_slug"}},{"kind":"Field","name":{"kind":"Name","value":"persona_name"}},{"kind":"Field","name":{"kind":"Name","value":"persona_photo_url"}},{"kind":"Field","name":{"kind":"Name","value":"skip_onboarding_redirect_on_login"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]}}]} as unknown as DocumentNode<GetPersistedOnboardingDataQuery, GetPersistedOnboardingDataQueryVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"session_token"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"customerIdentity"}}]}}]}}]}},...CustomerIdentityFragmentDoc.definitions]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const CustomerIdentityByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CustomerIdentityById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"customerId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"customer"},"name":{"kind":"Name","value":"customers_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"customerId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"customerIdentity"}}]}}]}},...CustomerIdentityFragmentDoc.definitions]} as unknown as DocumentNode<CustomerIdentityByIdQuery, CustomerIdentityByIdQueryVariables>;