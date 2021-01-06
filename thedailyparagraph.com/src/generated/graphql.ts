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
  json: any;
  timestamp: any;
  uuid: any;
};

/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export type Boolean_Comparison_Exp = {
  _eq?: Maybe<Scalars['Boolean']>;
  _gt?: Maybe<Scalars['Boolean']>;
  _gte?: Maybe<Scalars['Boolean']>;
  _in?: Maybe<Array<Scalars['Boolean']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['Boolean']>;
  _lte?: Maybe<Scalars['Boolean']>;
  _neq?: Maybe<Scalars['Boolean']>;
  _nin?: Maybe<Array<Scalars['Boolean']>>;
};

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
  _eq?: Maybe<Scalars['Int']>;
  _gt?: Maybe<Scalars['Int']>;
  _gte?: Maybe<Scalars['Int']>;
  _in?: Maybe<Array<Scalars['Int']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['Int']>;
  _lte?: Maybe<Scalars['Int']>;
  _neq?: Maybe<Scalars['Int']>;
  _nin?: Maybe<Array<Scalars['Int']>>;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: Maybe<Scalars['String']>;
  _gt?: Maybe<Scalars['String']>;
  _gte?: Maybe<Scalars['String']>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: Maybe<Scalars['String']>;
  _in?: Maybe<Array<Scalars['String']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  /** does the column match the given pattern */
  _like?: Maybe<Scalars['String']>;
  _lt?: Maybe<Scalars['String']>;
  _lte?: Maybe<Scalars['String']>;
  _neq?: Maybe<Scalars['String']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: Maybe<Scalars['String']>;
  _nin?: Maybe<Array<Scalars['String']>>;
  /** does the column NOT match the given pattern */
  _nlike?: Maybe<Scalars['String']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: Maybe<Scalars['String']>;
  /** does the column match the given SQL regular expression */
  _similar?: Maybe<Scalars['String']>;
};


/** Boolean expression to compare columns of type "json". All fields are combined with logical 'AND'. */
export type Json_Comparison_Exp = {
  _eq?: Maybe<Scalars['json']>;
  _gt?: Maybe<Scalars['json']>;
  _gte?: Maybe<Scalars['json']>;
  _in?: Maybe<Array<Scalars['json']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['json']>;
  _lte?: Maybe<Scalars['json']>;
  _neq?: Maybe<Scalars['json']>;
  _nin?: Maybe<Array<Scalars['json']>>;
};

/** columns and relationships of "members" */
export type Members = {
  __typename?: 'members';
  created_at: Scalars['timestamp'];
  firebase_uid: Scalars['String'];
  id: Scalars['uuid'];
  /** An object relationship */
  profile: Profiles;
  profile_id?: Maybe<Scalars['uuid']>;
};

/** aggregated selection of "members" */
export type Members_Aggregate = {
  __typename?: 'members_aggregate';
  aggregate?: Maybe<Members_Aggregate_Fields>;
  nodes: Array<Members>;
};

/** aggregate fields of "members" */
export type Members_Aggregate_Fields = {
  __typename?: 'members_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Members_Max_Fields>;
  min?: Maybe<Members_Min_Fields>;
};


/** aggregate fields of "members" */
export type Members_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Members_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "members". All fields are combined with a logical 'AND'. */
export type Members_Bool_Exp = {
  _and?: Maybe<Array<Members_Bool_Exp>>;
  _not?: Maybe<Members_Bool_Exp>;
  _or?: Maybe<Array<Members_Bool_Exp>>;
  created_at?: Maybe<Timestamp_Comparison_Exp>;
  firebase_uid?: Maybe<String_Comparison_Exp>;
  id?: Maybe<Uuid_Comparison_Exp>;
  profile?: Maybe<Profiles_Bool_Exp>;
  profile_id?: Maybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "members" */
export enum Members_Constraint {
  /** unique or primary key constraint */
  MembersFirebaseUidKey = 'members_firebase_uid_key',
  /** unique or primary key constraint */
  MembersPkey = 'members_pkey',
  /** unique or primary key constraint */
  MembersProfileIdKey = 'members_profile_id_key'
}

/** input type for inserting data into table "members" */
export type Members_Insert_Input = {
  created_at?: Maybe<Scalars['timestamp']>;
  firebase_uid?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  profile?: Maybe<Profiles_Obj_Rel_Insert_Input>;
  profile_id?: Maybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type Members_Max_Fields = {
  __typename?: 'members_max_fields';
  created_at?: Maybe<Scalars['timestamp']>;
  firebase_uid?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  profile_id?: Maybe<Scalars['uuid']>;
};

/** aggregate min on columns */
export type Members_Min_Fields = {
  __typename?: 'members_min_fields';
  created_at?: Maybe<Scalars['timestamp']>;
  firebase_uid?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  profile_id?: Maybe<Scalars['uuid']>;
};

/** response of any mutation on the table "members" */
export type Members_Mutation_Response = {
  __typename?: 'members_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Members>;
};

/** input type for inserting object relation for remote table "members" */
export type Members_Obj_Rel_Insert_Input = {
  data: Members_Insert_Input;
  /** on conflict condition */
  on_conflict?: Maybe<Members_On_Conflict>;
};

/** on conflict condition type for table "members" */
export type Members_On_Conflict = {
  constraint: Members_Constraint;
  update_columns: Array<Members_Update_Column>;
  where?: Maybe<Members_Bool_Exp>;
};

/** Ordering options when selecting data from "members". */
export type Members_Order_By = {
  created_at?: Maybe<Order_By>;
  firebase_uid?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  profile?: Maybe<Profiles_Order_By>;
  profile_id?: Maybe<Order_By>;
};

/** primary key columns input for table: members */
export type Members_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "members" */
export enum Members_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  FirebaseUid = 'firebase_uid',
  /** column name */
  Id = 'id',
  /** column name */
  ProfileId = 'profile_id'
}

/** input type for updating data in table "members" */
export type Members_Set_Input = {
  created_at?: Maybe<Scalars['timestamp']>;
  firebase_uid?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  profile_id?: Maybe<Scalars['uuid']>;
};

/** update columns of table "members" */
export enum Members_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  FirebaseUid = 'firebase_uid',
  /** column name */
  Id = 'id',
  /** column name */
  ProfileId = 'profile_id'
}

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root';
  /** delete data from the table: "members" */
  delete_members?: Maybe<Members_Mutation_Response>;
  /** delete single row from the table: "members" */
  delete_members_by_pk?: Maybe<Members>;
  /** delete data from the table: "post_versions" */
  delete_post_versions?: Maybe<Post_Versions_Mutation_Response>;
  /** delete single row from the table: "post_versions" */
  delete_post_versions_by_pk?: Maybe<Post_Versions>;
  /** delete data from the table: "posts" */
  delete_posts?: Maybe<Posts_Mutation_Response>;
  /** delete single row from the table: "posts" */
  delete_posts_by_pk?: Maybe<Posts>;
  /** delete data from the table: "profiles" */
  delete_profiles?: Maybe<Profiles_Mutation_Response>;
  /** delete single row from the table: "profiles" */
  delete_profiles_by_pk?: Maybe<Profiles>;
  /** insert data into the table: "members" */
  insert_members?: Maybe<Members_Mutation_Response>;
  /** insert a single row into the table: "members" */
  insert_members_one?: Maybe<Members>;
  /** insert data into the table: "post_versions" */
  insert_post_versions?: Maybe<Post_Versions_Mutation_Response>;
  /** insert a single row into the table: "post_versions" */
  insert_post_versions_one?: Maybe<Post_Versions>;
  /** insert data into the table: "posts" */
  insert_posts?: Maybe<Posts_Mutation_Response>;
  /** insert a single row into the table: "posts" */
  insert_posts_one?: Maybe<Posts>;
  /** insert data into the table: "profiles" */
  insert_profiles?: Maybe<Profiles_Mutation_Response>;
  /** insert a single row into the table: "profiles" */
  insert_profiles_one?: Maybe<Profiles>;
  /** update data of the table: "members" */
  update_members?: Maybe<Members_Mutation_Response>;
  /** update single row of the table: "members" */
  update_members_by_pk?: Maybe<Members>;
  /** update data of the table: "post_versions" */
  update_post_versions?: Maybe<Post_Versions_Mutation_Response>;
  /** update single row of the table: "post_versions" */
  update_post_versions_by_pk?: Maybe<Post_Versions>;
  /** update data of the table: "posts" */
  update_posts?: Maybe<Posts_Mutation_Response>;
  /** update single row of the table: "posts" */
  update_posts_by_pk?: Maybe<Posts>;
  /** update data of the table: "profiles" */
  update_profiles?: Maybe<Profiles_Mutation_Response>;
  /** update single row of the table: "profiles" */
  update_profiles_by_pk?: Maybe<Profiles>;
};


