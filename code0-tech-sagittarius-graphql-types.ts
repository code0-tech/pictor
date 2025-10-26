export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never }
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never }
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
    ID: { input: `gid://sagittarius//${number}`; output: `gid://sagittarius//${number}`; }
    String: { input: string; output: string; }
    Boolean: { input: boolean; output: boolean; }
    Int: { input: number; output: number; }
    Float: { input: number; output: number; }
    DataTypeID: { input: `gid://sagittarius/DataType/${number}`; output: `gid://sagittarius/DataType/${number}`; }
    DataTypeIdentifierID: { input: `gid://sagittarius/DataTypeIdentifier/${number}`; output: `gid://sagittarius/DataTypeIdentifier/${number}`; }
    DataTypeRuleID: { input: `gid://sagittarius/DataTypeRule/${number}`; output: `gid://sagittarius/DataTypeRule/${number}`; }
    FlowID: { input: `gid://sagittarius/Flow/${number}`; output: `gid://sagittarius/Flow/${number}`; }
    FlowSettingID: { input: `gid://sagittarius/FlowSetting/${number}`; output: `gid://sagittarius/FlowSetting/${number}`; }
    FlowTypeID: { input: `gid://sagittarius/FlowType/${number}`; output: `gid://sagittarius/FlowType/${number}`; }
    FlowTypeSettingID: { input: `gid://sagittarius/FlowTypeSetting/${number}`; output: `gid://sagittarius/FlowTypeSetting/${number}`; }
    FunctionDefinitionID: { input: `gid://sagittarius/FunctionDefinition/${number}`; output: `gid://sagittarius/FunctionDefinition/${number}`; }
    GenericCombinationStrategyID: { input: `gid://sagittarius/GenericCombinationStrategy/${number}`; output: `gid://sagittarius/GenericCombinationStrategy/${number}`; }
    GenericMapperID: { input: `gid://sagittarius/GenericMapper/${number}`; output: `gid://sagittarius/GenericMapper/${number}`; }
    GenericTypeID: { input: `gid://sagittarius/GenericType/${number}`; output: `gid://sagittarius/GenericType/${number}`; }
    JSON: { input: any; output: any; }
    NamespaceID: { input: `gid://sagittarius/Namespace/${number}`; output: `gid://sagittarius/Namespace/${number}`; }
    NamespaceLicenseID: { input: `gid://sagittarius/NamespaceLicense/${number}`; output: `gid://sagittarius/NamespaceLicense/${number}`; }
    NamespaceMemberID: { input: `gid://sagittarius/NamespaceMember/${number}`; output: `gid://sagittarius/NamespaceMember/${number}`; }
    NamespaceMemberRoleID: { input: `gid://sagittarius/NamespaceMemberRole/${number}`; output: `gid://sagittarius/NamespaceMemberRole/${number}`; }
    NamespaceProjectID: { input: `gid://sagittarius/NamespaceProject/${number}`; output: `gid://sagittarius/NamespaceProject/${number}`; }
    NamespaceRoleID: { input: `gid://sagittarius/NamespaceRole/${number}`; output: `gid://sagittarius/NamespaceRole/${number}`; }
    NodeFunctionID: { input: `gid://sagittarius/NodeFunction/${number}`; output: `gid://sagittarius/NodeFunction/${number}`; }
    NodeParameterID: { input: `gid://sagittarius/NodeParameter/${number}`; output: `gid://sagittarius/NodeParameter/${number}`; }
    OrganizationID: { input: `gid://sagittarius/Organization/${number}`; output: `gid://sagittarius/Organization/${number}`; }
    ParameterDefinitionID: { input: `gid://sagittarius/ParameterDefinition/${number}`; output: `gid://sagittarius/ParameterDefinition/${number}`; }
    ReferencePathID: { input: `gid://sagittarius/ReferencePath/${number}`; output: `gid://sagittarius/ReferencePath/${number}`; }
    ReferenceValueID: { input: `gid://sagittarius/ReferenceValue/${number}`; output: `gid://sagittarius/ReferenceValue/${number}`; }
    RuntimeFunctionDefinitionID: { input: `gid://sagittarius/RuntimeFunctionDefinition/${number}`; output: `gid://sagittarius/RuntimeFunctionDefinition/${number}`; }
    RuntimeID: { input: `gid://sagittarius/Runtime/${number}`; output: `gid://sagittarius/Runtime/${number}`; }
    RuntimeParameterDefinitionID: { input: `gid://sagittarius/RuntimeParameterDefinition/${number}`; output: `gid://sagittarius/RuntimeParameterDefinition/${number}`; }
    Time: { input: string; output: string; }
    TypesFlowTypeID: { input: `gid://sagittarius/TypesFlowType/${number}`; output: `gid://sagittarius/TypesFlowType/${number}`; }
    UserID: { input: `gid://sagittarius/User/${number}`; output: `gid://sagittarius/User/${number}`; }
    UserIdentityID: { input: `gid://sagittarius/UserIdentity/${number}`; output: `gid://sagittarius/UserIdentity/${number}`; }
    UserSessionID: { input: `gid://sagittarius/UserSession/${number}`; output: `gid://sagittarius/UserSession/${number}`; }
}

/** Represents an active model error */
export interface ActiveModelError {
    __typename?: 'ActiveModelError';
    /** The affected attribute on the model */
    attribute?: Maybe<Scalars['String']['output']>;
    /** The validation type that failed for the attribute */
    type?: Maybe<Scalars['String']['output']>;
}

/** Represents the application settings */
export interface ApplicationSettings {
    __typename?: 'ApplicationSettings';
    /** Shows if organization creation is restricted to administrators */
    organizationCreationRestricted?: Maybe<Scalars['Boolean']['output']>;
    /** Shows if user registration is enabled */
    userRegistrationEnabled?: Maybe<Scalars['Boolean']['output']>;
}

/** Autogenerated input type of ApplicationSettingsUpdate */
export interface ApplicationSettingsUpdateInput {
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    /** Set if organization creation is restricted to administrators. */
    organizationCreationRestricted?: InputMaybe<Scalars['Boolean']['input']>;
    /** Set if user registration is enabled. */
    userRegistrationEnabled?: InputMaybe<Scalars['Boolean']['input']>;
}

/** Autogenerated return type of ApplicationSettingsUpdate. */
export interface ApplicationSettingsUpdatePayload {
    __typename?: 'ApplicationSettingsUpdatePayload';
    /** The updated application settings. */
    applicationSettings?: Maybe<ApplicationSettings>;
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: Maybe<Scalars['String']['output']>;
    /** Errors encountered during execution of the mutation. */
    errors?: Maybe<Array<Error>>;
}

/** Objects that can present an authentication */
export type Authentication = UserSession;

/** Represents a DataType */
export interface DataType {
    __typename?: 'DataType';
    /** Time when this DataType was created */
    createdAt?: Maybe<Scalars['Time']['output']>;
    /** Generic keys of the datatype */
    genericKeys?: Maybe<Array<Scalars['String']['output']>>;
    /** Global ID of this DataType */
    id?: Maybe<Scalars['DataTypeID']['output']>;
    /** The identifier scoped to the namespace */
    identifier?: Maybe<Scalars['String']['output']>;
    /** Names of the flow type setting */
    name?: Maybe<TranslationConnection>;
    /** Rules of the datatype */
    rules?: Maybe<DataTypeRuleConnection>;
    /** The runtime where this datatype belongs to */
    runtime?: Maybe<Runtime>;
    /** Time when this DataType was last updated */
    updatedAt?: Maybe<Scalars['Time']['output']>;
    /** The type of the datatype */
    variant?: Maybe<DataTypeVariant>;
}


/** Represents a DataType */
export interface DataTypeNameArgs {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
}


/** Represents a DataType */
export interface DataTypeRulesArgs {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
}

/** The connection type for DataType. */
export interface DataTypeConnection {
    __typename?: 'DataTypeConnection';
    /** Total count of collection. */
    count?: Maybe<Scalars['Int']['output']>;
    /** A list of edges. */
    edges?: Maybe<Array<Maybe<DataTypeEdge>>>;
    /** A list of nodes. */
    nodes?: Maybe<Array<Maybe<DataType>>>;
    /** Information to aid in pagination. */
    pageInfo?: Maybe<PageInfo>;
}

/** An edge in a connection. */
export interface DataTypeEdge {
    __typename?: 'DataTypeEdge';
    /** A cursor for use in pagination. */
    cursor?: Maybe<Scalars['String']['output']>;
    /** The item at the end of the edge. */
    node?: Maybe<DataType>;
}

/** Represents a data type identifier. */
export interface DataTypeIdentifier {
    __typename?: 'DataTypeIdentifier';
    /** Time when this DataTypeIdentifier was created */
    createdAt?: Maybe<Scalars['Time']['output']>;
    /** The data type of the data type identifier. */
    dataType?: Maybe<DataType>;
    /** The generic key of the data type identifier. */
    genericKey?: Maybe<Scalars['String']['output']>;
    /** The generic type of the data type identifier. */
    genericType?: Maybe<GenericType>;
    /** Global ID of this DataTypeIdentifier */
    id?: Maybe<Scalars['DataTypeIdentifierID']['output']>;
    /** Time when this DataTypeIdentifier was last updated */
    updatedAt?: Maybe<Scalars['Time']['output']>;
}

/** Input type for data type identifier */
export interface DataTypeIdentifierInput {
    /** Data type ID */
    dataTypeId?: InputMaybe<Scalars['DataTypeID']['input']>;
    /** Generic key value */
    genericKey?: InputMaybe<Scalars['String']['input']>;
    /** Generic type information */
    genericType?: InputMaybe<GenericTypeInput>;
}

/** Represents a rule that can be applied to a data type. */
export interface DataTypeRule {
    __typename?: 'DataTypeRule';
    /** The configuration of the rule */
    config?: Maybe<DataTypeRulesConfig>;
    /** Time when this DataTypeRule was created */
    createdAt?: Maybe<Scalars['Time']['output']>;
    /** Global ID of this DataTypeRule */
    id?: Maybe<Scalars['DataTypeRuleID']['output']>;
    /** Time when this DataTypeRule was last updated */
    updatedAt?: Maybe<Scalars['Time']['output']>;
    /** The type of the rule */
    variant?: Maybe<DataTypeRulesVariant>;
}

/** The connection type for DataTypeRule. */
export interface DataTypeRuleConnection {
    __typename?: 'DataTypeRuleConnection';
    /** Total count of collection. */
    count?: Maybe<Scalars['Int']['output']>;
    /** A list of edges. */
    edges?: Maybe<Array<Maybe<DataTypeRuleEdge>>>;
    /** A list of nodes. */
    nodes?: Maybe<Array<Maybe<DataTypeRule>>>;
    /** Information to aid in pagination. */
    pageInfo?: Maybe<PageInfo>;
}

/** An edge in a connection. */
export interface DataTypeRuleEdge {
    __typename?: 'DataTypeRuleEdge';
    /** A cursor for use in pagination. */
    cursor?: Maybe<Scalars['String']['output']>;
    /** The item at the end of the edge. */
    node?: Maybe<DataTypeRule>;
}

/** Represents a rule that can be applied to a data type. */
export type DataTypeRulesConfig = DataTypeRulesContainsKeyConfig | DataTypeRulesContainsTypeConfig | DataTypeRulesInputTypesConfig | DataTypeRulesItemOfCollectionConfig | DataTypeRulesNumberRangeConfig | DataTypeRulesParentTypeConfig | DataTypeRulesRegexConfig | DataTypeRulesReturnTypeConfig;

/** Represents a rule that can be applied to a data type. */
export interface DataTypeRulesContainsKeyConfig {
    __typename?: 'DataTypeRulesContainsKeyConfig';
    /** The identifier of the data type this rule belongs to */
    dataTypeIdentifier?: Maybe<DataTypeIdentifier>;
    /** The key of the rule */
    key?: Maybe<Scalars['String']['output']>;
}

/** Represents a rule that can be applied to a data type. */
export interface DataTypeRulesContainsTypeConfig {
    __typename?: 'DataTypeRulesContainsTypeConfig';
    /** The identifier of the data type this rule belongs to */
    dataTypeIdentifier?: Maybe<DataTypeIdentifier>;
}

/** Represents a subtype of input type configuration for a input data type. */
export interface DataTypeRulesInputTypeConfig {
    __typename?: 'DataTypeRulesInputTypeConfig';
    /** The identifier of the data type this input type belongs to */
    dataTypeIdentifier?: Maybe<DataTypeIdentifier>;
    /** The input identifier that this configuration applies to */
    inputIdentifier?: Maybe<Scalars['String']['output']>;
}

/** Represents a rule that can be applied to a data type. */
export interface DataTypeRulesInputTypesConfig {
    __typename?: 'DataTypeRulesInputTypesConfig';
    /** The input types that can be used in this data type rule */
    inputTypes?: Maybe<Array<DataTypeRulesInputTypeConfig>>;
}

