export interface IUser {
    login?: string,
    id?: number,
    avatar_url?: string,
    gravatar_id?: string,
    url?: string,
    html_url?: string,
    followers_url?: string,
    following_url?: string,
    gists_url?: string,
    starred_url?: string,
    subscriptions_url?: string,
    organizations_url?: string,
    repos_url?: string,
    events_url?: string,
    received_events_url?: string,
    type?: string,
    site_admin?: boolean
}

export interface IUserProfile extends IUser {
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

export interface IRepository {
    id?: number,
    name?: string,
    full_name?: string,
    owner: IUser,
    private?: boolean,
    html_url?: string,
    description?: string,
    fork?: boolean,
    url?: string,
    forks_url?: string,
    keys_url?: string,
    collaborators_url?: string,
    teams_url?: string,
    hooks_url?: string,
    issue_events_url?: string,
    events_url?: string,
    assignees_url?: string,
    branches_url?: string,
    tags_url?: string,
    blobs_url?: string,
    git_tags_url?: string,
    git_refs_url?: string,
    trees_url?: string,
    statuses_url?: string,
    languages_url?: string,
    stargazers_url?: string,
    contributors_url?: string,
    subscribers_url?: string,
    subscription_url?: string,
    commits_url?: string,
    git_commits_url?: string,
    comments_url?: string,
    issue_comment_url?: string,
    contents_url?: string,
    compare_url?: string,
    merges_url?: string,
    archive_url?: string,
    downloads_url?: string,
    issues_url?: string,
    pulls_url?: string,
    milestones_url?: string,
    notifications_url?: string,
    labels_url?: string,
    releases_url?: string,
    deployments_url?: string,
    created_at?: Date,
    updated_at?: Date,
    pushed_at?: Date,
    git_url?: string,
    ssh_url?: string,
    clone_url?: string,
    svn_url?: string,
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
    mirror_url?: string
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

export interface IRepositoryCollection {
    data: IRepository[],
    page_count?: number,
    next_link?: string
}

export interface IOwnerRepository extends IRepository {
    organization?: IUser,
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