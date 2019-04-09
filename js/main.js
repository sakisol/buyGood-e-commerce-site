var app = new Vue({
    el: '#app',
    data: {
        searchProjects: [],
        nextprojID: "&nextProjectId=23",
        view: "home",
        selectedProj: {},
        selectedCountry: '',
        selectedTheme: '',
        basket: [],
        history: [],
        pageIndex: 0,
       

    },
    methods: {
       

        getItems: function () {

            var url = "https://api.globalgiving.org/api/public/projectservice/all/projects/active.json?api_key=f532b2d3-9dc1-428c-9f46-148656571409";

            var newurl = url + this.nextprojID;
            // var newurl = url = this.history[pageIndex]
            // console.log(this.history[this.pageIndex])
            
            // newhead = new Headers();
            
            // newhead.append('Accept', 'application/json');
            
            console.log(this.pageIndex)
            this.pageIndex++

            let req = new Request(newurl, {
                
            });
            fetch(req)
            .then(function (response) {
                return response.json();
                
            }).then(function (data) {
                console.log(data);
                
                app.history.push(app.nextprojID);
                app.nextprojID = "&nextProjectId=" + data.projects.nextProjectId
                console.log(app.nextprojID);
                
                
                // console.log(history)
                

                    for(let i=0; i < data.projects.project.length; i++){
                        data.projects.project[i].quantity=0;
                    }
                   

                    app.searchProjects = data.projects.project;
                    console.log(app.searchProjects)
                })
                .catch(function (error) {
                    alert("error")
                    console.log("error", error);
                });
            //end of fetch

        }, //end of method getItems 
        goDetail: function (project) {
            this.selectedProj = project;
        },
        addtoBasket: function (selected) {
            var found = false;
            this.basket.forEach(proj => {
                if (selected.id === proj.id) {
                    found = true;
                    proj.quantity++;
                }
            })
            if (found === false) {
                selected.quantity = 1;
                this.basket.push(selected);
            }

        },
        removefromBasket: function (selected) {
            // selected.quantity -= 1;
            // this.basket.splice(this.basket.indexOf(selected.id), 1);//this takes the whole project out of the basket 
            //rather than one portion/donation amount
        
            var found = false;
            this.basket.forEach(proj => {
                if (selected.id === proj.id) {
                    found = true;
                    proj.quantity--;
                }
            })
            if (found === false) {
                selected.quantity = -1;
                this.basket.push(selected);
            }
        },
        getHistory(){


                var url = "https://api.globalgiving.org/api/public/projectservice/all/projects/active.json?api_key=f532b2d3-9dc1-428c-9f46-148656571409";
    
                var newurl = url + this.history[this.history.length - 1];
                console.log(this.history[0])
    
                // newhead = new Headers();
    
                // newhead.append('Accept', 'application/json');
    
                let req = new Request(newurl, {
            
                });
                fetch(req)
                    .then(function (response) {
                        return response.json();
    
                    }).then(function (data) {
                        console.log(data);
                        
                        app.history.push(app.nextprojID);
                        app.nextprojID = "&nextProjectId=" + data.projects.nextProjectId
                        console.log(app.nextprojID);
    
                       
                        // console.log(history)
    
    
                        for(let i=0; i < data.projects.project.length; i++){
                            data.projects.project[i].quantity=0;
                        }
                       
    
                        app.searchProjects = data.projects.project;
                        console.log(app.searchProjects)
                    })
                    .catch(function (error) {
                        alert("error")
                        console.log("error", error);
                    });
                //end of fetch
        } 
    }, //end of methods
    created() {
        console.log("mounted!");

        this.getItems()

    }, //end of created
    computed: {
        getBasket() {
            return this.basket
        },
        filterProjects() {
            return this.searchProjects

                .filter((project) => {

                    return project.country.match(this.selectedCountry) || this.selectedCountry == 'all'

                })
                .filter((project) => {
                    return project.themeName.match(this.selectedTheme) || this.selectedTheme == 'all'
                })

        },
        subtotal(){

            return this.basket.reduce((x,y)=> 
            x+y.donationOptions.donationOption[0].amount * y.quantity, 0)
        },
        total() {
            var total =0;
            for (var i = 0; i < this.basket.length; i++){ 
            total += this.basket[i].donationOptions.donationOption[0].amount * this.basket[i].quantity;
                };
                 // get 10% discount when you donate to more than 5 projects  
                if (this.basket.length >= 3) {
                    let discount = total * 0.1;
                    total = total - discount;
                };  return total;
            }, 
        free(){
                this.basket.sort((a,b)=>{
                    return b.donationOptions.donationOption[0].amount - a.donationOptions.donationOption[0].amount;
                })
                console.log('sorted: ', this.basket)
            
                if (this.basket.length >=4){
                    alert ("i am 4+ projects");
                    this.basket[this.basket.length-1].quantity -= 1;
                }         
            } 
      
       
    }
});


$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})