/** Represents a rule that can be applied to a data type. */
export interface DataTypeRulesItemOfCollectionConfig {
    __typename?: 'DataTypeRulesItemOfCollectionConfig';
    /** The items that can be configured for this rule. */
    items?: Maybe<Array<Scalars['JSON']['output']>>;
}

/** Represents a rule that can be applied to a data type. */
export interface DataTypeRulesNumberRangeConfig {
    __typename?: 'DataTypeRulesNumberRangeConfig';
    /** The minimum value of the range */
    from?: Maybe<Scalars['Int']['output']>;
    /** The step value for the range, if applicable */
    steps?: Maybe<Scalars['Int']['output']>;
    /** The maximum value of the range */
    to?: Maybe<Scalars['Int']['output']>;
}

/** Represents a rule that can be applied to a data type. */
export interface DataTypeRulesParentTypeConfig {
    __typename?: 'DataTypeRulesParentTypeConfig';
    /** The data type identifier for the parent type. */
    dataTypeIdentifier?: Maybe<DataTypeIdentifier>;
}

/** Represents a rule that can be applied to a data type. */
export interface DataTypeRulesRegexConfig {
    __typename?: 'DataTypeRulesRegexConfig';
    /** The regex pattern to match against the data type value. */
    pattern?: Maybe<Scalars['String']['output']>;
}

/** Represents a rule that can be applied to a data type. */
export interface DataTypeRulesReturnTypeConfig {
    __typename?: 'DataTypeRulesReturnTypeConfig';
    /** The data type identifier for the return type. */
    dataTypeIdentifier?: Maybe<DataTypeIdentifier>;
}

/** The type of rule that can be applied to a data type. */
export const enum DataTypeRulesVariant {
    /** The rule checks if a key is present in the data type. */
    ContainsKey = 'CONTAINS_KEY',
    /** The rule checks if a specific type is present in the data type. */
    ContainsType = 'CONTAINS_TYPE',
    /** The rule checks if the data type matches a specific input type. */
    InputType = 'INPUT_TYPE',
    /** The rule checks if an item is part of a collection in the data type. */
    ItemOfCollection = 'ITEM_OF_COLLECTION',
    /** The rule checks if a number falls within a specified range. */
    NumberRange = 'NUMBER_RANGE',
    /** The rule checks if the data type is a child of a specific parent type. */
    ParentType = 'PARENT_TYPE',
    /** The rule checks if a string matches a specified regular expression. */
    Regex = 'REGEX',
    /** The rule checks if the data type matches a specific return type. */
    ReturnType = 'RETURN_TYPE'
}

/** Represent all available types of a datatype */
export const enum DataTypeVariant {
    /** Represents an array */
    Array = 'ARRAY',
    /** Represents an data type containing a data type */
    DataType = 'DATA_TYPE',
    /** Represents a error */
    Error = 'ERROR',
    /** Represents a node */
    Node = 'NODE',
    /** Represents an object */
    Object = 'OBJECT',
    /** Represents a primitive datatype */
    Primitive = 'PRIMITIVE',
    /** Represents a type */
    Type = 'TYPE'
}

/** Autogenerated input type of Echo */
export interface EchoInput {
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    /** Message to return to the user. */
    message?: InputMaybe<Scalars['String']['input']>;
}

/** Autogenerated return type of Echo. */
export interface EchoPayload {
    __typename?: 'EchoPayload';
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: Maybe<Scalars['String']['output']>;
    /** Errors encountered during execution of the mutation. */
    errors?: Maybe<Array<Error>>;
    /** Message returned to the user. */
    message?: Maybe<Scalars['String']['output']>;
}

/** Objects that can present an error */
export type Error = ActiveModelError | MessageError;

/** Represents a flow */
export interface Flow {
    __typename?: 'Flow';
    /** Time when this Flow was created */
    createdAt?: Maybe<Scalars['Time']['output']>;
    /** Global ID of this Flow */
    id?: Maybe<Scalars['FlowID']['output']>;
    /** The input data type of the flow */
    inputType?: Maybe<DataType>;
    /** Nodes of the flow */
    nodes?: Maybe<NodeFunctionConnection>;
    /** The return data type of the flow */
    returnType?: Maybe<DataType>;
    /** The settings of the flow */
    settings?: Maybe<FlowSettingConnection>;
    /** The ID of the starting node of the flow */
    startingNodeId?: Maybe<Scalars['NodeFunctionID']['output']>;
    /** The flow type of the flow */
    type?: Maybe<FlowType>;
    /** Time when this Flow was last updated */
    updatedAt?: Maybe<Scalars['Time']['output']>;
}


/** Represents a flow */
export interface FlowNodesArgs {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
}


/** Represents a flow */
export interface FlowSettingsArgs {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
}

/** The connection type for Flow. */
export interface FlowConnection {
    __typename?: 'FlowConnection';
    /** Total count of collection. */
    count?: Maybe<Scalars['Int']['output']>;
    /** A list of edges. */
    edges?: Maybe<Array<Maybe<FlowEdge>>>;
    /** A list of nodes. */
    nodes?: Maybe<Array<Maybe<Flow>>>;
    /** Information to aid in pagination. */
    pageInfo?: Maybe<PageInfo>;
}

/** An edge in a connection. */
export interface FlowEdge {
    __typename?: 'FlowEdge';
    /** A cursor for use in pagination. */
    cursor?: Maybe<Scalars['String']['output']>;
    /** The item at the end of the edge. */
    node?: Maybe<Flow>;
}

/** Input type for creating or updating a flow */
export interface FlowInput {
    /** The settings of the flow */
    settings?: InputMaybe<Array<FlowSettingInput>>;
    /** The starting node of the flow */
    startingNode: NodeFunctionInput;
    /** The identifier of the flow type */
    type: Scalars['FlowTypeID']['input'];
}

/** Represents a flow setting */
export interface FlowSetting {
    __typename?: 'FlowSetting';
    /** Time when this FlowSetting was created */
    createdAt?: Maybe<Scalars['Time']['output']>;
    /** The identifier of the flow setting */
    flowSettingIdentifier?: Maybe<Scalars['String']['output']>;
    /** Global ID of this FlowSetting */
    id?: Maybe<Scalars['FlowSettingID']['output']>;
    /** Time when this FlowSetting was last updated */
    updatedAt?: Maybe<Scalars['Time']['output']>;
    /** The value of the flow setting */
    value?: Maybe<Scalars['JSON']['output']>;
}

/** The connection type for FlowSetting. */
export interface FlowSettingConnection {
    __typename?: 'FlowSettingConnection';
    /** Total count of collection. */
    count?: Maybe<Scalars['Int']['output']>;
    /** A list of edges. */
    edges?: Maybe<Array<Maybe<FlowSettingEdge>>>;
    /** A list of nodes. */
    nodes?: Maybe<Array<Maybe<FlowSetting>>>;
    /** Information to aid in pagination. */
    pageInfo?: Maybe<PageInfo>;
}

/** An edge in a connection. */
export interface FlowSettingEdge {
    __typename?: 'FlowSettingEdge';
    /** A cursor for use in pagination. */
    cursor?: Maybe<Scalars['String']['output']>;
    /** The item at the end of the edge. */
    node?: Maybe<FlowSetting>;
}

/** Input type for flow settings */
export interface FlowSettingInput {
    /** The identifier (not database id) of the flow setting */
    flowSettingId: Scalars['String']['input'];
    /** The value of the flow setting */
    object: Scalars['JSON']['input'];
}

/** Represents a flow type */
export interface FlowType {
    __typename?: 'FlowType';
    /** Time when this FlowType was created */
    createdAt?: Maybe<Scalars['Time']['output']>;
    /** Descriptions of the flow type */
    descriptions?: Maybe<TranslationConnection>;
    /** Editable status of the flow type */
    editable?: Maybe<Scalars['Boolean']['output']>;
    /** Flow type settings of the flow type */
    flowTypeSettings?: Maybe<Array<FlowTypeSetting>>;
    /** Global ID of this FlowType */
    id?: Maybe<Scalars['TypesFlowTypeID']['output']>;
    /** Identifier of the flow type */
    identifier?: Maybe<Scalars['String']['output']>;
    /** Input type of the flow type */
    inputType?: Maybe<DataType>;
    /** Names of the flow type */
    names?: Maybe<TranslationConnection>;
    /** Return type of the flow type */
    returnType?: Maybe<DataType>;
    /** Time when this FlowType was last updated */
    updatedAt?: Maybe<Scalars['Time']['output']>;
}


/** Represents a flow type */
export interface FlowTypeDescriptionsArgs {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
}


/** Represents a flow type */
export interface FlowTypeNamesArgs {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
}

/** The connection type for FlowType. */
export interface FlowTypeConnection {
    __typename?: 'FlowTypeConnection';
    /** Total count of collection. */
    count?: Maybe<Scalars['Int']['output']>;
    /** A list of edges. */
    edges?: Maybe<Array<Maybe<FlowTypeEdge>>>;
    /** A list of nodes. */
    nodes?: Maybe<Array<Maybe<FlowType>>>;
    /** Information to aid in pagination. */
    pageInfo?: Maybe<PageInfo>;
}

/** An edge in a connection. */
export interface FlowTypeEdge {
    __typename?: 'FlowTypeEdge';
    /** A cursor for use in pagination. */
    cursor?: Maybe<Scalars['String']['output']>;
    /** The item at the end of the edge. */
    node?: Maybe<FlowType>;
}

/** Represents a flow type setting */
export interface FlowTypeSetting {
    __typename?: 'FlowTypeSetting';
    /** Time when this FlowTypeSetting was created */
    createdAt?: Maybe<Scalars['Time']['output']>;
    /** Data type of the flow type setting */
    dataType?: Maybe<DataType>;
    /** Descriptions of the flow type setting */
    descriptions?: Maybe<TranslationConnection>;
    /** Flow type of the flow type setting */
    flowType?: Maybe<FlowType>;
    /** Global ID of this FlowTypeSetting */
    id?: Maybe<Scalars['FlowTypeSettingID']['output']>;
    /** Identifier of the flow type setting */
    identifier?: Maybe<Scalars['String']['output']>;
    /** Names of the flow type setting */
    names?: Maybe<TranslationConnection>;
    /** Unique status of the flow type setting */
    unique?: Maybe<Scalars['Boolean']['output']>;
    /** Time when this FlowTypeSetting was last updated */
    updatedAt?: Maybe<Scalars['Time']['output']>;
}


/** Represents a flow type setting */
export interface FlowTypeSettingDescriptionsArgs {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
}


/** Represents a flow type setting */
export interface FlowTypeSettingNamesArgs {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
}

/** Represents a function definition */
export interface FunctionDefinition {
    __typename?: 'FunctionDefinition';
    /** Time when this FunctionDefinition was created */
    createdAt?: Maybe<Scalars['Time']['output']>;
    /** Deprecation message of the function */
    deprecationMessages?: Maybe<TranslationConnection>;
    /** Description of the function */
    descriptions?: Maybe<TranslationConnection>;
    /** Documentation of the function */
    documentations?: Maybe<TranslationConnection>;
    /** Generic keys of the function */
    genericKeys?: Maybe<Array<Scalars['String']['output']>>;
    /** Global ID of this FunctionDefinition */
    id?: Maybe<Scalars['FunctionDefinitionID']['output']>;
    /** Identifier of the function */
    identifier?: Maybe<Scalars['String']['output']>;
    /** Name of the function */
    names?: Maybe<TranslationConnection>;
    /** Parameters of the function */
    parameterDefinitions?: Maybe<ParameterDefinitionConnection>;
    /** Return type of the function */
    returnType?: Maybe<DataTypeIdentifier>;
    /** Runtime function definition */
    runtimeFunctionDefinition?: Maybe<RuntimeFunctionDefinition>;
    /** Indicates if the function can throw an error */
    throwsError?: Maybe<Scalars['Boolean']['output']>;
    /** Time when this FunctionDefinition was last updated */
    updatedAt?: Maybe<Scalars['Time']['output']>;
}


/** Represents a function definition */
export interface FunctionDefinitionDeprecationMessagesArgs {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
}


/** Represents a function definition */
export interface FunctionDefinitionDescriptionsArgs {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
}


/** Represents a function definition */
export interface FunctionDefinitionDocumentationsArgs {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
}


/** Represents a function definition */
export interface FunctionDefinitionNamesArgs {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
}


/** Represents a function definition */
export interface FunctionDefinitionParameterDefinitionsArgs {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
}

/** The connection type for FunctionDefinition. */
export interface FunctionDefinitionConnection {
    __typename?: 'FunctionDefinitionConnection';
    /** Total count of collection. */
    count?: Maybe<Scalars['Int']['output']>;
    /** A list of edges. */
    edges?: Maybe<Array<Maybe<FunctionDefinitionEdge>>>;
    /** A list of nodes. */
    nodes?: Maybe<Array<Maybe<FunctionDefinition>>>;
    /** Information to aid in pagination. */
    pageInfo?: Maybe<PageInfo>;
}

