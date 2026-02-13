import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Block = {
    __kind__: "table";
    table: {
        title?: string;
        rows: Array<Array<string>>;
    };
} | {
    __kind__: "title";
    title: {
        isMainHeading: boolean;
        text: string;
    };
} | {
    __kind__: "link";
    link: {
        url: string;
        linkText: string;
    };
} | {
    __kind__: "image";
    image: {
        url: string;
        altText?: string;
    };
} | {
    __kind__: "paragraph";
    paragraph: {
        text: string;
    };
};
export interface VacancyDetail {
    postName: string;
    eligibility: string;
    totalPosts: bigint;
}
export interface JobPost {
    id: JobId;
    admitCardUrl?: string;
    fees: Array<FeeCategory>;
    name: string;
    vacancies: Array<VacancyDetail>;
    selectionProcess?: string;
    links: {
        applyOnline?: string;
        notification?: string;
        officialWebsite?: string;
    };
    syllabusUrl?: string;
    blocks: Array<Block>;
    category: Category;
    importantDates: ImportantDates;
    posterImage?: string;
    ageLimit?: AgeLimit;
}
export type JobId = bigint;
export interface AgeLimit {
    minAge?: bigint;
    notes?: string;
    maxAge?: bigint;
    relaxation: boolean;
}
export interface ImportantDates {
    applicationBegin?: string;
    feePaymentLastDate?: string;
    examDate?: string;
    lastDate?: string;
}
export interface Scheme {
    id: bigint;
    link?: string;
    name: string;
    category: string;
}
export interface FeeCategory {
    name: string;
    amount: string;
}
export interface UserProfile {
    name: string;
}
export enum Category {
    latestJobs = "latestJobs",
    results = "results",
    closedPosts = "closedPosts",
    admitCards = "admitCards"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addJobPost(name: string, posterImage: string | null, dates: ImportantDates, fees: Array<FeeCategory>, ageLimit: AgeLimit | null, vacancies: Array<VacancyDetail>, selectionProcess: string | null, syllabusUrl: string | null, admitCardUrl: string | null, category: Category, links: {
        applyOnline?: string;
        notification?: string;
        officialWebsite?: string;
    }, blocks: Array<Block>): Promise<JobId>;
    addScheme(name: string, category: string, link: string | null): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteJobPost(id: JobId): Promise<void>;
    deleteScheme(id: bigint): Promise<void>;
    getAdmitCardPosts(): Promise<Array<JobPost>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getJobPost(id: JobId): Promise<JobPost>;
    getJobPostsByCategory(category: Category | null): Promise<Array<JobPost>>;
    getScheme(id: bigint): Promise<Scheme>;
    getSchemes(): Promise<Array<Scheme>>;
    getSchemesCount(): Promise<bigint>;
    getSyllabusRepository(): Promise<Array<JobPost>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initializeAccessControl(adminToken: string, userProvidedToken: string): Promise<void>;
    isAdmin(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateJobPost(id: JobId, name: string, posterImage: string | null, dates: ImportantDates, fees: Array<FeeCategory>, ageLimit: AgeLimit | null, vacancies: Array<VacancyDetail>, selectionProcess: string | null, syllabusUrl: string | null, admitCardUrl: string | null, category: Category, links: {
        applyOnline?: string;
        notification?: string;
        officialWebsite?: string;
    }, blocks: Array<Block>): Promise<void>;
    updateScheme(id: bigint, name: string, category: string, link: string | null): Promise<void>;
}
