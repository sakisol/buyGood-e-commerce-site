var app = new Vue({
  el: "#app",
  data: {
    searchProjects: [],
    nextprojID: "&nextProjectId=23",
    view: "home",
    selectedProj: {},
    selectedCountry: "",
    selectedTheme: "",
    basket: [],
    history: [],
    pageIndex: 0
  },
  methods: {
    changeView(page) {
      this.view = page; //change to indicated page id name
      window.scrollTo(0, 0); //go to the top of the page
    },
    getItems: function() {
      var url =
        "https://api.globalgiving.org/api/public/projectservice/all/projects/active.json?api_key=f532b2d3-9dc1-428c-9f46-148656571409";

      var newurl = url + this.nextprojID;

      let req = new Request(newurl, {});
      fetch(req)
        .then(function(response) {
          return response.json();
        })
        .then(function(data) {
          // console.log(data);
          // console.log(history)

          for (let i = 0; i < data.projects.project.length; i++) {
            data.projects.project[i].quantity = 0;
          }
          app.pageIndex++;

          console.log(app.pageIndex);

          if (app.pageIndex == app.history.length + 1) {
            app.nextprojID = "&nextProjectId=" + data.projects.nextProjectId;
            app.history.push(data.projects.project);

            app.searchProjects = app.history[app.history.length - 1];
            console.log(app.searchProjects);
          } else {
            app.searchProjects = app.history[app.pageIndex - 1];
          }
        })
        .catch(function(error) {
          // alert("error")
          console.log("error", error);
        });
      //end of fetch
    }, //end of method getItems

    getHistory() {
      app.pageIndex--;
      app.searchProjects = app.history[app.pageIndex - 1];
      console.log(app.pageIndex);
      console.log(app.history.length);
    },

    goDetail: function(project) {
      this.selectedProj = project;
    },
    addtoBasket: function(selected) {
      var found = false;
      this.basket.forEach(proj => {
        if (selected.id === proj.id) {
          found = true;
          proj.quantity++;
        }
      });
      if (found === false) {
        selected.quantity = 1;
        this.basket.push(selected);
      }
    },
    removefromBasket: function(selected) {
      var found = false;
      this.basket.forEach(proj => {
        if (selected.id === proj.id) {
          found = true;
          proj.quantity--;
        }
      });
      if (found === false) {
        selected.quantity = -1;
        this.basket.push(selected);
      } else if (selected.quantity === 0) {
        this.basket.splice(this.basket.indexOf(selected.id), 1);
      }
    }
  }, //end of methods
  created() {
    console.log("mounted!");

    this.getItems();
  }, //end of created
  computed: {
    getBasket() {
      return this.basket;
    },
    getCountries() {
      //new May 14th//simplify filter
      let nonrepeatCountry = [];

      for (var i = 0; i < this.searchProjects.length; i++) {
        if (!nonrepeatCountry.includes(this.searchProjects[i].country)) {
          nonrepeatCountry.push(this.searchProjects[i].country);
        }
      }
      //   return this.searchProjects
      console.log(nonrepeatCountry);
      return nonrepeatCountry.sort();
    },
    getThemes() {
      //new May 14th//simplify filter

      let nonrepeatTheme = [];

      for (var i = 0; i < this.searchProjects.length; i++) {
        if (!nonrepeatTheme.includes(this.searchProjects[i].themeName)) {
          nonrepeatTheme.push(this.searchProjects[i].themeName);
        }
      }

      return nonrepeatTheme.sort();
    },
    filterProjects() {
      return this.searchProjects

        .filter(project => {
          return (
            project.country.match(this.selectedCountry) ||
            this.selectedCountry == "all"
          );
        })
        .filter(project => {
          return (
            project.themeName.match(this.selectedTheme) ||
            this.selectedTheme == "all"
          );
        });
    },
    subtotal() {
      return this.basket.reduce(
        (x, y) => x + y.donationOptions.donationOption[0].amount * y.quantity,
        0
      );
    },
    total() {
      var total = 0;
      for (var i = 0; i < this.basket.length; i++) {
        total +=
          this.basket[i].donationOptions.donationOption[0].amount *
          this.basket[i].quantity;
      }

      if (this.basket.length >= 3) {
        let discount = total * 0.1;
        total = total - discount;
      }
      return total;
    },
    free() {
      this.basket.sort((a, b) => {
        return (
          b.donationOptions.donationOption[0].amount -
          a.donationOptions.donationOption[0].amount
        );
      });
      console.log("sorted: ", this.basket);

      if (this.basket.length >= 4) {
        alert("i am 4+ projects");
        this.basket[this.basket.length - 1].quantity -= 1;
      }
    }
  }
});

$(function() {
  $('[data-toggle="tooltip"]').tooltip();
});