/** An edge in a connection. */
export interface FunctionDefinitionEdge {
    __typename?: 'FunctionDefinitionEdge';
    /** A cursor for use in pagination. */
    cursor?: Maybe<Scalars['String']['output']>;
    /** The item at the end of the edge. */
    node?: Maybe<FunctionDefinition>;
}

/** Represents a combination strategy with AND/OR logic used by a generic mapper. */
export interface GenericCombinationStrategy {
    __typename?: 'GenericCombinationStrategy';
    /** Time when this GenericCombinationStrategy was created */
    createdAt?: Maybe<Scalars['Time']['output']>;
    /** The associated generic mapper, if any. */
    genericMapper?: Maybe<GenericMapper>;
    /** Global ID of this GenericCombinationStrategy */
    id?: Maybe<Scalars['GenericCombinationStrategyID']['output']>;
    /** The combination type ('AND' or 'OR'). */
    type?: Maybe<GenericCombinationStrategyType>;
    /** Time when this GenericCombinationStrategy was last updated */
    updatedAt?: Maybe<Scalars['Time']['output']>;
}

/** The available combination strategy types. */
export const enum GenericCombinationStrategyType {
    /** Represents a logical AND combination. */
    And = 'AND',
    /** Represents a logical OR combination. */
    Or = 'OR'
}

/** Represents a mapping between a source data type and a target key for generic values. */
export interface GenericMapper {
    __typename?: 'GenericMapper';
    /** Time when this GenericMapper was created */
    createdAt?: Maybe<Scalars['Time']['output']>;
    /** Combination strategies associated with this generic mapper. */
    genericCombinationStrategies?: Maybe<Array<GenericCombinationStrategy>>;
    /** Global ID of this GenericMapper */
    id?: Maybe<Scalars['GenericMapperID']['output']>;
    /** The source data type identifier. */
    sourceDataTypeIdentifiers?: Maybe<Array<DataTypeIdentifier>>;
    /** The target key for the generic value. */
    target?: Maybe<Scalars['String']['output']>;
    /** Time when this GenericMapper was last updated */
    updatedAt?: Maybe<Scalars['Time']['output']>;
}

/** Input type for generic mappers */
export interface GenericMapperInput {
    /** The source data type identifier for the mapper */
    sources: Array<DataTypeIdentifierInput>;
    /** The target data type identifier for the mapper */
    target: Scalars['String']['input'];
}

/** Represents a generic type that can be used in various contexts. */
export interface GenericType {
    __typename?: 'GenericType';
    /** Time when this GenericType was created */
    createdAt?: Maybe<Scalars['Time']['output']>;
    /** The data type associated with this generic type. */
    dataType?: Maybe<DataType>;
    /** The mappers associated with this generic type. */
    genericMappers?: Maybe<Array<GenericMapper>>;
    /** Global ID of this GenericType */
    id?: Maybe<Scalars['GenericTypeID']['output']>;
    /** Time when this GenericType was last updated */
    updatedAt?: Maybe<Scalars['Time']['output']>;
}

/** Input type for generic type operations. */
export interface GenericTypeInput {
    /** The data type associated with this generic type. */
    dataTypeId: Scalars['DataTypeID']['input'];
    /** The mappers associated with this generic type. */
    genericMappers: Array<GenericMapperInput>;
}

/** Represents the input for external user identity validation */
export interface IdentityInput {
    /** This validation code will be used for the oAuth validation process */
    code?: InputMaybe<Scalars['String']['input']>;
}

/** Represents a literal value, such as a string or number. */
export interface LiteralValue {
    __typename?: 'LiteralValue';
    /** Time when this LiteralValue was created */
    createdAt?: Maybe<Scalars['Time']['output']>;
    /** Time when this LiteralValue was last updated */
    updatedAt?: Maybe<Scalars['Time']['output']>;
    /** The literal value itself as JSON. */
    value?: Maybe<Scalars['JSON']['output']>;
}

/** Represents an error message */
export interface MessageError {
    __typename?: 'MessageError';
    /** The message provided from the error */
    message?: Maybe<Scalars['String']['output']>;
}

/** Represents the input for mfa authentication */
export interface MfaInput {
    /** The type of the mfa authentication */
    type: MfaType;
    /** The value of the authentication */
    value: Scalars['String']['input'];
}

/** Represent all available types to authenticate with mfa */
export const enum MfaType {
    /** Single use backup code */
    BackupCode = 'BACKUP_CODE',
    /** Time based onetime password */
    Totp = 'TOTP'
}

/** Root Mutation type */
export interface Mutation {
    __typename?: 'Mutation';
    /** Update application settings. */
    applicationSettingsUpdate?: Maybe<ApplicationSettingsUpdatePayload>;
    /**
     * A mutation that does not perform any changes.
     *
     * This is expected to be used for testing of endpoints, to verify
     * that a user has mutation access.
     *
     */
    echo?: Maybe<EchoPayload>;
    /** (EE only) Create a new namespace license. */
    namespacesLicensesCreate?: Maybe<NamespacesLicensesCreatePayload>;
    /** (EE only) Deletes an namespace license. */
    namespacesLicensesDelete?: Maybe<NamespacesLicensesDeletePayload>;
    /** Update the roles a member is assigned to. */
    namespacesMembersAssignRoles?: Maybe<NamespacesMembersAssignRolesPayload>;
    /** Remove a member from a namespace. */
    namespacesMembersDelete?: Maybe<NamespacesMembersDeletePayload>;
    /** Invite a new member to a namespace. */
    namespacesMembersInvite?: Maybe<NamespacesMembersInvitePayload>;
    /** Assign runtimes to a project */
    namespacesProjectsAssignRuntimes?: Maybe<NamespacesProjectsAssignRuntimesPayload>;
    /** Creates a new namespace project. */
    namespacesProjectsCreate?: Maybe<NamespacesProjectsCreatePayload>;
    /** Deletes a namespace project. */
    namespacesProjectsDelete?: Maybe<NamespacesProjectsDeletePayload>;
    /** Creates a new flow. */
    namespacesProjectsFlowsCreate?: Maybe<NamespacesProjectsFlowsCreatePayload>;
    /** Deletes a namespace project. */
    namespacesProjectsFlowsDelete?: Maybe<NamespacesProjectsFlowsDeletePayload>;
    /** Updates a namespace project. */
    namespacesProjectsUpdate?: Maybe<NamespacesProjectsUpdatePayload>;
    /** Update the abilities a role is granted. */
    namespacesRolesAssignAbilities?: Maybe<NamespacesRolesAssignAbilitiesPayload>;
    /** Update the project a role is assigned to. */
    namespacesRolesAssignProjects?: Maybe<NamespacesRolesAssignProjectsPayload>;
    /** Create a new role in a namespace. */
    namespacesRolesCreate?: Maybe<NamespacesRolesCreatePayload>;
    /** Delete an existing role in a namespace. */
    namespacesRolesDelete?: Maybe<NamespacesRolesDeletePayload>;
    /** Update an existing namespace role. */
    namespacesRolesUpdate?: Maybe<NamespacesRolesUpdatePayload>;
    /** Create a new organization. */
    organizationsCreate?: Maybe<OrganizationsCreatePayload>;
    /** Delete an existing organization. */
    organizationsDelete?: Maybe<OrganizationsDeletePayload>;
    /** Update an existing organization. */
    organizationsUpdate?: Maybe<OrganizationsUpdatePayload>;
    /** Create a new runtime. */
    runtimesCreate?: Maybe<RuntimesCreatePayload>;
    /** Delete an existing runtime. */
    runtimesDelete?: Maybe<RuntimesDeletePayload>;
    /** reloads the token of an existing runtime. */
    runtimesRotateToken?: Maybe<RuntimesRotateTokenPayload>;
    /** Update an existing runtime. */
    runtimesUpdate?: Maybe<RuntimesUpdatePayload>;
    /** Verify your email when changing it or signing up */
    usersEmailVerification?: Maybe<UsersEmailVerificationPayload>;
    /** Links an external identity to an existing user */
    usersIdentityLink?: Maybe<UsersIdentityLinkPayload>;
    /** Login to an existing user via an external identity */
    usersIdentityLogin?: Maybe<UsersIdentityLoginPayload>;
    /** Register a new user via an external identity */
    usersIdentityRegister?: Maybe<UsersIdentityRegisterPayload>;
    /** Unlinks an external identity from an user */
    usersIdentityUnlink?: Maybe<UsersIdentityUnlinkPayload>;
    /** Login to an existing user */
    usersLogin?: Maybe<UsersLoginPayload>;
    /** Logout an existing user session */
    usersLogout?: Maybe<UsersLogoutPayload>;
    /** Rotates the backup codes of a user. */
    usersMfaBackupCodesRotate?: Maybe<UsersMfaBackupCodesRotatePayload>;
    /** Generates an encrypted totp secret */
    usersMfaTotpGenerateSecret?: Maybe<UsersMfaTotpGenerateSecretPayload>;
    /** Validates a TOTP value for the given secret and enables TOTP MFA for the user */
    usersMfaTotpValidateSecret?: Maybe<UsersMfaTotpValidateSecretPayload>;
    /** Reset the password using a reset token */
    usersPasswordReset?: Maybe<UsersPasswordResetPayload>;
    /** Request an password reset */
    usersPasswordResetRequest?: Maybe<UsersPasswordResetRequestPayload>;
    /** Register a new user */
    usersRegister?: Maybe<UsersRegisterPayload>;
    /** Update an existing user. */
    usersUpdate?: Maybe<UsersUpdatePayload>;
}


/** Root Mutation type */
export interface MutationApplicationSettingsUpdateArgs {
    input: ApplicationSettingsUpdateInput;
}


/** Root Mutation type */
export interface MutationEchoArgs {
    input: EchoInput;
}


/** Root Mutation type */
export interface MutationNamespacesLicensesCreateArgs {
    input: NamespacesLicensesCreateInput;
}


/** Root Mutation type */
export interface MutationNamespacesLicensesDeleteArgs {
    input: NamespacesLicensesDeleteInput;
}


/** Root Mutation type */
export interface MutationNamespacesMembersAssignRolesArgs {
    input: NamespacesMembersAssignRolesInput;
}


/** Root Mutation type */
export interface MutationNamespacesMembersDeleteArgs {
    input: NamespacesMembersDeleteInput;
}


/** Root Mutation type */
export interface MutationNamespacesMembersInviteArgs {
    input: NamespacesMembersInviteInput;
}


/** Root Mutation type */
export interface MutationNamespacesProjectsAssignRuntimesArgs {
    input: NamespacesProjectsAssignRuntimesInput;
}


/** Root Mutation type */
export interface MutationNamespacesProjectsCreateArgs {
    input: NamespacesProjectsCreateInput;
}


/** Root Mutation type */
export interface MutationNamespacesProjectsDeleteArgs {
    input: NamespacesProjectsDeleteInput;
}


/** Root Mutation type */
export interface MutationNamespacesProjectsFlowsCreateArgs {
    input: NamespacesProjectsFlowsCreateInput;
}


/** Root Mutation type */
export interface MutationNamespacesProjectsFlowsDeleteArgs {
    input: NamespacesProjectsFlowsDeleteInput;
}


/** Root Mutation type */
export interface MutationNamespacesProjectsUpdateArgs {
    input: NamespacesProjectsUpdateInput;
}


/** Root Mutation type */
export interface MutationNamespacesRolesAssignAbilitiesArgs {
    input: NamespacesRolesAssignAbilitiesInput;
}


/** Root Mutation type */
export interface MutationNamespacesRolesAssignProjectsArgs {
    input: NamespacesRolesAssignProjectsInput;
}


/** Root Mutation type */
export interface MutationNamespacesRolesCreateArgs {
    input: NamespacesRolesCreateInput;
}


/** Root Mutation type */
export interface MutationNamespacesRolesDeleteArgs {
    input: NamespacesRolesDeleteInput;
}


/** Root Mutation type */
export interface MutationNamespacesRolesUpdateArgs {
    input: NamespacesRolesUpdateInput;
}


/** Root Mutation type */
export interface MutationOrganizationsCreateArgs {
    input: OrganizationsCreateInput;
}


/** Root Mutation type */
export interface MutationOrganizationsDeleteArgs {
    input: OrganizationsDeleteInput;
}


/** Root Mutation type */
export interface MutationOrganizationsUpdateArgs {
    input: OrganizationsUpdateInput;
}


/** Root Mutation type */
export interface MutationRuntimesCreateArgs {
    input: RuntimesCreateInput;
}


/** Root Mutation type */
export interface MutationRuntimesDeleteArgs {
    input: RuntimesDeleteInput;
}


/** Root Mutation type */
export interface MutationRuntimesRotateTokenArgs {
    input: RuntimesRotateTokenInput;
}