/** mutation root */
export type Mutation_RootDelete_MembersArgs = {
  where: Members_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Members_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Post_VersionsArgs = {
  where: Post_Versions_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Post_Versions_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_PostsArgs = {
  where: Posts_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Posts_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_ProfilesArgs = {
  where: Profiles_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Profiles_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootInsert_MembersArgs = {
  objects: Array<Members_Insert_Input>;
  on_conflict?: Maybe<Members_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Members_OneArgs = {
  object: Members_Insert_Input;
  on_conflict?: Maybe<Members_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Post_VersionsArgs = {
  objects: Array<Post_Versions_Insert_Input>;
  on_conflict?: Maybe<Post_Versions_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Post_Versions_OneArgs = {
  object: Post_Versions_Insert_Input;
  on_conflict?: Maybe<Post_Versions_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_PostsArgs = {
  objects: Array<Posts_Insert_Input>;
  on_conflict?: Maybe<Posts_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Posts_OneArgs = {
  object: Posts_Insert_Input;
  on_conflict?: Maybe<Posts_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_ProfilesArgs = {
  objects: Array<Profiles_Insert_Input>;
  on_conflict?: Maybe<Profiles_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Profiles_OneArgs = {
  object: Profiles_Insert_Input;
  on_conflict?: Maybe<Profiles_On_Conflict>;
};


/** mutation root */
export type Mutation_RootUpdate_MembersArgs = {
  _set?: Maybe<Members_Set_Input>;
  where: Members_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Members_By_PkArgs = {
  _set?: Maybe<Members_Set_Input>;
  pk_columns: Members_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Post_VersionsArgs = {
  _set?: Maybe<Post_Versions_Set_Input>;
  where: Post_Versions_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Post_Versions_By_PkArgs = {
  _set?: Maybe<Post_Versions_Set_Input>;
  pk_columns: Post_Versions_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_PostsArgs = {
  _inc?: Maybe<Posts_Inc_Input>;
  _set?: Maybe<Posts_Set_Input>;
  where: Posts_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Posts_By_PkArgs = {
  _inc?: Maybe<Posts_Inc_Input>;
  _set?: Maybe<Posts_Set_Input>;
  pk_columns: Posts_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_ProfilesArgs = {
  _set?: Maybe<Profiles_Set_Input>;
  where: Profiles_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Profiles_By_PkArgs = {
  _set?: Maybe<Profiles_Set_Input>;
  pk_columns: Profiles_Pk_Columns_Input;
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

/** columns and relationships of "post_versions" */
export type Post_Versions = {
  __typename?: 'post_versions';
  content?: Maybe<Scalars['json']>;
  created_at: Scalars['timestamp'];
  editor_state?: Maybe<Scalars['json']>;
  id: Scalars['uuid'];
  is_draft?: Maybe<Scalars['Boolean']>;
  locked_for_publication: Scalars['Boolean'];
  /** An object relationship */
  post: Posts;
  post_id: Scalars['uuid'];
  slug: Scalars['String'];
  title: Scalars['String'];
  updated_at: Scalars['timestamp'];
};


/** columns and relationships of "post_versions" */
export type Post_VersionsContentArgs = {
  path?: Maybe<Scalars['String']>;
};


/** columns and relationships of "post_versions" */
export type Post_VersionsEditor_StateArgs = {
  path?: Maybe<Scalars['String']>;
};

/** aggregated selection of "post_versions" */
export type Post_Versions_Aggregate = {
  __typename?: 'post_versions_aggregate';
  aggregate?: Maybe<Post_Versions_Aggregate_Fields>;
  nodes: Array<Post_Versions>;
};

/** aggregate fields of "post_versions" */
export type Post_Versions_Aggregate_Fields = {
  __typename?: 'post_versions_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Post_Versions_Max_Fields>;
  min?: Maybe<Post_Versions_Min_Fields>;
};


/** aggregate fields of "post_versions" */
export type Post_Versions_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Post_Versions_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "post_versions" */
export type Post_Versions_Aggregate_Order_By = {
  count?: Maybe<Order_By>;
  max?: Maybe<Post_Versions_Max_Order_By>;
  min?: Maybe<Post_Versions_Min_Order_By>;
};

/** input type for inserting array relation for remote table "post_versions" */
export type Post_Versions_Arr_Rel_Insert_Input = {
  data: Array<Post_Versions_Insert_Input>;
  /** on conflict condition */
  on_conflict?: Maybe<Post_Versions_On_Conflict>;
};

/** Boolean expression to filter rows from the table "post_versions". All fields are combined with a logical 'AND'. */
export type Post_Versions_Bool_Exp = {
  _and?: Maybe<Array<Post_Versions_Bool_Exp>>;
  _not?: Maybe<Post_Versions_Bool_Exp>;
  _or?: Maybe<Array<Post_Versions_Bool_Exp>>;
  content?: Maybe<Json_Comparison_Exp>;
  created_at?: Maybe<Timestamp_Comparison_Exp>;
  editor_state?: Maybe<Json_Comparison_Exp>;
  id?: Maybe<Uuid_Comparison_Exp>;
  is_draft?: Maybe<Boolean_Comparison_Exp>;
  locked_for_publication?: Maybe<Boolean_Comparison_Exp>;
  post?: Maybe<Posts_Bool_Exp>;
  post_id?: Maybe<Uuid_Comparison_Exp>;
  slug?: Maybe<String_Comparison_Exp>;
  title?: Maybe<String_Comparison_Exp>;
  updated_at?: Maybe<Timestamp_Comparison_Exp>;
};

/** unique or primary key constraints on table "post_versions" */
export enum Post_Versions_Constraint {
  /** unique or primary key constraint */
  PostVersionSlugs = 'post_version_slugs',
  /** unique or primary key constraint */
  PostVersionsLockedForPublication = 'post_versions_locked_for_publication',
  /** unique or primary key constraint */
  PostVersionsPkey = 'post_versions_pkey'
}

/** input type for inserting data into table "post_versions" */
export type Post_Versions_Insert_Input = {
  content?: Maybe<Scalars['json']>;
  created_at?: Maybe<Scalars['timestamp']>;
  editor_state?: Maybe<Scalars['json']>;
  id?: Maybe<Scalars['uuid']>;
  is_draft?: Maybe<Scalars['Boolean']>;
  locked_for_publication?: Maybe<Scalars['Boolean']>;
  post?: Maybe<Posts_Obj_Rel_Insert_Input>;
  post_id?: Maybe<Scalars['uuid']>;
  slug?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
};

/** aggregate max on columns */
export type Post_Versions_Max_Fields = {
  __typename?: 'post_versions_max_fields';
  created_at?: Maybe<Scalars['timestamp']>;
  id?: Maybe<Scalars['uuid']>;
  post_id?: Maybe<Scalars['uuid']>;
  slug?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
};

/** order by max() on columns of table "post_versions" */
export type Post_Versions_Max_Order_By = {
  created_at?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  post_id?: Maybe<Order_By>;
  slug?: Maybe<Order_By>;
  title?: Maybe<Order_By>;
  updated_at?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Post_Versions_Min_Fields = {
  __typename?: 'post_versions_min_fields';
  created_at?: Maybe<Scalars['timestamp']>;
  id?: Maybe<Scalars['uuid']>;
  post_id?: Maybe<Scalars['uuid']>;
  slug?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
};

/** order by min() on columns of table "post_versions" */
export type Post_Versions_Min_Order_By = {
  created_at?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  post_id?: Maybe<Order_By>;
  slug?: Maybe<Order_By>;
  title?: Maybe<Order_By>;
  updated_at?: Maybe<Order_By>;
};

/** response of any mutation on the table "post_versions" */
export type Post_Versions_Mutation_Response = {
  __typename?: 'post_versions_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Post_Versions>;
};

/** on conflict condition type for table "post_versions" */
export type Post_Versions_On_Conflict = {
  constraint: Post_Versions_Constraint;
  update_columns: Array<Post_Versions_Update_Column>;
  where?: Maybe<Post_Versions_Bool_Exp>;
};

/** Ordering options when selecting data from "post_versions". */
export type Post_Versions_Order_By = {
  content?: Maybe<Order_By>;
  created_at?: Maybe<Order_By>;
  editor_state?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  is_draft?: Maybe<Order_By>;
  locked_for_publication?: Maybe<Order_By>;
  post?: Maybe<Posts_Order_By>;
  post_id?: Maybe<Order_By>;
  slug?: Maybe<Order_By>;
  title?: Maybe<Order_By>;
  updated_at?: Maybe<Order_By>;
};

/** primary key columns input for table: post_versions */
export type Post_Versions_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "post_versions" */
export enum Post_Versions_Select_Column {
  /** column name */
  Content = 'content',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  EditorState = 'editor_state',
  /** column name */
  Id = 'id',
  /** column name */
  IsDraft = 'is_draft',
  /** column name */
  LockedForPublication = 'locked_for_publication',
  /** column name */
  PostId = 'post_id',
  /** column name */
  Slug = 'slug',
  /** column name */
  Title = 'title',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "post_versions" */
export type Post_Versions_Set_Input = {
  content?: Maybe<Scalars['json']>;
  created_at?: Maybe<Scalars['timestamp']>;
  editor_state?: Maybe<Scalars['json']>;
  id?: Maybe<Scalars['uuid']>;
  is_draft?: Maybe<Scalars['Boolean']>;
  locked_for_publication?: Maybe<Scalars['Boolean']>;
  post_id?: Maybe<Scalars['uuid']>;
  slug?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
};

/** update columns of table "post_versions" */
export enum Post_Versions_Update_Column {
  /** column name */
  Content = 'content',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  EditorState = 'editor_state',
  /** column name */
  Id = 'id',
  /** column name */
  IsDraft = 'is_draft',
  /** column name */
  LockedForPublication = 'locked_for_publication',
  /** column name */
  PostId = 'post_id',
  /** column name */
  Slug = 'slug',
  /** column name */
  Title = 'title',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** columns and relationships of "posts" */
export type Posts = {
  __typename?: 'posts';
  created_at: Scalars['timestamp'];
  deleted_at?: Maybe<Scalars['timestamp']>;
  id: Scalars['uuid'];
  latest_version_id?: Maybe<Scalars['uuid']>;
  latest_version_locked_for_publication?: Maybe<Scalars['Boolean']>;
  latest_version_slug?: Maybe<Scalars['String']>;
  /** An array relationship */
  post_versions: Array<Post_Versions>;
  /** An aggregate relationship */
  post_versions_aggregate: Post_Versions_Aggregate;
  /** An object relationship */
  profile: Profiles;
  profile_id: Scalars['uuid'];
  published_at?: Maybe<Scalars['timestamp']>;
  ranking?: Maybe<Scalars['Int']>;
};


/** columns and relationships of "posts" */
export type PostsPost_VersionsArgs = {
  distinct_on?: Maybe<Array<Post_Versions_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Post_Versions_Order_By>>;
  where?: Maybe<Post_Versions_Bool_Exp>;
};


/** columns and relationships of "posts" */
export type PostsPost_Versions_AggregateArgs = {
  distinct_on?: Maybe<Array<Post_Versions_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Post_Versions_Order_By>>;
  where?: Maybe<Post_Versions_Bool_Exp>;
};

/** aggregated selection of "posts" */
export type Posts_Aggregate = {
  __typename?: 'posts_aggregate';
  aggregate?: Maybe<Posts_Aggregate_Fields>;
  nodes: Array<Posts>;
};

/** aggregate fields of "posts" */
export type Posts_Aggregate_Fields = {
  __typename?: 'posts_aggregate_fields';
  avg?: Maybe<Posts_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Posts_Max_Fields>;
  min?: Maybe<Posts_Min_Fields>;
  stddev?: Maybe<Posts_Stddev_Fields>;
  stddev_pop?: Maybe<Posts_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Posts_Stddev_Samp_Fields>;
  sum?: Maybe<Posts_Sum_Fields>;
  var_pop?: Maybe<Posts_Var_Pop_Fields>;
  var_samp?: Maybe<Posts_Var_Samp_Fields>;
  variance?: Maybe<Posts_Variance_Fields>;
};


/** aggregate fields of "posts" */
export type Posts_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Posts_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "posts" */
export type Posts_Aggregate_Order_By = {
  avg?: Maybe<Posts_Avg_Order_By>;
  count?: Maybe<Order_By>;
  max?: Maybe<Posts_Max_Order_By>;
  min?: Maybe<Posts_Min_Order_By>;
  stddev?: Maybe<Posts_Stddev_Order_By>;
  stddev_pop?: Maybe<Posts_Stddev_Pop_Order_By>;
  stddev_samp?: Maybe<Posts_Stddev_Samp_Order_By>;
  sum?: Maybe<Posts_Sum_Order_By>;
  var_pop?: Maybe<Posts_Var_Pop_Order_By>;
  var_samp?: Maybe<Posts_Var_Samp_Order_By>;
  variance?: Maybe<Posts_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "posts" */
export type Posts_Arr_Rel_Insert_Input = {
  data: Array<Posts_Insert_Input>;
  /** on conflict condition */
  on_conflict?: Maybe<Posts_On_Conflict>;
};

/** aggregate avg on columns */
export type Posts_Avg_Fields = {
  __typename?: 'posts_avg_fields';
  ranking?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "posts" */
export type Posts_Avg_Order_By = {
  ranking?: Maybe<Order_By>;
};

/** Boolean expression to filter rows from the table "posts". All fields are combined with a logical 'AND'. */
export type Posts_Bool_Exp = {
  _and?: Maybe<Array<Posts_Bool_Exp>>;
  _not?: Maybe<Posts_Bool_Exp>;
  _or?: Maybe<Array<Posts_Bool_Exp>>;
  created_at?: Maybe<Timestamp_Comparison_Exp>;
  deleted_at?: Maybe<Timestamp_Comparison_Exp>;
  id?: Maybe<Uuid_Comparison_Exp>;
  latest_version_id?: Maybe<Uuid_Comparison_Exp>;
  latest_version_locked_for_publication?: Maybe<Boolean_Comparison_Exp>;
  latest_version_slug?: Maybe<String_Comparison_Exp>;
  post_versions?: Maybe<Post_Versions_Bool_Exp>;
  profile?: Maybe<Profiles_Bool_Exp>;
  profile_id?: Maybe<Uuid_Comparison_Exp>;
  published_at?: Maybe<Timestamp_Comparison_Exp>;
  ranking?: Maybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "posts" */
export enum Posts_Constraint {
  /** unique or primary key constraint */
  PostsByProfileAndDateIdx = 'posts_by_profile_and_date_idx',
  /** unique or primary key constraint */
  PostsByProfileAndSlugIdx = 'posts_by_profile_and_slug_idx',
  /** unique or primary key constraint */
  PostsPkey = 'posts_pkey'
}

/** input type for incrementing numeric columns in table "posts" */
export type Posts_Inc_Input = {
  ranking?: Maybe<Scalars['Int']>;
};

/** input type for inserting data into table "posts" */
export type Posts_Insert_Input = {
  created_at?: Maybe<Scalars['timestamp']>;
  deleted_at?: Maybe<Scalars['timestamp']>;
  id?: Maybe<Scalars['uuid']>;
  latest_version_id?: Maybe<Scalars['uuid']>;
  latest_version_locked_for_publication?: Maybe<Scalars['Boolean']>;
  latest_version_slug?: Maybe<Scalars['String']>;
  post_versions?: Maybe<Post_Versions_Arr_Rel_Insert_Input>;
  profile?: Maybe<Profiles_Obj_Rel_Insert_Input>;
  profile_id?: Maybe<Scalars['uuid']>;
  published_at?: Maybe<Scalars['timestamp']>;
  ranking?: Maybe<Scalars['Int']>;
};

/** aggregate max on columns */
export type Posts_Max_Fields = {
  __typename?: 'posts_max_fields';
  created_at?: Maybe<Scalars['timestamp']>;
  deleted_at?: Maybe<Scalars['timestamp']>;
  id?: Maybe<Scalars['uuid']>;
  latest_version_id?: Maybe<Scalars['uuid']>;
  latest_version_slug?: Maybe<Scalars['String']>;
  profile_id?: Maybe<Scalars['uuid']>;
  published_at?: Maybe<Scalars['timestamp']>;
  ranking?: Maybe<Scalars['Int']>;
};

/** order by max() on columns of table "posts" */
export type Posts_Max_Order_By = {
  created_at?: Maybe<Order_By>;
  deleted_at?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  latest_version_id?: Maybe<Order_By>;
  latest_version_slug?: Maybe<Order_By>;
  profile_id?: Maybe<Order_By>;
  published_at?: Maybe<Order_By>;
  ranking?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Posts_Min_Fields = {
  __typename?: 'posts_min_fields';
  created_at?: Maybe<Scalars['timestamp']>;
  deleted_at?: Maybe<Scalars['timestamp']>;
  id?: Maybe<Scalars['uuid']>;
  latest_version_id?: Maybe<Scalars['uuid']>;
  latest_version_slug?: Maybe<Scalars['String']>;
  profile_id?: Maybe<Scalars['uuid']>;
  published_at?: Maybe<Scalars['timestamp']>;
  ranking?: Maybe<Scalars['Int']>;
};

/** order by min() on columns of table "posts" */
export type Posts_Min_Order_By = {
  created_at?: Maybe<Order_By>;
  deleted_at?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  latest_version_id?: Maybe<Order_By>;
  latest_version_slug?: Maybe<Order_By>;
  profile_id?: Maybe<Order_By>;
  published_at?: Maybe<Order_By>;
  ranking?: Maybe<Order_By>;
};

/** response of any mutation on the table "posts" */
export type Posts_Mutation_Response = {
  __typename?: 'posts_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Posts>;
};

/** input type for inserting object relation for remote table "posts" */
export type Posts_Obj_Rel_Insert_Input = {
  data: Posts_Insert_Input;
  /** on conflict condition */
  on_conflict?: Maybe<Posts_On_Conflict>;
};

/** on conflict condition type for table "posts" */
export type Posts_On_Conflict = {
  constraint: Posts_Constraint;
  update_columns: Array<Posts_Update_Column>;
  where?: Maybe<Posts_Bool_Exp>;
};

/** Ordering options when selecting data from "posts". */
export type Posts_Order_By = {
  created_at?: Maybe<Order_By>;
  deleted_at?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  latest_version_id?: Maybe<Order_By>;
  latest_version_locked_for_publication?: Maybe<Order_By>;
  latest_version_slug?: Maybe<Order_By>;
  post_versions_aggregate?: Maybe<Post_Versions_Aggregate_Order_By>;
  profile?: Maybe<Profiles_Order_By>;
  profile_id?: Maybe<Order_By>;
  published_at?: Maybe<Order_By>;
  ranking?: Maybe<Order_By>;
};

/** primary key columns input for table: posts */
export type Posts_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "posts" */
export enum Posts_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DeletedAt = 'deleted_at',
  /** column name */
  Id = 'id',
  /** column name */
  LatestVersionId = 'latest_version_id',
  /** column name */
  LatestVersionLockedForPublication = 'latest_version_locked_for_publication',
  /** column name */
  LatestVersionSlug = 'latest_version_slug',
  /** column name */
  ProfileId = 'profile_id',
  /** column name */
  PublishedAt = 'published_at',
  /** column name */
  Ranking = 'ranking'
}

/** input type for updating data in table "posts" */
export type Posts_Set_Input = {
  created_at?: Maybe<Scalars['timestamp']>;
  deleted_at?: Maybe<Scalars['timestamp']>;
  id?: Maybe<Scalars['uuid']>;
  latest_version_id?: Maybe<Scalars['uuid']>;
  latest_version_locked_for_publication?: Maybe<Scalars['Boolean']>;
  latest_version_slug?: Maybe<Scalars['String']>;
  profile_id?: Maybe<Scalars['uuid']>;
  published_at?: Maybe<Scalars['timestamp']>;
  ranking?: Maybe<Scalars['Int']>;
};

/** aggregate stddev on columns */
export type Posts_Stddev_Fields = {
  __typename?: 'posts_stddev_fields';
  ranking?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "posts" */
export type Posts_Stddev_Order_By = {
  ranking?: Maybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Posts_Stddev_Pop_Fields = {
  __typename?: 'posts_stddev_pop_fields';
  ranking?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "posts" */
export type Posts_Stddev_Pop_Order_By = {
  ranking?: Maybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Posts_Stddev_Samp_Fields = {
  __typename?: 'posts_stddev_samp_fields';
  ranking?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "posts" */
export type Posts_Stddev_Samp_Order_By = {
  ranking?: Maybe<Order_By>;
};

/** aggregate sum on columns */
export type Posts_Sum_Fields = {
  __typename?: 'posts_sum_fields';
  ranking?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "posts" */
export type Posts_Sum_Order_By = {
  ranking?: Maybe<Order_By>;
};

/** update columns of table "posts" */
export enum Posts_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DeletedAt = 'deleted_at',
  /** column name */
  Id = 'id',
  /** column name */
  LatestVersionId = 'latest_version_id',
  /** column name */
  LatestVersionLockedForPublication = 'latest_version_locked_for_publication',
  /** column name */
  LatestVersionSlug = 'latest_version_slug',
  /** column name */
  ProfileId = 'profile_id',
  /** column name */
  PublishedAt = 'published_at',
  /** column name */
  Ranking = 'ranking'
}

/** aggregate var_pop on columns */
export type Posts_Var_Pop_Fields = {
  __typename?: 'posts_var_pop_fields';
  ranking?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "posts" */
export type Posts_Var_Pop_Order_By = {
  ranking?: Maybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Posts_Var_Samp_Fields = {
  __typename?: 'posts_var_samp_fields';
  ranking?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "posts" */
export type Posts_Var_Samp_Order_By = {
  ranking?: Maybe<Order_By>;
};

/** aggregate variance on columns */
export type Posts_Variance_Fields = {
  __typename?: 'posts_variance_fields';
  ranking?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "posts" */
export type Posts_Variance_Order_By = {
  ranking?: Maybe<Order_By>;
};

export type Profile_Published_Posts_By_Slug_Args = {
  p_slug?: Maybe<Scalars['String']>;
};

/** columns and relationships of "profiles" */
export type Profiles = {
  __typename?: 'profiles';
  avatar_url?: Maybe<Scalars['String']>;
  created_at: Scalars['timestamp'];
  display_name: Scalars['String'];
  handle?: Maybe<Scalars['String']>;
  id: Scalars['uuid'];
  /** An object relationship */
  member?: Maybe<Members>;
  /** An array relationship */
  posts: Array<Posts>;
  /** An aggregate relationship */
  posts_aggregate: Posts_Aggregate;
  /** A computed field, executes function "profile_published_posts" */
  published_posts?: Maybe<Array<Published_Posts>>;
  /** A computed field, executes function "profile_published_posts_by_slug" */
  published_posts_by_slug?: Maybe<Array<Published_Posts>>;
};


/** columns and relationships of "profiles" */
export type ProfilesPostsArgs = {
  distinct_on?: Maybe<Array<Posts_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Posts_Order_By>>;
  where?: Maybe<Posts_Bool_Exp>;
};


/** columns and relationships of "profiles" */
export type ProfilesPosts_AggregateArgs = {
  distinct_on?: Maybe<Array<Posts_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Posts_Order_By>>;
  where?: Maybe<Posts_Bool_Exp>;
};


/** columns and relationships of "profiles" */
export type ProfilesPublished_PostsArgs = {
  distinct_on?: Maybe<Array<Published_Posts_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Published_Posts_Order_By>>;
  where?: Maybe<Published_Posts_Bool_Exp>;
};


/** columns and relationships of "profiles" */
export type ProfilesPublished_Posts_By_SlugArgs = {
  args: Profile_Published_Posts_By_Slug_Args;
  distinct_on?: Maybe<Array<Published_Posts_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Published_Posts_Order_By>>;
  where?: Maybe<Published_Posts_Bool_Exp>;
};

/** aggregated selection of "profiles" */
export type Profiles_Aggregate = {
  __typename?: 'profiles_aggregate';
  aggregate?: Maybe<Profiles_Aggregate_Fields>;
  nodes: Array<Profiles>;
};

/** aggregate fields of "profiles" */
export type Profiles_Aggregate_Fields = {
  __typename?: 'profiles_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Profiles_Max_Fields>;
  min?: Maybe<Profiles_Min_Fields>;
};


/** aggregate fields of "profiles" */
export type Profiles_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Profiles_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "profiles". All fields are combined with a logical 'AND'. */
export type Profiles_Bool_Exp = {
  _and?: Maybe<Array<Profiles_Bool_Exp>>;
  _not?: Maybe<Profiles_Bool_Exp>;
  _or?: Maybe<Array<Profiles_Bool_Exp>>;
  avatar_url?: Maybe<String_Comparison_Exp>;
  created_at?: Maybe<Timestamp_Comparison_Exp>;
  display_name?: Maybe<String_Comparison_Exp>;
  handle?: Maybe<String_Comparison_Exp>;
  id?: Maybe<Uuid_Comparison_Exp>;
  member?: Maybe<Members_Bool_Exp>;
  posts?: Maybe<Posts_Bool_Exp>;
};

/** unique or primary key constraints on table "profiles" */
export enum Profiles_Constraint {
  /** unique or primary key constraint */
  ProfilesHandleKey = 'profiles_handle_key',
  /** unique or primary key constraint */
  ProfilesPkey = 'profiles_pkey'
}

/** input type for inserting data into table "profiles" */
export type Profiles_Insert_Input = {
  avatar_url?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamp']>;
  display_name?: Maybe<Scalars['String']>;
  handle?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  member?: Maybe<Members_Obj_Rel_Insert_Input>;
  posts?: Maybe<Posts_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Profiles_Max_Fields = {
  __typename?: 'profiles_max_fields';
  avatar_url?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamp']>;
  display_name?: Maybe<Scalars['String']>;
  handle?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
};

/** aggregate min on columns */
export type Profiles_Min_Fields = {
  __typename?: 'profiles_min_fields';
  avatar_url?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamp']>;
  display_name?: Maybe<Scalars['String']>;
  handle?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
};

/** response of any mutation on the table "profiles" */
export type Profiles_Mutation_Response = {
  __typename?: 'profiles_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Profiles>;
};

/** input type for inserting object relation for remote table "profiles" */
export type Profiles_Obj_Rel_Insert_Input = {
  data: Profiles_Insert_Input;
  /** on conflict condition */
  on_conflict?: Maybe<Profiles_On_Conflict>;
};

/** on conflict condition type for table "profiles" */
export type Profiles_On_Conflict = {
  constraint: Profiles_Constraint;
  update_columns: Array<Profiles_Update_Column>;
  where?: Maybe<Profiles_Bool_Exp>;
};

/** Ordering options when selecting data from "profiles". */
export type Profiles_Order_By = {
  avatar_url?: Maybe<Order_By>;
  created_at?: Maybe<Order_By>;
  display_name?: Maybe<Order_By>;
  handle?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  member?: Maybe<Members_Order_By>;
  posts_aggregate?: Maybe<Posts_Aggregate_Order_By>;
};

/** primary key columns input for table: profiles */
export type Profiles_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "profiles" */
export enum Profiles_Select_Column {
  /** column name */
  AvatarUrl = 'avatar_url',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DisplayName = 'display_name',
  /** column name */
  Handle = 'handle',
  /** column name */
  Id = 'id'
}

/** input type for updating data in table "profiles" */
export type Profiles_Set_Input = {
  avatar_url?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamp']>;
  display_name?: Maybe<Scalars['String']>;
  handle?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
};

/** update columns of table "profiles" */
export enum Profiles_Update_Column {
  /** column name */
  AvatarUrl = 'avatar_url',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DisplayName = 'display_name',
  /** column name */
  Handle = 'handle',
  /** column name */
  Id = 'id'
}

/** columns and relationships of "published_posts" */
export type Published_Posts = {
  __typename?: 'published_posts';
  content?: Maybe<Scalars['json']>;
  id?: Maybe<Scalars['uuid']>;
  /** An object relationship */
  profile?: Maybe<Profiles>;
  profile_id?: Maybe<Scalars['uuid']>;
  published_at?: Maybe<Scalars['timestamp']>;
  slug?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
};


/** columns and relationships of "published_posts" */
export type Published_PostsContentArgs = {
  path?: Maybe<Scalars['String']>;
};

/** aggregated selection of "published_posts" */
export type Published_Posts_Aggregate = {
  __typename?: 'published_posts_aggregate';
  aggregate?: Maybe<Published_Posts_Aggregate_Fields>;
  nodes: Array<Published_Posts>;
};

/** aggregate fields of "published_posts" */
export type Published_Posts_Aggregate_Fields = {
  __typename?: 'published_posts_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Published_Posts_Max_Fields>;
  min?: Maybe<Published_Posts_Min_Fields>;
};


/** aggregate fields of "published_posts" */
export type Published_Posts_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Published_Posts_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "published_posts". All fields are combined with a logical 'AND'. */
export type Published_Posts_Bool_Exp = {
  _and?: Maybe<Array<Published_Posts_Bool_Exp>>;
  _not?: Maybe<Published_Posts_Bool_Exp>;
  _or?: Maybe<Array<Published_Posts_Bool_Exp>>;
  content?: Maybe<Json_Comparison_Exp>;
  id?: Maybe<Uuid_Comparison_Exp>;
  profile?: Maybe<Profiles_Bool_Exp>;
  profile_id?: Maybe<Uuid_Comparison_Exp>;
  published_at?: Maybe<Timestamp_Comparison_Exp>;
  slug?: Maybe<String_Comparison_Exp>;
  title?: Maybe<String_Comparison_Exp>;
  updated_at?: Maybe<Timestamp_Comparison_Exp>;
};

/** aggregate max on columns */
export type Published_Posts_Max_Fields = {
  __typename?: 'published_posts_max_fields';
  id?: Maybe<Scalars['uuid']>;
  profile_id?: Maybe<Scalars['uuid']>;
  published_at?: Maybe<Scalars['timestamp']>;
  slug?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
};

/** aggregate min on columns */
export type Published_Posts_Min_Fields = {
  __typename?: 'published_posts_min_fields';
  id?: Maybe<Scalars['uuid']>;
  profile_id?: Maybe<Scalars['uuid']>;
  published_at?: Maybe<Scalars['timestamp']>;
  slug?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
};

/** Ordering options when selecting data from "published_posts". */
export type Published_Posts_Order_By = {
  content?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  profile?: Maybe<Profiles_Order_By>;
  profile_id?: Maybe<Order_By>;
  published_at?: Maybe<Order_By>;
  slug?: Maybe<Order_By>;
  title?: Maybe<Order_By>;
  updated_at?: Maybe<Order_By>;
};

/** select columns of table "published_posts" */
export enum Published_Posts_Select_Column {
  /** column name */
  Content = 'content',
  /** column name */
  Id = 'id',
  /** column name */
  ProfileId = 'profile_id',
  /** column name */
  PublishedAt = 'published_at',
  /** column name */
  Slug = 'slug',
  /** column name */
  Title = 'title',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Query_Root = {
  __typename?: 'query_root';
  /** fetch data from the table: "members" */
  members: Array<Members>;
  /** fetch aggregated fields from the table: "members" */
  members_aggregate: Members_Aggregate;
  /** fetch data from the table: "members" using primary key columns */
  members_by_pk?: Maybe<Members>;
  /** fetch data from the table: "post_versions" */
  post_versions: Array<Post_Versions>;
  /** fetch aggregated fields from the table: "post_versions" */
  post_versions_aggregate: Post_Versions_Aggregate;
  /** fetch data from the table: "post_versions" using primary key columns */
  post_versions_by_pk?: Maybe<Post_Versions>;
  /** fetch data from the table: "posts" */
  posts: Array<Posts>;
  /** fetch aggregated fields from the table: "posts" */
  posts_aggregate: Posts_Aggregate;
  /** fetch data from the table: "posts" using primary key columns */
  posts_by_pk?: Maybe<Posts>;
  /** fetch data from the table: "profiles" */
  profiles: Array<Profiles>;
  /** fetch aggregated fields from the table: "profiles" */
  profiles_aggregate: Profiles_Aggregate;
  /** fetch data from the table: "profiles" using primary key columns */
  profiles_by_pk?: Maybe<Profiles>;
  /** fetch data from the table: "published_posts" */
  published_posts: Array<Published_Posts>;
  /** fetch aggregated fields from the table: "published_posts" */
  published_posts_aggregate: Published_Posts_Aggregate;
};


export type Query_RootMembersArgs = {
  distinct_on?: Maybe<Array<Members_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Members_Order_By>>;
  where?: Maybe<Members_Bool_Exp>;
};


export type Query_RootMembers_AggregateArgs = {
  distinct_on?: Maybe<Array<Members_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Members_Order_By>>;
  where?: Maybe<Members_Bool_Exp>;
};


export type Query_RootMembers_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootPost_VersionsArgs = {
  distinct_on?: Maybe<Array<Post_Versions_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Post_Versions_Order_By>>;
  where?: Maybe<Post_Versions_Bool_Exp>;
};


export type Query_RootPost_Versions_AggregateArgs = {
  distinct_on?: Maybe<Array<Post_Versions_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Post_Versions_Order_By>>;
  where?: Maybe<Post_Versions_Bool_Exp>;
};


export type Query_RootPost_Versions_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootPostsArgs = {
  distinct_on?: Maybe<Array<Posts_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Posts_Order_By>>;
  where?: Maybe<Posts_Bool_Exp>;
};


export type Query_RootPosts_AggregateArgs = {
  distinct_on?: Maybe<Array<Posts_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Posts_Order_By>>;
  where?: Maybe<Posts_Bool_Exp>;
};


export type Query_RootPosts_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootProfilesArgs = {
  distinct_on?: Maybe<Array<Profiles_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Profiles_Order_By>>;
  where?: Maybe<Profiles_Bool_Exp>;
};


export type Query_RootProfiles_AggregateArgs = {
  distinct_on?: Maybe<Array<Profiles_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Profiles_Order_By>>;
  where?: Maybe<Profiles_Bool_Exp>;
};


export type Query_RootProfiles_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootPublished_PostsArgs = {
  distinct_on?: Maybe<Array<Published_Posts_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Published_Posts_Order_By>>;
  where?: Maybe<Published_Posts_Bool_Exp>;
};


export type Query_RootPublished_Posts_AggregateArgs = {
  distinct_on?: Maybe<Array<Published_Posts_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Published_Posts_Order_By>>;
  where?: Maybe<Published_Posts_Bool_Exp>;
};

export type Subscription_Root = {
  __typename?: 'subscription_root';
  /** fetch data from the table: "members" */
  members: Array<Members>;
  /** fetch aggregated fields from the table: "members" */
  members_aggregate: Members_Aggregate;
  /** fetch data from the table: "members" using primary key columns */
  members_by_pk?: Maybe<Members>;
  /** fetch data from the table: "post_versions" */
  post_versions: Array<Post_Versions>;
  /** fetch aggregated fields from the table: "post_versions" */
  post_versions_aggregate: Post_Versions_Aggregate;
  /** fetch data from the table: "post_versions" using primary key columns */
  post_versions_by_pk?: Maybe<Post_Versions>;
  /** fetch data from the table: "posts" */
  posts: Array<Posts>;
  /** fetch aggregated fields from the table: "posts" */
  posts_aggregate: Posts_Aggregate;
  /** fetch data from the table: "posts" using primary key columns */
  posts_by_pk?: Maybe<Posts>;
  /** fetch data from the table: "profiles" */
  profiles: Array<Profiles>;
  /** fetch aggregated fields from the table: "profiles" */
  profiles_aggregate: Profiles_Aggregate;
  /** fetch data from the table: "profiles" using primary key columns */
  profiles_by_pk?: Maybe<Profiles>;
  /** fetch data from the table: "published_posts" */
  published_posts: Array<Published_Posts>;
  /** fetch aggregated fields from the table: "published_posts" */
  published_posts_aggregate: Published_Posts_Aggregate;
};


export type Subscription_RootMembersArgs = {
  distinct_on?: Maybe<Array<Members_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Members_Order_By>>;
  where?: Maybe<Members_Bool_Exp>;
};


export type Subscription_RootMembers_AggregateArgs = {
  distinct_on?: Maybe<Array<Members_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Members_Order_By>>;
  where?: Maybe<Members_Bool_Exp>;
};


export type Subscription_RootMembers_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootPost_VersionsArgs = {
  distinct_on?: Maybe<Array<Post_Versions_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Post_Versions_Order_By>>;
  where?: Maybe<Post_Versions_Bool_Exp>;
};


export type Subscription_RootPost_Versions_AggregateArgs = {
  distinct_on?: Maybe<Array<Post_Versions_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Post_Versions_Order_By>>;
  where?: Maybe<Post_Versions_Bool_Exp>;
};


export type Subscription_RootPost_Versions_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootPostsArgs = {
  distinct_on?: Maybe<Array<Posts_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Posts_Order_By>>;
  where?: Maybe<Posts_Bool_Exp>;
};


export type Subscription_RootPosts_AggregateArgs = {
  distinct_on?: Maybe<Array<Posts_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Posts_Order_By>>;
  where?: Maybe<Posts_Bool_Exp>;
};


export type Subscription_RootPosts_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootProfilesArgs = {
  distinct_on?: Maybe<Array<Profiles_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Profiles_Order_By>>;
  where?: Maybe<Profiles_Bool_Exp>;
};


export type Subscription_RootProfiles_AggregateArgs = {
  distinct_on?: Maybe<Array<Profiles_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Profiles_Order_By>>;
  where?: Maybe<Profiles_Bool_Exp>;
};


export type Subscription_RootProfiles_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootPublished_PostsArgs = {
  distinct_on?: Maybe<Array<Published_Posts_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Published_Posts_Order_By>>;
  where?: Maybe<Published_Posts_Bool_Exp>;
};


export type Subscription_RootPublished_Posts_AggregateArgs = {
  distinct_on?: Maybe<Array<Published_Posts_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Published_Posts_Order_By>>;
  where?: Maybe<Published_Posts_Bool_Exp>;
};


/** Boolean expression to compare columns of type "timestamp". All fields are combined with logical 'AND'. */
export type Timestamp_Comparison_Exp = {
  _eq?: Maybe<Scalars['timestamp']>;
  _gt?: Maybe<Scalars['timestamp']>;
  _gte?: Maybe<Scalars['timestamp']>;
  _in?: Maybe<Array<Scalars['timestamp']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['timestamp']>;
  _lte?: Maybe<Scalars['timestamp']>;
  _neq?: Maybe<Scalars['timestamp']>;
  _nin?: Maybe<Array<Scalars['timestamp']>>;
};


/** Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'. */
export type Uuid_Comparison_Exp = {
  _eq?: Maybe<Scalars['uuid']>;
  _gt?: Maybe<Scalars['uuid']>;
  _gte?: Maybe<Scalars['uuid']>;
  _in?: Maybe<Array<Scalars['uuid']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['uuid']>;
  _lte?: Maybe<Scalars['uuid']>;
  _neq?: Maybe<Scalars['uuid']>;
  _nin?: Maybe<Array<Scalars['uuid']>>;
};

export type DashboardPostListQueryVariables = Exact<{
  profile_id: Scalars['uuid'];
}>;


export type DashboardPostListQuery = (
  { __typename?: 'query_root' }
  & { posts: Array<(
    { __typename?: 'posts' }
    & Pick<Posts, 'id' | 'created_at' | 'deleted_at' | 'published_at'>
    & { versions: Array<(
      { __typename?: 'post_versions' }
      & Pick<Post_Versions, 'id' | 'title' | 'content' | 'locked_for_publication' | 'updated_at'>
    )> }
  )> }
);

export type DashboardPostEditorQueryVariables = Exact<{
  post_id: Scalars['uuid'];
}>;


export type DashboardPostEditorQuery = (
  { __typename?: 'query_root' }
  & { post?: Maybe<(
    { __typename?: 'posts' }
    & Pick<Posts, 'id' | 'created_at' | 'deleted_at' | 'published_at'>
    & { versions: Array<(
      { __typename?: 'post_versions' }
      & Pick<Post_Versions, 'id' | 'title' | 'locked_for_publication' | 'updated_at' | 'content' | 'editor_state' | 'slug'>
    )> }
  )> }
);

export type CreatePostMutationVariables = Exact<{
  profile_id: Scalars['uuid'];
  version: Post_Versions_Insert_Input;
}>;


export type CreatePostMutation = (
  { __typename?: 'mutation_root' }
  & { insert_posts_one?: Maybe<(
    { __typename?: 'posts' }
    & Pick<Posts, 'id' | 'created_at' | 'deleted_at' | 'published_at'>
    & { versions: Array<(
      { __typename?: 'post_versions' }
      & Pick<Post_Versions, 'content' | 'editor_state' | 'id' | 'locked_for_publication' | 'slug' | 'title'>
    )> }
  )> }
);

export type SavePostDraftMutationVariables = Exact<{
  version: Post_Versions_Insert_Input;
}>;


export type SavePostDraftMutation = (
  { __typename?: 'mutation_root' }
  & { insert_post_versions?: Maybe<(
    { __typename?: 'post_versions_mutation_response' }
    & { returning: Array<(
      { __typename?: 'post_versions' }
      & Pick<Post_Versions, 'id' | 'locked_for_publication' | 'editor_state' | 'content' | 'slug' | 'title' | 'updated_at' | 'created_at'>
    )> }
  )> }
);

export type PublishPostMutationVariables = Exact<{
  post_id: Scalars['uuid'];
  published_at: Scalars['timestamp'];
}>;


export type PublishPostMutation = (
  { __typename?: 'mutation_root' }
  & { update_post_versions?: Maybe<(
    { __typename?: 'post_versions_mutation_response' }
    & { returning: Array<(
      { __typename?: 'post_versions' }
      & Pick<Post_Versions, 'id' | 'locked_for_publication'>
    )> }
  )>, update_posts_by_pk?: Maybe<(
    { __typename?: 'posts' }
    & Pick<Posts, 'id' | 'latest_version_id' | 'latest_version_locked_for_publication' | 'latest_version_slug' | 'published_at'>
  )> }
);

export type HomeQueryVariables = Exact<{
  limit?: Maybe<Scalars['Int']>;
}>;


export type HomeQuery = (
  { __typename?: 'query_root' }
  & { published_posts: Array<(
    { __typename?: 'published_posts' }
    & Pick<Published_Posts, 'id' | 'content' | 'published_at' | 'slug' | 'title' | 'updated_at'>
    & { profile?: Maybe<(
      { __typename?: 'profiles' }
      & Pick<Profiles, 'id' | 'display_name' | 'avatar_url' | 'handle'>
    )> }
  )> }
);

export type PostQueryVariables = Exact<{
  handle: Scalars['String'];
  slug: Scalars['String'];
}>;


export type PostQuery = (
  { __typename?: 'query_root' }
  & { profiles: Array<(
    { __typename?: 'profiles' }
    & Pick<Profiles, 'id' | 'handle' | 'display_name' | 'avatar_url'>
    & { published_posts_by_slug?: Maybe<Array<(
      { __typename?: 'published_posts' }
      & Pick<Published_Posts, 'title' | 'published_at' | 'updated_at' | 'id' | 'content'>
    )>> }
  )> }
);

export type MemberProfileQueryVariables = Exact<{
  memberId: Scalars['uuid'];
}>;


export type MemberProfileQuery = (
  { __typename?: 'query_root' }
  & { member?: Maybe<(
    { __typename?: 'members' }
    & Pick<Members, 'id'>
    & { profile: (
      { __typename?: 'profiles' }
      & Pick<Profiles, 'id' | 'display_name' | 'avatar_url' | 'handle'>
    ) }
  )> }
);


export const DashboardPostListDocument: DocumentNode<DashboardPostListQuery, DashboardPostListQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DashboardPostList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"profile_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"posts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"profile_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"profile_id"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"versions"},"name":{"kind":"Name","value":"post_versions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"updated_at"},"value":{"kind":"EnumValue","value":"desc"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"locked_for_publication"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"deleted_at"}},{"kind":"Field","name":{"kind":"Name","value":"published_at"}}]}}]}}]};
export const DashboardPostEditorDocument: DocumentNode<DashboardPostEditorQuery, DashboardPostEditorQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DashboardPostEditor"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"post_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"post"},"name":{"kind":"Name","value":"posts_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"post_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"versions"},"name":{"kind":"Name","value":"post_versions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"updated_at"},"value":{"kind":"EnumValue","value":"desc"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"locked_for_publication"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"editor_state"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"deleted_at"}},{"kind":"Field","name":{"kind":"Name","value":"published_at"}}]}}]}}]};
export const CreatePostDocument: DocumentNode<CreatePostMutation, CreatePostMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"profile_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"version"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"post_versions_insert_input"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insert_posts_one"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"object"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"profile_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"profile_id"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"post_versions"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"data"},"value":{"kind":"ListValue","values":[{"kind":"Variable","name":{"kind":"Name","value":"version"}}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"deleted_at"}},{"kind":"Field","name":{"kind":"Name","value":"published_at"}},{"kind":"Field","alias":{"kind":"Name","value":"versions"},"name":{"kind":"Name","value":"post_versions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"editor_state"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"locked_for_publication"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]};
export const SavePostDraftDocument: DocumentNode<SavePostDraftMutation, SavePostDraftMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SavePostDraft"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"version"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"post_versions_insert_input"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insert_post_versions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"objects"},"value":{"kind":"ListValue","values":[{"kind":"Variable","name":{"kind":"Name","value":"version"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"on_conflict"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"constraint"},"value":{"kind":"EnumValue","value":"post_versions_locked_for_publication"}},{"kind":"ObjectField","name":{"kind":"Name","value":"update_columns"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"editor_state"},{"kind":"EnumValue","value":"content"},{"kind":"EnumValue","value":"slug"},{"kind":"EnumValue","value":"title"}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"locked_for_publication"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"returning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"locked_for_publication"}},{"kind":"Field","name":{"kind":"Name","value":"editor_state"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}}]}}]}}]}}]};
export const PublishPostDocument: DocumentNode<PublishPostMutation, PublishPostMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PublishPost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"post_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"published_at"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamp"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_post_versions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"post_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"post_id"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"locked_for_publication"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"locked_for_publication"},"value":{"kind":"BooleanValue","value":true}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"returning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"locked_for_publication"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"update_posts_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pk_columns"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"post_id"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"published_at"},"value":{"kind":"Variable","name":{"kind":"Name","value":"published_at"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"latest_version_id"}},{"kind":"Field","name":{"kind":"Name","value":"latest_version_locked_for_publication"}},{"kind":"Field","name":{"kind":"Name","value":"latest_version_slug"}},{"kind":"Field","name":{"kind":"Name","value":"published_at"}}]}}]}}]};
export const HomeDocument: DocumentNode<HomeQuery, HomeQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Home"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"10"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"published_posts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"published_at"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar_url"}},{"kind":"Field","name":{"kind":"Name","value":"handle"}}]}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]}}]};
export const PostDocument: DocumentNode<PostQuery, PostQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Post"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"handle"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"profiles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"handle"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"handle"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"published_posts_by_slug"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"args"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"p_slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"published_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"handle"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar_url"}}]}}]}}]};
export const MemberProfileDocument: DocumentNode<MemberProfileQuery, MemberProfileQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MemberProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"member"},"name":{"kind":"Name","value":"members_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar_url"}},{"kind":"Field","name":{"kind":"Name","value":"handle"}}]}}]}}]}}]};