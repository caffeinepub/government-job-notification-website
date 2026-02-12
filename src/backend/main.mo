import Array "mo:core/Array";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Principal "mo:core/Principal";

import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
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

  public type UserProfile = {
    name : Text;
  };

  type Scheme = {
    id : Nat;
    name : Text;
    category : Text;
    link : ?Text;
  };

  func compareSchemesByName(a : Scheme, b : Scheme) : Order.Order {
    Text.compare(a.name, b.name);
  };

  func compareJobPostsNewestFirst(a : JobPost, b : JobPost) : Order.Order {
    Nat.compare(b.id, a.id);
  };

  let jobPosts = Map.empty<JobId, JobPost>();
  let schemes = Map.empty<Nat, Scheme>();

  var nextId = 0;
  var nextSchemeId = 21;

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func isAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  // Job Post CRUD Functions
  public shared ({ caller }) func addJobPost(
    name : Text,
    posterImage : ?Text,
    dates : ImportantDates,
    fees : [FeeCategory],
    ageLimit : ?AgeLimit,
    vacancies : [VacancyDetail],
    selectionProcess : ?Text,
    syllabusUrl : ?Text,
    admitCardUrl : ?Text,
    category : Category,
    links : {
      applyOnline : ?Text;
      notification : ?Text;
      officialWebsite : ?Text;
    },
    blocks : [Block],
  ) : async JobId {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add job posts");
    };

    let id = nextId;
    nextId += 1;

    let jobPost : JobPost = {
      id;
      name;
      posterImage;
      importantDates = dates;
      fees;
      ageLimit;
      vacancies;
      selectionProcess;
      syllabusUrl;
      admitCardUrl;
      category;
      links;
      blocks;
    };

    jobPosts.add(id, jobPost);
    id;
  };

  public query ({ caller }) func getJobPostsByCategory(category : ?Category) : async [JobPost] {
    let filteredPosts = jobPosts.values().toArray().filter(
      func(post) {
        switch (category) {
          case (null) { true };
          case (?cat) { post.category == cat };
        };
      }
    );
    filteredPosts.sort(compareJobPostsNewestFirst);
  };

  public query ({ caller }) func getSyllabusRepository() : async [JobPost] {
    let filteredPosts = jobPosts.values().toArray().filter(
      func(post) { post.syllabusUrl != null }
    );
    filteredPosts.sort(compareJobPostsNewestFirst);
  };

  public query ({ caller }) func getAdmitCardPosts() : async [JobPost] {
    let filteredPosts = jobPosts.values().toArray().filter(
      func(post) { post.admitCardUrl != null }
    );
    filteredPosts.sort(compareJobPostsNewestFirst);
  };

  public query ({ caller }) func getJobPost(id : JobId) : async JobPost {
    switch (jobPosts.get(id)) {
      case (null) { Runtime.trap("Job post not found") };
      case (?post) { post };
    };
  };

  public shared ({ caller }) func updateJobPost(
    id : JobId,
    name : Text,
    posterImage : ?Text,
    dates : ImportantDates,
    fees : [FeeCategory],
    ageLimit : ?AgeLimit,
    vacancies : [VacancyDetail],
    selectionProcess : ?Text,
    syllabusUrl : ?Text,
    admitCardUrl : ?Text,
    category : Category,
    links : {
      applyOnline : ?Text;
      notification : ?Text;
      officialWebsite : ?Text;
    },
    blocks : [Block],
  ) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update job posts");
    };

    switch (jobPosts.get(id)) {
      case (null) { Runtime.trap("Job post not found") };
      case (?_) {
        let updatedPost : JobPost = {
          id;
          name;
          posterImage;
          importantDates = dates;
          fees;
          ageLimit;
          vacancies;
          selectionProcess;
          syllabusUrl;
          admitCardUrl;
          category;
          links;
          blocks;
        };
        jobPosts.add(id, updatedPost);
      };
    };
  };

  public shared ({ caller }) func deleteJobPost(id : JobId) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete job posts");
    };

    if (not jobPosts.containsKey(id)) {
      Runtime.trap("Job post not found");
    };
    jobPosts.remove(id);
  };

  // Scheme/YoJna Management
  public query ({ caller }) func getSchemes() : async [Scheme] {
    let allSchemes = schemes.values().toArray();
    allSchemes.sort(compareSchemesByName);
  };

  public shared ({ caller }) func addScheme(
    name : Text,
    category : Text,
    link : ?Text,
  ) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add schemes");
    };

    let id = nextSchemeId;
    nextSchemeId += 1;

    let scheme : Scheme = {
      id;
      name;
      category;
      link;
    };

    schemes.add(id, scheme);
    id;
  };

  public shared ({ caller }) func updateScheme(
    id : Nat,
    name : Text,
    category : Text,
    link : ?Text,
  ) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update schemes");
    };

    switch (schemes.get(id)) {
      case (null) { Runtime.trap("Scheme not found") };
      case (?_) {
        let updatedScheme : Scheme = {
          id;
          name;
          category;
          link;
        };
        schemes.add(id, updatedScheme);
      };
    };
  };

  public shared ({ caller }) func deleteScheme(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete schemes");
    };

    if (not schemes.containsKey(id)) {
      Runtime.trap("Scheme not found");
    };
    schemes.remove(id);
  };

  public query ({ caller }) func getScheme(id : Nat) : async Scheme {
    switch (schemes.get(id)) {
      case (null) { Runtime.trap("Scheme not found") };
      case (?scheme) { scheme };
    };
  };

  public query ({ caller }) func getSchemesCount() : async Nat {
    schemes.size();
  };
};