/** Root Mutation type */
export interface MutationRuntimesUpdateArgs {
    input: RuntimesUpdateInput;
}


/** Root Mutation type */
export interface MutationUsersEmailVerificationArgs {
    input: UsersEmailVerificationInput;
}


/** Root Mutation type */
export interface MutationUsersIdentityLinkArgs {
    input: UsersIdentityLinkInput;
}


/** Root Mutation type */
export interface MutationUsersIdentityLoginArgs {
    input: UsersIdentityLoginInput;
}


/** Root Mutation type */
export interface MutationUsersIdentityRegisterArgs {
    input: UsersIdentityRegisterInput;
}


/** Root Mutation type */
export interface MutationUsersIdentityUnlinkArgs {
    input: UsersIdentityUnlinkInput;
}


/** Root Mutation type */
export interface MutationUsersLoginArgs {
    input: UsersLoginInput;
}


/** Root Mutation type */
export interface MutationUsersLogoutArgs {
    input: UsersLogoutInput;
}


/** Root Mutation type */
export interface MutationUsersMfaBackupCodesRotateArgs {
    input: UsersMfaBackupCodesRotateInput;
}


/** Root Mutation type */
export interface MutationUsersMfaTotpGenerateSecretArgs {
    input: UsersMfaTotpGenerateSecretInput;
}


/** Root Mutation type */
export interface MutationUsersMfaTotpValidateSecretArgs {
    input: UsersMfaTotpValidateSecretInput;
}


/** Root Mutation type */
export interface MutationUsersPasswordResetArgs {
    input: UsersPasswordResetInput;
}


/** Root Mutation type */
export interface MutationUsersPasswordResetRequestArgs {
    input: UsersPasswordResetRequestInput;
}


/** Root Mutation type */
export interface MutationUsersRegisterArgs {
    input: UsersRegisterInput;
}


/** Root Mutation type */
export interface MutationUsersUpdateArgs {
    input: UsersUpdateInput;
}

/** Represents a Namespace */
export interface Namespace {
    __typename?: 'Namespace';
    /** Time when this Namespace was created */
    createdAt?: Maybe<Scalars['Time']['output']>;
    /** Global ID of this Namespace */
    id?: Maybe<Scalars['NamespaceID']['output']>;
    /** Members of the namespace */
    members?: Maybe<NamespaceMemberConnection>;
    /** (EE only) Licenses of the namespace */
    namespaceLicenses?: Maybe<NamespaceLicenseConnection>;
    /** Parent of this namespace */
    parent?: Maybe<NamespaceParent>;
    /** Projects of the namespace */
    projects?: Maybe<NamespaceProjectConnection>;
    /** Roles of the namespace */
    roles?: Maybe<NamespaceRoleConnection>;
    /** Runtime of the namespace */
    runtimes?: Maybe<RuntimeConnection>;
    /** Time when this Namespace was last updated */
    updatedAt?: Maybe<Scalars['Time']['output']>;
}


/** Represents a Namespace */
export interface NamespaceMembersArgs {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
}


/** Represents a Namespace */
export interface NamespaceNamespaceLicensesArgs {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
}


/** Represents a Namespace */
export interface NamespaceProjectsArgs {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
}


/** Represents a Namespace */
export interface NamespaceRolesArgs {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
}


/** Represents a Namespace */
export interface NamespaceRuntimesArgs {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
}

/** (EE only) Represents a Namespace License */
export interface NamespaceLicense {
    __typename?: 'NamespaceLicense';
    /** Time when this NamespaceLicense was created */
    createdAt?: Maybe<Scalars['Time']['output']>;
    /** The end date of the license */
    endDate?: Maybe<Scalars['Time']['output']>;
    /** Global ID of this NamespaceLicense */
    id?: Maybe<Scalars['NamespaceLicenseID']['output']>;
    /** The licensee information */
    licensee?: Maybe<Scalars['JSON']['output']>;
    /** The namespace the license belongs to */
    namespace?: Maybe<Namespace>;
    /** The start date of the license */
    startDate?: Maybe<Scalars['Time']['output']>;
    /** Time when this NamespaceLicense was last updated */
    updatedAt?: Maybe<Scalars['Time']['output']>;
}

/** The connection type for NamespaceLicense. */
export interface NamespaceLicenseConnection {
    __typename?: 'NamespaceLicenseConnection';
    /** Total count of collection. */
    count?: Maybe<Scalars['Int']['output']>;
    /** A list of edges. */
    edges?: Maybe<Array<Maybe<NamespaceLicenseEdge>>>;
    /** A list of nodes. */
    nodes?: Maybe<Array<Maybe<NamespaceLicense>>>;
    /** Information to aid in pagination. */
    pageInfo?: Maybe<PageInfo>;
}

/** An edge in a connection. */
export interface NamespaceLicenseEdge {
    __typename?: 'NamespaceLicenseEdge';
    /** A cursor for use in pagination. */
    cursor?: Maybe<Scalars['String']['output']>;
    /** The item at the end of the edge. */
    node?: Maybe<NamespaceLicense>;
}

/** Represents a namespace member */
export interface NamespaceMember {
    __typename?: 'NamespaceMember';
    /** Time when this NamespaceMember was created */
    createdAt?: Maybe<Scalars['Time']['output']>;
    /** Global ID of this NamespaceMember */
    id?: Maybe<Scalars['NamespaceMemberID']['output']>;
    /** Memberroles of the member */
    memberRoles?: Maybe<NamespaceMemberRoleConnection>;
    /** Namespace this member belongs to */
    namespace?: Maybe<Namespace>;
    /** Roles of the member */
    roles?: Maybe<NamespaceRoleConnection>;
    /** Time when this NamespaceMember was last updated */
    updatedAt?: Maybe<Scalars['Time']['output']>;
    /** User this member belongs to */
    user?: Maybe<User>;
}


/** Represents a namespace member */
export interface NamespaceMemberMemberRolesArgs {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
}


/** Represents a namespace member */
export interface NamespaceMemberRolesArgs {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
}

/** The connection type for NamespaceMember. */
export interface NamespaceMemberConnection {
    __typename?: 'NamespaceMemberConnection';
    /** Total count of collection. */
    count?: Maybe<Scalars['Int']['output']>;
    /** A list of edges. */
    edges?: Maybe<Array<Maybe<NamespaceMemberEdge>>>;
    /** A list of nodes. */
    nodes?: Maybe<Array<Maybe<NamespaceMember>>>;
    /** Information to aid in pagination. */
    pageInfo?: Maybe<PageInfo>;
}

/** An edge in a connection. */
export interface NamespaceMemberEdge {
    __typename?: 'NamespaceMemberEdge';
    /** A cursor for use in pagination. */
    cursor?: Maybe<Scalars['String']['output']>;
    /** The item at the end of the edge. */
    node?: Maybe<NamespaceMember>;
}

/** Represents an assigned role to a member */
export interface NamespaceMemberRole {
    __typename?: 'NamespaceMemberRole';
    /** Time when this NamespaceMemberRole was created */
    createdAt?: Maybe<Scalars['Time']['output']>;
    /** Global ID of this NamespaceMemberRole */
    id?: Maybe<Scalars['NamespaceMemberRoleID']['output']>;
    /** The member the role is assigned to */
    member?: Maybe<NamespaceMember>;
    /** The assigned role */
    role?: Maybe<NamespaceRole>;
    /** Time when this NamespaceMemberRole was last updated */
    updatedAt?: Maybe<Scalars['Time']['output']>;
}

/** The connection type for NamespaceMemberRole. */
export interface NamespaceMemberRoleConnection {
    __typename?: 'NamespaceMemberRoleConnection';
    /** Total count of collection. */
    count?: Maybe<Scalars['Int']['output']>;
    /** A list of edges. */
    edges?: Maybe<Array<Maybe<NamespaceMemberRoleEdge>>>;
    /** A list of nodes. */
    nodes?: Maybe<Array<Maybe<NamespaceMemberRole>>>;
    /** Information to aid in pagination. */
    pageInfo?: Maybe<PageInfo>;
}

/** An edge in a connection. */
export interface NamespaceMemberRoleEdge {
    __typename?: 'NamespaceMemberRoleEdge';
    /** A cursor for use in pagination. */
    cursor?: Maybe<Scalars['String']['output']>;
    /** The item at the end of the edge. */
    node?: Maybe<NamespaceMemberRole>;
}

/** Objects that can present a namespace */
export type NamespaceParent = Organization | User;

/** Represents a namespace project */
export interface NamespaceProject {
    __typename?: 'NamespaceProject';
    /** Time when this NamespaceProject was created */
    createdAt?: Maybe<Scalars['Time']['output']>;
    /** Description of the project */
    description?: Maybe<Scalars['String']['output']>;
    /** Fetches an flow given by its ID */
    flow?: Maybe<Flow>;
    /** Fetches all flows in this project */
    flows?: Maybe<FlowConnection>;
    /** Global ID of this NamespaceProject */
    id?: Maybe<Scalars['NamespaceProjectID']['output']>;
    /** Name of the project */
    name?: Maybe<Scalars['String']['output']>;
    /** The namespace where this project belongs to */
    namespace?: Maybe<Namespace>;
    /** The primary runtime for the project */
    primaryRuntime?: Maybe<Runtime>;
    /** Runtimes assigned to this project */
    runtimes?: Maybe<RuntimeConnection>;
    /** Time when this NamespaceProject was last updated */
    updatedAt?: Maybe<Scalars['Time']['output']>;
}


/** Represents a namespace project */
export interface NamespaceProjectFlowArgs {
    id: Scalars['FlowID']['input'];
}


/** Represents a namespace project */
export interface NamespaceProjectFlowsArgs {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
}


/** Represents a namespace project */
export interface NamespaceProjectRuntimesArgs {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
}

/** The connection type for NamespaceProject. */
export interface NamespaceProjectConnection {
    __typename?: 'NamespaceProjectConnection';
    /** Total count of collection. */
    count?: Maybe<Scalars['Int']['output']>;
    /** A list of edges. */
    edges?: Maybe<Array<Maybe<NamespaceProjectEdge>>>;
    /** A list of nodes. */
    nodes?: Maybe<Array<Maybe<NamespaceProject>>>;
    /** Information to aid in pagination. */
    pageInfo?: Maybe<PageInfo>;
}

/** An edge in a connection. */
export interface NamespaceProjectEdge {
    __typename?: 'NamespaceProjectEdge';
    /** A cursor for use in pagination. */
    cursor?: Maybe<Scalars['String']['output']>;
    /** The item at the end of the edge. */
    node?: Maybe<NamespaceProject>;
}

/** Represents a namespace role. */
export interface NamespaceRole {
    __typename?: 'NamespaceRole';
    /** The abilities the role is granted */
    abilities?: Maybe<Array<NamespaceRoleAbility>>;
    /** The projects this role is assigned to */
    assignedProjects?: Maybe<NamespaceProjectConnection>;
    /** Time when this NamespaceRole was created */
    createdAt?: Maybe<Scalars['Time']['output']>;
    /** Global ID of this NamespaceRole */
    id?: Maybe<Scalars['NamespaceRoleID']['output']>;
    /** The name of this role */
    name?: Maybe<Scalars['String']['output']>;
    /** The namespace where this role belongs to */
    namespace?: Maybe<Namespace>;
    /** Time when this NamespaceRole was last updated */
    updatedAt?: Maybe<Scalars['Time']['output']>;
}


/** Represents a namespace role. */
export interface NamespaceRoleAssignedProjectsArgs {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
}

