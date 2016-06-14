export interface IProfile {
    login?: string,
    id?: number,
    avatar_url?: string,
    gravatar_id?: string,
    html_url?: string,
    url?: string,
    type?: string,
    site_admin?: boolean
}

export interface IProfileMetadata extends IProfile {
    name?: string,
    company?: string,
    blog?: string,
    location?: string,
    email?: string,
    hireable?: string,
    bio?: string,
    public_repos?: number,
    public_gists?: number,
    followers?: number,
    following?: number,
    created_at?: Date,
    updated_at?: Date   
}

export interface IUserProfile {
    user: IProfileMetadata,
    orgs: IProfileMetadata[],
    token: IToken
}

export interface IRepository {
    id?: number,
    name?: string,
    full_name?: string,
    owner: IProfile,
    private?: boolean,
    html_url?: string,
    description?: string,
    fork?: boolean,
    url?: string,
    created_at?: Date,
    updated_at?: Date,
    pushed_at?: Date,
    homepage?: string
    size?: number,
    stargazers_count?: number,
    watchers_count?: number,
    language?: string,
    has_issues?: boolean,
    has_downloads?: boolean,
    has_wiki?: boolean,
    has_pages?: boolean,
    forks_count?: number,
    open_issues_count?: number,
    forks?: number,
    open_issues?: number,
    watchers?: number,
    default_branch?: string,
    permissions?: {
        admin?: boolean,
        push?: boolean,
        pull: boolean
    }
}

export interface IOwnerRepository extends IRepository {
    organization?: IProfile,
    parent?: IRepository,
    source?: IRepository
}

export interface IBranch {
    name?: string,
    protection?: {
        enabled?: boolean,
        required_status_checks?: {
            enforcement_level?: string,
            contexts: any[]
        }
    },
    commit?: ICommit,
    _links?: {
        html?: string,
        self?: string
    }
}

export interface ICommit {
    sha?: string,
    commit?: {
        author?: {
            name?: string,
            date?: Date,
            email?: string
        },
        url?: string,
        message?: string,
        tree?: {
            sha?: string,
            url?: string
        },
        committer?: {
            name?: string,
            date?: Date,
            email?: string
        }
    },
    author?: {
        gravatar_id?: string,
        avatar_url?: string,
        url?: string,
        id?: number,
        login?: string
    },
    parents?: [
        {
            sha?: string,
            url?: string
        },
        {
            sha?: string,
            url?: string
        }
    ],
    url?: string,
    committer?: {
        gravatar_id?: string,
        avatar_url?: string,
        url?: string,
        id?: number,
        login?: string
    }
}

export interface IContents {
    type?: string,
    size?: number,
    name?: string,
    path?: string,
    sha?: string,
    url?: string,
    git_url?: string,
    html_url?: string,
    content?: string,
    download_url?: string,
    _links?: {
        self?: string,
        git?: string,
        html?: string
    }
}

export interface IToken {
    access_token: string;
    token_type: string;
    scope: string;
}

export interface IPinnable {
    isPinned?: boolean;
}