import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type JobId = bigint;
export interface DateRange {
    endDate: string;
    startDate: string;
}
export interface JobPost {
    id: JobId;
    fees: string;
    name: string;
    links: {
        applyOnline: string;
        notification: string;
        officialWebsite: string;
    };
    syllabusUrl: string;
    category: Category;
    importantDates: DateRange;
}
export enum Category {
    latestJobs = "latestJobs",
    results = "results",
    admitCards = "admitCards"
}
export interface backendInterface {
    addJobPost(name: string, dates: DateRange, fees: string, category: Category, syllabusUrl: string, links: {
        applyOnline: string;
        notification: string;
        officialWebsite: string;
    }): Promise<JobId>;
    getJobPost(id: JobId): Promise<JobPost>;
    getJobPostsByCategory(category: Category | null): Promise<Array<JobPost>>;
}