/** Represents abilities that can be granted to roles in namespaces. */
export const enum NamespaceRoleAbility {
    /** Allows to change the roles of a namespace member */
    AssignMemberRoles = 'ASSIGN_MEMBER_ROLES',
    /** Allows to assign runtimes to a project in the namespace */
    AssignProjectRuntimes = 'ASSIGN_PROJECT_RUNTIMES',
    /** Allows to change the abilities of a namespace role */
    AssignRoleAbilities = 'ASSIGN_ROLE_ABILITIES',
    /** Allows to change the assigned projects of a namespace role */
    AssignRoleProjects = 'ASSIGN_ROLE_PROJECTS',
    /** Allows to create flows in a namespace project */
    CreateFlows = 'CREATE_FLOWS',
    /** Allows to create a license for the namespace */
    CreateNamespaceLicense = 'CREATE_NAMESPACE_LICENSE',
    /** Allows to create a project in the namespace */
    CreateNamespaceProject = 'CREATE_NAMESPACE_PROJECT',
    /** Allows the creation of roles in a namespace */
    CreateNamespaceRole = 'CREATE_NAMESPACE_ROLE',
    /** Allows to create a runtime globally or for the namespace */
    CreateRuntime = 'CREATE_RUNTIME',
    /** Allows to delete flows in a namespace project */
    DeleteFlows = 'DELETE_FLOWS',
    /** Allows to remove members of a namespace */
    DeleteMember = 'DELETE_MEMBER',
    /** Allows to delete the license of the namespace */
    DeleteNamespaceLicense = 'DELETE_NAMESPACE_LICENSE',
    /** Allows to delete the project of the namespace */
    DeleteNamespaceProject = 'DELETE_NAMESPACE_PROJECT',
    /** Allows the deletion of roles in a namespace */
    DeleteNamespaceRole = 'DELETE_NAMESPACE_ROLE',
    /** Allows to delete the organization */
    DeleteOrganization = 'DELETE_ORGANIZATION',
    /** Allows to delete a runtime */
    DeleteRuntime = 'DELETE_RUNTIME',
    /** Allows to invite new members to a namespace */
    InviteMember = 'INVITE_MEMBER',
    /** Allows to perform any action in the namespace */
    NamespaceAdministrator = 'NAMESPACE_ADMINISTRATOR',
    /** Allows to read the license of the namespace */
    ReadNamespaceLicense = 'READ_NAMESPACE_LICENSE',
    /** Allows to read the project of the namespace */
    ReadNamespaceProject = 'READ_NAMESPACE_PROJECT',
    /** Allows to regenerate a runtime token */
    RotateRuntimeToken = 'ROTATE_RUNTIME_TOKEN',
    /** Allows to update flows in the project */
    UpdateFlows = 'UPDATE_FLOWS',
    /** Allows to update the project of the namespace */
    UpdateNamespaceProject = 'UPDATE_NAMESPACE_PROJECT',
    /** Allows to update the namespace role */
    UpdateNamespaceRole = 'UPDATE_NAMESPACE_ROLE',
    /** Allows to update the organization */
    UpdateOrganization = 'UPDATE_ORGANIZATION',
    /** Allows to update a runtime globally or for the namespace */
    UpdateRuntime = 'UPDATE_RUNTIME'
}

/** The connection type for NamespaceRole. */
export interface NamespaceRoleConnection {
    __typename?: 'NamespaceRoleConnection';
    /** Total count of collection. */
    count?: Maybe<Scalars['Int']['output']>;
    /** A list of edges. */
    edges?: Maybe<Array<Maybe<NamespaceRoleEdge>>>;
    /** A list of nodes. */
    nodes?: Maybe<Array<Maybe<NamespaceRole>>>;
    /** Information to aid in pagination. */
    pageInfo?: Maybe<PageInfo>;
}

/** An edge in a connection. */
export interface NamespaceRoleEdge {
    __typename?: 'NamespaceRoleEdge';
    /** A cursor for use in pagination. */
    cursor?: Maybe<Scalars['String']['output']>;
    /** The item at the end of the edge. */
    node?: Maybe<NamespaceRole>;
}

/** Autogenerated input type of NamespacesLicensesCreate */
export interface NamespacesLicensesCreateInput {
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    /** The license data. */
    data: Scalars['String']['input'];
    /** The namespace ID. */
    namespaceId: Scalars['NamespaceID']['input'];
}

/** Autogenerated return type of NamespacesLicensesCreate. */
export interface NamespacesLicensesCreatePayload {
    __typename?: 'NamespacesLicensesCreatePayload';
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: Maybe<Scalars['String']['output']>;
    /** Errors encountered during execution of the mutation. */
    errors?: Maybe<Array<Error>>;
    /** The newly created license. */
    namespaceLicense?: Maybe<NamespaceLicense>;
}

/** Autogenerated input type of NamespacesLicensesDelete */
export interface NamespacesLicensesDeleteInput {
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    /** The license id to delete. */
    namespaceLicenseId: Scalars['NamespaceLicenseID']['input'];
}

/** Autogenerated return type of NamespacesLicensesDelete. */
export interface NamespacesLicensesDeletePayload {
    __typename?: 'NamespacesLicensesDeletePayload';
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: Maybe<Scalars['String']['output']>;
    /** Errors encountered during execution of the mutation. */
    errors?: Maybe<Array<Error>>;
    /** The deleted namespace license. */
    namespaceLicense?: Maybe<NamespaceLicense>;
}

/** Autogenerated input type of NamespacesMembersAssignRoles */
export interface NamespacesMembersAssignRolesInput {
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    /** The id of the member which should be assigned the roles */
    memberId: Scalars['NamespaceMemberID']['input'];
    /** The roles the member should be assigned to the member */
    roleIds: Array<Scalars['NamespaceRoleID']['input']>;
}

/** Autogenerated return type of NamespacesMembersAssignRoles. */
export interface NamespacesMembersAssignRolesPayload {
    __typename?: 'NamespacesMembersAssignRolesPayload';
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: Maybe<Scalars['String']['output']>;
    /** Errors encountered during execution of the mutation. */
    errors?: Maybe<Array<Error>>;
    /** The roles the member is now assigned to */
    namespaceMemberRoles?: Maybe<Array<NamespaceMemberRole>>;
}

/** Autogenerated input type of NamespacesMembersDelete */
export interface NamespacesMembersDeleteInput {
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    /** The id of the namespace member to remove */
    namespaceMemberId: Scalars['NamespaceMemberID']['input'];
}

/** Autogenerated return type of NamespacesMembersDelete. */
export interface NamespacesMembersDeletePayload {
    __typename?: 'NamespacesMembersDeletePayload';
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: Maybe<Scalars['String']['output']>;
    /** Errors encountered during execution of the mutation. */
    errors?: Maybe<Array<Error>>;
    /** The removed namespace member */
    namespaceMember?: Maybe<NamespaceMember>;
}

/** Autogenerated input type of NamespacesMembersInvite */
export interface NamespacesMembersInviteInput {
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    /** The id of the namespace which this member will belong to */
    namespaceId: Scalars['NamespaceID']['input'];
    /** The id of the user to invite */
    userId: Scalars['UserID']['input'];
}

/** Autogenerated return type of NamespacesMembersInvite. */
export interface NamespacesMembersInvitePayload {
    __typename?: 'NamespacesMembersInvitePayload';
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: Maybe<Scalars['String']['output']>;
    /** Errors encountered during execution of the mutation. */
    errors?: Maybe<Array<Error>>;
    /** The newly created namespace member */
    namespaceMember?: Maybe<NamespaceMember>;
}

/** Autogenerated input type of NamespacesProjectsAssignRuntimes */
export interface NamespacesProjectsAssignRuntimesInput {
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    /** ID of the project to assign runtimes to */
    namespaceProjectId: Scalars['NamespaceProjectID']['input'];
    /** The new runtimes assigned to the project */
    runtimeIds: Array<Scalars['RuntimeID']['input']>;
}

/** Autogenerated return type of NamespacesProjectsAssignRuntimes. */
export interface NamespacesProjectsAssignRuntimesPayload {
    __typename?: 'NamespacesProjectsAssignRuntimesPayload';
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: Maybe<Scalars['String']['output']>;
    /** Errors encountered during execution of the mutation. */
    errors?: Maybe<Array<Error>>;
    /** The updated project with assigned runtimes */
    namespaceProject?: Maybe<NamespaceProject>;
}

/** Autogenerated input type of NamespacesProjectsCreate */
export interface NamespacesProjectsCreateInput {
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    /** Description for the new project. */
    description?: InputMaybe<Scalars['String']['input']>;
    /** Name for the new project. */
    name: Scalars['String']['input'];
    /** The id of the namespace which this project will belong to */
    namespaceId: Scalars['NamespaceID']['input'];
}

/** Autogenerated return type of NamespacesProjectsCreate. */
export interface NamespacesProjectsCreatePayload {
    __typename?: 'NamespacesProjectsCreatePayload';
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: Maybe<Scalars['String']['output']>;
    /** Errors encountered during execution of the mutation. */
    errors?: Maybe<Array<Error>>;
    /** The newly created project. */
    namespaceProject?: Maybe<NamespaceProject>;
}

/** Autogenerated input type of NamespacesProjectsDelete */
export interface NamespacesProjectsDeleteInput {
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    /** The id of the namespace project which will be deleted */
    namespaceProjectId: Scalars['NamespaceProjectID']['input'];
}

/** Autogenerated return type of NamespacesProjectsDelete. */
export interface NamespacesProjectsDeletePayload {
    __typename?: 'NamespacesProjectsDeletePayload';
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: Maybe<Scalars['String']['output']>;
    /** Errors encountered during execution of the mutation. */
    errors?: Maybe<Array<Error>>;
    /** The deleted project. */
    namespaceProject?: Maybe<NamespaceProject>;
}

/** Autogenerated input type of NamespacesProjectsFlowsCreate */
export interface NamespacesProjectsFlowsCreateInput {
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    /** The flow to create */
    flow: FlowInput;
    /** The ID of the project to which the flow belongs to */
    projectId: Scalars['NamespaceProjectID']['input'];
}

/** Autogenerated return type of NamespacesProjectsFlowsCreate. */
export interface NamespacesProjectsFlowsCreatePayload {
    __typename?: 'NamespacesProjectsFlowsCreatePayload';
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: Maybe<Scalars['String']['output']>;
    /** Errors encountered during execution of the mutation. */
    errors?: Maybe<Array<Error>>;
    /** The newly created flow. */
    flow?: Maybe<Flow>;
}

/** Autogenerated input type of NamespacesProjectsFlowsDelete */
export interface NamespacesProjectsFlowsDeleteInput {
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    /** The id of the flow which will be deleted */
    flowId: Scalars['FlowID']['input'];
}

/** Autogenerated return type of NamespacesProjectsFlowsDelete. */
export interface NamespacesProjectsFlowsDeletePayload {
    __typename?: 'NamespacesProjectsFlowsDeletePayload';
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: Maybe<Scalars['String']['output']>;
    /** Errors encountered during execution of the mutation. */
    errors?: Maybe<Array<Error>>;
    /** The deleted flow. */
    flow?: Maybe<Flow>;
}

/** Autogenerated input type of NamespacesProjectsUpdate */
export interface NamespacesProjectsUpdateInput {
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    /** Description for the updated project. */
    description?: InputMaybe<Scalars['String']['input']>;
    /** Name for the updated project. */
    name?: InputMaybe<Scalars['String']['input']>;
    /** The id of the namespace project which will be updated */
    namespaceProjectId: Scalars['NamespaceProjectID']['input'];
    /** The primary runtime for the updated project. */
    primaryRuntimeId?: InputMaybe<Scalars['RuntimeID']['input']>;
}

/** Autogenerated return type of NamespacesProjectsUpdate. */
export interface NamespacesProjectsUpdatePayload {
    __typename?: 'NamespacesProjectsUpdatePayload';
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: Maybe<Scalars['String']['output']>;
    /** Errors encountered during execution of the mutation. */
    errors?: Maybe<Array<Error>>;
    /** The updated project. */
    namespaceProject?: Maybe<NamespaceProject>;
}

/** Autogenerated input type of NamespacesRolesAssignAbilities */
export interface NamespacesRolesAssignAbilitiesInput {
    /** The abilities that should be granted to the ability */
    abilities: Array<NamespaceRoleAbility>;
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    /** The id of the role which should be granted the abilities */
    roleId: Scalars['NamespaceRoleID']['input'];
}

/** Autogenerated return type of NamespacesRolesAssignAbilities. */
export interface NamespacesRolesAssignAbilitiesPayload {
    __typename?: 'NamespacesRolesAssignAbilitiesPayload';
    /** The now granted abilities */
    abilities?: Maybe<Array<NamespaceRoleAbility>>;
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: Maybe<Scalars['String']['output']>;
    /** Errors encountered during execution of the mutation. */
    errors?: Maybe<Array<Error>>;
}

/** Autogenerated input type of NamespacesRolesAssignProjects */
export interface NamespacesRolesAssignProjectsInput {
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    /** The projects that should be assigned to the role */
    projectIds: Array<Scalars['NamespaceProjectID']['input']>;
    /** The id of the role which should be assigned to projects */
    roleId: Scalars['NamespaceRoleID']['input'];
}

/** Autogenerated return type of NamespacesRolesAssignProjects. */
export interface NamespacesRolesAssignProjectsPayload {
    __typename?: 'NamespacesRolesAssignProjectsPayload';
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: Maybe<Scalars['String']['output']>;
    /** Errors encountered during execution of the mutation. */
    errors?: Maybe<Array<Error>>;
    /** The now assigned projects */
    projects?: Maybe<Array<NamespaceProject>>;
}

/** Autogenerated input type of NamespacesRolesCreate */
export interface NamespacesRolesCreateInput {
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    /** The name for the new role */
    name: Scalars['String']['input'];
    /** The id of the namespace which this role will belong to */
    namespaceId: Scalars['NamespaceID']['input'];
}

/** Autogenerated return type of NamespacesRolesCreate. */
export interface NamespacesRolesCreatePayload {
    __typename?: 'NamespacesRolesCreatePayload';
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: Maybe<Scalars['String']['output']>;
    /** Errors encountered during execution of the mutation. */
    errors?: Maybe<Array<Error>>;
    /** The newly created namespace role */
    namespaceRole?: Maybe<NamespaceRole>;
}

