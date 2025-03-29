class AppFeatures {
  constructor(queryString, query) {
    this.queryString = queryString;
    this.query = query;
  }

  filter() {
    console.log(this.queryString);

    let queryObj = { ...this.queryString };

    let excludedFields = ["page", "limit", "sort"];

    excludedFields.forEach((ele) => delete queryObj[ele]);

    console.log(queryObj);

    this.query = this.query.find(queryObj);

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      this.query = this.query.sort(this.queryString.sort.split(",").join(" "));
    }
    return this;
  }

  pagination() {
    if (this.queryString.page) {
      this.queryString.page = this.queryString.page || 1;
      this.queryString.limit = this.queryString.limit || 100;
      this.queryString.skip = (this.queryString.page - 1) * limit;
      this.query = this.query
        .skip(this.queryString.skip)
        .limit(this.queryString.limit)
        .this.page(this.queryString.page);
    }
    return this;
  }

  limit() {
    if (this.queryString.limit) {
      this.query = this.query.limit(this.queryString.limit);
    }
    return this;
  }
}

module.exports = AppFeatures;
