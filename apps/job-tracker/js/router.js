/**
 * Job Notification Tracker — Routing, dashboard, saved, modal, filters, preferences, match score
 */

(function () {
  var STORAGE_KEY = "jt-saved";
  var PREFS_KEY = "jobTrackerPreferences";
  var DIGEST_KEY_PREFIX = "jobTrackerDigest_";
  var STATUS_KEY = "jobTrackerStatus";
  var STATUS_HISTORY_KEY = "jobTrackerStatusHistory";
  var STATUS_HISTORY_MAX = 20;
  var TEST_CHECKLIST_KEY = "jobTrackerTestChecklist";
  var TEST_CHECKLIST_COUNT = 10;
  var PROOF_ARTIFACTS_KEY = "jobTrackerProofArtifacts";
  var PROJECT_STATUS_KEY = "jobTrackerProjectStatus";

  function escapeHtml(s) {
    var div = document.createElement("div");
    div.textContent = s == null ? "" : s;
    return div.innerHTML;
  }

  function getJobs() {
    return window.JOB_TRACKER_JOBS || [];
  }

  function getPreferences() {
    try {
      var raw = localStorage.getItem(PREFS_KEY);
      if (!raw) return null;
      var p = JSON.parse(raw);
      return p && typeof p === "object" ? p : null;
    } catch (e) {
      return null;
    }
  }

  function setPreferences(p) {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(p));
    } catch (e) {}
  }

  function getDefaultPreferences() {
    return {
      roleKeywords: "",
      preferredLocations: [],
      preferredMode: [],
      experienceLevel: "",
      skills: "",
      minMatchScore: 40
    };
  }

  /**
   * Match score engine (deterministic). Cap at 100.
   * +25 roleKeyword in title, +15 in description, +15 location, +10 mode, +10 experience,
   * +15 skills overlap, +5 postedDaysAgo<=2, +5 source LinkedIn.
   */
  function computeMatchScore(job, prefs) {
    if (!prefs) return 0;
    var score = 0;
    var title = (job.title || "").toLowerCase();
    var desc = (job.description || "").toLowerCase();
    var roleKeywords = (prefs.roleKeywords || "")
      .split(",")
      .map(function (s) { return s.trim().toLowerCase(); })
      .filter(Boolean);
    var prefLocs = Array.isArray(prefs.preferredLocations) ? prefs.preferredLocations : [];
    var prefMode = Array.isArray(prefs.preferredMode) ? prefs.preferredMode : [];
    var userSkills = (prefs.skills || "")
      .split(",")
      .map(function (s) { return s.trim().toLowerCase(); })
      .filter(Boolean);
    var jobSkills = (job.skills || []).map(function (s) { return (s || "").toLowerCase(); });

    if (roleKeywords.length) {
      if (roleKeywords.some(function (k) { return title.indexOf(k) >= 0; })) score += 25;
      if (roleKeywords.some(function (k) { return desc.indexOf(k) >= 0; })) score += 15;
    }
    if (prefLocs.length && job.location && prefLocs.indexOf(job.location) >= 0) score += 15;
    if (prefMode.length && job.mode && prefMode.indexOf(job.mode) >= 0) score += 10;
    if (prefs.experienceLevel && job.experience === prefs.experienceLevel) score += 10;
    if (userSkills.length && jobSkills.some(function (js) {
      return userSkills.some(function (us) { return js.indexOf(us) >= 0 || us.indexOf(js) >= 0; });
    })) score += 15;
    if (job.postedDaysAgo != null && job.postedDaysAgo <= 2) score += 5;
    if (job.source === "LinkedIn") score += 5;

    return score > 100 ? 100 : score;
  }

  function getScoreBadgeClass(score) {
    if (score >= 80) return "jt-score--high";
    if (score >= 60) return "jt-score--medium";
    if (score >= 40) return "jt-score--neutral";
    return "jt-score--low";
  }

  function extractSalaryNumber(salaryRange) {
    if (!salaryRange || typeof salaryRange !== "string") return 0;
    var m = salaryRange.match(/(\d+)/);
    return m ? parseInt(m[1], 10) : 0;
  }

  function getTodayKey() {
    var d = new Date();
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return y + "-" + m + "-" + day;
  }

  function getDigestForToday() {
    try {
      var key = DIGEST_KEY_PREFIX + getTodayKey();
      var raw = localStorage.getItem(key);
      if (!raw) return null;
      var data = JSON.parse(raw);
      return data && data.jobs && Array.isArray(data.jobs) ? data : null;
    } catch (e) {
      return null;
    }
  }

  function generateDigest() {
    var jobs = getJobs();
    var withScores = jobsWithScores(jobs);
    withScores.sort(function (a, b) {
      var sa = a.matchScore != null ? a.matchScore : 0;
      var sb = b.matchScore != null ? b.matchScore : 0;
      if (sb !== sa) return sb - sa;
      var da = a.postedDaysAgo != null ? a.postedDaysAgo : 99;
      var db = b.postedDaysAgo != null ? b.postedDaysAgo : 99;
      return da - db;
    });
    var top10 = withScores.slice(0, 10);
    return { date: getTodayKey(), jobs: top10 };
  }

  function saveDigest(digest) {
    try {
      localStorage.setItem(DIGEST_KEY_PREFIX + digest.date, JSON.stringify(digest));
    } catch (e) {}
  }

  function formatDigestPlainText(jobs) {
    var lines = ["Top 10 Jobs For You — 9AM Digest", formatDigestDate(getTodayKey()), ""];
    jobs.forEach(function (j, i) {
      lines.push((i + 1) + ". " + (j.title || "") + " at " + (j.company || ""));
      lines.push("   Location: " + (j.location || "—") + " | Experience: " + (j.experience || "—") + " | Match: " + (j.matchScore != null ? j.matchScore : "—"));
      lines.push("   Apply: " + (j.applyUrl || ""));
      lines.push("");
    });
    lines.push("This digest was generated based on your preferences.");
    return lines.join("\n");
  }

  function formatDigestDate(ymd) {
    if (!ymd) return "";
    var parts = ymd.split("-");
    if (parts.length !== 3) return ymd;
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var month = months[parseInt(parts[1], 10) - 1] || parts[1];
    return month + " " + parseInt(parts[2], 10) + ", " + parts[0];
  }

  function getSavedIds() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      return [];
    }
  }

  function saveJob(id) {
    var ids = getSavedIds();
    if (ids.indexOf(id) >= 0) return;
    ids.push(id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }

  function removeSaved(id) {
    var ids = getSavedIds().filter(function (x) { return x !== id; });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }

  function isSaved(id) {
    return getSavedIds().indexOf(id) >= 0;
  }

  function getStatusMap() {
    try {
      var raw = localStorage.getItem(STATUS_KEY);
      if (!raw) return {};
      var o = JSON.parse(raw);
      return o && typeof o === "object" ? o : {};
    } catch (e) {
      return {};
    }
  }

  function getJobStatus(jobId) {
    var map = getStatusMap();
    var s = map[jobId];
    return s === "Applied" || s === "Rejected" || s === "Selected" || s === "Not Applied" ? s : "Not Applied";
  }

  function setJobStatus(jobId, status, job) {
    var map = getStatusMap();
    map[jobId] = status;
    try {
      localStorage.setItem(STATUS_KEY, JSON.stringify(map));
    } catch (e) {}
    if (status === "Applied" || status === "Rejected" || status === "Selected") {
      var history = getStatusHistory();
      history.unshift({
        jobId: jobId,
        title: (job && job.title) || "",
        company: (job && job.company) || "",
        status: status,
        dateChanged: new Date().toISOString()
      });
      history = history.slice(0, STATUS_HISTORY_MAX);
      try {
        localStorage.setItem(STATUS_HISTORY_KEY, JSON.stringify(history));
      } catch (e) {}
      showToast("Status updated: " + status);
    }
  }

  function getStatusHistory() {
    try {
      var raw = localStorage.getItem(STATUS_HISTORY_KEY);
      if (!raw) return [];
      var arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      return [];
    }
  }

  function showToast(message) {
    var existing = document.getElementById("jt-toast");
    if (existing) existing.remove();
    var el = document.createElement("div");
    el.id = "jt-toast";
    el.className = "jt-toast";
    el.setAttribute("role", "status");
    el.textContent = message;
    document.body.appendChild(el);
    setTimeout(function () {
      if (el.parentNode) el.remove();
    }, 2500);
  }

  function formatPosted(days) {
    if (days === 0) return "Today";
    if (days === 1) return "1 day ago";
    return days + " days ago";
  }

  function getRoute() {
    var hash = window.location.hash.slice(1).replace(/^\/?|\/$/g, "") || "";
    var routes = { "": true, dashboard: true, saved: true, digest: true, settings: true, proof: true, "jt/07-test": true, "jt/08-ship": true, "jt/proof": true };
    return routes[hash] ? hash : "";
  }

  function getProofArtifacts() {
    try {
      var raw = localStorage.getItem(PROOF_ARTIFACTS_KEY);
      if (!raw) return { lovableLink: "", githubLink: "", deployedLink: "" };
      var o = JSON.parse(raw);
      return o && typeof o === "object"
        ? { lovableLink: o.lovableLink || "", githubLink: o.githubLink || "", deployedLink: o.deployedLink || "" }
        : { lovableLink: "", githubLink: "", deployedLink: "" };
    } catch (e) {
      return { lovableLink: "", githubLink: "", deployedLink: "" };
    }
  }

  function setProofArtifacts(o) {
    try {
      localStorage.setItem(PROOF_ARTIFACTS_KEY, JSON.stringify(o));
    } catch (e) {}
  }

  function validateUrl(s) {
    if (!s || typeof s !== "string") return false;
    var t = s.trim();
    if (t.length === 0 || t.length > 2048) return false;
    return /^https?:\/\/[^\s]+$/i.test(t);
  }

  function allProofLinksValid() {
    var a = getProofArtifacts();
    return validateUrl(a.lovableLink) && validateUrl(a.githubLink) && validateUrl(a.deployedLink);
  }

  function getProjectStatus() {
    try {
      var s = localStorage.getItem(PROJECT_STATUS_KEY);
      if (s === "Shipped") return "Shipped";
      if (s === "In Progress") return "In Progress";
      return "Not Started";
    } catch (e) {
      return "Not Started";
    }
  }

  function setProjectStatus(status) {
    if (status !== "Not Started" && status !== "In Progress" && status !== "Shipped") return;
    if (status === "Shipped") {
      if (!allTestsPassed() || !allProofLinksValid()) return;
    }
    try {
      localStorage.setItem(PROJECT_STATUS_KEY, status);
    } catch (e) {}
  }

  function getTestChecklist() {
    try {
      var raw = localStorage.getItem(TEST_CHECKLIST_KEY);
      if (!raw) return new Array(TEST_CHECKLIST_COUNT).fill(false);
      var arr = JSON.parse(raw);
      if (!Array.isArray(arr) || arr.length !== TEST_CHECKLIST_COUNT) return new Array(TEST_CHECKLIST_COUNT).fill(false);
      return arr.map(function (x) { return !!x; });
    } catch (e) {
      return new Array(TEST_CHECKLIST_COUNT).fill(false);
    }
  }

  function setTestChecklistItem(index, checked) {
    var arr = getTestChecklist();
    if (index < 0 || index >= TEST_CHECKLIST_COUNT) return;
    arr[index] = !!checked;
    try {
      localStorage.setItem(TEST_CHECKLIST_KEY, JSON.stringify(arr));
    } catch (e) {}
  }

  function allTestsPassed() {
    var arr = getTestChecklist();
    return arr.length === TEST_CHECKLIST_COUNT && arr.every(function (x) { return x; });
  }

  function resetTestChecklist() {
    try {
      localStorage.setItem(TEST_CHECKLIST_KEY, JSON.stringify(new Array(TEST_CHECKLIST_COUNT).fill(false)));
    } catch (e) {}
  }

  function getFilterValues(jobs) {
    var locs = {}, modes = {}, exps = {}, sources = {};
    jobs.forEach(function (j) {
      locs[j.location] = true;
      modes[j.mode] = true;
      exps[j.experience] = true;
      sources[j.source] = true;
    });
    return {
      locations: Object.keys(locs).sort(),
      modes: Object.keys(modes).sort(),
      experiences: Object.keys(exps).sort(),
      sources: Object.keys(sources).sort()
    };
  }

  function getFilterStateFromDom() {
    var kw = document.getElementById("jt-filter-keyword");
    var loc = document.getElementById("jt-filter-location");
    var mode = document.getElementById("jt-filter-mode");
    var exp = document.getElementById("jt-filter-experience");
    var src = document.getElementById("jt-filter-source");
    var sort = document.getElementById("jt-filter-sort");
    var onlyAbove = document.getElementById("jt-filter-only-above");
    var statusFilter = document.getElementById("jt-filter-status");
    return {
      keyword: (kw && kw.value) ? kw.value.trim().toLowerCase() : "",
      location: (loc && loc.value) || "",
      mode: (mode && mode.value) || "",
      experience: (exp && exp.value) || "",
      source: (src && src.value) || "",
      sort: (sort && sort.value) || "latest",
      onlyAboveThreshold: !!(onlyAbove && onlyAbove.checked),
      status: (statusFilter && statusFilter.value) || ""
    };
  }

  function applyFiltersAndSort(jobsWithScores, state) {
    var list = jobsWithScores.slice();
    var prefs = getPreferences();
    var minScore = (prefs && prefs.minMatchScore != null) ? Number(prefs.minMatchScore) : 40;

    if (state.keyword) {
      var k = state.keyword;
      list = list.filter(function (j) {
        return (j.title && j.title.toLowerCase().indexOf(k) >= 0) ||
          (j.company && j.company.toLowerCase().indexOf(k) >= 0);
      });
    }
    if (state.location) list = list.filter(function (j) { return j.location === state.location; });
    if (state.mode) list = list.filter(function (j) { return j.mode === state.mode; });
    if (state.experience) list = list.filter(function (j) { return j.experience === state.experience; });
    if (state.source) list = list.filter(function (j) { return j.source === state.source; });
    if (state.onlyAboveThreshold) list = list.filter(function (j) { return (j.matchScore != null ? j.matchScore : 0) >= minScore; });
    if (state.status) list = list.filter(function (j) { return getJobStatus(j.id) === state.status; });

    var sortType = state.sort || "latest";
    list.sort(function (a, b) {
      if (sortType === "match") {
        var sa = a.matchScore != null ? a.matchScore : 0;
        var sb = b.matchScore != null ? b.matchScore : 0;
        return sb - sa;
      }
      if (sortType === "salary") {
        var na = extractSalaryNumber(a.salaryRange);
        var nb = extractSalaryNumber(b.salaryRange);
        return nb - na;
      }
      var da = a.postedDaysAgo != null ? a.postedDaysAgo : 99;
      var db = b.postedDaysAgo != null ? b.postedDaysAgo : 99;
      return da - db;
    });
    return list;
  }

  function openModal(job) {
    var overlay = document.getElementById("jt-modal");
    var content = document.getElementById("jt-modal-content");
    if (!overlay || !content || !job) return;
    var skillsHtml = (job.skills && job.skills.length)
      ? job.skills.map(function (s) { return "<span class=\"jt-modal__skill\">" + escapeHtml(s) + "</span>"; }).join("")
      : "";
    content.innerHTML =
      "<h2 class=\"jt-modal__heading\">" + escapeHtml(job.title) + "</h2>" +
      "<p class=\"jt-modal__company\">" + escapeHtml(job.company) + "</p>" +
      "<div class=\"jt-modal__section\">" +
      "<p class=\"jt-modal__label\">Description</p>" +
      "<p class=\"jt-modal__description\">" + escapeHtml(job.description || "") + "</p>" +
      "</div>" +
      "<div class=\"jt-modal__section\">" +
      "<p class=\"jt-modal__label\">Skills</p>" +
      "<div class=\"jt-modal__skills\">" + skillsHtml + "</div>" +
      "</div>" +
      "<button type=\"button\" class=\"kn-btn kn-btn--secondary jt-modal__close\" data-action=\"modal-close\">Close</button>";
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
  }

  function closeModal() {
    var overlay = document.getElementById("jt-modal");
    if (overlay) {
      overlay.classList.remove("is-open");
      overlay.setAttribute("aria-hidden", "true");
    }
  }

  function getStatusClass(status) {
    if (status === "Applied") return "jt-status--applied";
    if (status === "Rejected") return "jt-status--rejected";
    if (status === "Selected") return "jt-status--selected";
    return "jt-status--neutral";
  }

  function renderJobCard(job, options) {
    options = options || {};
    var saved = options.saved !== false && isSaved(job.id);
    var showUnsave = options.showUnsave === true;
    var score = job.matchScore != null ? job.matchScore : null;
    var status = getJobStatus(job.id);
    var statusClass = getStatusClass(status);
    var locationMode = [job.location, job.mode].filter(Boolean).join(" · ");
    var scoreBadge = score != null
      ? "<span class=\"jt-card__score jt-score-badge " + getScoreBadgeClass(score) + "\">" + score + "</span>"
      : "";
    var statusBtns = ["Not Applied", "Applied", "Rejected", "Selected"].map(function (s) {
      var active = s === status ? " jt-status-btn--active " + statusClass : "";
      return "<button type=\"button\" class=\"jt-status-btn" + active + "\" data-action=\"status\" data-status=\"" + escapeHtml(s) + "\">" + escapeHtml(s) + "</button>";
    }).join("");
    return (
      "<div class=\"jt-card\" data-job-id=\"" + escapeHtml(job.id) + "\">" +
      "<div class=\"jt-card__row\">" +
      "<h3 class=\"jt-card__title\">" + escapeHtml(job.title) + "</h3>" +
      scoreBadge +
      "<span class=\"jt-card__badge\">" + escapeHtml(job.source) + "</span>" +
      "</div>" +
      "<p class=\"jt-card__company\">" + escapeHtml(job.company) + "</p>" +
      "<p class=\"jt-card__meta\">" +
      escapeHtml(locationMode) +
      (job.experience ? " · " + escapeHtml(job.experience) : "") +
      (job.salaryRange ? " · " + escapeHtml(job.salaryRange) : "") +
      " · " + escapeHtml(formatPosted(job.postedDaysAgo != null ? job.postedDaysAgo : 0)) +
      "</p>" +
      "<div class=\"jt-card__status-group\">" + statusBtns + "</div>" +
      "<div class=\"jt-card__actions\">" +
      "<button type=\"button\" class=\"kn-btn kn-btn--secondary\" data-action=\"view\">View</button>" +
      (showUnsave && saved
        ? "<button type=\"button\" class=\"kn-btn kn-btn--secondary\" data-action=\"unsave\">Remove</button>"
        : "<button type=\"button\" class=\"kn-btn kn-btn--secondary\" data-action=\"save\">" + (saved ? "Saved" : "Save") + "</button>") +
      "<a href=\"" + escapeHtml(job.applyUrl || "#") + "\" target=\"_blank\" rel=\"noopener\" class=\"kn-btn kn-btn--primary\">Apply</a>" +
      "</div>" +
      "</div>"
    );
  }

  function getDefaultFilterState() {
    return { keyword: "", location: "", mode: "", experience: "", source: "", sort: "latest", onlyAboveThreshold: false, status: "" };
  }

  function buildFilterBar(jobs, state) {
    state = state || getDefaultFilterState();
    var v = getFilterValues(jobs);
    var opt = function (list, selected) {
      return list.map(function (x) {
        return "<option value=\"" + escapeHtml(x) + "\"" + (x === selected ? " selected" : "") + ">" + escapeHtml(x) + "</option>";
      }).join("");
    };
    var checked = state.onlyAboveThreshold ? " checked" : "";
    return (
      "<div class=\"jt-filters\">" +
      "<div class=\"jt-filters__keyword\">" +
      "<input type=\"text\" id=\"jt-filter-keyword\" class=\"kn-input\" placeholder=\"Search title or company\" value=\"" + escapeHtml(state.keyword) + "\" />" +
      "</div>" +
      "<select id=\"jt-filter-location\" aria-label=\"Location\">" +
      "<option value=\"\">All locations</option>" + opt(v.locations, state.location) +
      "</select>" +
      "<select id=\"jt-filter-mode\" aria-label=\"Mode\">" +
      "<option value=\"\">All modes</option>" + opt(v.modes, state.mode) +
      "</select>" +
      "<select id=\"jt-filter-experience\" aria-label=\"Experience\">" +
      "<option value=\"\">All experience</option>" + opt(v.experiences, state.experience) +
      "</select>" +
      "<select id=\"jt-filter-source\" aria-label=\"Source\">" +
      "<option value=\"\">All sources</option>" + opt(v.sources, state.source) +
      "</select>" +
      "<select id=\"jt-filter-status\" aria-label=\"Status\">" +
      "<option value=\"\"" + (state.status === "" ? " selected" : "") + ">All</option>" +
      "<option value=\"Not Applied\"" + (state.status === "Not Applied" ? " selected" : "") + ">Not Applied</option>" +
      "<option value=\"Applied\"" + (state.status === "Applied" ? " selected" : "") + ">Applied</option>" +
      "<option value=\"Rejected\"" + (state.status === "Rejected" ? " selected" : "") + ">Rejected</option>" +
      "<option value=\"Selected\"" + (state.status === "Selected" ? " selected" : "") + ">Selected</option>" +
      "</select>" +
      "<select id=\"jt-filter-sort\" aria-label=\"Sort\">" +
      "<option value=\"latest\"" + (state.sort === "latest" ? " selected" : "") + ">Latest</option>" +
      "<option value=\"match\"" + (state.sort === "match" ? " selected" : "") + ">Match Score</option>" +
      "<option value=\"salary\"" + (state.sort === "salary" ? " selected" : "") + ">Salary</option>" +
      "</select>" +
      "<label class=\"jt-filters__toggle\">" +
      "<input type=\"checkbox\" id=\"jt-filter-only-above\" aria-label=\"Show only jobs above my threshold\"" + checked + " />" +
      "<span>Show only jobs above my threshold</span>" +
      "</label>" +
      "</div>"
    );
  }

  function jobsWithScores(jobs) {
    var prefs = getPreferences();
    return jobs.map(function (j) {
      var copy = Object.assign({}, j);
      copy.matchScore = computeMatchScore(j, prefs);
      return copy;
    });
  }

  function renderDashboard() {
    var jobs = getJobs();
    var state = getFilterStateFromDom();
    if (!document.getElementById("jt-filter-keyword")) state = getDefaultFilterState();
    var withScores = jobsWithScores(jobs);
    var filtered = applyFiltersAndSort(withScores, state);
    var filterBar = buildFilterBar(jobs, state);
    var prefs = getPreferences();
    var banner = !prefs
      ? "<div class=\"jt-banner\" role=\"status\">Set your preferences to activate intelligent matching.</div>"
      : "";
    var cardsHtml;
    if (filtered.length === 0) {
      cardsHtml = "<div class=\"jt-empty jt-empty--inline\">" +
        "<p class=\"jt-empty__text\">No roles match your criteria. Adjust filters or lower threshold.</p>" +
        "</div>";
    } else {
      cardsHtml = filtered.map(function (j) { return renderJobCard(j); }).join("");
    }
    return (
      "<div class=\"jt-dashboard\">" +
      "<h1 class=\"jt-dashboard__heading\">Dashboard</h1>" +
      banner +
      filterBar +
      "<div class=\"jt-cards\" id=\"jt-cards\">" + cardsHtml + "</div>" +
      "</div>"
    );
  }

  function renderSaved() {
    var all = getJobs();
    var ids = getSavedIds();
    var savedJobs = ids.map(function (id) { return all.find(function (j) { return j.id === id; }); }).filter(Boolean);
    if (savedJobs.length === 0) {
      return (
        "<div class=\"jt-empty\">" +
        "<h1 class=\"jt-empty__heading\">Saved</h1>" +
        "<p class=\"jt-empty__text\">No saved jobs yet. Save jobs from the Dashboard to see them here.</p>" +
        "</div>"
      );
    }
    var cardsHtml = savedJobs.map(function (j) { return renderJobCard(j, { showUnsave: true }); }).join("");
    return (
      "<div class=\"jt-dashboard\">" +
      "<h1 class=\"jt-dashboard__heading\">Saved</h1>" +
      "<div class=\"jt-cards\" id=\"jt-cards\">" + cardsHtml + "</div>" +
      "</div>"
    );
  }

  function renderLanding() {
    return (
      '<div class="jt-landing">' +
      '<h1 class="jt-landing__headline">Stop Missing The Right Jobs.</h1>' +
      '<p class="jt-landing__subtext">Precision-matched job discovery delivered daily at 9AM.</p>' +
      '<a href="#/settings" class="jt-landing__cta kn-btn kn-btn--primary">Start Tracking</a>' +
      "</div>"
    );
  }

  function renderSettings() {
    var jobs = getJobs();
    var v = getFilterValues(jobs);
    var prefs = getPreferences() || getDefaultPreferences();
    var locs = (prefs.preferredLocations || []);
    var modes = (prefs.preferredMode || []);
    var roleKw = escapeHtml(prefs.roleKeywords || "");
    var skillsVal = escapeHtml(prefs.skills || "");
    var minScore = prefs.minMatchScore != null ? Number(prefs.minMatchScore) : 40;
    var expVal = prefs.experienceLevel || "";
    var locOpts = v.locations.map(function (x) {
      var sel = locs.indexOf(x) >= 0 ? " selected" : "";
      return "<option value=\"" + escapeHtml(x) + "\"" + sel + ">" + escapeHtml(x) + "</option>";
    }).join("");
    var modeRemote = modes.indexOf("Remote") >= 0 ? " checked" : "";
    var modeHybrid = modes.indexOf("Hybrid") >= 0 ? " checked" : "";
    var modeOnsite = modes.indexOf("Onsite") >= 0 ? " checked" : "";
    var expOpts = ["Fresher", "0-1", "1-3", "3-5"].map(function (x) {
      return "<option value=\"" + escapeHtml(x) + "\"" + (expVal === x ? " selected" : "") + ">" + escapeHtml(x) + "</option>";
    }).join("");
    return (
      '<div class="jt-settings">' +
      '<h1 class="jt-settings__heading">Settings</h1>' +
      '<div class="jt-field">' +
      '<label class="jt-field__label" for="jt-roleKeywords">Role keywords</label>' +
      '<input type="text" id="jt-roleKeywords" class="kn-input" placeholder="e.g. Frontend, React, Product Manager" value="' + roleKw + '" />' +
      '<span class="jt-field__hint">Comma-separated</span>' +
      "</div>" +
      '<div class="jt-field">' +
      '<label class="jt-field__label" for="jt-preferredLocations">Preferred locations</label>' +
      '<select id="jt-preferredLocations" class="kn-input jt-select-multi" multiple aria-label=\"Preferred locations\">' + locOpts + '</select>' +
      '<span class="jt-field__hint">Hold Ctrl/Cmd to select multiple</span>' +
      "</div>" +
      '<div class="jt-field">' +
      '<span class="jt-field__label">Preferred mode</span>' +
      '<div class="jt-field__checkboxes">' +
      '<label class="jt-checkbox"><input type="checkbox" name="jt-mode" value="Remote"' + modeRemote + ' /> Remote</label>' +
      '<label class="jt-checkbox"><input type="checkbox" name="jt-mode" value="Hybrid"' + modeHybrid + ' /> Hybrid</label>' +
      '<label class="jt-checkbox"><input type="checkbox" name="jt-mode" value="Onsite"' + modeOnsite + ' /> Onsite</label>' +
      '</div>' +
      "</div>" +
      '<div class="jt-field">' +
      '<label class="jt-field__label" for="jt-experienceLevel">Experience level</label>' +
      '<select id="jt-experienceLevel">' +
      '<option value="">Any</option>' + expOpts +
      '</select>' +
      "</div>" +
      '<div class="jt-field">' +
      '<label class="jt-field__label" for="jt-skills">Skills</label>' +
      '<input type="text" id="jt-skills" class="kn-input" placeholder="e.g. React, Python, SQL" value="' + skillsVal + '" />' +
      '<span class="jt-field__hint">Comma-separated</span>' +
      "</div>" +
      '<div class="jt-field">' +
      '<label class="jt-field__label" for="jt-minMatchScore">Minimum match score <span id="jt-minMatchScore-value">' + minScore + '</span></label>' +
      '<input type="range" id="jt-minMatchScore" min="0" max="100" value="' + minScore + '" />' +
      "</div>" +
      '<button type="button" id="jt-settings-save" class="kn-btn kn-btn--primary">Save preferences</button>' +
      "</div>"
    );
  }

  function attachSettingsListeners() {
    var saveBtn = document.getElementById("jt-settings-save");
    var slider = document.getElementById("jt-minMatchScore");
    var valueEl = document.getElementById("jt-minMatchScore-value");
    if (slider && valueEl) {
      function updateSliderLabel() { valueEl.textContent = slider.value; }
      slider.addEventListener("input", updateSliderLabel);
    }
    if (saveBtn) {
      saveBtn.addEventListener("click", function () {
        var roleKeywords = (document.getElementById("jt-roleKeywords") || {}).value || "";
        var locEl = document.getElementById("jt-preferredLocations");
        var preferredLocations = [];
        if (locEl) {
          for (var i = 0; i < locEl.options.length; i++) {
            if (locEl.options[i].selected) preferredLocations.push(locEl.options[i].value);
          }
        }
        var modeChecks = document.querySelectorAll("input[name=\"jt-mode\"]:checked");
        var preferredMode = [];
        for (var m = 0; m < modeChecks.length; m++) preferredMode.push(modeChecks[m].value);
        var experienceLevel = (document.getElementById("jt-experienceLevel") || {}).value || "";
        var skills = (document.getElementById("jt-skills") || {}).value || "";
        var minMatchScore = 40;
        if (slider) minMatchScore = parseInt(slider.value, 10);
        if (isNaN(minMatchScore) || minMatchScore < 0) minMatchScore = 0;
        if (minMatchScore > 100) minMatchScore = 100;
        setPreferences({
          roleKeywords: roleKeywords.trim(),
          preferredLocations: preferredLocations,
          preferredMode: preferredMode,
          experienceLevel: experienceLevel,
          skills: skills.trim(),
          minMatchScore: minMatchScore
        });
        saveBtn.textContent = "Saved";
        setTimeout(function () { saveBtn.textContent = "Save preferences"; }, 1500);
      });
    }
  }

  function renderEmpty(title, message) {
    return (
      '<div class="jt-empty">' +
      "<h1 class=\"jt-empty__heading\">" + escapeHtml(title) + "</h1>" +
      "<p class=\"jt-empty__text\">" + escapeHtml(message) + "</p>" +
      "</div>"
    );
  }

  function renderDigestJob(job) {
    var score = job.matchScore != null ? job.matchScore : "—";
    var scoreClass = typeof score === "number" ? getScoreBadgeClass(score) : "";
    var scoreHtml = typeof score === "number"
      ? "<span class=\"jt-digest-job__score jt-score-badge " + scoreClass + "\">" + score + "</span>"
      : "<span class=\"jt-digest-job__score\">—</span>";
    return (
      "<div class=\"jt-digest-job\">" +
      "<div class=\"jt-digest-job__row\">" +
      "<strong class=\"jt-digest-job__title\">" + escapeHtml(job.title || "") + "</strong> " + scoreHtml +
      "</div>" +
      "<p class=\"jt-digest-job__company\">" + escapeHtml(job.company || "") + "</p>" +
      "<p class=\"jt-digest-job__meta\">" +
      escapeHtml(job.location || "—") + " · " + escapeHtml(job.experience || "—") +
      "</p>" +
      "<a href=\"" + escapeHtml(job.applyUrl || "#") + "\" target=\"_blank\" rel=\"noopener\" class=\"kn-btn kn-btn--primary jt-digest-job__apply\">Apply</a>" +
      "</div>"
    );
  }

  function renderDigest() {
    var prefs = getPreferences();
    if (!prefs) {
      return (
        "<div class=\"jt-digest\">" +
        "<h1 class=\"jt-digest__heading\">Digest</h1>" +
        "<div class=\"jt-digest-block jt-digest-block--message\">" +
        "<p class=\"jt-digest-block__text\">Set preferences to generate a personalized digest.</p>" +
        "<a href=\"#/settings\" class=\"kn-btn kn-btn--primary\">Go to Settings</a>" +
        "</div>" +
        "</div>"
      );
    }
    var digest = getDigestForToday();
    var todayKey = getTodayKey();
    var dateLabel = formatDigestDate(todayKey);
    var note = "<p class=\"jt-digest__note\">Demo Mode: Daily 9AM trigger simulated manually.</p>";
    var btn = "<button type=\"button\" id=\"jt-digest-generate\" class=\"kn-btn kn-btn--primary\">Generate Today's 9AM Digest (Simulated)</button>";
    var card = "";
    if (digest) {
      if (!digest.jobs || digest.jobs.length === 0) {
        card = "<div class=\"jt-digest-card\">" +
          "<p class=\"jt-digest-card__empty\">No matching roles today. Check again tomorrow.</p>" +
          "</div>";
      } else {
        var jobsHtml = digest.jobs.map(function (j) { return renderDigestJob(j); }).join("");
        card = "<div class=\"jt-digest-card\">" +
          "<h2 class=\"jt-digest-card__header\">Top 10 Jobs For You — 9AM Digest</h2>" +
          "<p class=\"jt-digest-card__subtext\">" + escapeHtml(dateLabel) + "</p>" +
          "<div class=\"jt-digest-card__jobs\">" + jobsHtml + "</div>" +
          "<p class=\"jt-digest-card__footer\">This digest was generated based on your preferences.</p>" +
          "<div class=\"jt-digest-card__actions\">" +
          "<button type=\"button\" id=\"jt-digest-copy\" class=\"kn-btn kn-btn--secondary\">Copy Digest to Clipboard</button>" +
          "<a href=\"#\" id=\"jt-digest-mailto\" class=\"kn-btn kn-btn--secondary\">Create Email Draft</a>" +
          "</div>" +
          "</div>";
      }
    }
    var statusSection = "";
    var history = getStatusHistory();
    if (history.length > 0) {
      var historyHtml = history.map(function (h) {
        var d = "";
        try {
          var dt = new Date(h.dateChanged);
          d = dt.toLocaleDateString() + " " + dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        } catch (err) { d = h.dateChanged || ""; }
        var statusCls = h.status === "Applied" ? "jt-status--applied" : h.status === "Rejected" ? "jt-status--rejected" : h.status === "Selected" ? "jt-status--selected" : "jt-status--neutral";
        return "<div class=\"jt-digest-status-item\">" +
          "<strong class=\"jt-digest-status-item__title\">" + escapeHtml(h.title) + "</strong> " +
          "<span class=\"jt-digest-status-item__company\">" + escapeHtml(h.company) + "</span> " +
          "<span class=\"jt-digest-status-item__status " + statusCls + "\">" + escapeHtml(h.status) + "</span> " +
          "<span class=\"jt-digest-status-item__date\">" + escapeHtml(d) + "</span>" +
          "</div>";
      }).join("");
      statusSection = "<div class=\"jt-digest-status\">" +
        "<h3 class=\"jt-digest-status__heading\">Recent Status Updates</h3>" +
        "<div class=\"jt-digest-status__list\">" + historyHtml + "</div>" +
        "</div>";
    }
    return (
      "<div class=\"jt-digest\">" +
      "<h1 class=\"jt-digest__heading\">Digest</h1>" +
      note +
      "<div class=\"jt-digest__generate\">" + btn + "</div>" +
      card +
      statusSection +
      "</div>"
    );
  }

  function attachDigestListeners() {
    var gen = document.getElementById("jt-digest-generate");
    if (gen) {
      gen.addEventListener("click", function () {
        var digest = getDigestForToday();
        if (!digest) {
          digest = generateDigest();
          saveDigest(digest);
        }
        render("digest");
        setActiveLink("digest");
      });
    }
    var copyBtn = document.getElementById("jt-digest-copy");
    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        var digest = getDigestForToday();
        if (!digest || !digest.jobs || digest.jobs.length === 0) return;
        var text = formatDigestPlainText(digest.jobs);
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function () {
            copyBtn.textContent = "Copied";
            setTimeout(function () { copyBtn.textContent = "Copy Digest to Clipboard"; }, 2000);
          });
        }
      });
    }
    var mailtoLink = document.getElementById("jt-digest-mailto");
    if (mailtoLink) {
      var digest = getDigestForToday();
      if (digest && digest.jobs && digest.jobs.length > 0) {
        var text = formatDigestPlainText(digest.jobs);
        mailtoLink.href = "mailto:?subject=" + encodeURIComponent("My 9AM Job Digest") + "&body=" + encodeURIComponent(text);
        mailtoLink.setAttribute("target", "_blank");
        mailtoLink.setAttribute("rel", "noopener");
      }
      mailtoLink.addEventListener("click", function (e) {
        if (mailtoLink.href === "#" || mailtoLink.getAttribute("href") === "#") e.preventDefault();
      });
    }
  }

  var TEST_ITEMS = [
    { label: "Preferences persist after refresh", tip: "Save preferences in Settings, refresh the page, open Settings again — values should be pre-filled." },
    { label: "Match score calculates correctly", tip: "Set preferences, open Dashboard — job cards should show match score badges; higher match when role/location/skills align." },
    { label: "\"Show only matches\" toggle works", tip: "On Dashboard, enable \"Show only jobs above my threshold\" — only jobs with score ≥ your min match score appear." },
    { label: "Save job persists after refresh", tip: "Click Save on a job, refresh — job should still show Saved; it appears on Saved page." },
    { label: "Apply opens in new tab", tip: "Click Apply on any job — the apply URL should open in a new browser tab." },
    { label: "Status update persists after refresh", tip: "Change a job status to Applied/Rejected/Selected, refresh — the same status should still be selected." },
    { label: "Status filter works correctly", tip: "On Dashboard, set Status dropdown to e.g. Applied — only jobs with that status appear; combines with other filters." },
    { label: "Digest generates top 10 by score", tip: "Generate digest on Digest page — list shows up to 10 jobs, ordered by match score then recency." },
    { label: "Digest persists for the day", tip: "Generate digest, refresh page, open Digest again — same digest appears without regenerating." },
    { label: "No console errors on main pages", tip: "Open Dashboard, Saved, Digest, Settings, Proof — check browser console (F12) for errors; there should be none." }
  ];

  function renderTestChecklist() {
    var checklist = getTestChecklist();
    var passed = checklist.filter(Boolean).length;
    var allPass = allTestsPassed();
    var linksOk = allProofLinksValid();
    var canShip = allPass && linksOk;
    var summaryClass = passed < TEST_CHECKLIST_COUNT ? " jt-test-summary--warn" : "";
    var summaryHtml = "<div class=\"jt-test-summary" + summaryClass + "\">" +
      "<p class=\"jt-test-summary__count\">Tests Passed: " + passed + " / " + TEST_CHECKLIST_COUNT + "</p>" +
      "<p class=\"jt-test-summary__warn\">Resolve all issues before shipping.</p>" +
      "</div>";
    var itemsHtml = TEST_ITEMS.map(function (item, i) {
      var checked = checklist[i] ? " checked" : "";
      var tip = item.tip ? "<span class=\"jt-test-tip\" title=\"" + escapeHtml(item.tip) + "\" aria-label=\"How to test\">?</span>" : "";
      return "<label class=\"jt-test-item\">" +
        "<input type=\"checkbox\" class=\"jt-test-item__cb\" data-test-index=\"" + i + "\"" + checked + " />" +
        "<span class=\"jt-test-item__label\">" + escapeHtml(item.label) + "</span>" +
        tip +
        "</label>";
    }).join("");
    var shipDisabled = canShip ? "" : " disabled";
    var shipBtn = "<a href=\"" + (canShip ? "#/jt/08-ship" : "#") + "\" class=\"kn-btn kn-btn--primary jt-test-ship\"" + shipDisabled + " id=\"jt-test-ship-btn\">Ship</a>";
    return (
      "<div class=\"jt-test\">" +
      "<h1 class=\"jt-test__heading\">Test Checklist</h1>" +
      summaryHtml +
      "<div class=\"jt-test-actions\">" +
      "<button type=\"button\" class=\"kn-btn kn-btn--secondary\" id=\"jt-test-reset\">Reset Test Status</button>" +
      shipBtn +
      "</div>" +
      "<div class=\"jt-test-list\">" + itemsHtml + "</div>" +
      "</div>"
    );
  }

  function renderShip() {
    var allPass = allTestsPassed();
    var linksOk = allProofLinksValid();
    if (!allPass) {
      return (
        "<div class=\"jt-ship\">" +
        "<h1 class=\"jt-ship__heading\">Ship</h1>" +
        "<div class=\"jt-ship-locked\">" +
        "<p class=\"jt-ship-locked__text\">Complete all tests first. Go to the Test Checklist and check all 10 items.</p>" +
        "<a href=\"#/jt/07-test\" class=\"kn-btn kn-btn--primary\">Open Test Checklist</a>" +
        "</div>" +
        "</div>"
      );
    }
    if (!linksOk) {
      return (
        "<div class=\"jt-ship\">" +
        "<h1 class=\"jt-ship__heading\">Ship</h1>" +
        "<div class=\"jt-ship-locked\">" +
        "<p class=\"jt-ship-locked__text\">Complete proof artifacts. Provide all 3 links (Lovable, GitHub, Deployed URL) on the Final Proof page.</p>" +
        "<a href=\"#/jt/proof\" class=\"kn-btn kn-btn--primary\">Open Final Proof</a>" +
        "</div>" +
        "</div>"
      );
    }
    setProjectStatus("Shipped");
    return (
      "<div class=\"jt-ship\">" +
      "<h1 class=\"jt-ship__heading\">Ship</h1>" +
      "<div class=\"jt-ship-done\">" +
      "<p class=\"jt-ship-done__text\">Project 1 Shipped Successfully.</p>" +
      "</div>" +
      "</div>"
    );
  }

  function attachTestChecklistListeners() {
    var list = document.querySelector(".jt-test-list");
    if (list) {
      list.addEventListener("change", function (e) {
        var cb = e.target.closest("input[data-test-index]");
        if (!cb) return;
        var index = parseInt(cb.getAttribute("data-test-index"), 10);
        if (!isNaN(index)) setTestChecklistItem(index, cb.checked);
        var summary = document.querySelector(".jt-test-summary");
        var countEl = summary && summary.querySelector(".jt-test-summary__count");
        var shipBtn = document.getElementById("jt-test-ship-btn");
        if (summary && countEl) {
          var checklist = getTestChecklist();
          var passed = checklist.filter(Boolean).length;
          countEl.textContent = "Tests Passed: " + passed + " / " + TEST_CHECKLIST_COUNT;
          if (summary) summary.classList.toggle("jt-test-summary--warn", passed < TEST_CHECKLIST_COUNT);
        }
        if (shipBtn) {
          var allPass = allTestsPassed();
          var linksOk = allProofLinksValid();
          var canShip = allPass && linksOk;
          shipBtn.disabled = !canShip;
          shipBtn.href = canShip ? "#/jt/08-ship" : "#";
          shipBtn.classList.toggle("kn-btn--disabled", !canShip);
        }
      });
    }
    var resetBtn = document.getElementById("jt-test-reset");
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        resetTestChecklist();
        render("jt/07-test");
        setActiveLink(getRoute());
      });
    }
    var shipBtn = document.getElementById("jt-test-ship-btn");
    if (shipBtn) {
      shipBtn.addEventListener("click", function (e) {
        if (shipBtn.disabled || shipBtn.getAttribute("href") === "#") e.preventDefault();
      });
    }
  }

  var PROOF_STEPS = [
    "Preferences configured",
    "Match scoring active",
    "Dashboard with filters",
    "Save jobs",
    "Daily digest",
    "Status tracking",
    "Test checklist",
    "Artifacts submitted"
  ];

  function getProofStepStatus() {
    var prefs = getPreferences();
    var saved = getSavedIds();
    var digest = getDigestForToday();
    var history = getStatusHistory();
    var artifacts = allProofLinksValid();
    return [
      !!prefs,
      !!prefs,
      true,
      saved.length > 0,
      !!digest,
      history.length > 0,
      allTestsPassed(),
      artifacts
    ];
  }

  function renderProofFinal() {
    var status = getProjectStatus();
    var steps = getProofStepStatus();
    var art = getProofArtifacts();
    var badgeClass = status === "Shipped" ? "jt-proof-badge--shipped" : status === "In Progress" ? "jt-proof-badge--progress" : "jt-proof-badge--not-started";
    var stepsHtml = PROOF_STEPS.map(function (label, i) {
      var done = steps[i];
      return "<div class=\"jt-proof-step\">" +
        "<span class=\"jt-proof-step__status\">" + (done ? "Completed" : "Pending") + "</span>" +
        "<span class=\"jt-proof-step__label\">" + escapeHtml(label) + "</span>" +
        "</div>";
    }).join("");
    var lovableVal = escapeHtml(art.lovableLink || "");
    var githubVal = escapeHtml(art.githubLink || "");
    var deployedVal = escapeHtml(art.deployedLink || "");
    return (
      "<div class=\"jt-proof-final\">" +
      "<h1 class=\"jt-proof-final__heading\">Project 1 — Job Notification Tracker</h1>" +
      "<p class=\"jt-proof-final__badge jt-proof-badge " + badgeClass + "\">" + escapeHtml(status) + "</p>" +
      "<section class=\"jt-proof-final__section\">" +
      "<h2 class=\"jt-proof-final__subheading\">Step Completion Summary</h2>" +
      "<div class=\"jt-proof-steps\">" + stepsHtml + "</div>" +
      "</section>" +
      "<section class=\"jt-proof-final__section\">" +
      "<h2 class=\"jt-proof-final__subheading\">Artifact Collection</h2>" +
      "<div class=\"jt-proof-fields\">" +
      "<div class=\"jt-field\">" +
      "<label class=\"jt-field__label\" for=\"jt-proof-lovable\">Lovable Project Link</label>" +
      "<input type=\"url\" id=\"jt-proof-lovable\" class=\"kn-input\" placeholder=\"https://\" value=\"" + lovableVal + "\" />" +
      "<span class=\"jt-proof-field-error\" id=\"jt-proof-lovable-err\" aria-live=\"polite\"></span>" +
      "</div>" +
      "<div class=\"jt-field\">" +
      "<label class=\"jt-field__label\" for=\"jt-proof-github\">GitHub Repository Link</label>" +
      "<input type=\"url\" id=\"jt-proof-github\" class=\"kn-input\" placeholder=\"https://\" value=\"" + githubVal + "\" />" +
      "<span class=\"jt-proof-field-error\" id=\"jt-proof-github-err\" aria-live=\"polite\"></span>" +
      "</div>" +
      "<div class=\"jt-field\">" +
      "<label class=\"jt-field__label\" for=\"jt-proof-deployed\">Deployed URL (Vercel or equivalent)</label>" +
      "<input type=\"url\" id=\"jt-proof-deployed\" class=\"kn-input\" placeholder=\"https://\" value=\"" + deployedVal + "\" />" +
      "<span class=\"jt-proof-field-error\" id=\"jt-proof-deployed-err\" aria-live=\"polite\"></span>" +
      "</div>" +
      "</div>" +
      "<button type=\"button\" id=\"jt-proof-copy\" class=\"kn-btn kn-btn--primary\">Copy Final Submission</button>" +
      "</section>" +
      "</div>"
    );
  }

  function attachProofFinalListeners() {
    var ids = ["lovable", "github", "deployed"];
    ids.forEach(function (key) {
      var input = document.getElementById("jt-proof-" + key);
      var errEl = document.getElementById("jt-proof-" + key + "-err");
      if (!input) return;
      function validateAndSave() {
        var val = input.value.trim();
        var ok = !val || validateUrl(val);
        if (errEl) errEl.textContent = val && !validateUrl(val) ? "Enter a valid URL (e.g. https://...)" : "";
        input.setAttribute("aria-invalid", val && !validateUrl(val) ? "true" : "false");
        var art = getProofArtifacts();
        if (key === "lovable") art.lovableLink = val;
        else if (key === "github") art.githubLink = val;
        else if (key === "deployed") art.deployedLink = val;
        setProofArtifacts(art);
        if (getProjectStatus() === "Not Started" && (art.lovableLink || art.githubLink || art.deployedLink)) {
          setProjectStatus("In Progress");
        }
      }
      input.addEventListener("blur", validateAndSave);
      input.addEventListener("input", function () {
        if (errEl) errEl.textContent = "";
      });
    });
    var copyBtn = document.getElementById("jt-proof-copy");
    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        var art = getProofArtifacts();
        var text = [
          "------------------------------------------",
          "Job Notification Tracker — Final Submission",
          "------------------------------------------",
          "",
          "Lovable Project:",
          art.lovableLink || "",
          "",
          "GitHub Repository:",
          art.githubLink || "",
          "",
          "Live Deployment:",
          art.deployedLink || "",
          "",
          "Core Features:",
          "- Intelligent match scoring",
          "- Daily digest simulation",
          "- Status tracking",
          "- Test checklist enforced",
          "------------------------------------------"
        ].join("\n");
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function () {
            copyBtn.textContent = "Copied";
            setTimeout(function () { copyBtn.textContent = "Copy Final Submission"; }, 2000);
          });
        }
      });
    }
  }

  function renderProof() {
    return (
      '<div class="jt-proof">' +
      '<h1 class="jt-proof__heading">Proof</h1>' +
      '<p class="jt-proof__text">Placeholder for artifact collection. This section will be built in the next step.</p>' +
      '<p class="jt-proof__link"><a href="#/jt/07-test" class="kn-btn kn-btn--secondary">Open Test Checklist</a></p>' +
      '<p class="jt-proof__link"><a href="#/jt/proof" class="kn-btn kn-btn--secondary">Final Proof & Submission</a></p>' +
      "</div>"
    );
  }

  function render(path) {
    var outlet = document.getElementById("jt-outlet");
    if (!outlet) return;

    var html = "";
    if (path === "") html = renderLanding();
    else if (path === "settings") html = renderSettings();
    else if (path === "dashboard") html = renderDashboard();
    else if (path === "saved") html = renderSaved();
    else if (path === "digest") html = renderDigest();
    else if (path === "proof") html = renderProof();
    else if (path === "jt/07-test") html = renderTestChecklist();
    else if (path === "jt/08-ship") html = renderShip();
    else if (path === "jt/proof") html = renderProofFinal();
    else html = renderDashboard();

    outlet.innerHTML = html;

    if (path === "dashboard") attachFilterListeners();
    if (path === "settings") attachSettingsListeners();
    if (path === "digest") attachDigestListeners();
    if (path === "jt/07-test") attachTestChecklistListeners();
    if (path === "jt/proof") attachProofFinalListeners();
  }

  function attachFilterListeners() {
    var keyword = document.getElementById("jt-filter-keyword");
    var location = document.getElementById("jt-filter-location");
    var mode = document.getElementById("jt-filter-mode");
    var experience = document.getElementById("jt-filter-experience");
    var source = document.getElementById("jt-filter-source");
    var sort = document.getElementById("jt-filter-sort");
    var onlyAbove = document.getElementById("jt-filter-only-above");
    function updateCards() {
      var cardsEl = document.getElementById("jt-cards");
      if (!cardsEl) return;
      var jobs = getJobs();
      var state = getFilterStateFromDom();
      var withScores = jobsWithScores(jobs);
      var filtered = applyFiltersAndSort(withScores, state);
      if (filtered.length === 0) {
        cardsEl.innerHTML = "<div class=\"jt-empty jt-empty--inline\">" +
          "<p class=\"jt-empty__text\">No roles match your criteria. Adjust filters or lower threshold.</p>" +
          "</div>";
      } else {
        cardsEl.innerHTML = filtered.map(function (j) { return renderJobCard(j); }).join("");
      }
    }
    function onFilterChange() { updateCards(); }
    if (keyword) keyword.addEventListener("input", onFilterChange);
    if (keyword) keyword.addEventListener("change", onFilterChange);
    if (location) location.addEventListener("change", onFilterChange);
    if (mode) mode.addEventListener("change", onFilterChange);
    if (experience) experience.addEventListener("change", onFilterChange);
    if (source) source.addEventListener("change", onFilterChange);
    if (sort) sort.addEventListener("change", onFilterChange);
    var statusFilter = document.getElementById("jt-filter-status");
    if (statusFilter) statusFilter.addEventListener("change", onFilterChange);
    if (onlyAbove) onlyAbove.addEventListener("change", onFilterChange);
  }

  function setActiveLink(path) {
    var links = document.querySelectorAll(".jt-nav__link[data-route]");
    links.forEach(function (link) {
      var route = link.getAttribute("data-route");
      link.classList.toggle("is-active", route === path);
    });
  }

  function go(path) {
    path = path || "";
    window.location.hash = path ? "#/" + path : "#/";
  }

  function handleNavClick(e) {
    var a = e.target.closest("a[data-route][href^=\"#\"]");
    if (!a) return;
    e.preventDefault();
    var route = a.getAttribute("data-route");
    go(route === "dashboard" ? "dashboard" : route);
    var nav = document.querySelector(".jt-nav");
    if (nav) nav.classList.remove("is-open");
    var btn = document.querySelector(".jt-nav__toggle");
    if (btn) btn.setAttribute("aria-expanded", "false");
  }

  function handleToggle() {
    var nav = document.querySelector(".jt-nav");
    var btn = document.querySelector(".jt-nav__toggle");
    if (!nav || !btn) return;
    nav.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", nav.classList.contains("is-open"));
  }

  function handleOutletClick(e) {
    var btn = e.target.closest("button[data-action]");
    if (!btn) return;
    var action = btn.getAttribute("data-action");
    var card = e.target.closest(".jt-card");
    var jobId = card ? card.getAttribute("data-job-id") : null;
    var jobs = getJobs();
    var job = jobId ? jobs.find(function (j) { return j.id === jobId; }) : null;

    if (action === "view" && job) {
      e.preventDefault();
      openModal(job);
      return;
    }
    if (action === "modal-close") {
      e.preventDefault();
      closeModal();
      return;
    }
    if (action === "save" && jobId) {
      e.preventDefault();
      saveJob(jobId);
      btn.textContent = "Saved";
      return;
    }
    if (action === "unsave" && jobId) {
      e.preventDefault();
      removeSaved(jobId);
      var path = getRoute();
      if (path === "saved") render(path);
      return;
    }
    if (action === "status" && jobId && job) {
      e.preventDefault();
      var newStatus = btn.getAttribute("data-status");
      if (newStatus) {
        setJobStatus(jobId, newStatus, job);
        if (card) {
          var group = card.querySelector(".jt-card__status-group");
          if (group) {
            var cur = getJobStatus(jobId);
            var statusClass = getStatusClass(cur);
            var statusBtns = ["Not Applied", "Applied", "Rejected", "Selected"].map(function (s) {
              var active = s === cur ? " jt-status-btn--active " + statusClass : "";
              return "<button type=\"button\" class=\"jt-status-btn" + active + "\" data-action=\"status\" data-status=\"" + escapeHtml(s) + "\">" + escapeHtml(s) + "</button>";
            }).join("");
            group.innerHTML = statusBtns;
          }
        }
      }
      return;
    }
  }

  function handleModalOverlayClick(e) {
    if (e.target.id === "jt-modal") closeModal();
  }

  function onHashChange() {
    var path = getRoute();
    render(path);
    setActiveLink(path);
  }

  function init() {
    document.addEventListener("click", function (e) {
      if (e.target.closest(".jt-nav__toggle")) handleToggle();
      else if (e.target.closest(".jt-nav__links")) handleNavClick(e);
    });
    var outlet = document.getElementById("jt-outlet");
    if (outlet) outlet.addEventListener("click", handleOutletClick);
    var modal = document.getElementById("jt-modal");
    if (modal) modal.addEventListener("click", handleModalOverlayClick);
    window.addEventListener("hashchange", onHashChange);
    if (!window.location.hash) go("");
    onHashChange();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