/** Autogenerated input type of NamespacesRolesDelete */
export interface NamespacesRolesDeleteInput {
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    /** The id of the namespace role which will be deleted */
    namespaceRoleId: Scalars['NamespaceRoleID']['input'];
}

/** Autogenerated return type of NamespacesRolesDelete. */
export interface NamespacesRolesDeletePayload {
    __typename?: 'NamespacesRolesDeletePayload';
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: Maybe<Scalars['String']['output']>;
    /** Errors encountered during execution of the mutation. */
    errors?: Maybe<Array<Error>>;
    /** The deleted namespace role */
    namespaceRole?: Maybe<NamespaceRole>;
}

/** Autogenerated input type of NamespacesRolesUpdate */
export interface NamespacesRolesUpdateInput {
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    /** Name for the namespace role. */
    name: Scalars['String']['input'];
    /** ID of the namespace role to update. */
    namespaceRoleId: Scalars['NamespaceRoleID']['input'];
}

/** Autogenerated return type of NamespacesRolesUpdate. */
export interface NamespacesRolesUpdatePayload {
    __typename?: 'NamespacesRolesUpdatePayload';
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: Maybe<Scalars['String']['output']>;
    /** Errors encountered during execution of the mutation. */
    errors?: Maybe<Array<Error>>;
    /** The updated namespace role. */
    namespaceRole?: Maybe<NamespaceRole>;
}

/** An object with an ID. */
export interface Node {
    /** ID of the object. */
    id?: Maybe<Scalars['ID']['output']>;
}

/** Represents a Node Function */
export interface NodeFunction {
    __typename?: 'NodeFunction';
    /** Time when this NodeFunction was created */
    createdAt?: Maybe<Scalars['Time']['output']>;
    /** The definition of the Node Function */
    functionDefinition?: Maybe<FunctionDefinition>;
    /** Global ID of this NodeFunction */
    id?: Maybe<Scalars['NodeFunctionID']['output']>;
    /** The ID of the next Node Function in the flow */
    nextNodeId?: Maybe<Scalars['NodeFunctionID']['output']>;
    /** The parameters of the Node Function */
    parameters?: Maybe<NodeParameterConnection>;
    /** Time when this NodeFunction was last updated */
    updatedAt?: Maybe<Scalars['Time']['output']>;
}


/** Represents a Node Function */
export interface NodeFunctionParametersArgs {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
}

/** The connection type for NodeFunction. */
export interface NodeFunctionConnection {
    __typename?: 'NodeFunctionConnection';
    /** Total count of collection. */
    count?: Maybe<Scalars['Int']['output']>;
    /** A list of edges. */
    edges?: Maybe<Array<Maybe<NodeFunctionEdge>>>;
    /** A list of nodes. */
    nodes?: Maybe<Array<Maybe<NodeFunction>>>;
    /** Information to aid in pagination. */
    pageInfo?: Maybe<PageInfo>;
}

/** An edge in a connection. */
export interface NodeFunctionEdge {
    __typename?: 'NodeFunctionEdge';
    /** A cursor for use in pagination. */
    cursor?: Maybe<Scalars['String']['output']>;
    /** The item at the end of the edge. */
    node?: Maybe<NodeFunction>;
}

/** Input type for a Node Function */
export interface NodeFunctionInput {
    /** The next Node Function in the flow */
    nextNode?: InputMaybe<NodeFunctionInput>;
    /** The parameters of the Node Function */
    parameters: Array<NodeParameterInput>;
    /** The identifier of the Runtime Function Definition */
    runtimeFunctionId: Scalars['RuntimeFunctionDefinitionID']['input'];
}

/** Represents a Node parameter */
export interface NodeParameter {
    __typename?: 'NodeParameter';
    /** Time when this NodeParameter was created */
    createdAt?: Maybe<Scalars['Time']['output']>;
    /** Global ID of this NodeParameter */
    id?: Maybe<Scalars['NodeParameterID']['output']>;
    /** The definition of the parameter */
    runtimeParameter?: Maybe<RuntimeParameterDefinition>;
    /** Time when this NodeParameter was last updated */
    updatedAt?: Maybe<Scalars['Time']['output']>;
    /** The value of the parameter */
    value?: Maybe<NodeParameterValue>;
}

/** The connection type for NodeParameter. */
export interface NodeParameterConnection {
    __typename?: 'NodeParameterConnection';
    /** Total count of collection. */
    count?: Maybe<Scalars['Int']['output']>;
    /** A list of edges. */
    edges?: Maybe<Array<Maybe<NodeParameterEdge>>>;
    /** A list of nodes. */
    nodes?: Maybe<Array<Maybe<NodeParameter>>>;
    /** Information to aid in pagination. */
    pageInfo?: Maybe<PageInfo>;
}

/** An edge in a connection. */
export interface NodeParameterEdge {
    __typename?: 'NodeParameterEdge';
    /** A cursor for use in pagination. */
    cursor?: Maybe<Scalars['String']['output']>;
    /** The item at the end of the edge. */
    node?: Maybe<NodeParameter>;
}

/** Input type for Node parameter */
export interface NodeParameterInput {
    /** The identifier of the Runtime Parameter Definition */
    runtimeParameterDefinitionId: Scalars['RuntimeParameterDefinitionID']['input'];
    /** The value of the parameter */
    value?: InputMaybe<NodeParameterValueInput>;
}

/** Represents a parameter value for a node. */
export type NodeParameterValue = LiteralValue | NodeFunction | ReferenceValue;

/** Input type for parameter value */
export interface NodeParameterValueInput {
    /** The function value of the parameter */
    functionValue?: InputMaybe<NodeFunctionInput>;
    /** The literal value of the parameter */
    literalValue?: InputMaybe<Scalars['JSON']['input']>;
    /** The reference value of the parameter */
    referenceValue?: InputMaybe<ReferenceValueInput>;
}

/** Represents a Organization */
export interface Organization {
    __typename?: 'Organization';
    /** Time when this Organization was created */
    createdAt?: Maybe<Scalars['Time']['output']>;
    /** Global ID of this Organization */
    id?: Maybe<Scalars['OrganizationID']['output']>;
    /** Name of the organization */
    name?: Maybe<Scalars['String']['output']>;
    /** Namespace of this organization */
    namespace?: Maybe<Namespace>;
    /** Time when this Organization was last updated */
    updatedAt?: Maybe<Scalars['Time']['output']>;
}

/** Autogenerated input type of OrganizationsCreate */
export interface OrganizationsCreateInput {
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    /** Name for the new organization. */
    name: Scalars['String']['input'];
}

/** Autogenerated return type of OrganizationsCreate. */
export interface OrganizationsCreatePayload {
    __typename?: 'OrganizationsCreatePayload';
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: Maybe<Scalars['String']['output']>;
    /** Errors encountered during execution of the mutation. */
    errors?: Maybe<Array<Error>>;
    /** The newly created organization. */
    organization?: Maybe<Organization>;
}

/** Autogenerated input type of OrganizationsDelete */
export interface OrganizationsDeleteInput {
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    /** The organization to delete. */
    organizationId: Scalars['OrganizationID']['input'];
}

/** Autogenerated return type of OrganizationsDelete. */
export interface OrganizationsDeletePayload {
    __typename?: 'OrganizationsDeletePayload';
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: Maybe<Scalars['String']['output']>;
    /** Errors encountered during execution of the mutation. */
    errors?: Maybe<Array<Error>>;
    /** The deleted organization. */
    organization?: Maybe<Organization>;
}

/** Autogenerated input type of OrganizationsUpdate */
export interface OrganizationsUpdateInput {
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    /** Name for the new organization. */
    name: Scalars['String']['input'];
    /** ID of the organization to update. */
    organizationId: Scalars['OrganizationID']['input'];
}

/** Autogenerated return type of OrganizationsUpdate. */
export interface OrganizationsUpdatePayload {
    __typename?: 'OrganizationsUpdatePayload';
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: Maybe<Scalars['String']['output']>;
    /** Errors encountered during execution of the mutation. */
    errors?: Maybe<Array<Error>>;
    /** The updated organization. */
    organization?: Maybe<Organization>;
}

/** Information about pagination in a connection. */
export interface PageInfo {
    __typename?: 'PageInfo';
    /** When paginating forwards, the cursor to continue. */
    endCursor?: Maybe<Scalars['String']['output']>;
    /** When paginating forwards, are there more items? */
    hasNextPage?: Maybe<Scalars['Boolean']['output']>;
    /** When paginating backwards, are there more items? */
    hasPreviousPage?: Maybe<Scalars['Boolean']['output']>;
    /** When paginating backwards, the cursor to continue. */
    startCursor?: Maybe<Scalars['String']['output']>;
}

/** Represents a parameter definition */
export interface ParameterDefinition {
    __typename?: 'ParameterDefinition';
    /** Time when this ParameterDefinition was created */
    createdAt?: Maybe<Scalars['Time']['output']>;
    /** Data type of the parameter */
    dataTypeIdentifier?: Maybe<DataTypeIdentifier>;
    /** Description of the parameter */
    descriptions?: Maybe<TranslationConnection>;
    /** Documentation of the parameter */
    documentations?: Maybe<TranslationConnection>;
    /** Global ID of this ParameterDefinition */
    id?: Maybe<Scalars['ParameterDefinitionID']['output']>;
    /** Identifier of the parameter */
    identifier?: Maybe<Scalars['String']['output']>;
    /** Name of the parameter */
    names?: Maybe<TranslationConnection>;
    /** Time when this ParameterDefinition was last updated */
    updatedAt?: Maybe<Scalars['Time']['output']>;
}


/** Represents a parameter definition */
export interface ParameterDefinitionDescriptionsArgs {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
}


/** Represents a parameter definition */
export interface ParameterDefinitionDocumentationsArgs {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
}


/** Represents a parameter definition */
export interface ParameterDefinitionNamesArgs {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
}

/** The connection type for ParameterDefinition. */
export interface ParameterDefinitionConnection {
    __typename?: 'ParameterDefinitionConnection';
    /** Total count of collection. */
    count?: Maybe<Scalars['Int']['output']>;
    /** A list of edges. */
    edges?: Maybe<Array<Maybe<ParameterDefinitionEdge>>>;
    /** A list of nodes. */
    nodes?: Maybe<Array<Maybe<ParameterDefinition>>>;
    /** Information to aid in pagination. */
    pageInfo?: Maybe<PageInfo>;
}

/** An edge in a connection. */
export interface ParameterDefinitionEdge {
    __typename?: 'ParameterDefinitionEdge';
    /** A cursor for use in pagination. */
    cursor?: Maybe<Scalars['String']['output']>;
    /** The item at the end of the edge. */
    node?: Maybe<ParameterDefinition>;
}

/** Root Query type */
export interface Query {
    __typename?: 'Query';
    /** Get global application settings */
    applicationSettings?: Maybe<ApplicationSettings>;
    /** Get the currently logged in authentication */
    currentAuthentication?: Maybe<Authentication>;
    /** Get the currently logged in user */
    currentUser?: Maybe<User>;
    /** Field available for use to test API access */
    echo?: Maybe<Scalars['String']['output']>;
    /** Find runtimes */
    globalRuntimes?: Maybe<RuntimeConnection>;
    /** Find a namespace */
    namespace?: Maybe<Namespace>;
    /** Fetches an object given its ID */
    node?: Maybe<Node>;
    /** Fetches a list of objects given a list of IDs */
    nodes?: Maybe<Array<Maybe<Node>>>;
    /** Find a organization */
    organization?: Maybe<Organization>;
    /** Find users */
    users?: Maybe<UserConnection>;
}


/** Root Query type */
export interface QueryEchoArgs {
    message: Scalars['String']['input'];
}


/** Root Query type */
export interface QueryGlobalRuntimesArgs {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
}


/** Root Query type */
export interface QueryNamespaceArgs {
    id: Scalars['NamespaceID']['input'];
}


/** Root Query type */
export interface QueryNodeArgs {
    id: Scalars['ID']['input'];
}


/** Root Query type */
export interface QueryNodesArgs {
    ids: Array<Scalars['ID']['input']>;
}


/** Root Query type */
export interface QueryOrganizationArgs {
    id?: InputMaybe<Scalars['OrganizationID']['input']>;
    name?: InputMaybe<Scalars['String']['input']>;
}


/** Root Query type */
export interface QueryUsersArgs {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
}

/** Represents a reference path in a flow */
export interface ReferencePath {
    __typename?: 'ReferencePath';
    /** The array index of the referenced data by the path */
    arrayIndex?: Maybe<Scalars['Int']['output']>;
    /** Time when this ReferencePath was created */
    createdAt?: Maybe<Scalars['Time']['output']>;
    /** Global ID of this ReferencePath */
    id?: Maybe<Scalars['ReferencePathID']['output']>;
    /** The path to the reference in the flow */
    path?: Maybe<Scalars['String']['output']>;
    /** Time when this ReferencePath was last updated */
    updatedAt?: Maybe<Scalars['Time']['output']>;
}

