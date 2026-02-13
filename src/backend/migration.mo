import Map "mo:core/Map";
import Nat "mo:core/Nat";
import AccessControl "authorization/access-control";

module {
  type JobId = Nat;
  type Category = {
    #latestJobs;
    #admitCards;
    #results;
    #closedPosts;
  };

  type ImportantDates = {
    applicationBegin : ?Text;
    lastDate : ?Text;
    feePaymentLastDate : ?Text;
    examDate : ?Text;
  };

  type FeeCategory = {
    name : Text;
    amount : Text;
  };

  type AgeLimit = {
    minAge : ?Nat;
    maxAge : ?Nat;
    relaxation : Bool;
    notes : ?Text;
  };

  type VacancyDetail = {
    postName : Text;
    totalPosts : Nat;
    eligibility : Text;
  };

  type Block = {
    #title : {
      text : Text;
      isMainHeading : Bool;
    };
    #paragraph : { text : Text };
    #table : {
      title : ?Text;
      rows : [[Text]];
    };
    #link : {
      linkText : Text;
      url : Text;
    };
    #image : {
      url : Text;
      altText : ?Text;
    };
  };

  type JobPost = {
    id : JobId;
    name : Text;
    posterImage : ?Text;
    importantDates : ImportantDates;
    fees : [FeeCategory];
    ageLimit : ?AgeLimit;
    vacancies : [VacancyDetail];
    selectionProcess : ?Text;
    syllabusUrl : ?Text;
    admitCardUrl : ?Text;
    category : Category;
    links : {
      applyOnline : ?Text;
      notification : ?Text;
      officialWebsite : ?Text;
    };
    blocks : [Block];
  };

  type UserProfile = {
    name : Text;
  };

  type Scheme = {
    id : Nat;
    name : Text;
    category : Text;
    link : ?Text;
  };

  type OldActor = {
    jobPosts : Map.Map<JobId, JobPost>;
    schemes : Map.Map<Nat, Scheme>;
    nextId : JobId;
    nextSchemeId : Nat;
    accessControlState : AccessControl.AccessControlState;
    userProfiles : Map.Map<Principal, UserProfile>;
  };

  type NewActor = {
    jobPosts : Map.Map<JobId, JobPost>;
    schemes : Map.Map<Nat, Scheme>;
    nextId : JobId;
    nextSchemeId : Nat;
    accessControlState : AccessControl.AccessControlState;
    isAccessControlInitialized : Bool;
    userProfiles : Map.Map<Principal, UserProfile>;
  };

  public func run(old : OldActor) : NewActor {
    // Preserve initialization state: if access control was already set up,
    // mark it as initialized to prevent re-initialization attacks
    {
      old with
      isAccessControlInitialized = true;
    };
  };
};
