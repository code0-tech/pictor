import {
    Maybe, Namespace,
    NamespaceProjectConnection,
    NamespaceRole,
    NamespaceRoleAbility, NamespaceRoleUserAbilities, Scalars
} from "@code0-tech/sagittarius-graphql-types";

export class DNamespaceRoleView {

    /** The abilities the role is granted */
    private readonly _abilities?: Maybe<Array<NamespaceRoleAbility>>;
    /** The projects this role is assigned to */
    private readonly _assignedProjects?: Maybe<NamespaceProjectConnection>;
    /** Time when this NamespaceRole was created */
    private readonly _createdAt?: Maybe<Scalars['Time']['output']>;
    /** Global ID of this NamespaceRole */
    private readonly _id?: Maybe<Scalars['NamespaceRoleID']['output']>;
    /** The name of this role */
    private readonly _name?: Maybe<Scalars['String']['output']>;
    /** The namespace where this role belongs to */
    private readonly _namespace?: Maybe<Namespace>;
    /** Time when this NamespaceRole was last updated */
    private readonly _updatedAt?: Maybe<Scalars['Time']['output']>;
    /** Abilities for the current user on this NamespaceRole */
    private readonly _userAbilities?: Maybe<NamespaceRoleUserAbilities>;

    constructor(payload: NamespaceRole) {
        this._abilities = payload.abilities;
        this._assignedProjects = payload.assignedProjects;
        this._createdAt = payload.createdAt;
        this._id = payload.id;
        this._name = payload.name;
        this._namespace = payload.namespace;
        this._updatedAt = payload.updatedAt;
        this._userAbilities = payload.userAbilities;
    }


    get abilities(): Maybe<Array<NamespaceRoleAbility>> | undefined {
        return this._abilities;
    }

    get assignedProjects(): Maybe<NamespaceProjectConnection> | undefined {
        return this._assignedProjects;
    }

    get createdAt(): Maybe<Scalars["Time"]["output"]> | undefined {
        return this._createdAt;
    }

    get id(): Maybe<Scalars["NamespaceRoleID"]["output"]> | undefined {
        return this._id;
    }

    get name(): Maybe<Scalars["String"]["output"]> | undefined {
        return this._name;
    }

    get namespace(): Maybe<Namespace> | undefined {
        return this._namespace;
    }

    get updatedAt(): Maybe<Scalars["Time"]["output"]> | undefined {
        return this._updatedAt;
    }

    get userAbilities(): Maybe<NamespaceRoleUserAbilities> | undefined {
        return this._userAbilities;
    }

    json(): NamespaceRole {
        return {
            abilities: this._abilities,
            assignedProjects: this._assignedProjects,
            createdAt: this._createdAt,
            id: this._id,
            name: this._name,
            namespace: this._namespace,
            updatedAt: this._updatedAt
        };
    }
}