/** Input type for reference path */
export interface ReferencePathInput {
    /** Array index if applicable */
    arrayIndex?: InputMaybe<Scalars['Int']['input']>;
    /** The path to the reference in the flow */
    path?: InputMaybe<Scalars['String']['input']>;
}

/** Represents a reference value in the system. */
export interface ReferenceValue {
    __typename?: 'ReferenceValue';
    /** Time when this ReferenceValue was created */
    createdAt?: Maybe<Scalars['Time']['output']>;
    /** The identifier of the data type this reference value belongs to. */
    dataTypeIdentifier?: Maybe<DataTypeIdentifier>;
    /** The depth of the reference value. */
    depth?: Maybe<Scalars['Int']['output']>;
    /** Global ID of this ReferenceValue */
    id?: Maybe<Scalars['ReferenceValueID']['output']>;
    /** The node of the reference value. */
    node?: Maybe<Scalars['Int']['output']>;
    /** The paths associated with this reference value. */
    referencePath?: Maybe<Array<ReferencePath>>;
    /** The scope of the reference value. */
    scope?: Maybe<Array<Scalars['Int']['output']>>;
    /** Time when this ReferenceValue was last updated */
    updatedAt?: Maybe<Scalars['Time']['output']>;
}

/** Input type for reference value */
export interface ReferenceValueInput {
    /** The identifier of the data type this reference value belongs to */
    dataTypeIdentifier: DataTypeIdentifierInput;
    /** The primary level of the reference value */
    primaryLevel: Scalars['Int']['input'];
    /** The paths associated with this reference value */
    referencePath: Array<ReferencePathInput>;
    /** The secondary level of the reference value */
    secondaryLevel: Scalars['Int']['input'];
    /** The tertiary level of the reference value */
    tertiaryLevel?: InputMaybe<Scalars['Int']['input']>;
}

/** Represents a runtime */
export interface Runtime {
    __typename?: 'Runtime';
    /** Time when this Runtime was created */
    createdAt?: Maybe<Scalars['Time']['output']>;
    /** DataTypes of the runtime */
    dataTypes?: Maybe<DataTypeConnection>;
    /** The description for the runtime if present */
    description?: Maybe<Scalars['String']['output']>;
    /** FlowTypes of the runtime */
    flowTypes?: Maybe<FlowTypeConnection>;
    /** Global ID of this Runtime */
    id?: Maybe<Scalars['RuntimeID']['output']>;
    /** The name for the runtime */
    name?: Maybe<Scalars['String']['output']>;
    /** The parent namespace for the runtime */
    namespace?: Maybe<Namespace>;
    /** Projects associated with the runtime */
    projects?: Maybe<NamespaceProjectConnection>;
    /** The status of the runtime */
    status?: Maybe<RuntimeStatusType>;
    /** Token belonging to the runtime, only present on creation */
    token?: Maybe<Scalars['String']['output']>;
    /** Time when this Runtime was last updated */
    updatedAt?: Maybe<Scalars['Time']['output']>;
}


/** Represents a runtime */
export interface RuntimeDataTypesArgs {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
}


/** Represents a runtime */
export interface RuntimeFlowTypesArgs {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
}


/** Represents a runtime */
export interface RuntimeProjectsArgs {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
}

/** The connection type for Runtime. */
export interface RuntimeConnection {
    __typename?: 'RuntimeConnection';
    /** Total count of collection. */
    count?: Maybe<Scalars['Int']['output']>;
    /** A list of edges. */
    edges?: Maybe<Array<Maybe<RuntimeEdge>>>;
    /** A list of nodes. */
    nodes?: Maybe<Array<Maybe<Runtime>>>;
    /** Information to aid in pagination. */
    pageInfo?: Maybe<PageInfo>;
}

/** An edge in a connection. */
export interface RuntimeEdge {
    __typename?: 'RuntimeEdge';
    /** A cursor for use in pagination. */
    cursor?: Maybe<Scalars['String']['output']>;
    /** The item at the end of the edge. */
    node?: Maybe<Runtime>;
}

/** Represents a runtime function definition */
export interface RuntimeFunctionDefinition {
    __typename?: 'RuntimeFunctionDefinition';
    /** Time when this RuntimeFunctionDefinition was created */
    createdAt?: Maybe<Scalars['Time']['output']>;
    /** Function definitions of the runtime function definition */
    functionDefinitions?: Maybe<FunctionDefinitionConnection>;
    /** Global ID of this RuntimeFunctionDefinition */
    id?: Maybe<Scalars['RuntimeFunctionDefinitionID']['output']>;
    /** Identifier of the runtime function definition */
    identifier?: Maybe<Scalars['String']['output']>;
    /** The runtime this runtime function definition belongs to */
    runtime?: Maybe<Runtime>;
    /** Parameter definitions of the runtime function definition */
    runtimeParameterDefinitions?: Maybe<RuntimeParameterDefinitionConnection>;
    /** Time when this RuntimeFunctionDefinition was last updated */
    updatedAt?: Maybe<Scalars['Time']['output']>;
}


/** Represents a runtime function definition */
export interface RuntimeFunctionDefinitionFunctionDefinitionsArgs {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
}


/** Represents a runtime function definition */
export interface RuntimeFunctionDefinitionRuntimeParameterDefinitionsArgs {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
}

/** Represents a runtime parameter definition */
export interface RuntimeParameterDefinition {
    __typename?: 'RuntimeParameterDefinition';
    /** Time when this RuntimeParameterDefinition was created */
    createdAt?: Maybe<Scalars['Time']['output']>;
    /** Global ID of this RuntimeParameterDefinition */
    id?: Maybe<Scalars['RuntimeParameterDefinitionID']['output']>;
    /** Time when this RuntimeParameterDefinition was last updated */
    updatedAt?: Maybe<Scalars['Time']['output']>;
}

/** The connection type for RuntimeParameterDefinition. */
export interface RuntimeParameterDefinitionConnection {
    __typename?: 'RuntimeParameterDefinitionConnection';
    /** Total count of collection. */
    count?: Maybe<Scalars['Int']['output']>;
    /** A list of edges. */
    edges?: Maybe<Array<Maybe<RuntimeParameterDefinitionEdge>>>;
    /** A list of nodes. */
    nodes?: Maybe<Array<Maybe<RuntimeParameterDefinition>>>;
    /** Information to aid in pagination. */
    pageInfo?: Maybe<PageInfo>;
}

/** An edge in a connection. */
export interface RuntimeParameterDefinitionEdge {
    __typename?: 'RuntimeParameterDefinitionEdge';
    /** A cursor for use in pagination. */
    cursor?: Maybe<Scalars['String']['output']>;
    /** The item at the end of the edge. */
    node?: Maybe<RuntimeParameterDefinition>;
}

/** Represent all available types of statuses of a runtime */
export const enum RuntimeStatusType {
    /** No problem with connection, everything works as expected */
    Connected = 'CONNECTED',
    /** The runtime is disconnected, cause unknown */
    Disconnected = 'DISCONNECTED'
}

/** Autogenerated input type of RuntimesCreate */
export interface RuntimesCreateInput {
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    /** The description for the new runtime. */
    description?: InputMaybe<Scalars['String']['input']>;
    /** Name for the new runtime. */
    name: Scalars['String']['input'];
    /** The Parent Id for the runtime. */
    namespaceId?: InputMaybe<Scalars['NamespaceID']['input']>;
}

/** Autogenerated return type of RuntimesCreate. */
export interface RuntimesCreatePayload {
    __typename?: 'RuntimesCreatePayload';
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: Maybe<Scalars['String']['output']>;
    /** Errors encountered during execution of the mutation. */
    errors?: Maybe<Array<Error>>;
    /** The newly created runtime. */
    runtime?: Maybe<Runtime>;
}

/** Autogenerated input type of RuntimesDelete */
export interface RuntimesDeleteInput {
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    /** The runtime to delete. */
    runtimeId: Scalars['RuntimeID']['input'];
}

/** Autogenerated return type of RuntimesDelete. */
export interface RuntimesDeletePayload {
    __typename?: 'RuntimesDeletePayload';
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: Maybe<Scalars['String']['output']>;
    /** Errors encountered during execution of the mutation. */
    errors?: Maybe<Array<Error>>;
    /** The updated organization. */
    runtime?: Maybe<Runtime>;
}

/** Autogenerated input type of RuntimesRotateToken */
export interface RuntimesRotateTokenInput {
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    /** The runtime to rotate the token. */
    runtimeId: Scalars['RuntimeID']['input'];
}

/** Autogenerated return type of RuntimesRotateToken. */
export interface RuntimesRotateTokenPayload {
    __typename?: 'RuntimesRotateTokenPayload';
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: Maybe<Scalars['String']['output']>;
    /** Errors encountered during execution of the mutation. */
    errors?: Maybe<Array<Error>>;
    /** The updated runtime. */
    runtime?: Maybe<Runtime>;
}

/** Autogenerated input type of RuntimesUpdate */
export interface RuntimesUpdateInput {
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    /** Description for the new runtime. */
    description?: InputMaybe<Scalars['String']['input']>;
    /** Name for the new runtime. */
    name?: InputMaybe<Scalars['String']['input']>;
    /** ID of the runtime to update. */
    runtimeId: Scalars['RuntimeID']['input'];
}

/** Autogenerated return type of RuntimesUpdate. */
export interface RuntimesUpdatePayload {
    __typename?: 'RuntimesUpdatePayload';
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: Maybe<Scalars['String']['output']>;
    /** Errors encountered during execution of the mutation. */
    errors?: Maybe<Array<Error>>;
    /** The updated runtime. */
    runtime?: Maybe<Runtime>;
}

/** Represents a translation */
export interface Translation {
    __typename?: 'Translation';
    /** Code of the translation */
    code?: Maybe<Scalars['String']['output']>;
    /** Content of the translation */
    content?: Maybe<Scalars['String']['output']>;
}

/** The connection type for Translation. */
export interface TranslationConnection {
    __typename?: 'TranslationConnection';
    /** Total count of collection. */
    count?: Maybe<Scalars['Int']['output']>;
    /** A list of edges. */
    edges?: Maybe<Array<Maybe<TranslationEdge>>>;
    /** A list of nodes. */
    nodes?: Maybe<Array<Maybe<Translation>>>;
    /** Information to aid in pagination. */
    pageInfo?: Maybe<PageInfo>;
}

/** An edge in a connection. */
export interface TranslationEdge {
    __typename?: 'TranslationEdge';
    /** A cursor for use in pagination. */
    cursor?: Maybe<Scalars['String']['output']>;
    /** The item at the end of the edge. */
    node?: Maybe<Translation>;
}

/** Represents a user */
export interface User {
    __typename?: 'User';
    /** Global admin status of the user */
    admin?: Maybe<Scalars['Boolean']['output']>;
    /** The avatar if present of the user */
    avatarPath?: Maybe<Scalars['String']['output']>;
    /** Time when this User was created */
    createdAt?: Maybe<Scalars['Time']['output']>;
    /** Email of the user */
    email?: Maybe<Scalars['String']['output']>;
    /** Email verification date of the user if present */
    emailVerifiedAt?: Maybe<Scalars['Time']['output']>;
    /** Firstname of the user */
    firstname?: Maybe<Scalars['String']['output']>;
    /** Global ID of this User */
    id?: Maybe<Scalars['UserID']['output']>;
    /** Identities of this user */
    identities?: Maybe<UserIdentityConnection>;
    /** Lastname of the user */
    lastname?: Maybe<Scalars['String']['output']>;
    /** Namespace of this user */
    namespace?: Maybe<Namespace>;
    /** Namespace Memberships of this user */
    namespaceMemberships?: Maybe<NamespaceMemberConnection>;
    /** Sessions of this user */
    sessions?: Maybe<UserSessionConnection>;
    /** Time when this User was last updated */
    updatedAt?: Maybe<Scalars['Time']['output']>;
    /** Username of the user */
    username?: Maybe<Scalars['String']['output']>;
}


/** Represents a user */
export interface UserIdentitiesArgs {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
}


/** Represents a user */
export interface UserNamespaceMembershipsArgs {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
}


/** Represents a user */
export interface UserSessionsArgs {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
}

/** The connection type for User. */
export interface UserConnection {
    __typename?: 'UserConnection';
    /** Total count of collection. */
    count?: Maybe<Scalars['Int']['output']>;
    /** A list of edges. */
    edges?: Maybe<Array<Maybe<UserEdge>>>;
    /** A list of nodes. */
    nodes?: Maybe<Array<Maybe<User>>>;
    /** Information to aid in pagination. */
    pageInfo?: Maybe<PageInfo>;
}

