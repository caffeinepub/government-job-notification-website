import Array "mo:core/Array";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";

actor {
  type JobId = Nat;
  type Category = { #latestJobs; #admitCards; #results };
  type DateRange = { startDate : Text; endDate : Text };

  type JobPost = {
    id : JobId;
    name : Text;
    importantDates : DateRange;
    fees : Text;
    category : Category;
    syllabusUrl : Text;
    links : {
      applyOnline : Text;
      notification : Text;
      officialWebsite : Text;
    };
  };

  let jobPosts = Map.empty<JobId, JobPost>();
  var nextId = 0;

  public shared ({ caller }) func addJobPost(
    name : Text,
    dates : DateRange,
    fees : Text,
    category : Category,
    syllabusUrl : Text,
    links : {
      applyOnline : Text;
      notification : Text;
      officialWebsite : Text;
    },
  ) : async JobId {
    let id = nextId;
    nextId += 1;

    let jobPost : JobPost = {
      id;
      name;
      importantDates = dates;
      fees;
      category;
      syllabusUrl;
      links;
    };

    jobPosts.add(id, jobPost);
    id;
  };

  public query ({ caller }) func getJobPostsByCategory(category : ?Category) : async [JobPost] {
    jobPosts.values().toArray().filter(
      func(post) {
        switch (category) {
          case (null) { true };
          case (?cat) { post.category == cat };
        };
      }
    );
  };

  public query ({ caller }) func getJobPost(id : JobId) : async JobPost {
    switch (jobPosts.get(id)) {
      case (null) { Runtime.trap("Job post not found") };
      case (?post) { post };
    };
  };
};
