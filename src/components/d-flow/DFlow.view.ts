import {Flow as SagittariusFlow, Maybe, Scalars} from "@code0-tech/sagittarius-graphql-types";

export interface Flow extends SagittariusFlow {
    editedAt?: Maybe<Scalars['Time']['output']>;
}