/** An edge in a connection. */
export interface UserEdge {
    __typename?: 'UserEdge';
    /** A cursor for use in pagination. */
    cursor?: Maybe<Scalars['String']['output']>;
    /** The item at the end of the edge. */
    node?: Maybe<User>;
}

/** Represents an external user identity */
export interface UserIdentity {
    __typename?: 'UserIdentity';
    /** Time when this UserIdentity was created */
    createdAt?: Maybe<Scalars['Time']['output']>;
    /** Global ID of this UserIdentity */
    id?: Maybe<Scalars['UserIdentityID']['output']>;
    /** The description for the runtime if present */
    identifier?: Maybe<Scalars['String']['output']>;
    /** The name for the runtime */
    providerId?: Maybe<Scalars['String']['output']>;
    /** Time when this UserIdentity was last updated */
    updatedAt?: Maybe<Scalars['Time']['output']>;
    /** The correlating user of the identity */
    user?: Maybe<User>;
}

/** The connection type for UserIdentity. */
export interface UserIdentityConnection {
    __typename?: 'UserIdentityConnection';
    /** Total count of collection. */
    count?: Maybe<Scalars['Int']['output']>;
    /** A list of edges. */
    edges?: Maybe<Array<Maybe<UserIdentityEdge>>>;
    /** A list of nodes. */
    nodes?: Maybe<Array<Maybe<UserIdentity>>>;
    /** Information to aid in pagination. */
    pageInfo?: Maybe<PageInfo>;
}

/** An edge in a connection. */
export interface UserIdentityEdge {
    __typename?: 'UserIdentityEdge';
    /** A cursor for use in pagination. */
    cursor?: Maybe<Scalars['String']['output']>;
    /** The item at the end of the edge. */
    node?: Maybe<UserIdentity>;
}

/** Represents a user session */
export interface UserSession {
    __typename?: 'UserSession';
    /** Whether or not the session is active and can be used */
    active?: Maybe<Scalars['Boolean']['output']>;
    /** Time when this UserSession was created */
    createdAt?: Maybe<Scalars['Time']['output']>;
    /** Global ID of this UserSession */
    id?: Maybe<Scalars['UserSessionID']['output']>;
    /** Token belonging to the session, only present on creation */
    token?: Maybe<Scalars['String']['output']>;
    /** Time when this UserSession was last updated */
    updatedAt?: Maybe<Scalars['Time']['output']>;
    /** User that belongs to the session */
    user?: Maybe<User>;
}

/** The connection type for UserSession. */
export interface UserSessionConnection {
    __typename?: 'UserSessionConnection';
    /** Total count of collection. */
    count?: Maybe<Scalars['Int']['output']>;
    /** A list of edges. */
    edges?: Maybe<Array<Maybe<UserSessionEdge>>>;
    /** A list of nodes. */
    nodes?: Maybe<Array<Maybe<UserSession>>>;
    /** Information to aid in pagination. */
    pageInfo?: Maybe<PageInfo>;
}

/** An edge in a connection. */
export interface UserSessionEdge {
    __typename?: 'UserSessionEdge';
    /** A cursor for use in pagination. */
    cursor?: Maybe<Scalars['String']['output']>;
    /** The item at the end of the edge. */
    node?: Maybe<UserSession>;
}

/** Autogenerated input type of UsersEmailVerification */
export interface UsersEmailVerificationInput {
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    /** The email verification token */
    token: Scalars['String']['input'];
}

/** Autogenerated return type of UsersEmailVerification. */
export interface UsersEmailVerificationPayload {
    __typename?: 'UsersEmailVerificationPayload';
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: Maybe<Scalars['String']['output']>;
    /** Errors encountered during execution of the mutation. */
    errors?: Maybe<Array<Error>>;
    /** The user whose email was verified */
    user?: Maybe<User>;
}

/** Autogenerated input type of UsersIdentityLink */
export interface UsersIdentityLinkInput {
    /** The validation object */
    args: IdentityInput;
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    /** The ID of the external provider (e.g. google, discord, gitlab...)  */
    providerId: Scalars['String']['input'];
}

/** Autogenerated return type of UsersIdentityLink. */
export interface UsersIdentityLinkPayload {
    __typename?: 'UsersIdentityLinkPayload';
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: Maybe<Scalars['String']['output']>;
    /** Errors encountered during execution of the mutation. */
    errors?: Maybe<Array<Error>>;
    /** The created user identity */
    userIdentity?: Maybe<UserIdentity>;
}

/** Autogenerated input type of UsersIdentityLogin */
export interface UsersIdentityLoginInput {
    /** The validation object */
    args: IdentityInput;
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    /** The ID of the external provider (e.g. google, discord, gitlab...)  */
    providerId: Scalars['String']['input'];
}

/** Autogenerated return type of UsersIdentityLogin. */
export interface UsersIdentityLoginPayload {
    __typename?: 'UsersIdentityLoginPayload';
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: Maybe<Scalars['String']['output']>;
    /** Errors encountered during execution of the mutation. */
    errors?: Maybe<Array<Error>>;
    /** The created user session */
    userSession?: Maybe<UserSession>;
}

/** Autogenerated input type of UsersIdentityRegister */
export interface UsersIdentityRegisterInput {
    /** The validation object */
    args: IdentityInput;
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    /** The ID of the external provider (e.g. google, discord, gitlab...)  */
    providerId: Scalars['String']['input'];
}

/** Autogenerated return type of UsersIdentityRegister. */
export interface UsersIdentityRegisterPayload {
    __typename?: 'UsersIdentityRegisterPayload';
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: Maybe<Scalars['String']['output']>;
    /** Errors encountered during execution of the mutation. */
    errors?: Maybe<Array<Error>>;
    /** The created users session */
    userSession?: Maybe<UserSession>;
}

/** Autogenerated input type of UsersIdentityUnlink */
export interface UsersIdentityUnlinkInput {
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    /** The ID of the identity to remove */
    identityId: Scalars['UserIdentityID']['input'];
}

/** Autogenerated return type of UsersIdentityUnlink. */
export interface UsersIdentityUnlinkPayload {
    __typename?: 'UsersIdentityUnlinkPayload';
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: Maybe<Scalars['String']['output']>;
    /** Errors encountered during execution of the mutation. */
    errors?: Maybe<Array<Error>>;
    /** The removed identity */
    userIdentity?: Maybe<UserIdentity>;
}

/** Autogenerated input type of UsersLogin */
export interface UsersLoginInput {
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    /** Email of the user */
    email?: InputMaybe<Scalars['String']['input']>;
    /** The data of the mfa login */
    mfa?: InputMaybe<MfaInput>;
    /** Password of the user */
    password: Scalars['String']['input'];
    /** Username of the user */
    username?: InputMaybe<Scalars['String']['input']>;
}

/** Autogenerated return type of UsersLogin. */
export interface UsersLoginPayload {
    __typename?: 'UsersLoginPayload';
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: Maybe<Scalars['String']['output']>;
    /** Errors encountered during execution of the mutation. */
    errors?: Maybe<Array<Error>>;
    /** The created user session */
    userSession?: Maybe<UserSession>;
}

/** Autogenerated input type of UsersLogout */
export interface UsersLogoutInput {
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    /** ID of the session to logout */
    userSessionId: Scalars['UserSessionID']['input'];
}

/** Autogenerated return type of UsersLogout. */
export interface UsersLogoutPayload {
    __typename?: 'UsersLogoutPayload';
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: Maybe<Scalars['String']['output']>;
    /** Errors encountered during execution of the mutation. */
    errors?: Maybe<Array<Error>>;
    /** The logged out user session */
    userSession?: Maybe<UserSession>;
}

/** Autogenerated input type of UsersMfaBackupCodesRotate */
export interface UsersMfaBackupCodesRotateInput {
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
}

/** Autogenerated return type of UsersMfaBackupCodesRotate. */
export interface UsersMfaBackupCodesRotatePayload {
    __typename?: 'UsersMfaBackupCodesRotatePayload';
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: Maybe<Scalars['String']['output']>;
    /** The newly rotated backup codes. */
    codes?: Maybe<Array<Scalars['String']['output']>>;
    /** Errors encountered during execution of the mutation. */
    errors?: Maybe<Array<Error>>;
}

/** Autogenerated input type of UsersMfaTotpGenerateSecret */
export interface UsersMfaTotpGenerateSecretInput {
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
}

/** Autogenerated return type of UsersMfaTotpGenerateSecret. */
export interface UsersMfaTotpGenerateSecretPayload {
    __typename?: 'UsersMfaTotpGenerateSecretPayload';
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: Maybe<Scalars['String']['output']>;
    /** Errors encountered during execution of the mutation. */
    errors?: Maybe<Array<Error>>;
    /** The created and signed secret */
    secret?: Maybe<Scalars['String']['output']>;
}

/** Autogenerated input type of UsersMfaTotpValidateSecret */
export interface UsersMfaTotpValidateSecretInput {
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    /**
     * The current totp at the time to verify the mfa
     *                                                         authentication device
     */
    currentTotp: Scalars['String']['input'];
    /** The signed secret from the generation */
    secret: Scalars['String']['input'];
}

/** Autogenerated return type of UsersMfaTotpValidateSecret. */
export interface UsersMfaTotpValidateSecretPayload {
    __typename?: 'UsersMfaTotpValidateSecretPayload';
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: Maybe<Scalars['String']['output']>;
    /** Errors encountered during execution of the mutation. */
    errors?: Maybe<Array<Error>>;
    /** The modified user */
    user?: Maybe<User>;
}

/** Autogenerated input type of UsersPasswordReset */
export interface UsersPasswordResetInput {
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    /** The new password to set for the user */
    newPassword: Scalars['String']['input'];
    /** The confirmation of the new password to set for the user needs to be the same as the new password */
    newPasswordConfirmation: Scalars['String']['input'];
    /** The password reset token sent to the user email */
    resetToken: Scalars['String']['input'];
}

/** Autogenerated return type of UsersPasswordReset. */
export interface UsersPasswordResetPayload {
    __typename?: 'UsersPasswordResetPayload';
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: Maybe<Scalars['String']['output']>;
    /** Errors encountered during execution of the mutation. */
    errors?: Maybe<Array<Error>>;
    /** A message indicating the result of the password reset request */
    message?: Maybe<Scalars['String']['output']>;
}

/** Autogenerated input type of UsersPasswordResetRequest */
export interface UsersPasswordResetRequestInput {
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    /** Email of the user to reset the password */
    email: Scalars['String']['input'];
}

/** Autogenerated return type of UsersPasswordResetRequest. */
export interface UsersPasswordResetRequestPayload {
    __typename?: 'UsersPasswordResetRequestPayload';
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: Maybe<Scalars['String']['output']>;
    /** Errors encountered during execution of the mutation. */
    errors?: Maybe<Array<Error>>;
    /** A message indicating the result of the password reset request */
    message?: Maybe<Scalars['String']['output']>;
}

/** Autogenerated input type of UsersRegister */
export interface UsersRegisterInput {
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    /** Email of the user */
    email: Scalars['String']['input'];
    /** Password of the user */
    password: Scalars['String']['input'];
    /** The repeated password of the user to check for typos */
    passwordRepeat: Scalars['String']['input'];
    /** Username of the user */
    username: Scalars['String']['input'];
}

/** Autogenerated return type of UsersRegister. */
export interface UsersRegisterPayload {
    __typename?: 'UsersRegisterPayload';
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: Maybe<Scalars['String']['output']>;
    /** Errors encountered during execution of the mutation. */
    errors?: Maybe<Array<Error>>;
    /** The created users session */
    userSession?: Maybe<UserSession>;
}

/** Autogenerated input type of UsersUpdate */
export interface UsersUpdateInput {
    /** New global admin status for the user. */
    admin?: InputMaybe<Scalars['Boolean']['input']>;
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    /** New email for the user. */
    email?: InputMaybe<Scalars['String']['input']>;
    /** New firstname for the user. */
    firstname?: InputMaybe<Scalars['String']['input']>;
    /** New lastname for the user. */
    lastname?: InputMaybe<Scalars['String']['input']>;
    /** The data of the mfa validation */
    mfa?: InputMaybe<MfaInput>;
    /** New password for the user. */
    password?: InputMaybe<Scalars['String']['input']>;
    /** New password repeat for the user to check for typos, required if password is set. */
    passwordRepeat?: InputMaybe<Scalars['String']['input']>;
    /** ID of the user to update. */
    userId: Scalars['UserID']['input'];
    /** New username for the user. */
    username?: InputMaybe<Scalars['String']['input']>;
}

/** Autogenerated return type of UsersUpdate. */
export interface UsersUpdatePayload {
    __typename?: 'UsersUpdatePayload';
    /** A unique identifier for the client performing the mutation. */
    clientMutationId?: Maybe<Scalars['String']['output']>;
    /** Errors encountered during execution of the mutation. */
    errors?: Maybe<Array<Error>>;
    /** The updated user. */
    user?: Maybe<User>;
}
